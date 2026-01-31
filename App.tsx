import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './screens/HomeScreen';
import { ListScreen } from './screens/ListScreen';
import { requestPermissions } from './utils/notifications';
import { getBirthdays } from './utils/storage';
import { rescheduleAllNotifications } from './utils/notifications';
import { useTranslation } from './hooks/useTranslation';

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Request notification permissions on app start
    requestPermissions();
    
    // Reschedule all notifications on app start
    const initializeNotifications = async () => {
      const birthdays = await getBirthdays();
      await rescheduleAllNotifications(birthdays);
    };
    
    initializeNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
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
              tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
              tabBarLabel: t('home'),
            }}
          />
          <Tab.Screen
            name="List"
            component={ListScreen}
            options={{
              tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📋</Text>,
              tabBarLabel: t('allBirthdays'),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
