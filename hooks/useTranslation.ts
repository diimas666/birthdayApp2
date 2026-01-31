import { uk } from '../locales/uk';

type TranslationKey = keyof typeof uk;

export const useTranslation = () => {
  const t = (key: TranslationKey, ...args: unknown[]): string => {
    const translation = uk[key];
    if (typeof translation === 'function') {
      return (translation as (...a: unknown[]) => string)(...args);
    }
    return translation as string;
  };

  return { t };
};
