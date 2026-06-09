import { CONTACT_EMAIL } from '@/lib/constants';
import type { NavLink } from '@/types';

export const AGENCY = {
  name: 'Karib Teck',
  logoSub: '— Agence Web aux Antilles —',
  tagline: 'Agence Web aux Antilles',
  email: CONTACT_EMAIL,
} as const;

export const NAV_LINKS: NavLink[] = [
  { labelKey: 'nav.home', href: '#hero' },
  { labelKey: 'nav.services', href: '#services' },
  { labelKey: 'nav.projects', href: '#realisations' },
  { labelKey: 'nav.about', href: '#pourquoi' },
  { labelKey: 'nav.pricing', href: '#tarifs' },
  { labelKey: 'nav.contact', href: '#contact' },
];
