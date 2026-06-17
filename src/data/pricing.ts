import type { Locale, Localized, PricingPlan } from '@/types';

interface PricingPlanData {
  name: Localized<string>;
  price: Localized<string>;
  priceNote?: Localized<string>;
  description: Localized<string>;
  features: Localized<string[]>;
  popular: boolean;
  ctaKey: 'requestQuote' | 'contactUs';
}

const PRICING_PLANS_DATA: PricingPlanData[] = [
  {
    name: { fr: 'Starter', en: 'Starter' },
    price: { fr: 'À partir de 990€', en: 'From €990' },
    description: {
      fr: 'Pour les TPE, indépendants et porteurs de projet qui veulent une présence web professionnelle.',
      en: 'For micro-businesses, freelancers and project owners who want a professional web presence.',
    },
    features: {
      fr: [
        'Site vitrine 5 pages',
        'Design personnalisé',
        '100% Responsive',
        'Optimisation SEO de base',
        'Formulaire de contact',
        'Hébergement 1 an inclus',
      ],
      en: [
        '5-page brochure site',
        'Custom design',
        '100% Responsive',
        'Basic SEO optimization',
        'Contact form',
        '1 year hosting included',
      ],
    },
    popular: false,
    ctaKey: 'requestQuote',
  },
  {
    name: { fr: 'Business', en: 'Business' },
    price: { fr: 'À partir de 2 900€', en: 'From €2,900' },
    description: {
      fr: 'Pour les PME qui veulent un site performant ou une application web avec des fonctionnalités avancées.',
      en: 'For SMEs that want a high-performing site or a web app with advanced features.',
    },
    features: {
      fr: [
        "Site jusqu'à 20 pages",
        'Espace client / extranet',
        'Intégrations sur mesure (API)',
        'SEO avancé + analytics',
        'Réservation / prise de rendez-vous',
        'Formation & documentation',
        'Support 6 mois inclus',
      ],
      en: [
        'Up to 20 pages',
        'Client area / extranet',
        'Custom integrations (API)',
        'Advanced SEO + analytics',
        'Booking / scheduling',
        'Training & documentation',
        '6 months support included',
      ],
    },
    popular: true,
    ctaKey: 'requestQuote',
  },
  {
    name: { fr: 'Entreprise', en: 'Enterprise' },
    price: { fr: 'Sur devis', en: 'On quote' },
    description: {
      fr: 'Pour les projets complexes : applications web et mobiles sur mesure et intégration d’IA, clé en main.',
      en: 'For complex projects: custom web and mobile apps and AI integration, turnkey.',
    },
    features: {
      fr: [
        'Application web sur mesure',
        'Application mobile iOS/Android',
        'Automatisations & tableaux de bord',
        'Architecture cloud scalable',
        'Intégration IA',
        'Maintenance & évolutions',
        'SLA et support dédié',
      ],
      en: [
        'Custom web application',
        'iOS/Android mobile app',
        'Automation & dashboards',
        'Scalable cloud architecture',
        'AI integration',
        'Maintenance & evolutions',
        'Dedicated SLA and support',
      ],
    },
    popular: false,
    ctaKey: 'contactUs',
  },
];

export function getPricingPlans(locale: Locale): PricingPlan[] {
  return PRICING_PLANS_DATA.map((p) => ({
    name: p.name[locale],
    price: p.price[locale],
    ...(p.priceNote ? { priceNote: p.priceNote[locale] } : {}),
    description: p.description[locale],
    features: p.features[locale],
    popular: p.popular,
    ctaKey: p.ctaKey,
  }));
}
