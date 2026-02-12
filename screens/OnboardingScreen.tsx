import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "../hooks/useTranslation";
import { setOnboardingDone } from "../utils/settingsStorage";
import { requestPermissions } from "../utils/notifications";
import {
  getNotificationHour,
  setNotificationHour,
} from "../utils/settingsStorage";
import {
  spacing,
  fontSize,
  borderRadius,
  moderateScale,
  verticalScale,
  dimensions,
} from "../utils/scale";

const { width } = dimensions;

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [notificationHour, setNotificationHourState] = useState(9);

  const handleSkip = async () => {
    await setOnboardingDone();
    onComplete();
  };

  const handleAllowNotifications = async () => {
    await requestPermissions();
  };

  const handleStart = async () => {
    await setNotificationHour(notificationHour);
    await setOnboardingDone();
    onComplete();
  };

  const loadInitialHour = async () => {
    const h = await getNotificationHour();
    setNotificationHourState(h);
  };

  React.useEffect(() => {
    loadInitialHour();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0a2e" />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{t("onboardingSkip")}</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setStep(index);
        }}
      >
        <View style={[styles.slide, { width }]}>
          <Image
            source={require("../assets/images/birthday-cake.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t("onboardingSlide1Title")}</Text>
          <Text style={styles.text}>{t("onboardingSlide1Text")}</Text>
        </View>

        <View style={[styles.slide, { width }]}>
          <Text style={styles.emoji}>🔔</Text>
          <Text style={styles.title}>{t("onboardingSlide2Title")}</Text>
          <Text style={styles.text}>{t("onboardingSlide2Text")}</Text>
          <TouchableOpacity
            style={styles.allowButton}
            onPress={handleAllowNotifications}
          >
            <Text style={styles.allowButtonText}>
              {t("onboardingAllowNotifications")}
            </Text>
          </TouchableOpacity>
          <Text style={styles.timeLabel}>{t("notificationTime")}</Text>
          <GestureScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hoursRow}
            contentContainerStyle={styles.hoursRowContent}
            nestedScrollEnabled
            scrollEventThrottle={16}
          >
            {HOURS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.hourChip,
                  notificationHour === h && styles.hourChipActive,
                ]}
                onPress={() => setNotificationHourState(h)}
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
          </GestureScrollView>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>{t("onboardingStart")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.dots}>
        <View style={[styles.dot, step === 0 && styles.dotActive]} />
        <View style={[styles.dot, step === 1 && styles.dotActive]} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0a2e",
  },
  skipButton: {
    position: "absolute",
    top: verticalScale(50),
    right: spacing.lg,
    zIndex: 10,
  },
  skipText: {
    color: "#a78bfa",
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: verticalScale(80),
  },
  slide: {
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  heroImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: fontSize.huge,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  text: {
    fontSize: fontSize.lg,
    color: "#c4b5fd",
    textAlign: "center",
    lineHeight: moderateScale(24),
  },
  allowButton: {
    marginTop: spacing.xl,
    paddingVertical: moderateScale(14),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    borderWidth: 1,
    borderColor: "#8b5cf6",
  },
  allowButtonText: {
    color: "#fff",
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  timeLabel: {
    marginTop: spacing.lg,
    fontSize: fontSize.md,
    color: "#a78bfa",
    marginBottom: spacing.md,
  },
  hoursRow: {
    marginBottom: spacing.md,
    maxHeight: verticalScale(50),
  },
  hoursRowContent: {
    paddingRight: spacing.md,
  },
  hourChip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: spacing.sm,
  },
  hourChipActive: {
    backgroundColor: "#8b5cf6",
  },
  hourChipText: {
    fontSize: fontSize.md,
    color: "#fff",
  },
  hourChipTextActive: {
    fontWeight: "600",
  },
  startButton: {
    marginTop: spacing.lg,
    paddingVertical: moderateScale(18),
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.sm,
    backgroundColor: "#8b5cf6",
  },
  startButtonText: {
    color: "#fff",
    fontSize: fontSize.lg,
    fontWeight: "bold",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    backgroundColor: "#8b5cf6",
    width: moderateScale(24),
  },
});
