import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomeScreen } from './screens/HomeScreen';
import { ListScreen } from './screens/ListScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { requestPermissions } from './utils/notifications';
import { getBirthdays } from './utils/storage';
import { rescheduleAllNotifications } from './utils/notifications';
import { getOnboardingDone } from './utils/settingsStorage';
import { useTranslation } from './hooks/useTranslation';

const Tab = createBottomTabNavigator();

function AppTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size ?? 24} color={color} />,
          tabBarLabel: t('home'),
        }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size ?? 24} color={color} />,
          tabBarLabel: t('allBirthdays'),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size ?? 24} color={color} />,
          tabBarLabel: t('calendar'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size ?? 24} color={color} />,
          tabBarLabel: t('settings'),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDoneState] = useState<boolean | null>(null);

  useEffect(() => {
    getOnboardingDone().then(setOnboardingDoneState);
  }, []);

  useEffect(() => {
    if (onboardingDone !== true) return;
    requestPermissions();
    const initializeNotifications = async () => {
      const birthdays = await getBirthdays();
      await rescheduleAllNotifications(birthdays);
    };
    initializeNotifications();
  }, [onboardingDone]);

  if (onboardingDone === null) {
    return (
      <ThemeProvider>
        <GestureHandlerRootView style={styles.root}>
          <View style={[styles.root, { backgroundColor: '#1a0a2e' }]} />
        </GestureHandlerRootView>
      </ThemeProvider>
    );
  }

  if (onboardingDone === false) {
    return (
      <ThemeProvider>
        <GestureHandlerRootView style={styles.root}>
          <OnboardingScreen onComplete={() => setOnboardingDoneState(true)} />
        </GestureHandlerRootView>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#1a0a2e" />
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: {
    backgroundColor: '#1a0a2e',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
