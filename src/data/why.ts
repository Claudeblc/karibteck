import type { Locale, Localized, Stat, WhyPoint } from '@/types';

interface WhyPointData {
  icon: string;
  title: Localized<string>;
  description: Localized<string>;
}

const WHY_POINTS_DATA: WhyPointData[] = [
  {
    icon: 'lucide:target',
    title: { fr: 'Expertise technique solide', en: 'Solid technical expertise' },
    description: {
      fr: 'Développeurs seniors spécialisés en web, mobile et progiciels métier, avec une exigence de qualité sur chaque ligne de code.',
      en: 'Senior developers specialized in web, mobile and business software, with a quality bar on every line of code.',
    },
  },
  {
    icon: 'lucide:palmtree',
    title: { fr: 'Connaissance du terrain local', en: 'Local field knowledge' },
    description: {
      fr: 'Nous comprenons les spécificités des entreprises antillaises : fiscalité, logistique, contraintes réglementaires.',
      en: 'We understand the specifics of West Indian businesses: taxation, logistics, regulatory constraints.',
    },
  },
  {
    icon: 'lucide:bar-chart-3',
    title: { fr: 'Orientés résultats', en: 'Results-driven' },
    description: {
      fr: 'Chaque projet est évalué sur des KPIs concrets : trafic, conversion, ROI. Nous livrons de la valeur, pas juste du code.',
      en: 'Every project is measured on concrete KPIs: traffic, conversion, ROI. We deliver value, not just code.',
    },
  },
  {
    icon: 'lucide:handshake',
    title: { fr: 'Partenariat long terme', en: 'Long-term partnership' },
    description: {
      fr: 'Nous ne disparaissons pas après la livraison. Maintenance, évolutions, support — nous restons à vos côtés.',
      en: "We don't disappear after delivery. Maintenance, evolutions, support — we stay by your side.",
    },
  },
];

interface StatData {
  value: string;
  label: Localized<string>;
}

// Honest metrics only (spec §3): no fabricated "projets livrés" / "clients satisfaits".
const WHY_STATS_DATA: StatData[] = [
  { value: '100%', label: { fr: 'Sur-mesure', en: 'Tailor-made' } },
  { value: '7/7', label: { fr: 'Support disponible', en: 'Support available' } },
  { value: '24h', label: { fr: 'Réponse à votre demande', en: 'Reply to your request' } },
  { value: '0', label: { fr: 'Template générique', en: 'Generic template' } },
];

const EXPERTISE_TAGS_DATA: Localized<string[]> = {
  fr: [
    'Sites vitrine',
    'E-commerce',
    'Applications métier',
    'ERP sur mesure',
    'CRM',
    'Apps mobiles',
    'Intégration API',
    'Intelligence Artificielle',
  ],
  en: [
    'Brochure sites',
    'E-commerce',
    'Business apps',
    'Custom ERP',
    'CRM',
    'Mobile apps',
    'API integration',
    'Artificial Intelligence',
  ],
};

export function getWhyPoints(locale: Locale): WhyPoint[] {
  return WHY_POINTS_DATA.map((p) => ({
    icon: p.icon,
    title: p.title[locale],
    description: p.description[locale],
  }));
}

export function getWhyStats(locale: Locale): Stat[] {
  return WHY_STATS_DATA.map((s) => ({
    value: s.value,
    label: s.label[locale],
  }));
}

export function getExpertiseTags(locale: Locale): string[] {
  return EXPERTISE_TAGS_DATA[locale];
}
