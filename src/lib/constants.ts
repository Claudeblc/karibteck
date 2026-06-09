export const SITE_URL = 'https://karibteck.com';

export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export const DEFAULT_LOCALE = 'fr';

export const CONTACT_EMAIL = 'contact@karibteck.com';

/** Zones desservies — used for local SEO (areaServed) in Phase 3. */
export const AREA_SERVED = [
  'Guadeloupe',
  'Martinique',
  'Guyane',
  'Saint-Martin',
  'Saint-Barthélemy',
] as const;

/** Legal/brand identifiers for schema.org. */
export const ORGANIZATION_NAME = 'Karib Teck';
export const ORGANIZATION_LEGAL_NAME = 'Karib Teck';
/** Region for PostalAddress (placeholder until full NAP is provided). */
export const ADDRESS_REGION = 'Guadeloupe';
export const ADDRESS_COUNTRY = 'FR';
/** Approx. centroid of Guadeloupe — placeholder geo until a real address exists. */
export const GEO_LATITUDE = 16.265;
export const GEO_LONGITUDE = -61.551;
