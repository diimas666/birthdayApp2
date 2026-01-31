import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_THEME = '@birthday_app:theme';
const KEY_NOTIFICATION_HOUR = '@birthday_app:notificationHour';
const KEY_LAST_CONFETTI_DATE = '@birthday_app:lastConfettiDate';

export type ThemeMode = 'light' | 'dark';

export const getTheme = async (): Promise<ThemeMode> => {
  try {
    const v = await AsyncStorage.getItem(KEY_THEME);
    return (v === 'dark' ? 'dark' : 'light') as ThemeMode;
  } catch {
    return 'light';
  }
};

export const setTheme = async (theme: ThemeMode): Promise<void> => {
  await AsyncStorage.setItem(KEY_THEME, theme);
};

export const getNotificationHour = async (): Promise<number> => {
  try {
    const v = await AsyncStorage.getItem(KEY_NOTIFICATION_HOUR);
    const n = v ? parseInt(v, 10) : 9;
    return Number.isNaN(n) ? 9 : Math.max(0, Math.min(23, n));
  } catch {
    return 9;
  }
};

export const setNotificationHour = async (hour: number): Promise<void> => {
  await AsyncStorage.setItem(KEY_NOTIFICATION_HOUR, String(Math.max(0, Math.min(23, hour))));
};

export const getLastConfettiDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEY_LAST_CONFETTI_DATE);
  } catch {
    return null;
  }
};

export const setLastConfettiDate = async (dateStr: string): Promise<void> => {
  await AsyncStorage.setItem(KEY_LAST_CONFETTI_DATE, dateStr);
};
