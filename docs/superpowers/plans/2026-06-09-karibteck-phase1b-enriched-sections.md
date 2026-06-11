# KaribTeck Phase 1b — Enriched Sections (Team, Guarantees, FAQ) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three enriched, bilingual sections to the landing — **Équipe** (the 3 engineers, placeholder names), **Garanties/Engagements**, and **FAQ** — so the site reads as a credible professional agency and the FAQ feeds a `FAQPage` JSON-LD in Phase 3.

**Architecture:** Same patterns as Phases 1–2: translatable content in `Localized<T>` data modules with `getX(locale)` getters; presentational molecules + organisms; sections use the existing `SectionHeader`; strings via `ui.ts` (FR+EN, symmetric). FAQ accordion uses native `<details>/<summary>` (zero JS, accessible). New organisms are inserted into the shared `HomePage.astro` in spec order.

**Tech Stack:** Astro 6 static, Tailwind 4 `@theme`, TS strict. Builds on Phases 0–2.

> **Content:** authored here (FR + EN), honest (no fabricated proof, no fake client counts). **Team names are explicit placeholders** (`[Prénom Nom]`) — roles are real agency roles; avatars are initials, no fake photos. **Spec:** `…specs/2026-06-09-…-design.md` §6.1 (landing order: … Projets → Équipe → Garanties → Tarifs → FAQ → Contact). **Conventions:** `CLAUDE.md`.

---

## Scope

**In scope:** `team.ts`/`guarantees.ts`/`faq.ts` data (FR+EN); `TeamMember`/`Guarantee`/`FaqItem` types; molecules `TeamMemberCard`, `GuaranteeItem`, `FaqItem`; organisms `TeamSection`, `GuaranteesSection`, `FaqSection`; new `ui.ts` keys (FR+EN); insertion into `HomePage.astro`. Both locales (the shared HomePage already renders FR + EN).

**NOT in scope:** `FAQPage`/any JSON-LD (Phase 3 — it will consume `getFaq(locale)`), real engineer names/photos, real metrics, service pages, blog, contact wiring.

---

## Section placement in `HomePage.astro`

Current order: Hero · FeaturesStrip · Services · Stack · Process · Why · Projects · Pricing · Contact.
After this phase: … Projects · **Team** · **Guarantees** · Pricing · **FAQ** · Contact.

---

## Task 1: Types

**Files:** Modify `src/types/index.ts` (append).

- [ ] **Step 1: Add interfaces**

```ts
export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  accent: string;
}

export interface Guarantee {
  icon: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

- [ ] **Step 2: Verify + commit**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

```bash
git add src/types/index.ts
git commit -m "feat(types): add TeamMember, Guarantee and FaqItem interfaces"
```

---

## Task 2: Data — team, guarantees, faq (FR + EN)

**Files:** Create `src/data/team.ts`, `src/data/guarantees.ts`, `src/data/faq.ts`.

- [ ] **Step 1: `src/data/team.ts`** — 3 members, names are explicit placeholders, roles real, `accent` is a token color used for the initials avatar.

```ts
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
    accent: 'var(--color-cyan)',
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
    accent: 'var(--color-blue-2)',
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
    accent: 'var(--color-blue-1)',
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
```

- [ ] **Step 2: `src/data/guarantees.ts`** — 6 honest commitments.

```ts
import type { Guarantee, Locale, Localized } from '@/types';

interface GuaranteeData {
  icon: string;
  title: Localized<string>;
  description: Localized<string>;
}

const GUARANTEES_DATA: GuaranteeData[] = [
  {
    icon: '⏱️',
    title: { fr: 'Devis sous 24h', en: 'Quote within 24h' },
    description: {
      fr: 'Vous nous contactez, nous revenons vers vous sous 24h avec une première réponse claire.',
      en: 'You reach out, we get back to you within 24h with a clear first answer.',
    },
  },
  {
    icon: '🧱',
    title: { fr: 'Code propre & maintenable', en: 'Clean, maintainable code' },
    description: {
      fr: 'Un code structuré et documenté, pensé pour durer et évoluer — jamais une boîte noire.',
      en: 'Structured, documented code built to last and evolve — never a black box.',
    },
  },
  {
    icon: '⚡',
    title: { fr: 'Performance & SEO inclus', en: 'Performance & SEO included' },
    description: {
      fr: 'Rapidité, accessibilité et référencement sont intégrés dès la conception, pas en option.',
      en: 'Speed, accessibility and search optimization are built in from the start, not an add-on.',
    },
  },
  {
    icon: '🔑',
    title: { fr: 'Vous êtes propriétaire', en: 'You own everything' },
    description: {
      fr: 'Le code, les accès et les données vous appartiennent intégralement à la livraison.',
      en: 'The code, accesses and data are fully yours on delivery.',
    },
  },
  {
    icon: '💬',
    title: { fr: 'Accompagnement continu', en: 'Ongoing support' },
    description: {
      fr: 'Nous restons disponibles après la mise en ligne : maintenance, évolutions et conseils.',
      en: 'We stay available after launch: maintenance, evolutions and advice.',
    },
  },
  {
    icon: '🪪',
    title: { fr: 'Transparence des prix', en: 'Transparent pricing' },
    description: {
      fr: 'Un devis détaillé et sans surprise : vous savez exactement ce que vous payez et pourquoi.',
      en: 'A detailed, no-surprise quote: you know exactly what you pay and why.',
    },
  },
];

export function getGuarantees(locale: Locale): Guarantee[] {
  return GUARANTEES_DATA.map((g) => ({
    icon: g.icon,
    title: g.title[locale],
    description: g.description[locale],
  }));
}
```

- [ ] **Step 3: `src/data/faq.ts`** — 7 honest, GEO-friendly Q&A.

```ts
import type { FaqItem, Locale, Localized } from '@/types';

interface FaqData {
  question: Localized<string>;
  answer: Localized<string>;
}

const FAQ_DATA: FaqData[] = [
  {
    question: { fr: 'Combien coûte un site web ?', en: 'How much does a website cost?' },
    answer: {
      fr: 'Un site vitrine démarre autour de 990€, un site ou une application plus avancée autour de 2 900€, et les projets sur mesure (logiciels, apps mobiles) sont sur devis. Chaque projet étant unique, nous établissons un devis précis après un premier échange.',
      en: 'A brochure site starts around €990, a more advanced site or app around €2,900, and custom projects (software, mobile apps) are quoted individually. Since every project is unique, we provide a precise quote after a first conversation.',
    },
  },
  {
    question: { fr: 'En combien de temps livrez-vous ?', en: 'How long does delivery take?' },
    answer: {
      fr: 'Un site vitrine prend généralement 2 à 4 semaines, un projet plus complexe quelques mois. Nous fixons un calendrier clair dès la phase de conception et livrons par étapes.',
      en: 'A brochure site usually takes 2 to 4 weeks, a more complex project a few months. We set a clear schedule from the design phase and deliver in stages.',
    },
  },
  {
    question: {
      fr: 'Travaillez-vous à distance, hors de la Guadeloupe ?',
      en: 'Do you work remotely, outside Guadeloupe?',
    },
    answer: {
      fr: 'Oui. Nous sommes ancrés aux Antilles et connaissons le marché local des DOM, mais nous travaillons avec des clients partout, en présentiel comme à distance.',
      en: 'Yes. We are rooted in the French West Indies and know the local overseas market, but we work with clients anywhere, on-site or remotely.',
    },
  },
  {
    question: { fr: 'Assurez-vous la maintenance ?', en: 'Do you handle maintenance?' },
    answer: {
      fr: 'Oui. Nous proposons maintenance, mises à jour de sécurité et évolutions après la mise en ligne. Nous ne disparaissons pas après la livraison.',
      en: 'Yes. We offer maintenance, security updates and evolutions after launch. We don’t disappear after delivery.',
    },
  },
  {
    question: {
      fr: 'À qui appartient le site une fois livré ?',
      en: 'Who owns the site once delivered?',
    },
    answer: {
      fr: 'À vous, intégralement : le code, les accès, le nom de domaine et les données vous appartiennent. Vous n’êtes jamais prisonnier de notre agence.',
      en: 'You do, entirely: the code, accesses, domain name and data are yours. You are never locked into our agency.',
    },
  },
  {
    question: {
      fr: 'Gérez-vous le référencement (SEO) ?',
      en: 'Do you handle search optimization (SEO)?',
    },
    answer: {
      fr: 'Oui. L’optimisation technique pour le référencement et la performance est intégrée à chaque site dès sa conception, pour que vous soyez visible sur Google et les moteurs IA.',
      en: 'Yes. Technical optimization for search and performance is built into every site from the start, so you’re visible on Google and AI search engines.',
    },
  },
  {
    question: { fr: 'Quelles technologies utilisez-vous ?', en: 'Which technologies do you use?' },
    answer: {
      fr: 'Nous choisissons la technologie adaptée à votre besoin : WordPress, React/Next.js, React Native ou Flutter pour le mobile, Node.js, PHP/Laravel et PostgreSQL côté back-end, et l’intégration d’IA quand elle apporte de la valeur.',
      en: 'We pick the right technology for your need: WordPress, React/Next.js, React Native or Flutter for mobile, Node.js, PHP/Laravel and PostgreSQL on the back-end, and AI integration when it adds value.',
    },
  },
];

export function getFaq(locale: Locale): FaqItem[] {
  return FAQ_DATA.map((f) => ({
    question: f.question[locale],
    answer: f.answer[locale],
  }));
}
```

- [ ] **Step 4: Verify + commit**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

```bash
git add src/data/team.ts src/data/guarantees.ts src/data/faq.ts
git commit -m "feat(data): add bilingual team, guarantees and faq content"
```

---

## Task 3: UI strings for the three sections (FR + EN)

**Files:** Modify `src/i18n/ui.ts` (add keys to BOTH `fr` and `en` — the bidirectional `_UiSymmetry` guard enforces symmetry).

- [ ] **Step 1: Add keys** — FR values:

```ts
    'team.badge': 'L’équipe',
    'team.title.lead': 'Trois ingénieurs,',
    'team.title.hl': 'une exigence commune',
    'team.sub':
      'Une équipe à taille humaine, où chaque projet est porté par des développeurs seniors qui maîtrisent leur sujet de bout en bout.',
    'guarantees.badge': 'Nos engagements',
    'guarantees.title.lead': 'Ce sur quoi vous pouvez',
    'guarantees.title.hl': 'compter',
    'guarantees.sub':
      'Pas de promesses en l’air : des engagements concrets qui encadrent chacune de nos collaborations.',
    'faq.badge': 'FAQ',
    'faq.title.lead': 'Questions',
    'faq.title.hl': 'fréquentes',
    'faq.sub': 'Les réponses aux questions qu’on nous pose le plus souvent. Une autre question ? Écrivez-nous.',
```

- [ ] **Step 2: Add the matching `en` values:**

```ts
    'team.badge': 'The team',
    'team.title.lead': 'Three engineers,',
    'team.title.hl': 'one shared standard',
    'team.sub':
      'A small, focused team where every project is led by senior developers who own their craft end to end.',
    'guarantees.badge': 'Our commitments',
    'guarantees.title.lead': 'What you can',
    'guarantees.title.hl': 'count on',
    'guarantees.sub':
      'No empty promises: concrete commitments that frame every collaboration.',
    'faq.badge': 'FAQ',
    'faq.title.lead': 'Frequently asked',
    'faq.title.hl': 'questions',
    'faq.sub': 'Answers to the questions we hear most often. Another question? Write to us.',
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0/0 (if `_UiSymmetry` errors, a key is missing in one locale — fix).

```bash
git add src/i18n/ui.ts
git commit -m "feat(i18n): add team, guarantees and faq section strings (FR+EN)"
```

---

## Task 4: Molecules

**Files:** Create `src/components/molecules/{TeamMemberCard,GuaranteeItem,FaqItem}.astro`.

- [ ] **Step 1: `TeamMemberCard.astro`** — initials avatar (no photo), name, role, bio.

```astro
---
import type { TeamMember } from '@/types';

interface Props {
  member: TeamMember;
}
const { member } = Astro.props;
---

<article class="team-card fade-up">
  <div class="avatar" style={`--avatar-accent: ${member.accent}`} aria-hidden="true">
    {member.initials}
  </div>
  <h3 class="name">{member.name}</h3>
  <p class="role">{member.role}</p>
  <p class="bio">{member.bio}</p>
</article>

<style>
  .team-card {
    background: var(--color-navy-2);
    border: 1px solid var(--color-gray-2);
    border-radius: var(--radius-lg);
    padding: 28px;
    text-align: center;
  }
  .avatar {
    width: 72px;
    height: 72px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--color-navy-3);
    border: 2px solid var(--avatar-accent);
    color: var(--avatar-accent);
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 700;
  }
  .name {
    font-family: var(--font-display);
    font-size: 1.1rem;
  }
  .role {
    color: var(--color-cyan);
    font-size: 0.9rem;
    margin: 4px 0 12px;
  }
  .bio {
    color: var(--color-gray);
    font-size: 0.92rem;
  }
</style>
```

- [ ] **Step 2: `GuaranteeItem.astro`** — icon + title + description.

```astro
---
import type { Guarantee } from '@/types';

interface Props {
  guarantee: Guarantee;
}
const { guarantee } = Astro.props;
---

<article class="guarantee fade-up">
  <div class="icon" aria-hidden="true">{guarantee.icon}</div>
  <div>
    <h3 class="title">{guarantee.title}</h3>
    <p class="desc">{guarantee.description}</p>
  </div>
</article>

<style>
  .guarantee {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: var(--color-navy-2);
    border: 1px solid var(--color-gray-2);
    border-radius: var(--radius-card);
  }
  .icon {
    font-size: 1.6rem;
    line-height: 1;
  }
  .title {
    font-family: var(--font-display);
    font-size: 1.02rem;
    margin-bottom: 6px;
  }
  .desc {
    color: var(--color-gray);
    font-size: 0.92rem;
  }
</style>
```

- [ ] **Step 3: `FaqItem.astro`** — native `<details>/<summary>` accordion (zero JS, accessible).

```astro
---
import type { FaqItem } from '@/types';

interface Props {
  item: FaqItem;
}
const { item } = Astro.props;
---

<details class="faq-item fade-up">
  <summary>
    <span>{item.question}</span>
    <span class="chevron" aria-hidden="true">+</span>
  </summary>
  <p class="answer">{item.answer}</p>
</details>

<style>
  .faq-item {
    border: 1px solid var(--color-gray-2);
    border-radius: var(--radius-card);
    background: var(--color-navy-2);
    padding: 0 20px;
  }
  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 0;
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 1rem;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .chevron {
    color: var(--color-cyan);
    font-size: 1.4rem;
    transition: transform 0.2s;
  }
  .faq-item[open] .chevron {
    transform: rotate(45deg);
  }
  .answer {
    color: var(--color-gray);
    font-size: 0.95rem;
    padding: 0 0 18px;
  }
  @media (prefers-reduced-motion: reduce) {
    .chevron {
      transition: none;
    }
  }
</style>
```

- [ ] **Step 4: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean.

```bash
git add src/components/molecules/TeamMemberCard.astro src/components/molecules/GuaranteeItem.astro src/components/molecules/FaqItem.astro
git commit -m "feat(molecules): add team card, guarantee item and FAQ accordion item"
```

---

## Task 5: Organisms

**Files:** Create `src/components/organisms/{TeamSection,GuaranteesSection,FaqSection}.astro`. Each takes `locale?: Locale`, uses `SectionHeader` + the getter + the molecule. Follow the existing organism pattern (e.g. `ServicesSection`).

- [ ] **Step 1: `TeamSection.astro`** — `<section id="equipe">`

```astro
---
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import TeamMemberCard from '@/components/molecules/TeamMemberCard.astro';
import { getTeam } from '@/data/team';
import { useTranslations } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
const team = getTeam(locale);
---

<section id="equipe">
  <div class="section-inner">
    <SectionHeader
      badge={t('team.badge')}
      lead={t('team.title.lead')}
      highlight={t('team.title.hl')}
      sub={t('team.sub')}
      align="center"
    />
    <div class="team-grid">
      {team.map((member) => <TeamMemberCard member={member} />)}
    </div>
  </div>

  <style>
    #equipe {
      padding: var(--section-pad-y) 5%;
    }
    .section-inner {
      max-width: var(--content-max);
      margin: 0 auto;
    }
    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 48px;
    }
    @media (max-width: 860px) {
      .team-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</section>
```

> If `SectionHeader`'s prop names differ from `badge/lead/highlight/sub/align`, read `SectionHeader.astro` and use its actual prop API. Match whatever ServicesSection/ProcessSection already pass.

- [ ] **Step 2: `GuaranteesSection.astro`** — `<section id="garanties">`, `getGuarantees(locale)` → `GuaranteeItem` in a 2-column grid (1 col mobile). Same shell as TeamSection.

- [ ] **Step 3: `FaqSection.astro`** — `<section id="faq">`, `getFaq(locale)` → `FaqItem` stacked in a narrow column (`max-width: 760px; margin: 48px auto 0;`). Same shell.

- [ ] **Step 4: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean; no organism > 150 lines.

```bash
git add src/components/organisms/TeamSection.astro src/components/organisms/GuaranteesSection.astro src/components/organisms/FaqSection.astro
git commit -m "feat(organisms): add team, guarantees and FAQ sections"
```

---

## Task 6: Insert sections into HomePage + nav links

**Files:**

- Modify: `src/components/organisms/HomePage.astro`
- Modify: `src/data/agency.ts` (add nav anchors), `src/i18n/ui.ts` (nav labels), `src/components/molecules/NavMenu.astro` if needed.

- [ ] **Step 1: Insert organisms into `HomePage.astro`** in spec order — after `ProjectsSection`: `TeamSection` then `GuaranteesSection`; after `PricingSection`: `FaqSection` (before `ContactSection`). Pass `locale` to each, mirroring the others:

```astro
<ProjectsSection locale={locale} />
<TeamSection locale={locale} />
<GuaranteesSection locale={locale} />
<PricingSection locale={locale} />
<FaqSection locale={locale} />
<ContactSection locale={locale} />
```

- [ ] **Step 2: Add nav links** for the new sections. In `src/i18n/ui.ts` add `nav.team` (fr "Équipe" / en "Team") and `nav.faq` (fr "FAQ" / en "FAQ") to both dicts. In `src/data/agency.ts` add to `NAV_LINKS` (after projects): `{ labelKey: 'nav.team', href: '#equipe' }`, and keep nav concise — insert `{ labelKey: 'nav.faq', href: '#faq' }` before contact. (Keep total nav items reasonable; if the bar gets crowded, place Équipe and FAQ but it's fine at this count.)

> `NavLink.labelKey` is typed `UiKey`, so the new keys must exist in `ui.ts` first (Step adds them). Verify no type error.

- [ ] **Step 3: Build + visual check**

Run: `rm -rf dist .astro && npm run check && npm run build`
Expected: 0/0; both `dist/index.html` and `dist/en/index.html` built.

Run `npm run dev`, open `/` and `/en/`. Verify: Team (3 initials-avatar cards), Guarantees (6 items), FAQ (7 accordions, expand/collapse via click, chevron rotates), all in correct order, both locales translated. Stop dev.

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/HomePage.astro src/data/agency.ts src/i18n/ui.ts src/components/molecules/NavMenu.astro
git commit -m "feat(landing): insert team, guarantees and FAQ sections + nav links"
```

---

## Task 7: Final gate

- [ ] **Step 1: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check`
Expected: all green; components ≤150 lines (`find src/components -name '*.astro' | xargs wc -l | sort -n | tail`).

- [ ] **Step 2: Bilingual + honesty checks**
  - `dist/index.html` has section ids `equipe`, `garanties`, `faq` (plus the originals).
  - `dist/en/index.html` shows English team roles ("Web development & architecture", …), guarantees ("Quote within 24h", …), FAQ ("How much does a website cost?", …).
  - Honesty: `grep -rEn "50\+|98%|Clients satisfaits|Projets livrés|clients satisfied" dist src` → nothing. Team names are the `[Prénom Nom]` placeholders (intended).
  - FAQ accordion works with keyboard (Tab to summary, Enter toggles — native `<details>` behavior).

- [ ] **Step 3: Commit (if touch-ups)**

```bash
git add -A
git commit -m "test(landing): verify enriched sections render bilingually" --allow-empty
```

---

## Self-review notes (against spec §6.1, §3 and CLAUDE.md)

- **Enriched sections (spec §6.1):** Équipe, Garanties, FAQ added in correct order. ✅
- **FAQ ready for GEO (spec §8.2):** `getFaq(locale)` provides structured Q&A for the Phase-3 `FAQPage` JSON-LD. ✅
- **Honesty (spec §3):** team names explicit placeholders, no fabricated metrics/clients; guarantees are commitments, FAQ answers factual. ✅
- **Patterns consistent:** `Localized` + getters, `SectionHeader`, `ui.ts` symmetric (bidirectional guard), zero-JS FAQ via `<details>`. ✅
- **a11y:** initials avatar `aria-hidden`, native `<details>` accordion (keyboard + screen-reader friendly), `prefers-reduced-motion` on chevron. ✅
- **Deferred (correctly absent):** `FAQPage`/JSON-LD (Phase 3), real names/photos/metrics. Noted, not gaps.
- **Placeholder scan:** Task 5 Steps 2–3 describe GuaranteesSection/FaqSection by reference to the fully-coded TeamSection (same shell, different getter/molecule/grid) — a bounded, unambiguous mirror, not an open TODO. `[Prénom Nom]` is an intentional content placeholder, flagged for the user to fill.

```

```
