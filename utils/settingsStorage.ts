import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_THEME = '@birthday_app:theme';
const KEY_NOTIFICATION_HOUR = '@birthday_app:notificationHour';
const KEY_LAST_CONFETTI_DATE = '@birthday_app:lastConfettiDate';
const KEY_ONBOARDING_DONE = '@birthday_app:onboardingDone';
const KEY_QUIET_HOURS_FROM = '@birthday_app:quietHoursFrom';
const KEY_QUIET_HOURS_TO = '@birthday_app:quietHoursTo';
const KEY_LANGUAGE = '@birthday_app:language';

export type ThemeMode = 'light' | 'dark';
export type LanguageCode = 'uk' | 'en';

export const getLanguage = async (): Promise<LanguageCode> => {
  try {
    const v = await AsyncStorage.getItem(KEY_LANGUAGE);
    return (v === 'en' ? 'en' : 'uk') as LanguageCode;
  } catch {
    return 'uk';
  }
};

export const setLanguage = async (code: LanguageCode): Promise<void> => {
  await AsyncStorage.setItem(KEY_LANGUAGE, code);
};

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

export const getOnboardingDone = async (): Promise<boolean> => {
  // #region agent log
  const _dbg = (msg: string, data: Record<string, unknown>) => {
    const payload = { location: 'settingsStorage.ts:getOnboardingDone', message: msg, data, hypothesisId: 'H1' };
    console.log('[DEBUG]', JSON.stringify(payload));
    fetch('http://127.0.0.1:7244/ingest/be24e36e-c29f-4989-be54-b71a377e8d68',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
  };
  _dbg('getOnboardingDone entry', {});
  // #endregion
  try {
    const v = await AsyncStorage.getItem(KEY_ONBOARDING_DONE);
    // #region agent log
    _dbg('getOnboardingDone result', { raw: v, result: v === 'true' });
    // #endregion
    return v === 'true';
  } catch (e) {
    // #region agent log
    _dbg('getOnboardingDone catch', { err: String(e) });
    // #endregion
    return false;
  }
};

export const setOnboardingDone = async (): Promise<void> => {
  await AsyncStorage.setItem(KEY_ONBOARDING_DONE, 'true');
};

export const getQuietHoursFrom = async (): Promise<number> => {
  try {
    const v = await AsyncStorage.getItem(KEY_QUIET_HOURS_FROM);
    const n = v != null ? parseInt(v, 10) : 22;
    return Number.isNaN(n) ? 22 : Math.max(0, Math.min(23, n));
  } catch {
    return 22;
  }
};

export const getQuietHoursTo = async (): Promise<number> => {
  try {
    const v = await AsyncStorage.getItem(KEY_QUIET_HOURS_TO);
    const n = v != null ? parseInt(v, 10) : 8;
    return Number.isNaN(n) ? 8 : Math.max(0, Math.min(23, n));
  } catch {
    return 8;
  }
};

export const setQuietHours = async (from: number, to: number): Promise<void> => {
  await AsyncStorage.setItem(KEY_QUIET_HOURS_FROM, String(Math.max(0, Math.min(23, from))));
  await AsyncStorage.setItem(KEY_QUIET_HOURS_TO, String(Math.max(0, Math.min(23, to))));
};
