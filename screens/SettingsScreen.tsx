import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Modal,
  TextInput,
  Linking,
  Switch,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";
import { ThemeMode, LanguageCode } from "../utils/settingsStorage";
import {
  spacing,
  fontSize,
  borderRadius,
  moderateScale,
  verticalScale,
} from "../utils/scale";
import {
  getNotificationHour,
  setNotificationHour,
  getQuietHoursFrom,
  getQuietHoursTo,
  setQuietHours,
  getNotifyOnBirthdayDay,
  setNotifyOnBirthdayDay,
  getImportOnlyWithBirthday,
  setImportOnlyWithBirthday,
  getImportUpdateChanges,
  setImportUpdateChanges,
} from "../utils/settingsStorage";
import { importFromContacts } from "../utils/contactsImport";
import {
  exportBirthdaysJson,
  exportBirthdaysCsv,
  importBirthdaysFromJson,
  importBirthdaysFromCsv,
  getBirthdays,
} from "../utils/storage";
import {
  rescheduleAllNotifications,
  isBatteryOptimizationEnabled,
  openBatteryOptimizationSettings,
  openAlarmPermissionSettings,
} from "../utils/notifications";
import AdBanner from "../components/AdBanner";
import Ionicons from "react-native-vector-icons/Ionicons";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Сюда можно подставить свою ссылку на банку Monobank
const MONOBANK_DONATION_URL = "https://send.monobank.ua/jar/2VmwzxQnrW";

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setThemeMode, isDark } = useTheme();
  const { language, setLanguageCode } = useLanguage();
  const [notificationHour, setNotificationHourState] = useState(9);
  const [quietFrom, setQuietFromState] = useState(22);
  const [quietTo, setQuietToState] = useState(8);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [notifyOnBirthdayDay, setNotifyOnBirthdayDayState] = useState(true);
  const [importOnlyWithBirthday, setImportOnlyWithBirthdayState] =
    useState(true);
  const [importUpdateChanges, setImportUpdateChangesState] = useState(true);
  const [importingContacts, setImportingContacts] = useState(false);
  const [batteryOptEnabled, setBatteryOptEnabled] = useState<boolean | null>(
    null,
  );
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    getNotificationHour().then(setNotificationHourState);
    Promise.all([getQuietHoursFrom(), getQuietHoursTo()]).then(([from, to]) => {
      setQuietFromState(from);
      setQuietToState(to);
    });
    getNotifyOnBirthdayDay().then(setNotifyOnBirthdayDayState);
    getImportOnlyWithBirthday().then(setImportOnlyWithBirthdayState);
    getImportUpdateChanges().then(setImportUpdateChangesState);
    if (Platform.OS === "android") {
      isBatteryOptimizationEnabled().then(setBatteryOptEnabled);
    }
  }, []);

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  const handleHourChange = async (hour: number) => {
    await setNotificationHour(hour);
    setNotificationHourState(hour);
    const birthdays = await getBirthdays();
    await rescheduleAllNotifications(birthdays, hour);
  };

  const handleQuietHoursChange = async (from: number, to: number) => {
    await setQuietHours(from, to);
    setQuietFromState(from);
    setQuietToState(to);
    const birthdays = await getBirthdays();
    await rescheduleAllNotifications(birthdays);
  };

  const handleNotifyOnBirthdayDayChange = async (value: boolean) => {
    await setNotifyOnBirthdayDay(value);
    setNotifyOnBirthdayDayState(value);
    const birthdays = await getBirthdays();
    await rescheduleAllNotifications(birthdays);
  };

  const handleExportCsv = async () => {
    try {
      const csv = await exportBirthdaysCsv();
      await Share.share({
        message: csv,
        title: "birthdays_list.csv",
      });
      Alert.alert(t("exportSuccess"), "");
    } catch (e) {
      Alert.alert(t("error"), String(e));
    }
  };

  const handleExportJson = async () => {
    try {
      const json = await exportBirthdaysJson();
      await Share.share({
        message: json,
        title: "birthdays_export.json",
      });
      Alert.alert(t("exportSuccess"), "");
    } catch (e) {
      Alert.alert(t("error"), String(e));
    }
  };

  const handleWriteToSupport = () => {
    Linking.openURL("mailto:uu36548@gmail.com").catch(() =>
      Alert.alert(t("error"), t("openEmailFailed")),
    );
  };

  const handleDonateToAuthor = () => {
    if (!MONOBANK_DONATION_URL || MONOBANK_DONATION_URL.includes("XXXX")) {
      Alert.alert(t("error"), t("donationLinkNotConfigured"));
      return;
    }
    Linking.openURL(MONOBANK_DONATION_URL).catch((e) =>
      Alert.alert(t("error"), String(e)),
    );
  };

  const handleLanguageChange = async (code: LanguageCode) => {
    await setLanguageCode(code);
    setLanguageModalVisible(false);
  };

  const handleImportFromContacts = async () => {
    setImportingContacts(true);
    try {
      const result = await importFromContacts({
        permissionRationale: {
          title: t("contactsPermissionTitle"),
          message: t("contactsPermissionMessage"),
          buttonPositive: t("contactsPermissionButtonOK"),
        },
      });
      if (result.error) {
        if (result.error === "Permission denied") {
          Alert.alert(
            t("contactsPermissionDenied"),
            t("contactsPermissionDeniedHint"),
            [
              {
                text: t("openSettings"),
                onPress: () => Linking.openSettings(),
              },
              { text: t("ok") },
            ],
          );
        } else {
          Alert.alert(t("error"), result.error);
        }
        return;
      }
      const birthdays = await getBirthdays();
      await rescheduleAllNotifications(birthdays);
      if (result.totalWithBirthday === 0) {
        Alert.alert(t("importSuccess"), t("noContactsWithBirthday"));
      } else {
        Alert.alert(
          t("importSuccess"),
          t(
            "importFromContactsSuccess",
            result.added,
            result.updated,
            result.skipped,
            result.totalWithBirthday,
          ),
        );
      }
    } catch (e) {
      Alert.alert(t("importError"), String(e));
    } finally {
      setImportingContacts(false);
    }
  };

  const handleImportOnlyWithBirthdayChange = async (value: boolean) => {
    await setImportOnlyWithBirthday(value);
    setImportOnlyWithBirthdayState(value);
  };

  const handleImportUpdateChangesChange = async (value: boolean) => {
    await setImportUpdateChanges(value);
    setImportUpdateChangesState(value);
  };

  const handleImport = async () => {
    const raw = importJson.trim();
    if (!raw) {
      Alert.alert(t("validationError"), t("importPlaceholder"));
      return;
    }
    try {
      const isJson = raw.startsWith("[");
      const { imported, total } = isJson
        ? await importBirthdaysFromJson(raw)
        : await importBirthdaysFromCsv(raw);
      setImportModalVisible(false);
      setImportJson("");
      const birthdays = await getBirthdays();
      await rescheduleAllNotifications(birthdays);
      Alert.alert(t("importSuccess"), t("importCount", imported, total));
    } catch (e) {
      Alert.alert(t("importError"), String(e));
    }
  };

  const bg = isDark ? "#0a0a14" : "#F5F5F5";
  const cardBg = isDark ? "#2a2a3e" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const secondaryColor = isDark ? "#a78bfa" : "#8b5cf6";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>
          {t("settings")}
        </Text>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <TouchableOpacity
            style={styles.switchRow}
            activeOpacity={0.7}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Text style={[styles.switchLabel, { color: textColor }]}>
              {t("language")}
            </Text>
            <View style={styles.languagePicker}>
              <Text style={[styles.languagePickerText, { color: textColor }]}>
                {language === "uk"
                  ? t("languageUk")
                  : language === "en"
                    ? t("languageEn")
                    : language === "es"
                      ? t("languageEs")
                      : language === "it"
                        ? t("languageIt")
                        : language === "pt"
                          ? t("languagePt")
                          : t("languageDe")}
              </Text>
              <Ionicons name="chevron-down" size={18} color={secondaryColor} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>
              {t("theme")} —{" "}
              {theme === "dark" ? t("themeDark") : t("themeLight")}
            </Text>
            <Switch
              value={theme === "dark"}
              onValueChange={(v) => handleThemeChange(v ? "dark" : "light")}
              trackColor={{ false: "#ccc", true: secondaryColor }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
            {t("notificationTime")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hoursRow}
          >
            {HOURS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.hourChip,
                  notificationHour === h && { backgroundColor: secondaryColor },
                ]}
                onPress={() => handleHourChange(h)}
              >
                <Text
                  style={[
                    styles.hourChipText,
                    notificationHour === h && styles.hourChipTextActive,
                  ]}
                >
                  {h}:00
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.quietHint, { color: textColor, marginTop: 8 }]}>
            {t("notifyOnBirthdayDayHint")}
          </Text>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>
              {t("notifyOnBirthdayDay")}
            </Text>
            <Switch
              value={notifyOnBirthdayDay}
              onValueChange={handleNotifyOnBirthdayDayChange}
              trackColor={{ false: "#ccc", true: secondaryColor }}
              thumbColor="#fff"
            />
          </View>
          {Platform.OS === "android" && (
            <>
              <View style={styles.batteryOptBlock}>
                <Text style={[styles.quietHint, { color: textColor }]}>
                  {t("settingsBatteryOptimizationHint")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.batteryOptButton,
                    { backgroundColor: secondaryColor },
                  ]}
                  onPress={() => openBatteryOptimizationSettings()}
                >
                  <Text style={styles.batteryOptButtonText}>
                    {t("settingsBatteryOptimizationButton")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.batteryOptBlock}>
                <Text style={[styles.quietHint, { color: textColor }]}>
                  {t("settingsAlarmPermissionHint")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.batteryOptButton,
                    { backgroundColor: secondaryColor },
                  ]}
                  onPress={() => openAlarmPermissionSettings()}
                >
                  <Text style={styles.batteryOptButtonText}>
                    {t("settingsAlarmPermissionButton")}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
            {t("quietHours")}
          </Text>
          <Text style={[styles.quietHint, { color: textColor }]}>
            {t("quietHoursHint")}
          </Text>
          <Text style={[styles.quietLabel, { color: textColor }]}>
            {t("quietHoursFrom")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hoursRow}
          >
            {HOURS.map((h) => (
              <TouchableOpacity
                key={`from-${h}`}
                style={[
                  styles.hourChip,
                  quietFrom === h && { backgroundColor: secondaryColor },
                ]}
                onPress={() => handleQuietHoursChange(h, quietTo)}
              >
                <Text
                  style={[
                    styles.hourChipText,
                    quietFrom === h && styles.hourChipTextActive,
                  ]}
                >
                  {h}:00
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text
            style={[styles.quietLabel, { color: textColor, marginTop: 12 }]}
          >
            {t("quietHoursTo")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hoursRow}
          >
            {HOURS.map((h) => (
              <TouchableOpacity
                key={`to-${h}`}
                style={[
                  styles.hourChip,
                  quietTo === h && { backgroundColor: secondaryColor },
                ]}
                onPress={() => handleQuietHoursChange(quietFrom, h)}
              >
                <Text
                  style={[
                    styles.hourChipText,
                    quietTo === h && styles.hourChipTextActive,
                  ]}
                >
                  {h}:00
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
            {t("importFromContacts")}
          </Text>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>
              {t("importOnlyWithBirthday")}
            </Text>
            <Switch
              value={importOnlyWithBirthday}
              onValueChange={handleImportOnlyWithBirthdayChange}
              trackColor={{ false: "#ccc", true: secondaryColor }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>
              {t("importUpdateChanges")}
            </Text>
            <Switch
              value={importUpdateChanges}
              onValueChange={handleImportUpdateChangesChange}
              trackColor={{ false: "#ccc", true: secondaryColor }}
              thumbColor="#fff"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.importContactsButton,
              { backgroundColor: secondaryColor },
            ]}
            onPress={handleImportFromContacts}
            disabled={importingContacts}
          >
            {importingContacts ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.importContactsButtonText}>
                {t("importFromContacts")}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.section,
            styles.telegramBlock,
            { backgroundColor: cardBg },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.telegramRow,
              styles.telegramRowBorder,
              {
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
            onPress={handleExportCsv}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.telegramIconWrap,
                {
                  backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff",
                },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={secondaryColor}
              />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>
              {t("exportDataList")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.telegramRow,
              styles.telegramRowBorder,
              {
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
            onPress={handleExportJson}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.telegramIconWrap,
                {
                  backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff",
                },
              ]}
            >
              <Ionicons
                name="document-outline"
                size={22}
                color={secondaryColor}
              />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>
              {t("exportDataFull")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.telegramRow,
              styles.telegramRowBorder,
              {
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
            onPress={() => setImportModalVisible(true)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.telegramIconWrap,
                {
                  backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff",
                },
              ]}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color={secondaryColor}
              />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>
              {t("importData")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.telegramRow,
              styles.telegramRowBorder,
              {
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
            onPress={handleWriteToSupport}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.telegramIconWrap,
                {
                  backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff",
                },
              ]}
            >
              <Ionicons name="mail-outline" size={22} color={secondaryColor} />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>
              {t("writeToSupport")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.telegramRow}
            onPress={handleDonateToAuthor}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.telegramIconWrap,
                {
                  backgroundColor: isDark
                    ? "rgba(248,113,113,0.25)"
                    : "#fee2e2",
                },
              ]}
            >
              <Ionicons name="heart-outline" size={22} color="#ef4444" />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>
              {t("donateToAuthor")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
            {t("about")}
          </Text>
          <Text style={[styles.aboutText, { color: textColor }]}>
            {t("aboutText")}
          </Text>
          <Text style={[styles.versionText, { color: secondaryColor }]}>
            {t("version")} 1.0.0
          </Text>
        </View>
      </ScrollView>

      <Modal visible={importModalVisible} transparent animationType="slide">
        <View style={styles.importOverlay}>
          <View style={[styles.importModal, { backgroundColor: cardBg }]}>
            <Text style={[styles.importTitle, { color: textColor }]}>
              {t("importData")}
            </Text>
            <TextInput
              style={[
                styles.importInput,
                { color: textColor, borderColor: secondaryColor },
              ]}
              value={importJson}
              onChangeText={setImportJson}
              placeholder={t("importPlaceholder")}
              placeholderTextColor="#666"
              multiline
              numberOfLines={8}
            />
            <View style={styles.importButtons}>
              <TouchableOpacity
                style={styles.importButtonCancel}
                onPress={() => {
                  setImportModalVisible(false);
                  setImportJson("");
                }}
              >
                <Text style={styles.importButtonTextCancel}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.importButtonOk,
                  { backgroundColor: secondaryColor },
                ]}
                onPress={handleImport}
              >
                <Text style={styles.importButtonText}>{t("save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Выбор языка */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.languageOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setLanguageModalVisible(false)}
          />
          <View style={[styles.languageModal, { backgroundColor: cardBg }]}>
            {(["uk", "en", "es", "it", "pt", "de"] as LanguageCode[]).map(
              (code) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.languageOption,
                    language === code && styles.languageOptionActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleLanguageChange(code)}
                >
                  <Text
                    style={[styles.languageOptionText, { color: textColor }]}
                  >
                    {code === "uk"
                      ? t("languageUk")
                      : code === "en"
                        ? t("languageEn")
                        : code === "es"
                          ? t("languageEs")
                          : code === "it"
                            ? t("languageIt")
                            : code === "pt"
                              ? t("languagePt")
                              : t("languageDe")}
                  </Text>
                  {language === code && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={secondaryColor}
                    />
                  )}
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      </Modal>
      <AdBanner />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: verticalScale(40) },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    marginBottom: spacing.xl,
  },
  section: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  telegramBlock: {
    paddingVertical: 0,
    paddingHorizontal: spacing.md,
    overflow: "hidden",
  },
  telegramRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(14),
    paddingHorizontal: spacing.xxs,
  },
  telegramRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  telegramIconWrap: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  telegramRowText: { fontSize: fontSize.base, flex: 1 },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  row: { flexDirection: "row", gap: spacing.md },
  hoursRow: { flexDirection: "row", marginHorizontal: -spacing.xxs },
  hourChip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: "#eee",
    marginRight: spacing.sm,
  },
  hourChipActive: { backgroundColor: "#8b5cf6" },
  hourChipText: { fontSize: fontSize.md, color: "#333" },
  hourChipTextActive: { color: "#fff" },
  quietHint: { fontSize: fontSize.md, marginBottom: spacing.md, opacity: 0.9 },
  quietLabel: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  aboutText: { fontSize: fontSize.md, marginBottom: spacing.sm },
  versionText: { fontSize: fontSize.sm },
  importOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  importModal: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  importTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  importInput: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    minHeight: verticalScale(120),
    textAlignVertical: "top",
  },
  importButtons: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  importButtonCancel: {
    flex: 1,
    padding: moderateScale(14),
    borderRadius: borderRadius.sm,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  importButtonOk: {
    flex: 1,
    padding: moderateScale(14),
    borderRadius: borderRadius.sm,
    alignItems: "center",
  },
  importButtonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#fff",
  },
  importButtonTextCancel: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#333",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  switchLabel: { fontSize: fontSize.base, flex: 1, marginRight: spacing.sm },
  importContactsButton: {
    paddingVertical: moderateScale(14),
    borderRadius: borderRadius.sm,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  importContactsButtonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#fff",
  },
  batteryOptBlock: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  batteryOptButton: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  batteryOptButtonText: {
    fontSize: fontSize.base,
    fontWeight: "600",
    color: "#fff",
  },
  languagePicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(139,92,246,0.08)",
    gap: spacing.xs,
  },
  languagePickerText: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  languageOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  languageModal: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  languageOptionText: {
    fontSize: fontSize.md,
  },
  languageOptionActive: {
    backgroundColor: "rgba(139,92,246,0.06)",
  },
});
