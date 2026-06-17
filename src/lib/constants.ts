export const SITE_URL = 'https://karibteck.com';

/**
 * Public env-driven integrations (Phase 6). Empty fallbacks keep the build
 * working with no `.env`: the form renders with a blank access key, and the
 * Cal/WhatsApp CTAs render nothing until real values are provided.
 */
export const WEB3FORMS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
export const CALCOM_URL = import.meta.env.PUBLIC_CALCOM_URL ?? '';
export const WHATSAPP_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '';

/** Google Search Console site verification token (meta-tag method). */
export const GOOGLE_SITE_VERIFICATION = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '';

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
/**
 * Opening hours in schema.org format — mirrors the display hours
 * "Lun–Ven : 8h – 18h • Sam : 9h – 13h".
 */
export const OPENING_HOURS = ['Mo-Fr 08:00-18:00', 'Sa 09:00-13:00'];

/** Region for PostalAddress (placeholder until full NAP is provided). */
export const ADDRESS_REGION = 'Guadeloupe';
export const ADDRESS_COUNTRY = 'FR';
/** Approx. centroid of Guadeloupe — placeholder geo until a real address exists. */
export const GEO_LATITUDE = 16.265;
export const GEO_LONGITUDE = -61.551;
