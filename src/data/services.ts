import type { Locale, Localized, Service } from '@/types';

interface ServiceData {
  slug: string;
  icon: string;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
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
  },
];

export function getServices(locale: Locale): Service[] {
  return SERVICES_DATA.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    tags: s.tags,
    title: s.title[locale],
    description: s.description[locale],
  }));
}
