import type { Locale, Localized, Service } from '@/types';

interface ServiceData {
  slug: string;
  icon: string;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
  intro: Localized<string>;
  metaDescription: Localized<string>;
  benefits: Localized<string[]>;
}

const SERVICES_DATA: ServiceData[] = [
  {
    slug: 'creation-sites-web',
    icon: 'lucide:globe',
    tags: ['WordPress', 'Next.js', 'Figma', 'SEO'],
    title: { fr: 'Création de Sites Web', en: 'Website Design & Development' },
    description: {
      fr: 'Sites vitrines, landing pages, sites e-commerce et portails corporate. Des designs modernes, rapides et optimisés SEO qui convertissent vos visiteurs en clients.',
      en: 'Brochure sites, landing pages, e-commerce stores and corporate portals. Modern, fast, SEO-optimized designs that turn visitors into customers.',
    },
    intro: {
      fr: 'Nous concevons des sites web sur mesure pour les entreprises des Antilles : vitrines élégantes, sites e-commerce et portails corporate, pensés pour être rapides, bien référencés et faciles à gérer.',
      en: 'We design custom websites for businesses in the French West Indies: elegant brochure sites, e-commerce stores and corporate portals — built to be fast, well-ranked and easy to manage.',
    },
    metaDescription: {
      fr: 'Création de sites web sur mesure pour les entreprises des Antilles : vitrines, e-commerce et portails corporate, rapides, bien référencés et faciles à gérer.',
      en: 'Custom website design and development for businesses in the French West Indies: fast, SEO-optimized brochure, e-commerce and corporate sites built to convert.',
    },
    benefits: {
      fr: [
        'Design unique aligné sur votre marque',
        'Optimisation SEO et performance dès la conception',
        '100% responsive, adapté à tous les écrans',
        'Interface d’administration simple à prendre en main',
      ],
      en: [
        'Unique design aligned with your brand',
        'SEO and performance built in from the start',
        '100% responsive across every screen',
        'Simple, easy-to-learn admin interface',
      ],
    },
  },
  {
    slug: 'applications-mobiles',
    icon: 'lucide:smartphone',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    title: { fr: 'Applications Mobiles', en: 'Mobile Apps' },
    description: {
      fr: 'Applications iOS et Android sur mesure pour votre activité. Gestion de commandes, suivi client, tableaux de bord — nous transformons vos processus en apps intuitives.',
      en: 'Custom iOS and Android apps for your business. Order management, customer tracking, dashboards — we turn your processes into intuitive apps.',
    },
    intro: {
      fr: 'Nous développons des applications iOS et Android natives ou cross-platform pour digitaliser votre activité : commandes, réservations, suivi client, tableaux de bord.',
      en: 'We build native or cross-platform iOS and Android apps to digitize your business: orders, bookings, customer tracking, dashboards.',
    },
    metaDescription: {
      fr: "Développement d'applications mobiles iOS et Android pour les entreprises des Antilles : commandes, réservations, suivi client et tableaux de bord sur mesure.",
      en: 'iOS and Android mobile app development for businesses in the French West Indies: orders, bookings, customer tracking and custom dashboards in one app.',
    },
    benefits: {
      fr: [
        'Une seule base de code pour iOS et Android',
        'Expérience fluide et intuitive',
        'Publication sur l’App Store et Google Play',
        'Notifications, hors-ligne et intégrations sur mesure',
      ],
      en: [
        'A single codebase for iOS and Android',
        'Smooth, intuitive experience',
        'Publishing to the App Store and Google Play',
        'Notifications, offline mode and custom integrations',
      ],
    },
  },
  {
    slug: 'intelligence-artificielle',
    icon: 'lucide:cpu',
    tags: ['ChatGPT API', 'Python', 'Automatisation'],
    title: { fr: 'Intelligence Artificielle', en: 'Artificial Intelligence' },
    description: {
      fr: "Intégration d'IA dans vos outils existants : chatbots intelligents, analyse de données, automatisation des tâches répétitives et recommandations personnalisées.",
      en: 'AI integrated into your existing tools: smart chatbots, data analysis, automation of repetitive tasks, and personalized recommendations.',
    },
    intro: {
      fr: 'Nous intégrons l’intelligence artificielle dans vos outils : chatbots, analyse de données, automatisation et recommandations — uniquement là où elle apporte une réelle valeur.',
      en: 'We integrate artificial intelligence into your tools: chatbots, data analysis, automation and recommendations — only where it brings real value.',
    },
    metaDescription: {
      fr: "Intégration d'intelligence artificielle dans vos outils aux Antilles : chatbots, analyse de données et automatisation, là où elle apporte une vraie valeur.",
      en: 'Artificial intelligence integrated into your tools in the French West Indies: chatbots, data analysis and automation, only where it brings real value.',
    },
    benefits: {
      fr: [
        'Chatbots et assistants intelligents',
        'Automatisation des tâches à faible valeur',
        'Analyse et exploitation de vos données',
        'Intégration dans vos outils existants',
      ],
      en: [
        'Smart chatbots and assistants',
        'Automation of low-value tasks',
        'Analysis and use of your data',
        'Integration into your existing tools',
      ],
    },
  },
];

export function getServices(locale: Locale): Service[] {
  return SERVICES_DATA.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    tags: s.tags,
    title: s.title[locale],
    description: s.description[locale],
    intro: s.intro[locale],
    metaDescription: s.metaDescription[locale],
    benefits: s.benefits[locale],
  }));
}

export function getServiceBySlug(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}
