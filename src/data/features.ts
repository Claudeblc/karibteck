import type { Feature, Locale, Localized } from '@/types';

interface FeatureData {
  icon: string;
  title: Localized<string>;
  subtitle: Localized<string>;
}

const FEATURES_DATA: FeatureData[] = [
  {
    icon: '🎨',
    title: { fr: 'Sites modernes', en: 'Modern sites' },
    subtitle: { fr: 'Design premium & unique', en: 'Premium, unique design' },
  },
  {
    icon: '🔒',
    title: { fr: 'Sécurisés', en: 'Secure' },
    subtitle: { fr: 'Protection avancée', en: 'Advanced protection' },
  },
  {
    icon: '📱',
    title: { fr: '100% Responsive', en: '100% Responsive' },
    subtitle: { fr: 'Optimisé tous écrans', en: 'Optimized for every screen' },
  },
  {
    icon: '⚡',
    title: { fr: 'Rapides', en: 'Fast' },
    subtitle: { fr: 'Performance maximale', en: 'Maximum performance' },
  },
  {
    icon: '🛟',
    title: { fr: 'Support 7/7', en: '7/7 Support' },
    subtitle: { fr: 'Accompagnement continu', en: 'Continuous support' },
  },
];

export function getFeatures(locale: Locale): Feature[] {
  return FEATURES_DATA.map((f) => ({
    icon: f.icon,
    title: f.title[locale],
    subtitle: f.subtitle[locale],
  }));
}
