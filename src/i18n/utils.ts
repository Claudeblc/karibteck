import { DEFAULT_LOCALE } from '@/lib/constants';
import { getUiDict, type UiKey } from '@/i18n/ui';
import type { Locale } from '@/types';

/** Returns a translator bound to the given locale (falls back to default). */
export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  const dict = getUiDict(locale);
  return function t(key: UiKey): string {
    return dict[key];
  };
}

/** Prefixes a path with the locale segment (default locale has no prefix). */
export function localizePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return `/${locale}${normalized}`;
}
