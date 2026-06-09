import type { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    slug: 'creation-sites-web',
    icon: '🌐',
    title: 'Création de Sites Web',
    description:
      'Sites vitrines, landing pages, sites e-commerce et portails corporate. Des designs modernes, rapides et optimisés SEO qui convertissent vos visiteurs en clients.',
    tags: ['WordPress', 'Next.js', 'Figma', 'SEO'],
  },
  {
    slug: 'applications-mobiles',
    icon: '📱',
    title: 'Applications Mobiles',
    description:
      'Applications iOS et Android sur mesure pour votre activité. Gestion de commandes, suivi client, tableaux de bord — nous transformons vos processus en apps intuitives.',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
  },
  {
    slug: 'logiciels-metier',
    icon: '⚙️',
    title: 'Logiciels Métier (ERP / CRM)',
    description:
      'Progiciels de gestion sur mesure : ERP, CRM, outils de facturation, gestion des stocks et des RH. Des solutions clé en main qui automatisent votre cœur de métier.',
    tags: ['PHP / Laravel', 'Node.js', 'PostgreSQL', 'API REST'],
  },
  {
    slug: 'e-commerce',
    icon: '🛒',
    title: 'E-Commerce',
    description:
      'Boutiques en ligne performantes et sécurisées. Paiement en ligne, gestion des stocks, expéditions, fidélisation — tout le nécessaire pour vendre efficacement sur le web.',
    tags: ['WooCommerce', 'Shopify', 'Paiement sécurisé'],
  },
  {
    slug: 'hebergement-devops',
    icon: '☁️',
    title: 'Hébergement & DevOps',
    description:
      'Déploiement, infrastructure cloud, CI/CD et maintenance. Nous gérons toute la partie technique pour que vous vous concentriez sur votre business.',
    tags: ['AWS / VPS', 'Docker', 'CI/CD', 'SSL'],
  },
  {
    slug: 'intelligence-artificielle',
    icon: '🤖',
    title: 'Intelligence Artificielle',
    description:
      "Intégration d'IA dans vos outils existants : chatbots intelligents, analyse de données, automatisation des tâches répétitives et recommandations personnalisées.",
    tags: ['ChatGPT API', 'Python', 'Automatisation'],
  },
];
