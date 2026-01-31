import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLanguage, setLanguage, LanguageCode } from '../utils/settingsStorage';

type LanguageContextType = {
  language: LanguageCode;
  setLanguageCode: (code: LanguageCode) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('uk');

  useEffect(() => {
    getLanguage().then(setLanguageState);
  }, []);

  const setLanguageCode = useCallback(async (code: LanguageCode) => {
    await setLanguage(code);
    setLanguageState(code);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguageCode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
