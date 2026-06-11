import type { ExpertiseItem, Locale, Localized } from '@/types';

interface ExpertiseData {
  variant: ExpertiseItem['variant'];
  icon?: string;
  title: Localized<string>;
  description: Localized<string>;
  stat?: string;
  col: number;
}

// Honest content only (spec §3): no fabricated metrics, no client counts.
const EXPERTISE_DATA: ExpertiseData[] = [
  {
    variant: 'dark',
    icon: 'lucide:code-2',
    title: { fr: 'Excellence technique', en: 'Technical excellence' },
    description: {
      fr: 'Une équipe de développeurs seniors qui maîtrise les frameworks modernes — web, mobile et logiciels métier — avec une exigence de qualité sur chaque ligne de code.',
      en: 'A team of senior developers fluent in modern frameworks — web, mobile and business software — with a quality bar on every line of code.',
    },
    col: 8,
  },
  {
    variant: 'stat',
    stat: '100%',
    title: { fr: 'Sur-mesure', en: 'Tailor-made' },
    description: {
      fr: 'Aucun template générique : chaque produit est conçu pour vos usages réels.',
      en: 'No generic template: every product is built around your real-world usage.',
    },
    col: 4,
  },
  {
    variant: 'light',
    icon: 'lucide:palmtree',
    title: { fr: 'Ancrage local', en: 'Local roots' },
    description: {
      fr: 'Basés aux Antilles, nous comprenons les réalités du terrain : fiscalité, logistique et contraintes propres aux entreprises de la région.',
      en: 'Based in the French West Indies, we understand the realities on the ground: taxation, logistics and the constraints specific to businesses in the region.',
    },
    col: 4,
  },
  {
    variant: 'light',
    icon: 'lucide:handshake',
    title: { fr: 'Partenariat durable', en: 'Lasting partnership' },
    description: {
      fr: 'Nous ne disparaissons pas après la livraison : maintenance, évolutions et support continu pour faire grandir votre produit dans le temps.',
      en: "We don't disappear after delivery: maintenance, evolutions and continuous support to grow your product over time.",
    },
    col: 8,
  },
];

export function getExpertise(locale: Locale): ExpertiseItem[] {
  return EXPERTISE_DATA.map((item) => ({
    variant: item.variant,
    icon: item.icon,
    title: item.title[locale],
    description: item.description[locale],
    stat: item.stat,
    col: item.col,
  }));
}
