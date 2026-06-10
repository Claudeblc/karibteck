import type { Locale, Localized, TeamMember } from '@/types';

interface TeamMemberData {
  initials: string;
  name: string;
  accent: string;
  role: Localized<string>;
  bio: Localized<string>;
}

// Names are placeholders to fill once finalized; roles are real.
const TEAM_DATA: TeamMemberData[] = [
  {
    initials: 'A',
    name: '[Prénom Nom]',
    accent: 'var(--color-teal)',
    role: {
      fr: 'Développement web & architecture',
      en: 'Web development & architecture',
    },
    bio: {
      fr: 'Conception et développement de sites et applications web performants, du front-end à l’architecture back-end.',
      en: 'Designs and builds high-performance websites and web apps, from the front-end to the back-end architecture.',
    },
  },
  {
    initials: 'B',
    name: '[Prénom Nom]',
    accent: 'var(--color-teal-bright)',
    role: {
      fr: 'Applications mobiles & design produit',
      en: 'Mobile apps & product design',
    },
    bio: {
      fr: 'Applications iOS et Android sur mesure et design d’interfaces centrées sur l’expérience utilisateur.',
      en: 'Custom iOS and Android apps and interface design focused on the user experience.',
    },
  },
  {
    initials: 'C',
    name: '[Prénom Nom]',
    accent: 'var(--color-primary)',
    role: {
      fr: 'DevOps, cloud & intelligence artificielle',
      en: 'DevOps, cloud & artificial intelligence',
    },
    bio: {
      fr: 'Infrastructure cloud, déploiement continu et intégration de solutions d’IA dans les produits livrés.',
      en: 'Cloud infrastructure, continuous deployment and AI integration into the products we ship.',
    },
  },
];

export function getTeam(locale: Locale): TeamMember[] {
  return TEAM_DATA.map((m) => ({
    initials: m.initials,
    name: m.name,
    accent: m.accent,
    role: m.role[locale],
    bio: m.bio[locale],
  }));
}
