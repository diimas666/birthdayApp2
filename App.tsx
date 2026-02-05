import React, { useEffect, useState, useRef, Component, type ErrorInfo } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar, StyleSheet, View, Platform, Text, AppState, type AppStateStatus } from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { HomeScreen } from "./screens/HomeScreen";
import { ListScreen } from "./screens/ListScreen";
import { CalendarScreen } from "./screens/CalendarScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { requestPermissions } from "./utils/notifications";
import { getBirthdays } from "./utils/storage";
import { getBirthdaysByFilter } from "./utils/dateHelpers";
import { rescheduleAllNotifications } from "./utils/notifications";
import { updateBirthdayWidget } from "./utils/updateBirthdayWidget";
import {
  getOnboardingDone,
  incrementLaunchCount,
} from "./utils/settingsStorage";
import { scheduleReviewPrompt } from "./utils/inAppReview";
import { useTranslation } from "./hooks/useTranslation";
import { scaleFont } from "./utils/scale";

class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.error("AppErrorBoundary:", error.message);
  }
  render() {
    if (this.state.error) {
      return (
        <View
          style={[
            styles.root,
            {
              backgroundColor: "#1a0a2e",
              padding: 20,
              justifyContent: "center",
            },
          ]}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>
            {this.state.error.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const TAB_BAR_BG = "#1a0a2e";

const DarkNavTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8b5cf6",
    background: TAB_BAR_BG,
    card: TAB_BAR_BG,
    border: TAB_BAR_BG,
    text: "#fff",
  },
};

const Tab = createBottomTabNavigator();

function TabLabel({
  children,
  color,
  labelStyle,
}: {
  children: string;
  color: string;
  labelStyle: object;
}) {
  return (
    <View style={styles.tabLabelWrapper}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        style={[styles.tabBarLabel, labelStyle, { color }]}
      >
        {children}
      </Text>
    </View>
  );
}

function AppTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  const tabBarBottom = isAndroid ? Math.max(10, insets.bottom) : 10;
  const tabBarHeight = 56 + tabBarBottom;
  const labelStyle = [
    styles.tabBarLabel,
    isAndroid && styles.tabBarLabelAndroid,
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: tabBarBottom,
            paddingTop: 8,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderTopColor: TAB_BAR_BG,
          },
        ],
        tabBarBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: TAB_BAR_BG,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              },
            ]}
          />
        ),
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "#666",
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: labelStyle,
        tabBarItemStyle: isAndroid
          ? { paddingVertical: 4, paddingHorizontal: 2 }
          : undefined,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 22} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <TabLabel color={color} labelStyle={StyleSheet.flatten(labelStyle)}>
              {t("home")}
            </TabLabel>
          ),
        }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size ?? 22} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <TabLabel color={color} labelStyle={StyleSheet.flatten(labelStyle)}>
              {t("allBirthdays")}
            </TabLabel>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size ?? 22} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <TabLabel color={color} labelStyle={StyleSheet.flatten(labelStyle)}>
              {t("calendar")}
            </TabLabel>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size ?? 22} color={color} />
          ),
          tabBarLabel: ({ color }) => (
            <TabLabel color={color} labelStyle={StyleSheet.flatten(labelStyle)}>
              {t("settings")}
            </TabLabel>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDoneState] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;
      setOnboardingDoneState(false);
    }, 3000);
    getOnboardingDone()
      .then((v) => {
        if (cancelled) return;
        clearTimeout(timeout);
        setOnboardingDoneState(v);
      })
      .catch(() => {
        if (cancelled) return;
        clearTimeout(timeout);
        setOnboardingDoneState(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  if (onboardingDone === null) {
    return (
      <AppErrorBoundary>
        <ThemeProvider>
          <LanguageProvider>
            <GestureHandlerRootView style={styles.root}>
              <View style={[styles.root, { backgroundColor: "#1a0a2e" }]} />
            </GestureHandlerRootView>
          </LanguageProvider>
        </ThemeProvider>
      </AppErrorBoundary>
    );
  }

  if (onboardingDone === false) {
    return (
      <AppErrorBoundary>
        <ThemeProvider>
          <LanguageProvider>
            <GestureHandlerRootView style={styles.root}>
              <OnboardingScreen
                onComplete={() => setOnboardingDoneState(true)}
              />
            </GestureHandlerRootView>
          </LanguageProvider>
        </ThemeProvider>
      </AppErrorBoundary>
    );
  }

  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <MainContentWithEffects />
        </LanguageProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

function MainContentWithEffects() {
  const { t } = useTranslation();
  const lastRescheduleRef = useRef<number>(0);
  const RESCHEDULE_THROTTLE_MS = 10000;
  useEffect(() => {
    const runReschedule = async () => {
      const now = Date.now();
      if (now - lastRescheduleRef.current < RESCHEDULE_THROTTLE_MS) return;
      lastRescheduleRef.current = now;
      try {
        await requestPermissions();
        const birthdays = await getBirthdays();
        await rescheduleAllNotifications(birthdays);
        const todayList = getBirthdaysByFilter(birthdays, "today");
        const todayNames = todayList.map((b) => b.name);
        await updateBirthdayWidget(todayNames, t("widgetEmpty"), t("widgetTitle"));
      } catch (_) {}
    };
    const timeoutId = setTimeout(runReschedule, 500);
    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (nextState === "active") runReschedule();
    });
    return () => {
      clearTimeout(timeoutId);
      subscription.remove();
    };
  }, []);

  // Запит оцінки: після 2+ запусків або 3+ днів народження, один раз показати діалог
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await incrementLaunchCount();
        if (cancelled) return;
        scheduleReviewPrompt(() => ({
          title: t("rateAppTitle"),
          message: t("rateAppMessage"),
          rate: t("rateAppRate"),
          later: t("rateAppLater"),
        }));
      } catch (_) {}
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);
  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: TAB_BAR_BG }]}>
      <SafeAreaProvider>
        <View style={[styles.root, { backgroundColor: TAB_BAR_BG }]}>
          <BottomSheetModalProvider>
            <StatusBar barStyle="light-content" backgroundColor={TAB_BAR_BG} />
            <NavigationContainer theme={DarkNavTheme}>
              <AppTabs />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: {
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  tabLabelWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  tabBarLabel: {
    fontSize: scaleFont(12),
    fontWeight: "600",
    textAlign: "center",
  },
  tabBarLabelAndroid: {
    fontSize: scaleFont(10),
    marginTop: 2,
  },
});
