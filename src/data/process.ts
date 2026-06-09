import type { ProcessStep } from '@/types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    num: 1,
    title: 'Écoute & Analyse',
    description:
      'Nous prenons le temps de comprendre votre activité, vos objectifs et vos contraintes avant de proposer la moindre solution.',
  },
  {
    num: 2,
    title: 'Conception',
    description:
      'Maquettes, architecture fonctionnelle, choix technologiques — nous vous présentons un plan détaillé avant de coder la première ligne.',
  },
  {
    num: 3,
    title: 'Développement',
    description:
      "Livraisons itératives avec points réguliers. Vous suivez l'avancement en temps réel et validez chaque étape.",
  },
  {
    num: 4,
    title: 'Tests & Recette',
    description:
      'Tests approfondis sur tous les appareils et navigateurs. Zéro surprise à la mise en production.',
  },
  {
    num: 5,
    title: 'Lancement & Suivi',
    description:
      'Mise en ligne, formation si besoin, puis suivi post-lancement pour garantir le bon fonctionnement de votre solution.',
  },
];
