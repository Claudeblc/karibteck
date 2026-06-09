import type { Project } from '@/types';

// Reframed per spec §3: presented as the kinds of projects we build, not as
// delivered client work (the agency starts with zero clients).
export const PROJECTS: Project[] = [
  {
    category: 'E-Commerce',
    title: 'Boutique en ligne — Distribution alimentaire',
    description:
      'Plateforme e-commerce complète avec gestion des stocks, livraison locale et paiement en ligne, pensée pour un distributeur alimentaire des DOM.',
    emoji: '🛒',
    gradient: 'linear-gradient(135deg,#0d2040,#1a3560)',
  },
  {
    category: 'Logiciel Métier',
    title: 'ERP de gestion — Entreprise du BTP',
    description:
      'Progiciel de gestion intégré couvrant devis, facturation, gestion de chantiers et suivi RH pour une PME du bâtiment.',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg,#0a1e40,#0d2d50)',
  },
  {
    category: 'Application Mobile',
    title: 'App de réservation — Activités nautiques',
    description:
      'Application iOS & Android permettant de réserver des excursions en mer, avec tableau de bord pour le prestataire local.',
    emoji: '📱',
    gradient: 'linear-gradient(135deg,#0f1a38,#152040)',
  },
];
