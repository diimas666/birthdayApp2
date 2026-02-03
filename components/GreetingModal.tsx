import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Share,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../hooks/useTranslation";
import {
  spacing,
  fontSize,
  borderRadius,
  moderateScale,
  verticalScale,
} from "../utils/scale";
import {
  getRandomGreeting,
  GreetingStyle,
  GreetingRecipient,
} from "../utils/greetingTemplates";
import { BirthdayWithAge } from "../types";

const STYLES: GreetingStyle[] = ["short", "official", "funny"];
const RECIPIENTS: GreetingRecipient[] = [
  "friend",
  "girlfriend",
  "family",
  "colleague",
];

const STYLE_KEYS: Record<
  GreetingStyle,
  keyof typeof import("../locales/uk").uk
> = {
  short: "greetingShort",
  official: "greetingOfficial",
  funny: "greetingFunny",
};
const RECIPIENT_KEYS: Record<
  GreetingRecipient,
  keyof typeof import("../locales/uk").uk
> = {
  friend: "greetingForFriend",
  girlfriend: "greetingForGirlfriend",
  family: "greetingForFamily",
  colleague: "greetingForColleague",
};

interface GreetingModalProps {
  visible: boolean;
  birthday: BirthdayWithAge | null;
  onClose: () => void;
}

const openTelegram = (phone: string, errorMsg: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned.length) return;
  const url = `https://t.me/+${cleaned}`;
  Linking.openURL(url).catch(() => Alert.alert("", errorMsg));
};

const openSmsWithBody = (phone: string, body: string, errorMsg: string) => {
  const url = `sms:${phone.trim()}?body=${encodeURIComponent(body)}`;
  Linking.openURL(url).catch(() => Alert.alert("", errorMsg));
};

const pickNewGreeting = (
  style: GreetingStyle,
  recipient: GreetingRecipient,
  name: string
) => (name ? getRandomGreeting(style, recipient, name) : "");

export const GreetingModal: React.FC<GreetingModalProps> = ({
  visible,
  birthday,
  onClose,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [style, setStyle] = useState<GreetingStyle>("short");
  const [recipient, setRecipient] = useState<GreetingRecipient>("friend");
  const [editableText, setEditableText] = useState("");

  const name = birthday?.name ?? "";

  const refreshGreeting = useCallback(() => {
    setEditableText(pickNewGreeting(style, recipient, name));
  }, [style, recipient, name]);

  useEffect(() => {
    if (visible && name)
      setEditableText(pickNewGreeting(style, recipient, name));
  }, [visible, style, recipient, name]);

  const hasPhone = Boolean(birthday?.phone?.trim());
  const cardBg = isDark ? "#2a2a3e" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const secondaryColor = isDark ? "#a78bfa" : "#8b5cf6";

  const handleCopy = async () => {
    try {
      await Share.share({
        message: editableText,
        title: t("generateGreeting"),
      });
    } catch {
      Alert.alert(t("error"), t("shareFailed"));
    }
  };

  const handleTelegram = () => {
    if (hasPhone && birthday?.phone)
      openTelegram(birthday.phone, t("openTelegramFailed"));
    else Alert.alert("", t("addPhoneToContact"));
  };

  const handleSms = () => {
    if (hasPhone && birthday?.phone)
      openSmsWithBody(birthday.phone, editableText, t("openSmsFailed"));
    else Alert.alert("", t("addPhoneToContact"));
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: cardBg }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              {t("generateGreeting")}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={[styles.closeBtn, { color: secondaryColor }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.label, { color: textColor }]}>
              {t("greetingStyleLabel")}
            </Text>
            <View style={styles.chipRow}>
              {STYLES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.chip,
                    style === s && { backgroundColor: secondaryColor },
                  ]}
                  onPress={() => setStyle(s)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      style === s && styles.chipTextActive,
                    ]}
                  >
                    {t(STYLE_KEYS[s])}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: textColor }]}>
              {t("greetingRecipientLabel")}
            </Text>
            <View style={styles.chipRow}>
              {RECIPIENTS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.chip,
                    recipient === r && { backgroundColor: secondaryColor },
                  ]}
                  onPress={() => setRecipient(r)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      recipient === r && styles.chipTextActive,
                    ]}
                  >
                    {t(RECIPIENT_KEYS[r])}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: textColor }]}>
              {t("generateGreeting")}
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { color: textColor, borderColor: secondaryColor },
              ]}
              value={editableText}
              onChangeText={setEditableText}
              editable={true}
              multiline
              numberOfLines={4}
              placeholder={name ? "" : t("selectContact")}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={[styles.refreshBtn, { backgroundColor: secondaryColor }]}
              onPress={refreshGreeting}
            >
              <Ionicons
                name="refresh"
                size={22}
                color="#fff"
                style={styles.refreshIcon}
              />
              <Text style={styles.refreshBtnText}>{t("greetingRefresh")}</Text>
            </TouchableOpacity>
            {/* кнопки: копіювати, Telegram, SMS */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: secondaryColor }]}
                onPress={handleCopy}
              >
                <Text style={styles.primaryBtnText}>{t("copyGreeting")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  { backgroundColor: "#0088cc", opacity: hasPhone ? 1 : 0.6 },
                ]}
                onPress={handleTelegram}
                disabled={!hasPhone}
              >
                <Text style={styles.primaryBtnText}>{t("telegram")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  { backgroundColor: "#34C759", opacity: hasPhone ? 1 : 0.6 },
                ]}
                onPress={handleSms}
                disabled={!hasPhone}
              >
                <Text style={styles.primaryBtnText}>{t("sendViaSms")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "85%",
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: { fontSize: fontSize.xl, fontWeight: "700" },
  closeBtn: { fontSize: fontSize.xxl, fontWeight: "600" },
  scroll: { paddingHorizontal: spacing.lg },
  label: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xxs,
  },
  chip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: "#eee",
  },
  chipText: { fontSize: fontSize.md, color: "#333" },
  chipTextActive: { color: "#fff" },
  textArea: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    minHeight: verticalScale(100),
    textAlignVertical: "top",
    fontSize: fontSize.base,
  },
  refreshBtn: {
    marginTop: spacing.sm,
    paddingVertical: moderateScale(10),
    borderRadius: borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  refreshIcon: {},
  refreshBtnText: { color: "#fff", fontWeight: "600", fontSize: fontSize.base },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: "100%",
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: fontSize.base },
});
