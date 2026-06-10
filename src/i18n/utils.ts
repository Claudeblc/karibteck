import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/constants';
import { getUiDict, routes, type UiKey, type RouteKey } from '@/i18n/ui';
import type { Locale } from '@/types';

/** Returns a translator bound to the given locale (falls back to default). */
export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  const dict = getUiDict(locale);
  function t(key: UiKey): string {
    return dict[key];
  }
  t.path = (route: RouteKey): string => routes[locale][route];
  return t;
}

/** Localized path for a known route key. */
export function localizePath(route: RouteKey, locale: Locale = DEFAULT_LOCALE): string {
  return routes[locale][route];
}

/** Detects the locale from a URL pathname (first segment). */
export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if ((SUPPORTED_LOCALES as readonly string[]).includes(first)) return first as Locale;
  return DEFAULT_LOCALE;
}

/** The other locale. */
export function alternateLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

/** The same route's path in the other locale (for hreflang / lang toggle). */
export function alternateUrl(route: RouteKey, locale: Locale): string {
  return routes[alternateLocale(locale)][route];
}

/** Path to a service detail page for a locale (slug shared across locales). */
export function localizeServicePath(slug: string, locale: Locale): string {
  return locale === 'fr' ? `/services/${slug}/` : `/en/services/${slug}/`;
}
