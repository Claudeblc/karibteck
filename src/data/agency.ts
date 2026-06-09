import { CONTACT_EMAIL } from '@/lib/constants';
import type { NavLink } from '@/types';

export const AGENCY = {
  name: 'Karib Teck',
  logoSub: '— Agence Web aux Antilles —',
  tagline: 'Agence Web aux Antilles',
  email: CONTACT_EMAIL,
} as const;

/**
 * NAP (Name / Address / Phone) + opening hours.
 * Single source of truth for the contact section and Phase-3 local-SEO JSON-LD.
 * Values are placeholders — update with real agency data when available.
 */
export const CONTACT_DETAILS = {
  email: CONTACT_EMAIL,
  phone: '+590 690 00 00 00',
  location: 'Guadeloupe, Antilles Françaises',
  hours: 'Lun–Ven : 8h – 18h • Sam : 9h – 13h',
} as const;

export const NAV_LINKS: NavLink[] = [
  { labelKey: 'nav.home', href: '#hero' },
  { labelKey: 'nav.services', href: '#services' },
  { labelKey: 'nav.projects', href: '#realisations' },
  { labelKey: 'nav.about', href: '#pourquoi' },
  { labelKey: 'nav.pricing', href: '#tarifs' },
  { labelKey: 'nav.contact', href: '#contact' },
];
