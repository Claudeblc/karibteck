import type { Stat, WhyPoint } from '@/types';

export const WHY_POINTS: WhyPoint[] = [
  {
    icon: '🎯',
    title: 'Expertise technique solide',
    description:
      'Développeurs seniors spécialisés en web, mobile et progiciels métier, avec une exigence de qualité sur chaque ligne de code.',
  },
  {
    icon: '🏝️',
    title: 'Connaissance du terrain local',
    description:
      'Nous comprenons les spécificités des entreprises antillaises : fiscalité, logistique, contraintes réglementaires.',
  },
  {
    icon: '📊',
    title: 'Orientés résultats',
    description:
      'Chaque projet est évalué sur des KPIs concrets : trafic, conversion, ROI. Nous livrons de la valeur, pas juste du code.',
  },
  {
    icon: '🤝',
    title: 'Partenariat long terme',
    description:
      'Nous ne disparaissons pas après la livraison. Maintenance, évolutions, support — nous restons à vos côtés.',
  },
];

// Honest metrics only (spec §3): no fabricated "projets livrés" / "clients satisfaits".
export const WHY_STATS: Stat[] = [
  { value: '100%', label: 'Sur-mesure' },
  { value: '7/7', label: 'Support disponible' },
  { value: '24h', label: 'Réponse à votre demande' },
  { value: '0', label: 'Template générique' },
];

export const EXPERTISE_TAGS: string[] = [
  'Sites vitrine',
  'E-commerce',
  'Applications métier',
  'ERP sur mesure',
  'CRM',
  'Apps mobiles',
  'Intégration API',
  'Intelligence Artificielle',
];
