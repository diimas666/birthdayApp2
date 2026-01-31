import { uk } from '../locales/uk';

type TranslationKey = keyof typeof uk;

export const useTranslation = () => {
  const t = (key: TranslationKey, ...args: any[]): string => {
    const translation = uk[key];
    
    if (typeof translation === 'function') {
      return translation(...args);
    }
    
    return translation as string;
  };

  return { t };
};
