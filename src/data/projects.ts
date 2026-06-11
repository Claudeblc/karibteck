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
    emoji: 'lucide:globe',
    gradient: 'linear-gradient(135deg,#0d2040,#1a3560)',
    category: { fr: 'Site Web', en: 'Website' },
    title: {
      fr: 'Site vitrine — Cabinet de conseil',
      en: 'Brochure site — Consulting firm',
    },
    description: {
      fr: 'Site vitrine rapide et optimisé SEO, avec prise de rendez-vous en ligne et espace actualités, pensé pour un cabinet de conseil local.',
      en: 'A fast, SEO-optimized brochure site with online booking and a news section, designed for a local consulting firm.',
    },
  },
  {
    emoji: 'lucide:cpu',
    gradient: 'linear-gradient(135deg,#0a1e40,#0d2d50)',
    category: { fr: 'Intelligence Artificielle', en: 'Artificial Intelligence' },
    title: {
      fr: 'Assistant IA — Service client',
      en: 'AI assistant — Customer support',
    },
    description: {
      fr: 'Chatbot intelligent connecté à la base de connaissances de l’entreprise, répondant automatiquement aux questions fréquentes des clients.',
      en: 'A smart chatbot connected to the company knowledge base, answering customers’ frequent questions automatically.',
    },
  },
  {
    emoji: 'lucide:smartphone',
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
