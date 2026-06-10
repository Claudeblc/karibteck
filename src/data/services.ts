import type { Locale, Localized, Service } from '@/types';

interface ServiceData {
  slug: string;
  icon: string;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
  intro: Localized<string>;
  benefits: Localized<string[]>;
}

const SERVICES_DATA: ServiceData[] = [
  {
    slug: 'creation-sites-web',
    icon: '🌐',
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
    icon: '📱',
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
    slug: 'logiciels-metier',
    icon: '⚙️',
    tags: ['PHP / Laravel', 'Node.js', 'PostgreSQL', 'API REST'],
    title: { fr: 'Logiciels Métier (ERP / CRM)', en: 'Business Software (ERP / CRM)' },
    description: {
      fr: 'Progiciels de gestion sur mesure : ERP, CRM, outils de facturation, gestion des stocks et des RH. Des solutions clé en main qui automatisent votre cœur de métier.',
      en: 'Custom management software: ERP, CRM, invoicing, inventory and HR tools. Turnkey solutions that automate the core of your business.',
    },
    intro: {
      fr: 'Nous créons des logiciels métier sur mesure — ERP, CRM, outils de facturation et de gestion — qui automatisent votre cœur d’activité et remplacent les tableurs éparpillés.',
      en: 'We build custom business software — ERP, CRM, invoicing and management tools — that automates the core of your activity and replaces scattered spreadsheets.',
    },
    benefits: {
      fr: [
        'Adapté exactement à vos processus',
        'Centralisation de vos données',
        'Automatisation des tâches répétitives',
        'Évolutif au rythme de votre croissance',
      ],
      en: [
        'Tailored exactly to your processes',
        'Your data, centralized',
        'Automation of repetitive tasks',
        'Scales with your growth',
      ],
    },
  },
  {
    slug: 'e-commerce',
    icon: '🛒',
    tags: ['WooCommerce', 'Shopify', 'Paiement sécurisé'],
    title: { fr: 'E-Commerce', en: 'E-Commerce' },
    description: {
      fr: 'Boutiques en ligne performantes et sécurisées. Paiement en ligne, gestion des stocks, expéditions, fidélisation — tout le nécessaire pour vendre efficacement sur le web.',
      en: 'High-performing, secure online stores. Online payments, inventory, shipping, loyalty — everything you need to sell effectively online.',
    },
    intro: {
      fr: 'Nous lançons des boutiques en ligne performantes et sécurisées, du catalogue au paiement, prêtes à vendre auprès de vos clients antillais et au-delà.',
      en: 'We launch fast, secure online stores, from catalog to checkout, ready to sell to your customers in the West Indies and beyond.',
    },
    benefits: {
      fr: [
        'Paiement en ligne sécurisé',
        'Gestion des stocks et des expéditions',
        'Optimisé pour la conversion',
        'Fidélisation et promotions intégrées',
      ],
      en: [
        'Secure online payments',
        'Inventory and shipping management',
        'Conversion-optimized',
        'Built-in loyalty and promotions',
      ],
    },
  },
  {
    slug: 'hebergement-devops',
    icon: '☁️',
    tags: ['AWS / VPS', 'Docker', 'CI/CD', 'SSL'],
    title: { fr: 'Hébergement & DevOps', en: 'Hosting & DevOps' },
    description: {
      fr: 'Déploiement, infrastructure cloud, CI/CD et maintenance. Nous gérons toute la partie technique pour que vous vous concentriez sur votre business.',
      en: 'Deployment, cloud infrastructure, CI/CD and maintenance. We handle the entire technical side so you can focus on your business.',
    },
    intro: {
      fr: 'Nous gérons toute l’infrastructure technique de vos applications : déploiement, cloud, CI/CD, sauvegardes et maintenance, pour que vous restiez concentré sur votre business.',
      en: 'We handle the entire technical infrastructure of your applications: deployment, cloud, CI/CD, backups and maintenance, so you stay focused on your business.',
    },
    benefits: {
      fr: [
        'Hébergement fiable et sécurisé (SSL inclus)',
        'Déploiements automatisés (CI/CD)',
        'Sauvegardes et supervision',
        'Maintenance et mises à jour de sécurité',
      ],
      en: [
        'Reliable, secure hosting (SSL included)',
        'Automated deployments (CI/CD)',
        'Backups and monitoring',
        'Maintenance and security updates',
      ],
    },
  },
  {
    slug: 'intelligence-artificielle',
    icon: '🤖',
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
    benefits: s.benefits[locale],
  }));
}

export function getServiceBySlug(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}
