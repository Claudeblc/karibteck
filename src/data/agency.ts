import { CONTACT_EMAIL } from '@/lib/constants';
import type { Locale, Localized, NavLink } from '@/types';

const TAGLINE: Localized<string> = {
  fr: 'Agence Web aux Antilles',
  en: 'Web agency in the French West Indies',
};

export const AGENCY = {
  name: 'Karib Teck',
  email: CONTACT_EMAIL,
} as const;

export function getTagline(locale: Locale): string {
  return TAGLINE[locale];
}

/**
 * NAP (Name / Address / Phone) + opening hours.
 * Single source of truth for the contact section and Phase-3 local-SEO JSON-LD.
 * Values are placeholders — update with real agency data when available.
 */
const CONTACT_DETAILS_DATA = {
  email: CONTACT_EMAIL,
  phone: '+590 690 00 00 00',
  location: {
    fr: 'Guadeloupe, Antilles Françaises',
    en: 'Guadeloupe, French West Indies',
  } as Localized<string>,
  hours: {
    fr: 'Lun–Ven : 8h – 18h • Sam : 9h – 13h',
    en: 'Mon–Fri: 8am – 6pm • Sat: 9am – 1pm',
  } as Localized<string>,
};

export interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  hours: string;
}

export function getContactDetails(locale: Locale): ContactDetails {
  return {
    email: CONTACT_DETAILS_DATA.email,
    phone: CONTACT_DETAILS_DATA.phone,
    location: CONTACT_DETAILS_DATA.location[locale],
    hours: CONTACT_DETAILS_DATA.hours[locale],
  };
}

export const NAV_LINKS: NavLink[] = [
  { labelKey: 'nav.home', href: '#hero' },
  { labelKey: 'nav.services', href: '#services' },
  { labelKey: 'nav.projects', href: '#realisations' },
  { labelKey: 'nav.team', href: '#equipe' },
  { labelKey: 'nav.about', href: '#pourquoi' },
  { labelKey: 'nav.pricing', href: '#tarifs' },
  { labelKey: 'nav.faq', href: '#faq' },
  { labelKey: 'nav.contact', href: '#contact' },
];
