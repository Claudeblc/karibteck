import type { SUPPORTED_LOCALES } from '@/lib/constants';
import type { UiKey } from '@/i18n/ui';

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** A value translated into every supported locale. */
export type Localized<T> = Record<Locale, T>;

export type { RouteKey } from '@/i18n/ui';

export interface NavLink {
  labelKey: UiKey;
  href: string;
}

export interface Service {
  slug: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
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
  abbr: string;
  href: string;
}
