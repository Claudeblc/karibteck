import {
  SITE_URL,
  ORGANIZATION_NAME,
  ORGANIZATION_LEGAL_NAME,
  ADDRESS_REGION,
  ADDRESS_COUNTRY,
  GEO_LATITUDE,
  GEO_LONGITUDE,
  AREA_SERVED,
} from '@/lib/constants';
import { getServices } from '@/data/services';
import { getFaq } from '@/data/faq';
import { getContactDetails } from '@/data/agency';
import { useTranslations } from '@/i18n/utils';
import { routes } from '@/i18n/ui';
import type { Locale, Service } from '@/types';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function areaServedNodes() {
  return AREA_SERVED.map((name) => ({ '@type': 'AdministrativeArea', name }));
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    addressRegion: ADDRESS_REGION,
    addressCountry: ADDRESS_COUNTRY,
  };
}

function geoCoordinates() {
  return {
    '@type': 'GeoCoordinates',
    latitude: GEO_LATITUDE,
    longitude: GEO_LONGITUDE,
  };
}

export function buildOrganization(locale: Locale) {
  const contact = getContactDetails(locale);
  const t = useTranslations(locale);
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: ORGANIZATION_NAME,
    legalName: ORGANIZATION_LEGAL_NAME,
    url: SITE_URL,
    email: contact.email,
    telephone: contact.phone,
    description: t('meta.home.description'),
    address: postalAddress(),
    geo: geoCoordinates(),
    areaServed: areaServedNodes(),
    knowsAbout: getServices(locale).map((s) => s.title),
  };
}

export function buildWebSite(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: ORGANIZATION_NAME,
    inLanguage: locale,
    publisher: { '@id': ORG_ID },
  };
}

export function buildServices(locale: Locale) {
  return getServices(locale).map((s) => ({
    '@type': 'Service',
    name: s.title,
    description: s.description,
    serviceType: s.title,
    provider: { '@id': ORG_ID },
    areaServed: areaServedNodes(),
  }));
}

export function buildFaqPage(locale: Locale) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: getFaq(locale).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function buildBreadcrumb(locale: Locale, url: string) {
  const t = useTranslations(locale);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: url,
      },
    ],
  };
}

/** Full graph for a single service detail page. */
export function buildServiceGraph(locale: Locale, service: Service, url: string) {
  const t = useTranslations(locale);
  const homeUrl = new URL(routes[locale].home, SITE_URL).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      {
        '@type': 'Service',
        name: service.title,
        description: service.intro,
        serviceType: service.title,
        provider: { '@id': ORG_ID },
        areaServed: areaServedNodes(),
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('nav.home'), item: homeUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('services.detail.breadcrumb'),
            item: `${homeUrl}#services`,
          },
          { '@type': 'ListItem', position: 3, name: service.title, item: url },
        ],
      },
    ],
  };
}

/** Full graph for a single blog article (Organization + BlogPosting). */
export function buildBlogPostGraph(
  locale: Locale,
  post: { title: string; excerpt: string; date: Date; url: string },
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date.toISOString(),
        inLanguage: locale,
        url: post.url,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        mainEntityOfPage: post.url,
      },
    ],
  };
}

/** Graph for the blog index / tag listing pages (Organization + WebSite). */
export function buildBlogIndexGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildOrganization(locale), buildWebSite(locale)],
  };
}

/**
 * Graph for simple standalone pages (legal, thank-you): Organization + WebSite.
 * Ensures the JSON-LD validator finds an Organization node on every page.
 */
export function buildSimplePageGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildOrganization(locale), buildWebSite(locale)],
  };
}

/** Full graph for the /services index page. */
export function buildServicesIndexGraph(locale: Locale) {
  const t = useTranslations(locale);
  const homeUrl = new URL(routes[locale].home, SITE_URL).href;
  const servicesUrl = new URL(routes[locale].services, SITE_URL).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebSite(locale),
      ...buildServices(locale),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('nav.home'), item: homeUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('services.detail.breadcrumb'),
            item: servicesUrl,
          },
        ],
      },
    ],
  };
}

/** Full graph for the /a-propos (about) page. */
export function buildAboutGraph(locale: Locale) {
  const t = useTranslations(locale);
  const homeUrl = new URL(routes[locale].home, SITE_URL).href;
  const aboutUrl = new URL(routes[locale].about, SITE_URL).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebSite(locale),
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/#aboutpage`,
        url: aboutUrl,
        name: t('about.page.metaTitle'),
        inLanguage: locale,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('nav.home'), item: homeUrl },
          { '@type': 'ListItem', position: 2, name: t('nav.aboutPage'), item: aboutUrl },
        ],
      },
    ],
  };
}

/** Full graph for the home page. */
export function buildHomeGraph(locale: Locale, url: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebSite(locale),
      ...buildServices(locale),
      buildFaqPage(locale),
      buildBreadcrumb(locale, url),
    ],
  };
}
