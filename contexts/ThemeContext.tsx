import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, setTheme, ThemeMode } from '../utils/settingsStorage';

type ThemeContextType = {
  theme: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemDark = useColorScheme() === 'dark';
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    getTheme().then(setThemeState);
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    await setTheme(mode);
    setThemeState(mode);
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
