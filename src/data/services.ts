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
      fr: 'Un site rapide, bien référencé et pensé pour convertir : vos visiteurs deviennent des clients, pas juste des visites.',
      en: 'A fast, well-ranked site built to convert: your visitors become customers, not just traffic.',
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
      fr: 'Mettez votre activité dans la poche de vos clients : commandes, réservations et fidélité, sur iOS et Android.',
      en: "Put your business in your customers' pocket: orders, bookings and loyalty, on iOS and Android.",
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
    tags: ['Agents IA', 'RAG', 'LLM', 'Python'],
    title: { fr: 'Intelligence Artificielle', en: 'Artificial Intelligence' },
    description: {
      fr: 'Au-delà du chatbot : des agents IA qui agissent dans vos outils — qualifient vos leads, répondent 24/7 et automatisent vos process de bout en bout.',
      en: 'Beyond the chatbot: AI agents that act inside your tools — qualifying leads, replying 24/7 and automating your processes end to end.',
    },
    intro: {
      fr: 'Nous concevons des agents IA qui agissent dans vos outils — qualification de leads, support client 24/7, automatisation de vos process — connectés à vos données (RAG). De l’IA qui exécute, pas du gadget.',
      en: 'We build AI agents that act inside your tools — lead qualification, 24/7 customer support, process automation — connected to your data (RAG). AI that executes, not gimmicks.',
    },
    metaDescription: {
      fr: 'Agents IA pour les entreprises des Antilles : qualification de leads, support 24/7 et automatisation de vos process, connectés à vos données et vos outils.',
      en: 'AI agents for businesses in the French West Indies: lead qualification, 24/7 support and process automation, connected to your own data and tools.',
    },
    benefits: {
      fr: [
        'Des agents IA qui exécutent vos tâches, pas juste un chatbot',
        'Support client et qualification de leads 24/7',
        'Connectés à vos données et vos outils (RAG)',
        'Automatisation de vos process de bout en bout',
      ],
      en: [
        'AI agents that execute tasks, not just a chatbot',
        '24/7 customer support and lead qualification',
        'Connected to your data and tools (RAG)',
        'End-to-end automation of your processes',
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
