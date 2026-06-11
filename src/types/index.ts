import type { SUPPORTED_LOCALES } from '@/lib/constants';
import type { UiKey, RouteKey } from '@/i18n/ui';

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** A value translated into every supported locale. */
export type Localized<T> = Record<Locale, T>;

export type { RouteKey } from '@/i18n/ui';

export interface NavLink {
  labelKey: UiKey;
  routeKey: RouteKey;
}

export interface Service {
  slug: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  intro: string;
  /** Concise SEO meta description (≈150-155 chars), distinct from `intro`. */
  metaDescription?: string;
  /** Pain the client faces today — opens the detail page (problem → deliver → result). */
  problem: string;
  benefits: string[];
  /** Concrete, illustrative things we can build for this service (not client work). */
  useCases: string[];
  /** Outcome the client gets — closes the detail page before the CTA. */
  outcome: string;
  /** Service-specific FAQ — also fed into the page's FAQPage JSON-LD. */
  faq: FaqItem[];
}

export interface Feature {
  icon: string;
  title: string;
  subtitle: string;
}

export interface TechLogo {
  icon: string;
  name: string;
  color: string;
}

export interface ProcessStep {
  num: number;
  title: string;
  description: string;
}

export interface WhyPoint {
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Project {
  category: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  popular: boolean;
  ctaKey: 'requestQuote' | 'contactUs';
}

export interface SocialLink {
  label: string;
  /** Iconify icon name, e.g. "simple-icons:linkedin". */
  icon: string;
  href: string;
}

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  accent: string;
}

export interface Guarantee {
  icon: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ExpertiseItem {
  variant: 'light' | 'dark' | 'stat';
  icon?: string;
  title: string;
  description: string;
  stat?: string;
  col?: number;
}

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDoc {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}
