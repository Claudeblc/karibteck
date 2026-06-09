import type { PricingPlan } from '@/types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    price: 'À partir de 990€',
    description:
      'Pour les TPE, indépendants et porteurs de projet qui veulent une présence web professionnelle.',
    features: [
      'Site vitrine 5 pages',
      'Design personnalisé',
      '100% Responsive',
      'Optimisation SEO de base',
      'Formulaire de contact',
      'Hébergement 1 an inclus',
    ],
    popular: false,
    ctaKey: 'requestQuote',
  },
  {
    name: 'Business',
    price: 'À partir de 2 900€',
    description:
      'Pour les PME qui veulent un site performant ou une application web avec des fonctionnalités avancées.',
    features: [
      "Site jusqu'à 20 pages",
      'Espace client / extranet',
      'Intégration CRM ou ERP',
      'SEO avancé + analytics',
      'E-commerce ou réservation',
      'Formation & documentation',
      'Support 6 mois inclus',
    ],
    popular: true,
    ctaKey: 'requestQuote',
  },
  {
    name: 'Entreprise',
    price: 'Sur devis',
    description:
      'Pour les projets complexes : logiciels métier, applications mobiles, ERP et solutions clé en main.',
    features: [
      'Application web sur mesure',
      'Application mobile iOS/Android',
      'ERP / CRM / Progiciel métier',
      'Architecture cloud scalable',
      'Intégration IA',
      'Maintenance & évolutions',
      'SLA et support dédié',
    ],
    popular: false,
    ctaKey: 'contactUs',
  },
];
