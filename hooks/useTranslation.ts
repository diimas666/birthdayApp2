import { useLanguage } from '../contexts/LanguageContext';
import { uk } from '../locales/uk';
import { en } from '../locales/en';

export type Locale = typeof uk;

const locales: Record<'uk' | 'en', Locale> = { uk, en };

type TranslationKey = keyof typeof uk;

export const useTranslation = () => {
  const { language } = useLanguage();
  const locale = locales[language];

  const t = (key: TranslationKey, ...args: unknown[]): string => {
    const translation = locale[key];
    if (typeof translation === 'function') {
      return (translation as (...a: unknown[]) => string)(...args);
    }
    return translation as string;
  };

  return { t, locale };
};
