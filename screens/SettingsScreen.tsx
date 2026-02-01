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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";
import { ThemeMode, LanguageCode } from "../utils/settingsStorage";
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
import { rescheduleAllNotifications } from "../utils/notifications";
import Ionicons from "react-native-vector-icons/Ionicons";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

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
  const [importOnlyWithBirthday, setImportOnlyWithBirthdayState] = useState(true);
  const [importUpdateChanges, setImportUpdateChangesState] = useState(true);
  const [importingContacts, setImportingContacts] = useState(false);

  useEffect(() => {
    getNotificationHour().then(setNotificationHourState);
    Promise.all([getQuietHoursFrom(), getQuietHoursTo()]).then(([from, to]) => {
      setQuietFromState(from);
      setQuietToState(to);
    });
    getNotifyOnBirthdayDay().then(setNotifyOnBirthdayDayState);
    getImportOnlyWithBirthday().then(setImportOnlyWithBirthdayState);
    getImportUpdateChanges().then(setImportUpdateChangesState);
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
      Alert.alert(t("error"), t("openEmailFailed"))
    );
  };

  const handleLanguageChange = async (code: LanguageCode) => {
    await setLanguageCode(code);
  };

  const handleImportFromContacts = async () => {
    setImportingContacts(true);
    try {
      const result = await importFromContacts();
      if (result.error) {
        Alert.alert(t("error"), t("contactsPermissionDenied"));
        return;
      }
      const birthdays = await getBirthdays();
      await rescheduleAllNotifications(birthdays);
      Alert.alert(
        t("importSuccess"),
        t("importFromContactsSuccess", result.added, result.updated, result.skipped, result.totalWithBirthday)
      );
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
      Alert.alert(
        t("importSuccess"),
        t("importCount", imported, total)
      );
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
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>
              {t("language")} — {language === "uk" ? t("languageUk") : t("languageEn")}
            </Text>
            <Switch
              value={language === "uk"}
              onValueChange={(v) => handleLanguageChange(v ? "uk" : "en")}
              trackColor={{ false: "#ccc", true: secondaryColor }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>
              {t("theme")} — {theme === "dark" ? t("themeDark") : t("themeLight")}
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
          <Text style={[styles.quietLabel, { color: textColor, marginTop: 12 }]}>
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
            style={[styles.importContactsButton, { backgroundColor: secondaryColor }]}
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

        <View style={[styles.section, styles.telegramBlock, { backgroundColor: cardBg }]}>
          <TouchableOpacity
            style={[styles.telegramRow, styles.telegramRowBorder, { borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }]}
            onPress={handleExportCsv}
            activeOpacity={0.7}
          >
            <View style={[styles.telegramIconWrap, { backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff" }]}>
              <Ionicons name="document-text-outline" size={22} color={secondaryColor} />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>{t("exportDataList")}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.telegramRow, styles.telegramRowBorder, { borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }]}
            onPress={handleExportJson}
            activeOpacity={0.7}
          >
            <View style={[styles.telegramIconWrap, { backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff" }]}>
              <Ionicons name="document-outline" size={22} color={secondaryColor} />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>{t("exportDataFull")}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.telegramRow, styles.telegramRowBorder, { borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }]}
            onPress={() => setImportModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.telegramIconWrap, { backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff" }]}>
              <Ionicons name="cloud-upload-outline" size={22} color={secondaryColor} />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>{t("importData")}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.telegramRow}
            onPress={handleWriteToSupport}
            activeOpacity={0.7}
          >
            <View style={[styles.telegramIconWrap, { backgroundColor: isDark ? "rgba(139,92,246,0.25)" : "#f0e6ff" }]}>
              <Ionicons name="mail-outline" size={22} color={secondaryColor} />
            </View>
            <Text style={[styles.telegramRowText, { color: textColor }]}>{t("writeToSupport")}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  telegramBlock: {
    paddingVertical: 0,
    paddingHorizontal: 12,
    overflow: "hidden",
  },
  telegramRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  telegramRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  telegramIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  telegramRowText: { fontSize: 16, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  hoursRow: { flexDirection: "row", marginHorizontal: -4 },
  hourChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  hourChipActive: { backgroundColor: "#8b5cf6" },
  hourChipText: { fontSize: 14, color: "#333" },
  hourChipTextActive: { color: "#fff" },
  quietHint: { fontSize: 14, marginBottom: 12, opacity: 0.9 },
  quietLabel: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  aboutText: { fontSize: 14, marginBottom: 8 },
  versionText: { fontSize: 12 },
  importOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  importModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  importTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  importInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },
  importButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
  importButtonCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  importButtonOk: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  importButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  importButtonTextCancel: { fontSize: 16, fontWeight: "600", color: "#333" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  switchLabel: { fontSize: 16, flex: 1, marginRight: 12 },
  importContactsButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  importContactsButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
