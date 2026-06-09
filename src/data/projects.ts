import type { Locale, Localized, Project } from '@/types';

interface ProjectData {
  emoji: string;
  gradient: string;
  category: Localized<string>;
  title: Localized<string>;
  description: Localized<string>;
}

// Reframed per spec §3: presented as the kinds of projects we build, not as
// delivered client work (the agency starts with zero clients).
const PROJECTS_DATA: ProjectData[] = [
  {
    emoji: '🛒',
    gradient: 'linear-gradient(135deg,#0d2040,#1a3560)',
    category: { fr: 'E-Commerce', en: 'E-Commerce' },
    title: {
      fr: 'Boutique en ligne — Distribution alimentaire',
      en: 'Online store — Food distribution',
    },
    description: {
      fr: 'Plateforme e-commerce complète avec gestion des stocks, livraison locale et paiement en ligne, pensée pour un distributeur alimentaire des DOM.',
      en: 'A complete e-commerce platform with inventory management, local delivery and online payment, designed for a food distributor in the overseas territories.',
    },
  },
  {
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg,#0a1e40,#0d2d50)',
    category: { fr: 'Logiciel Métier', en: 'Business Software' },
    title: {
      fr: 'ERP de gestion — Entreprise du BTP',
      en: 'Management ERP — Construction company',
    },
    description: {
      fr: 'Progiciel de gestion intégré couvrant devis, facturation, gestion de chantiers et suivi RH pour une PME du bâtiment.',
      en: 'An integrated management suite covering quotes, invoicing, site management and HR tracking for a construction SME.',
    },
  },
  {
    emoji: '📱',
    gradient: 'linear-gradient(135deg,#0f1a38,#152040)',
    category: { fr: 'Application Mobile', en: 'Mobile App' },
    title: {
      fr: 'App de réservation — Activités nautiques',
      en: 'Booking app — Water activities',
    },
    description: {
      fr: 'Application iOS & Android permettant de réserver des excursions en mer, avec tableau de bord pour le prestataire local.',
      en: 'An iOS & Android app to book sea excursions, with a dashboard for the local provider.',
    },
  },
];

export function getProjects(locale: Locale): Project[] {
  return PROJECTS_DATA.map((p) => ({
    category: p.category[locale],
    title: p.title[locale],
    description: p.description[locale],
    emoji: p.emoji,
    gradient: p.gradient,
  }));
}
