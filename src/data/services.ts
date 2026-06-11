import type { Locale, Localized, Service } from '@/types';

interface ServiceData {
  slug: string;
  icon: string;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
  intro: Localized<string>;
  metaDescription: Localized<string>;
  problem: Localized<string>;
  benefits: Localized<string[]>;
  useCases: Localized<string[]>;
  outcome: Localized<string>;
  faq: { question: Localized<string>; answer: Localized<string> }[];
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
    problem: {
      fr: 'Un site lent, daté ou introuvable sur Google, c’est des clients qui partent à la concurrence sans même vous connaître.',
      en: 'A slow, dated or invisible site means customers go to your competitors without ever knowing you exist.',
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
    outcome: {
      fr: 'Un site rapide, bien positionné sur Google et pensé pour convertir : plus de demandes entrantes, moins d’efforts commerciaux.',
      en: 'A fast site that ranks on Google and is built to convert: more inbound requests, less sales effort.',
    },
    useCases: {
      fr: [
        'Site vitrine pour un restaurant ou un commerce : menu, horaires, réservation et avis, optimisé Google.',
        'Boutique en ligne pour un producteur ou artisan local : catalogue, paiement et livraison.',
        'Refonte d’un site lent ou daté : design moderne, vitesse, SEO et back-office simple.',
      ],
      en: [
        'Brochure site for a restaurant or shop: menu, hours, booking and reviews, optimized for Google.',
        'Online store for a local producer or maker: catalog, checkout and delivery.',
        'Redesign of a slow or dated site: modern design, speed, SEO and a simple back office.',
      ],
    },
    faq: [
      {
        question: {
          fr: 'Combien de temps pour un site vitrine ?',
          en: 'How long for a brochure site?',
        },
        answer: {
          fr: 'En général 2 à 4 semaines selon le nombre de pages et la complexité, avec un calendrier fixé dès la conception.',
          en: 'Usually 2 to 4 weeks depending on the number of pages and complexity, with a schedule set from the design phase.',
        },
      },
      {
        question: {
          fr: 'Pourrai-je mettre à jour le site moi-même ?',
          en: 'Will I be able to update the site myself?',
        },
        answer: {
          fr: 'Oui. Nous livrons un back-office simple et une courte formation pour que vous restiez autonome.',
          en: 'Yes. We deliver a simple back office and a short training so you stay independent.',
        },
      },
      {
        question: {
          fr: 'Mon site sera-t-il bien référencé sur Google ?',
          en: 'Will my site rank on Google?',
        },
        answer: {
          fr: 'Le SEO technique (vitesse, structure, balises, mobile) est intégré dès la conception. Nous posons des bases saines ; le référencement se travaille ensuite dans la durée.',
          en: 'Technical SEO (speed, structure, tags, mobile) is built in from the start. We lay healthy foundations; ranking is then built over time.',
        },
      },
    ],
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
    problem: {
      fr: 'Vos clients vivent sur leur téléphone, mais votre activité reste coincée au comptoir ou au téléphone.',
      en: 'Your customers live on their phones, but your business is still stuck at the counter or on the phone.',
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
    outcome: {
      fr: 'Une app que vos clients gardent en poche : commandes et réservations en autonomie, et un lien direct qui fidélise.',
      en: 'An app your customers keep in their pocket: self-service orders and bookings, and a direct channel that builds loyalty.',
    },
    useCases: {
      fr: [
        'App de réservation et de prise de rendez-vous, avec tableau de bord pour le prestataire.',
        'App de commande et de fidélité pour un commerce : panier, notifications, points de fidélité.',
        'App métier de terrain : saisie hors-ligne, suivi d’interventions, synchronisation au retour du réseau.',
      ],
      en: [
        'Booking and appointment app, with a dashboard for the provider.',
        'Ordering and loyalty app for a shop: cart, notifications, loyalty points.',
        'Field operations app: offline data entry, job tracking, sync when back online.',
      ],
    },
    faq: [
      {
        question: {
          fr: 'iOS et Android, ça veut dire deux apps ?',
          en: 'Does iOS and Android mean two apps?',
        },
        answer: {
          fr: 'Non. Nous développons une seule base de code (React Native ou Flutter) publiée sur l’App Store et Google Play, ce qui réduit coût et délais.',
          en: 'No. We build a single codebase (React Native or Flutter) published to the App Store and Google Play, which cuts cost and time.',
        },
      },
      {
        question: {
          fr: 'L’app peut-elle fonctionner hors connexion ?',
          en: 'Can the app work offline?',
        },
        answer: {
          fr: 'Oui, c’est utile aux Antilles : les données saisies hors-ligne se synchronisent dès le retour du réseau.',
          en: 'Yes, which matters in the West Indies: data entered offline syncs as soon as the network is back.',
        },
      },
      {
        question: {
          fr: 'Gérez-vous la publication sur les stores ?',
          en: 'Do you handle store publishing?',
        },
        answer: {
          fr: 'Oui, nous gérons la mise en ligne sur l’App Store et Google Play, ainsi que les mises à jour.',
          en: 'Yes, we handle release on the App Store and Google Play, as well as updates.',
        },
      },
    ],
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
    problem: {
      fr: 'Vos équipes perdent des heures sur des tâches répétitives, et vos clients attendent une réponse quand personne n’est disponible.',
      en: 'Your team loses hours on repetitive tasks, and your customers wait for answers when no one is available.',
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
    outcome: {
      fr: 'Des agents IA qui travaillent 24/7 dans vos outils : leads qualifiés, clients répondus, process automatisés — votre équipe se concentre sur l’essentiel.',
      en: 'AI agents working 24/7 inside your tools: leads qualified, customers answered, processes automated — your team focuses on what matters.',
    },
    useCases: {
      fr: [
        'Chatbot de support connecté à votre FAQ et vos documents : répond 24/7 et escalade vers vous si besoin.',
        'Agent de qualification de leads : trie les demandes entrantes, pose les bonnes questions et route les prospects chauds.',
        'Automatisation de tâches : génération de devis et de comptes-rendus, extraction de données depuis vos documents.',
      ],
      en: [
        'Support chatbot connected to your FAQ and documents: answers 24/7 and escalates to you when needed.',
        'Lead-qualification agent: sorts incoming requests, asks the right questions and routes hot prospects.',
        'Task automation: quote and report generation, data extraction from your documents.',
      ],
    },
    faq: [
      {
        question: {
          fr: 'L’IA va-t-elle dire n’importe quoi à mes clients ?',
          en: 'Will the AI say anything to my customers?',
        },
        answer: {
          fr: 'Nous connectons les agents à vos données réelles (RAG) et posons des garde-fous : ils répondent à partir de vos documents et escaladent vers un humain en cas de doute.',
          en: 'We connect agents to your real data (RAG) and set guardrails: they answer from your documents and escalate to a human when unsure.',
        },
      },
      {
        question: {
          fr: 'Faut-il changer tous nos outils ?',
          en: 'Do we have to change all our tools?',
        },
        answer: {
          fr: 'Non. Les agents s’intègrent à vos outils existants (site, CRM, messagerie) via API, sans tout remplacer.',
          en: 'No. Agents integrate with your existing tools (site, CRM, inbox) via API, without replacing everything.',
        },
      },
      {
        question: { fr: 'Mes données sont-elles en sécurité ?', en: 'Is my data safe?' },
        answer: {
          fr: 'Nous cadrons les accès et le périmètre des données dès le départ, et privilégions des solutions respectueuses de la confidentialité.',
          en: 'We scope data access and boundaries from the start, and favor privacy-respecting solutions.',
        },
      },
    ],
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
    problem: s.problem[locale],
    benefits: s.benefits[locale],
    useCases: s.useCases[locale],
    outcome: s.outcome[locale],
    faq: s.faq.map((f) => ({ question: f.question[locale], answer: f.answer[locale] })),
  }));
}

export function getServiceBySlug(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}
