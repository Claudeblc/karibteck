import type { Locale, Localized, ProcessStep } from '@/types';

interface ProcessStepData {
  num: number;
  title: Localized<string>;
  description: Localized<string>;
}

const PROCESS_STEPS_DATA: ProcessStepData[] = [
  {
    num: 1,
    title: { fr: 'Écoute & Analyse', en: 'Listen & Analyze' },
    description: {
      fr: 'Nous prenons le temps de comprendre votre activité, vos objectifs et vos contraintes avant de proposer la moindre solution.',
      en: 'We take the time to understand your business, goals and constraints before proposing any solution.',
    },
  },
  {
    num: 2,
    title: { fr: 'Conception', en: 'Design' },
    description: {
      fr: 'Maquettes, architecture fonctionnelle, choix technologiques — nous vous présentons un plan détaillé avant de coder la première ligne.',
      en: 'Mockups, functional architecture, technology choices — we present a detailed plan before writing a single line of code.',
    },
  },
  {
    num: 3,
    title: { fr: 'Développement', en: 'Development' },
    description: {
      fr: "Livraisons itératives avec points réguliers. Vous suivez l'avancement en temps réel et validez chaque étape.",
      en: 'Iterative deliveries with regular check-ins. You follow progress in real time and validate each step.',
    },
  },
  {
    num: 4,
    title: { fr: 'Tests & Recette', en: 'Testing & QA' },
    description: {
      fr: 'Tests approfondis sur tous les appareils et navigateurs. Zéro surprise à la mise en production.',
      en: 'Thorough testing across all devices and browsers. Zero surprises at go-live.',
    },
  },
  {
    num: 5,
    title: { fr: 'Lancement & Suivi', en: 'Launch & Follow-up' },
    description: {
      fr: 'Mise en ligne, formation si besoin, puis suivi post-lancement pour garantir le bon fonctionnement de votre solution.',
      en: 'Go-live, training if needed, then post-launch follow-up to keep your solution running smoothly.',
    },
  },
];

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return PROCESS_STEPS_DATA.map((s) => ({
    num: s.num,
    title: s.title[locale],
    description: s.description[locale],
  }));
}
