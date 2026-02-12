import { useLanguage } from '../contexts/LanguageContext';
import { uk } from '../locales/uk';
import { en } from '../locales/en';
import { es } from '../locales/es';
import { it } from '../locales/it';
import { pt } from '../locales/pt';
import { de } from '../locales/de';
import type { LanguageCode } from '../utils/settingsStorage';

export type Locale = typeof uk;

const locales: Record<LanguageCode, Locale> = {
  uk,
  en,
  es,
  it,
  pt,
  de,
};

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
