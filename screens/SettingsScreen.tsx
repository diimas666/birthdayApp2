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
} from "../utils/settingsStorage";
import {
  exportBirthdaysJson,
  exportBirthdaysCsv,
  importBirthdaysFromJson,
  importBirthdaysFromCsv,
  getBirthdays,
} from "../utils/storage";
import { rescheduleAllNotifications } from "../utils/notifications";

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

  useEffect(() => {
    getNotificationHour().then(setNotificationHourState);
    Promise.all([getQuietHoursFrom(), getQuietHoursTo()]).then(([from, to]) => {
      setQuietFromState(from);
      setQuietToState(to);
    });
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
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
            {t("language")}
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                language === "uk" && { backgroundColor: secondaryColor },
              ]}
              onPress={() => handleLanguageChange("uk")}
            >
              <Text
                style={[
                  styles.optionText,
                  language === "uk" && styles.optionTextActive,
                ]}
              >
                {t("languageUk")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                language === "en" && { backgroundColor: secondaryColor },
              ]}
              onPress={() => handleLanguageChange("en")}
            >
              <Text
                style={[
                  styles.optionText,
                  language === "en" && styles.optionTextActive,
                ]}
              >
                {t("languageEn")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>
            {t("theme")}
          </Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                theme === "light" && { backgroundColor: secondaryColor },
              ]}
              onPress={() => handleThemeChange("light")}
            >
              <Text
                style={[
                  styles.optionText,
                  theme === "light" && styles.optionTextActive,
                ]}
              >
                {t("themeLight")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                theme === "dark" && { backgroundColor: secondaryColor },
              ]}
              onPress={() => handleThemeChange("dark")}
            >
              <Text
                style={[
                  styles.optionText,
                  theme === "dark" && styles.optionTextActive,
                ]}
              >
                {t("themeDark")}
              </Text>
            </TouchableOpacity>
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
            {t("exportData")}
          </Text>
          <TouchableOpacity style={styles.menuRow} onPress={handleExportCsv}>
            <Text style={[styles.menuRowText, { color: textColor }]}>
              {t("exportDataList")}
            </Text>
            <Text style={styles.menuRowArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={handleExportJson}>
            <Text style={[styles.menuRowText, { color: textColor }]}>
              {t("exportDataFull")}
            </Text>
            <Text style={styles.menuRowArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setImportModalVisible(true)}
          >
            <Text style={[styles.menuRowText, { color: textColor }]}>
              {t("importData")}
            </Text>
            <Text style={styles.menuRowArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleWriteToSupport}
          >
            <Text style={[styles.menuRowText, { color: textColor }]}>
              {t("writeToSupport")}
            </Text>
            <Text style={styles.menuRowArrow}>→</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  optionButtonActive: { backgroundColor: "#8b5cf6" },
  optionText: { fontSize: 16, color: "#333" },
  optionTextActive: { color: "#fff" },
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
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuRowText: { fontSize: 16 },
  menuRowArrow: { fontSize: 18, color: "#666" },
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
});
