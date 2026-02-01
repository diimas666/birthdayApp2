import React, { useEffect, useState, Component, type ErrorInfo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar, StyleSheet, View, Platform, Text } from "react-native";
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context";
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
import { rescheduleAllNotifications } from "./utils/notifications";
import { getOnboardingDone } from "./utils/settingsStorage";
import { useTranslation } from "./hooks/useTranslation";

// #region agent log
const log = (
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string
) => {
  const payload = {
    location,
    message,
    data: { ...data, platform: Platform.OS },
    hypothesisId,
  };
  console.log("[DEBUG]", JSON.stringify(payload));
  fetch("http://127.0.0.1:7244/ingest/be24e36e-c29f-4989-be54-b71a377e8d68", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      timestamp: Date.now(),
      sessionId: "debug-session",
    }),
  }).catch(() => {});
};
// #endregion

class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    log(
      "App.tsx:ErrorBoundary",
      "componentDidCatch",
      { message: error.message, componentStack: info.componentStack },
      "H2"
    );
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

const Tab = createBottomTabNavigator();

function AppTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  const tabBarBottom = isAndroid ? Math.max(10, insets.bottom) : 10;
  const tabBarHeight = 56 + tabBarBottom;

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
          },
        ],
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: [styles.tabBarLabel, isAndroid && styles.tabBarLabelAndroid],
        tabBarItemStyle: isAndroid ? { paddingVertical: 4 } : undefined,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 22} color={color} />
          ),
          tabBarLabel: t("home"),
        }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size ?? 22} color={color} />
          ),
          tabBarLabel: isAndroid ? t("allBirthdaysShort") : t("allBirthdays"),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size ?? 22} color={color} />
          ),
          tabBarLabel: isAndroid ? t("calendarShort") : t("calendar"),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size ?? 22} color={color} />
          ),
          tabBarLabel: isAndroid ? t("settingsShort") : t("settings"),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDoneState] = useState<boolean | null>(
    null
  );

  // #region agent log
  log("App.tsx:render", "App render", { onboardingDone }, "H1");
  // #endregion

  useEffect(() => {
    // #region agent log
    log("App.tsx:useEffect", "getOnboardingDone called", {}, "H1");
    // #endregion
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;
      // #region agent log
      log(
        "App.tsx:getOnboardingDone.timeout",
        "getOnboardingDone timeout fallback",
        {},
        "H1"
      );
      // #endregion
      setOnboardingDoneState(false);
    }, 3000);
    getOnboardingDone()
      .then((v) => {
        if (cancelled) return;
        clearTimeout(timeout);
        // #region agent log
        log(
          "App.tsx:getOnboardingDone.then",
          "getOnboardingDone resolved",
          { value: v },
          "H1"
        );
        // #endregion
        setOnboardingDoneState(v);
      })
      .catch((err) => {
        if (cancelled) return;
        clearTimeout(timeout);
        // #region agent log
        log(
          "App.tsx:getOnboardingDone.catch",
          "getOnboardingDone rejected",
          { err: String(err) },
          "H1"
        );
        // #endregion
        setOnboardingDoneState(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (onboardingDone !== true) return;
    const t = setTimeout(() => {
      requestPermissions();
      const initializeNotifications = async () => {
        try {
          const birthdays = await getBirthdays();
          await rescheduleAllNotifications(birthdays);
        } catch (_) {}
      };
      initializeNotifications();
    }, 500);
    return () => clearTimeout(t);
  }, [onboardingDone]);

  if (onboardingDone === null) {
    // #region agent log
    log("App.tsx:branch", "rendering loading (onboardingDone=null)", {}, "H5");
    // #endregion
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
    // #region agent log
    log("App.tsx:branch", "rendering onboarding", {}, "H1");
    // #endregion
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

  // #region agent log
  log("App.tsx:branch", "rendering main tabs", {}, "H1");
  // #endregion
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <GestureHandlerRootView style={styles.root}>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <StatusBar barStyle="light-content" backgroundColor="#1a0a2e" />
                <NavigationContainer>
                  <AppTabs />
                </NavigationContainer>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </LanguageProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: {
    backgroundColor: "#1a0a2e",
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
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  tabBarLabelAndroid: {
    fontSize: 11,
    marginTop: 2,
  },
});
