import type { Locale, Localized, TeamMember } from '@/types';

interface TeamMemberData {
  initials: string;
  name: string;
  accent: string;
  role: Localized<string>;
  bio: Localized<string>;
}

// Two founders. Roles split the three verticals (web, mobile, IA) across them.
const TEAM_DATA: TeamMemberData[] = [
  {
    initials: 'A',
    name: 'Aymeric',
    accent: 'var(--color-teal)',
    role: {
      fr: 'Développement web, mobile & architecture',
      en: 'Web & mobile development, architecture',
    },
    bio: {
      fr: 'Conception et développement de sites, d’applications web et mobiles performants, du front-end à l’architecture back-end.',
      en: 'Designs and builds high-performance websites, web and mobile apps, from the front-end to the back-end architecture.',
    },
  },
  {
    initials: 'C',
    name: 'Claude',
    accent: 'var(--color-teal-bright)',
    role: {
      fr: 'Intelligence artificielle, DevOps & cloud',
      en: 'Artificial intelligence, DevOps & cloud',
    },
    bio: {
      fr: 'Conception d’agents IA intégrés aux produits livrés, infrastructure cloud et déploiement continu.',
      en: 'Builds AI agents integrated into the products we ship, cloud infrastructure and continuous deployment.',
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
