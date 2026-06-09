# KaribTeck Phase 1 — Design System & Landing FR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the monolithic `index.html` with a clean, componentized Astro landing page (FR) reaching visual parity with the original, using atomic-design components, data-driven content, and an i18n-FR scaffold — ready for the EN mirror (Phase 2).

**Architecture:** Content lives in typed `src/data/*.ts` files; UI chrome + section headings live in `src/i18n/ui.ts` (FR) consumed via `useTranslations` (no hardcoded UI strings, so Phase 2 only adds EN). Components follow atoms → molecules → organisms; `src/pages/index.astro` only composes organisms. Zero client JS except one small `IntersectionObserver` reveal script + the mobile-menu toggle.

**Tech Stack:** Astro 6 (static), Tailwind 4 `@theme`, TypeScript strict. Builds on Phase 0.

> **Source of truth for copy:** the existing `/Users/aymeric/Documents/Projects/Karibteck/karibteck/index.html`. This plan extracts its real text into data files (see line ranges per task). **Honesty rule (spec §3): fabricated social proof must NOT be ported.** Specifically the "Pourquoi" stats `50+ Projets livrés` and `98% Clients satisfaits` are removed/replaced (Task 3, `data/why.ts`).
>
> **Spec:** `docs/superpowers/specs/2026-06-09-karibteck-astro-refonte-design.md` (§5 design system, §6.1 landing). **Conventions:** `CLAUDE.md`.

---

## Scope

**In scope (parity port of `index.html`, FR):** Nav, Hero, Features strip, Services, Stack/Techno, Processus, Pourquoi (honesty-corrected), Nos projets (réalisations, reframed per spec §3), Tarifs, Contact (static markup only — form not wired), Footer. Plus the i18n-FR scaffold, data files, design-system atoms/molecules, `MainLayout`, and removal of `index.html`.

**Explicitly NOT in scope (later phases):** EN mirror + LangToggle (Phase 2); the new enriched sections Équipe/Garanties/FAQ (Phase 1b/3); SEO `<SeoHead>` + JSON-LD (Phase 3); working contact form / Cal.com / WhatsApp (Phase 6). The Contact section is ported as static markup with a non-submitting form, matching today's behavior.

---

## File structure produced by this phase

```
src/
├─ i18n/
│  ├─ ui.ts                FR strings (nav, CTAs, section headings, footer)
│  └─ utils.ts             useTranslations(locale), localizePath(path, locale)
├─ types/index.ts          (extended) Service, Feature, TechLogo, ProcessStep,
│                          WhyPoint, Stat, Project, PricingPlan, SocialLink, NavLink
├─ data/
│  ├─ agency.ts            name, tagline, nav links, expertise tags, contact info
│  ├─ services.ts          6 services (with slug for Phase 4)
│  ├─ features.ts          5 feature-strip items
│  ├─ stack.ts             8 tech logos
│  ├─ process.ts           5 process steps
│  ├─ why.ts               4 why-points + honest stats + expertise tags
│  ├─ projects.ts          3 projects (reframed — capability examples)
│  ├─ pricing.ts           3 pricing plans
│  └─ socialLinks.ts       4 social links (placeholder hrefs)
├─ assets/
│  └─ hero.png             moved from repo-root ChatGPT image (hero visual)
├─ components/
│  ├─ atoms/               Highlight.astro, SectionBadge.astro, Tag.astro, Button.astro
│  ├─ molecules/           ServiceCard, FeatureItem, TechLogo, ProcessStep, WhyPoint,
│  │                       StatCard, ProjectCard, PricingCard, SocialLink, NavMenu
│  └─ organisms/           Nav, Hero, FeaturesStrip, ServicesSection, StackSection,
│                          ProcessSection, WhySection, ProjectsSection, PricingSection,
│                          ContactSection, Footer
├─ layouts/MainLayout.astro
├─ scripts/reveal.ts       IntersectionObserver fade-up + mobile menu toggle
└─ pages/index.astro       composes organisms (replaces placeholder)
styles/theme.css           (extended) gradient + a few layout tokens
```

`index.html` is deleted in Task 9. The hero PNG is moved into `src/assets/`; remaining root `*.png` are unused and left as-is (cleaned up later if desired).

---

## Task 1: Extend types and theme tokens

**Files:**

- Modify: `src/types/index.ts`
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Append shared interfaces to `src/types/index.ts`** (keep the existing `Locale` export)

```ts
export interface NavLink {
  labelKey: string;
  href: string;
}

export interface Service {
  slug: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Feature {
  icon: string;
  title: string;
  subtitle: string;
}

export interface TechLogo {
  icon: string;
  name: string;
  color: string;
}

export interface ProcessStep {
  num: number;
  title: string;
  description: string;
}

export interface WhyPoint {
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Project {
  category: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  popular: boolean;
  ctaKey: 'requestQuote' | 'contactUs';
}

export interface SocialLink {
  label: string;
  abbr: string;
  href: string;
}
```

- [ ] **Step 2: Add layout/gradient tokens to `src/styles/theme.css`** (inside the existing `:root` block, alongside `--gradient-accent`)

```css
:root {
  --gradient-accent: linear-gradient(135deg, #0057e7, #00d4ff);
  --nav-height: 70px;
  --section-pad-y: 96px;
  --content-max: 1200px;
}
```

- [ ] **Step 3: Verify types compile**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/styles/theme.css
git commit -m "feat(types): add landing domain interfaces and layout tokens"
```

---

## Task 2: i18n scaffold (FR)

**Files:**

- Create: `src/i18n/ui.ts`
- Create: `src/i18n/utils.ts`

FR-only now; Phase 2 adds the `en` record and real path localization. The shape is built for both so Phase 2 is additive.

- [ ] **Step 1: Create `src/i18n/ui.ts`**

```ts
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

export const ui = {
  fr: {
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.projects': 'Réalisations',
    'nav.about': 'À propos',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'cta.requestQuote': 'Demander un devis',
    'cta.discoverServices': 'Découvrir nos services',
    'cta.seeProjects': 'Voir nos réalisations',
    'cta.discussProject': 'Discuter de votre projet',
    'cta.contactUs': 'Nous contacter',
    'hero.badge': 'Agence Web aux Antilles',
    'services.badge': 'Nos Services',
    'services.title.lead': 'Des solutions',
    'services.title.hl': 'adaptées à vos ambitions',
    'services.sub':
      "De la vitrine en ligne à l'application métier complexe, nous couvrons l'intégralité de votre besoin digital avec une expertise de pointe.",
    'process.badge': 'Notre Méthode',
    'process.title.lead': 'Un processus',
    'process.title.hl': 'simple et transparent',
    'process.sub':
      'De la première réunion à la mise en ligne, nous vous accompagnons à chaque étape avec clarté et rigueur.',
    'why.badge': 'Pourquoi Karib Teck',
    'why.title.lead': 'Une agence',
    'why.title.hl': 'ancrée aux Antilles,',
    'why.title.tail': 'tournée vers le monde',
    'why.sub':
      'Nous connaissons les réalités du marché local des DOM tout en maîtrisant les standards internationaux du développement web et logiciel.',
    'why.expertiseLabel': "Nos domaines d'expertise",
    'projects.badge': 'Nos Réalisations',
    'projects.title.lead': 'Des projets qui',
    'projects.title.hl': "parlent d'eux-mêmes",
    'projects.sub':
      'Exemples de projets que nous concevons et réalisons pour les entreprises de Guadeloupe, Martinique et des DOM.',
    'pricing.badge': 'Tarifs',
    'pricing.title.lead': 'Des offres',
    'pricing.title.hl': 'transparentes',
    'pricing.sub':
      'Chaque projet est unique. Ces tarifs sont indicatifs — contactez-nous pour un devis sur mesure adapté à vos besoins exacts.',
    'pricing.popular': '⭐ Le plus choisi',
    'contact.badge': 'Contact',
    'contact.title.lead': 'Parlons de votre',
    'contact.title.hl': 'projet',
    'contact.intro':
      'Une idée, un besoin, un projet à lancer ? Remplissez le formulaire ou contactez-nous directement. Nous vous répondons sous 24h.',
    'contact.form.firstName': 'Prénom',
    'contact.form.lastName': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Téléphone',
    'contact.form.company': 'Entreprise',
    'contact.form.message': 'Votre message',
    'contact.form.submit': 'Envoyer ma demande de devis',
    'footer.servicesTitle': 'Services',
    'footer.companyTitle': 'Entreprise',
    'footer.legalTitle': 'Légal',
    'footer.followTitle': 'Suivez-nous',
    'footer.legal.mentions': 'Mentions légales',
    'footer.legal.privacy': 'Politique de confidentialité',
    'footer.legal.cgv': 'CGV',
    'footer.rights': 'Tous droits réservés.',
  },
} as const;

export type UiKey = keyof (typeof ui)['fr'];

export const SUPPORTED_UI_LOCALES = Object.keys(ui) as Locale[];

export function getUiDict(locale: Locale) {
  return ui[locale as keyof typeof ui] ?? ui[DEFAULT_LOCALE as keyof typeof ui];
}
```

- [ ] **Step 2: Create `src/i18n/utils.ts`**

```ts
import { DEFAULT_LOCALE } from '@/lib/constants';
import { getUiDict, type UiKey } from '@/i18n/ui';
import type { Locale } from '@/types';

/** Returns a translator bound to the given locale (falls back to default). */
export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  const dict = getUiDict(locale);
  return function t(key: UiKey): string {
    return dict[key];
  };
}

/** Prefixes a path with the locale segment (default locale has no prefix). */
export function localizePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return `/${locale}${normalized}`;
}
```

- [ ] **Step 3: Verify**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/ui.ts src/i18n/utils.ts
git commit -m "feat(i18n): add FR ui strings and useTranslations/localizePath"
```

---

## Task 3: Data files (real content extracted from index.html)

**Files:** Create all of: `src/data/agency.ts`, `services.ts`, `features.ts`, `stack.ts`, `process.ts`, `why.ts`, `projects.ts`, `pricing.ts`, `socialLinks.ts`.

> Copy is taken verbatim from `index.html` EXCEPT `why.ts` stats (honesty fix per spec §3).

- [ ] **Step 1: Create `src/data/agency.ts`**

```ts
import { CONTACT_EMAIL } from '@/lib/constants';
import type { NavLink } from '@/types';

export const AGENCY = {
  name: 'Karib Teck',
  logoSub: '— Agence Web aux Antilles —',
  tagline: 'Agence Web aux Antilles',
  email: CONTACT_EMAIL,
} as const;

export const NAV_LINKS: NavLink[] = [
  { labelKey: 'nav.home', href: '#hero' },
  { labelKey: 'nav.services', href: '#services' },
  { labelKey: 'nav.projects', href: '#realisations' },
  { labelKey: 'nav.about', href: '#pourquoi' },
  { labelKey: 'nav.pricing', href: '#tarifs' },
  { labelKey: 'nav.contact', href: '#contact' },
];
```

- [ ] **Step 2: Create `src/data/services.ts`** (6 services, copy from `index.html:1106-1174`)

```ts
import type { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    slug: 'creation-sites-web',
    icon: '🌐',
    title: 'Création de Sites Web',
    description:
      'Sites vitrines, landing pages, sites e-commerce et portails corporate. Des designs modernes, rapides et optimisés SEO qui convertissent vos visiteurs en clients.',
    tags: ['WordPress', 'Next.js', 'Figma', 'SEO'],
  },
  {
    slug: 'applications-mobiles',
    icon: '📱',
    title: 'Applications Mobiles',
    description:
      'Applications iOS et Android sur mesure pour votre activité. Gestion de commandes, suivi client, tableaux de bord — nous transformons vos processus en apps intuitives.',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
  },
  {
    slug: 'logiciels-metier',
    icon: '⚙️',
    title: 'Logiciels Métier (ERP / CRM)',
    description:
      'Progiciels de gestion sur mesure : ERP, CRM, outils de facturation, gestion des stocks et des RH. Des solutions clé en main qui automatisent votre cœur de métier.',
    tags: ['PHP / Laravel', 'Node.js', 'PostgreSQL', 'API REST'],
  },
  {
    slug: 'e-commerce',
    icon: '🛒',
    title: 'E-Commerce',
    description:
      'Boutiques en ligne performantes et sécurisées. Paiement en ligne, gestion des stocks, expéditions, fidélisation — tout le nécessaire pour vendre efficacement sur le web.',
    tags: ['WooCommerce', 'Shopify', 'Paiement sécurisé'],
  },
  {
    slug: 'hebergement-devops',
    icon: '☁️',
    title: 'Hébergement & DevOps',
    description:
      'Déploiement, infrastructure cloud, CI/CD et maintenance. Nous gérons toute la partie technique pour que vous vous concentriez sur votre business.',
    tags: ['AWS / VPS', 'Docker', 'CI/CD', 'SSL'],
  },
  {
    slug: 'intelligence-artificielle',
    icon: '🤖',
    title: 'Intelligence Artificielle',
    description:
      "Intégration d'IA dans vos outils existants : chatbots intelligents, analyse de données, automatisation des tâches répétitives et recommandations personnalisées.",
    tags: ['ChatGPT API', 'Python', 'Automatisation'],
  },
];
```

- [ ] **Step 3: Create `src/data/features.ts`** (copy from `index.html:1076-1098`)

```ts
import type { Feature } from '@/types';

export const FEATURES: Feature[] = [
  { icon: '🎨', title: 'Sites modernes', subtitle: 'Design premium & unique' },
  { icon: '🔒', title: 'Sécurisés', subtitle: 'Protection avancée' },
  { icon: '📱', title: '100% Responsive', subtitle: 'Optimisé tous écrans' },
  { icon: '⚡', title: 'Rapides', subtitle: 'Performance maximale' },
  { icon: '🛟', title: 'Support 7/7', subtitle: 'Accompagnement continu' },
];
```

- [ ] **Step 4: Create `src/data/stack.ts`** (copy from `index.html:1180-1188`)

```ts
import type { TechLogo } from '@/types';

export const STACK: TechLogo[] = [
  { icon: '⚡', name: 'WordPress', color: '#21759b' },
  { icon: '⚛', name: 'React', color: '#61dafb' },
  { icon: '▲', name: 'NEXT.js', color: '#ffffff' },
  { icon: '🐘', name: 'PHP', color: '#8892be' },
  { icon: '💨', name: 'Tailwind CSS', color: '#38bdf8' },
  { icon: '🎨', name: 'Figma', color: '#f24e1e' },
  { icon: '🟢', name: 'Node.js', color: '#68a063' },
  { icon: '🐘', name: 'PostgreSQL', color: '#336791' },
];
```

- [ ] **Step 5: Create `src/data/process.ts`** (copy from `index.html:1205-1229`)

```ts
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
```

- [ ] **Step 6: Create `src/data/why.ts`** — why-points copied from `index.html:1239-1258`; **stats are honesty-corrected (NOT copied)**

```ts
import type { Stat, WhyPoint } from '@/types';

export const WHY_POINTS: WhyPoint[] = [
  {
    icon: '🎯',
    title: 'Expertise technique solide',
    description:
      'Développeurs seniors spécialisés en web, mobile et progiciels métier, avec une exigence de qualité sur chaque ligne de code.',
  },
  {
    icon: '🏝️',
    title: 'Connaissance du terrain local',
    description:
      'Nous comprenons les spécificités des entreprises antillaises : fiscalité, logistique, contraintes réglementaires.',
  },
  {
    icon: '📊',
    title: 'Orientés résultats',
    description:
      'Chaque projet est évalué sur des KPIs concrets : trafic, conversion, ROI. Nous livrons de la valeur, pas juste du code.',
  },
  {
    icon: '🤝',
    title: 'Partenariat long terme',
    description:
      'Nous ne disparaissons pas après la livraison. Maintenance, évolutions, support — nous restons à vos côtés.',
  },
];

// Honest metrics only (spec §3): no fabricated "projets livrés" / "clients satisfaits".
export const WHY_STATS: Stat[] = [
  { value: '100%', label: 'Sur-mesure' },
  { value: '7/7', label: 'Support disponible' },
  { value: '24h', label: 'Réponse à votre demande' },
  { value: '0', label: 'Template générique' },
];

export const EXPERTISE_TAGS: string[] = [
  'Sites vitrine',
  'E-commerce',
  'Applications métier',
  'ERP sur mesure',
  'CRM',
  'Apps mobiles',
  'Intégration API',
  'Intelligence Artificielle',
];
```

- [ ] **Step 7: Create `src/data/projects.ts`** — reframed per spec §3 (capability examples, not delivered client work). Copy descriptions from `index.html:1304-1326` but neutralize client-specific phrasing.

```ts
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
```

- [ ] **Step 8: Create `src/data/pricing.ts`** (copy from `index.html:1347-1390`)

```ts
import type { PricingPlan } from '@/types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    price: 'À partir de 990€',
    description:
      'Pour les TPE, indépendants et porteurs de projet qui veulent une présence web professionnelle.',
    features: [
      'Site vitrine 5 pages',
      'Design personnalisé',
      '100% Responsive',
      'Optimisation SEO de base',
      'Formulaire de contact',
      'Hébergement 1 an inclus',
    ],
    popular: false,
    ctaKey: 'requestQuote',
  },
  {
    name: 'Business',
    price: 'À partir de 2 900€',
    description:
      'Pour les PME qui veulent un site performant ou une application web avec des fonctionnalités avancées.',
    features: [
      "Site jusqu'à 20 pages",
      'Espace client / extranet',
      'Intégration CRM ou ERP',
      'SEO avancé + analytics',
      'E-commerce ou réservation',
      'Formation & documentation',
      'Support 6 mois inclus',
    ],
    popular: true,
    ctaKey: 'requestQuote',
  },
  {
    name: 'Entreprise',
    price: 'Sur devis',
    description:
      'Pour les projets complexes : logiciels métier, applications mobiles, ERP et solutions clé en main.',
    features: [
      'Application web sur mesure',
      'Application mobile iOS/Android',
      'ERP / CRM / Progiciel métier',
      'Architecture cloud scalable',
      'Intégration IA',
      'Maintenance & évolutions',
      'SLA et support dédié',
    ],
    popular: false,
    ctaKey: 'contactUs',
  },
];
```

- [ ] **Step 9: Create `src/data/socialLinks.ts`** (from `index.html` footer social buttons; hrefs are placeholders until provided)

```ts
import type { SocialLink } from '@/types';

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'LinkedIn', abbr: 'in', href: '#' },
  { label: 'Instagram', abbr: 'ig', href: '#' },
  { label: 'Facebook', abbr: 'fb', href: '#' },
  { label: 'WhatsApp', abbr: 'wa', href: '#' },
];
```

- [ ] **Step 10: Verify + commit**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

```bash
git add src/data
git commit -m "feat(data): extract landing content into typed data files (honesty-corrected stats)"
```

---

## Task 4: Atoms

**Files:** Create `src/components/atoms/{Highlight,SectionBadge,Tag,Button}.astro`.

- [ ] **Step 1: `Highlight.astro`** — gradient-clipped text (replaces the inline-style hack from the placeholder)

```astro
---
interface Props {
  text: string;
}
const { text } = Astro.props;
---

<span class="hl">{text}</span>

<style>
  .hl {
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>
```

- [ ] **Step 2: `SectionBadge.astro`**

```astro
---
interface Props {
  label: string;
}
const { label } = Astro.props;
---

<span class="badge">{label}</span>

<style>
  .badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(0, 153, 255, 0.1);
    border: 1px solid rgba(0, 153, 255, 0.25);
    color: var(--color-cyan);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 3: `Tag.astro`**

```astro
---
interface Props {
  label: string;
}
const { label } = Astro.props;
---

<span class="tag">{label}</span>

<style>
  .tag {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 8px;
    background: rgba(0, 87, 231, 0.12);
    border: 1px solid rgba(0, 153, 255, 0.18);
    color: var(--color-gray);
    font-size: 0.78rem;
    font-weight: 500;
  }
</style>
```

- [ ] **Step 4: `Button.astro`** — variants `primary | outline | devis`, renders an `<a>`

```astro
---
interface Props {
  href: string;
  variant?: 'primary' | 'outline' | 'devis';
  class?: string;
}
const { href, variant = 'primary', class: className } = Astro.props;
---

<a href={href} class:list={['btn', `btn-${variant}`, className]}>
  <slot />
</a>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    text-decoration: none;
    border-radius: var(--radius-card);
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      opacity 0.2s;
  }
  .btn-primary {
    padding: 14px 28px;
    background: var(--gradient-accent);
    color: var(--color-white);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 87, 231, 0.55);
  }
  .btn-outline {
    padding: 14px 28px;
    background: transparent;
    color: var(--color-white);
    border: 1px solid rgba(0, 153, 255, 0.35);
  }
  .btn-outline:hover {
    transform: translateY(-2px);
    border-color: var(--color-cyan);
  }
  .btn-devis {
    padding: 10px 20px;
    background: var(--gradient-accent);
    color: var(--color-white);
  }
  .btn-devis:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
</style>
```

- [ ] **Step 5: Verify + commit**

Run: `npm run check && npm run lint`
Expected: both clean.

```bash
git add src/components/atoms
git commit -m "feat(atoms): add Highlight, SectionBadge, Tag, Button"
```

---

## Task 5: MainLayout, reveal script, Nav, Footer

**Files:**

- Create: `src/scripts/reveal.ts`
- Create: `src/layouts/MainLayout.astro`
- Create: `src/components/molecules/NavMenu.astro`
- Create: `src/components/organisms/Nav.astro`
- Create: `src/components/organisms/Footer.astro`

- [ ] **Step 1: Create `src/scripts/reveal.ts`** (ports the `<script>` from `index.html:1511-1550`: fade-up reveal + mobile menu + active nav highlight)

```ts
// Mobile menu toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger?.addEventListener('click', () => navLinks?.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll reveal for .fade-up elements
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        window.setTimeout(() => entry.target.classList.add('visible'), index * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
);
document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
```

- [ ] **Step 2: Create `src/layouts/MainLayout.astro`** — `<head>` (title/description/lang from locale), skip-link, `<slot>`, reveal script, fade-up base CSS

```astro
---
import { DEFAULT_LOCALE, SITE_URL } from '@/lib/constants';
import type { Locale } from '@/types';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@/styles/global.css';

interface Props {
  title: string;
  description: string;
  locale?: Locale;
}
const { title, description, locale = DEFAULT_LOCALE } = Astro.props;
const canonical = new URL(Astro.url.pathname, SITE_URL).href;
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
  </head>
  <body>
    <a href="#main" class="skip-link">Aller au contenu</a>
    <slot name="nav" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
    <script>
      import '@/scripts/reveal.ts';
    </script>
    <style is:global>
      .skip-link {
        position: absolute;
        left: -999px;
        top: 0;
        background: var(--color-cyan);
        color: var(--color-navy);
        padding: 8px 16px;
        z-index: 2000;
      }
      .skip-link:focus {
        left: 0;
      }
      .fade-up {
        opacity: 0;
        transform: translateY(24px);
        transition:
          opacity 0.6s ease,
          transform 0.6s ease;
      }
      .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
      }
      @media (prefers-reduced-motion: reduce) {
        .fade-up {
          opacity: 1;
          transform: none;
          transition: none;
        }
      }
    </style>
  </body>
</html>
```

- [ ] **Step 3: Create `src/components/molecules/NavMenu.astro`** — the link list (ports `index.html:1033-1041`)

```astro
---
import { NAV_LINKS } from '@/data/agency';
import { useTranslations } from '@/i18n/utils';
import Button from '@/components/atoms/Button.astro';
import type { Locale } from '@/types';
import type { UiKey } from '@/i18n/ui';

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const t = useTranslations(locale);
---

<ul class="nav-links" id="navLinks">
  {
    NAV_LINKS.map((link) => (
      <li>
        <a href={link.href}>{t(link.labelKey as UiKey)}</a>
      </li>
    ))
  }
  <li><Button href="#contact" variant="devis">{t('cta.requestQuote')}</Button></li>
</ul>

<style>
  .nav-links {
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-links a {
    color: var(--color-white);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }
  .nav-links a:hover {
    color: var(--color-cyan);
  }
  @media (max-width: 860px) {
    .nav-links {
      position: fixed;
      inset: var(--nav-height) 0 auto 0;
      flex-direction: column;
      gap: 18px;
      padding: 24px 5%;
      background: var(--color-navy-2);
      transform: translateY(-120%);
      transition: transform 0.3s ease;
    }
    .nav-links.open {
      transform: translateY(0);
    }
  }
</style>
```

- [ ] **Step 4: Create `src/components/organisms/Nav.astro`** — fixed bar + logo + burger (ports `index.html:1028-1046`)

```astro
---
import { AGENCY } from '@/data/agency';
import NavMenu from '@/components/molecules/NavMenu.astro';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
---

<nav>
  <a href="#hero" class="nav-logo">
    <span class="nav-logo-name">{AGENCY.name.toUpperCase()}</span>
    <span class="nav-logo-sub">{AGENCY.logoSub}</span>
  </a>
  <NavMenu locale={locale} />
  <button class="burger" id="burger" aria-label="Ouvrir le menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<style>
  nav {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 1000;
    height: var(--nav-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 0 5%;
    background: rgba(0, 87, 180, 0.85);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(0, 153, 255, 0.12);
  }
  .nav-logo {
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }
  .nav-logo-name {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--color-white);
    letter-spacing: 0.04em;
  }
  .nav-logo-sub {
    font-size: 0.62rem;
    color: var(--color-gray);
    letter-spacing: 0.05em;
  }
  .burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
  }
  .burger span {
    width: 24px;
    height: 2px;
    background: var(--color-white);
  }
  @media (max-width: 860px) {
    .burger {
      display: flex;
    }
  }
</style>
```

- [ ] **Step 5: Create `src/components/organisms/Footer.astro`** — ports `index.html` footer (services list, company links, legal links, social, copyright). Read the footer block in `index.html` (the `<footer>` after the contact section, ~lines 1480-1510) for exact labels; use `SERVICES` titles for the services column, `NAV_LINKS` for company, the three legal links from `ui.ts` (`footer.legal.*`), and `SOCIAL_LINKS` for social.

```astro
---
import { AGENCY } from '@/data/agency';
import { SERVICES } from '@/data/services';
import { SOCIAL_LINKS } from '@/data/socialLinks';
import { useTranslations } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
const year = new Date().getFullYear();
---

<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <span class="footer-name">{AGENCY.name}</span>
      <p>{AGENCY.tagline}</p>
      <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
    </div>
    <div>
      <h3>{t('footer.servicesTitle')}</h3>
      <ul>
        {
          SERVICES.map((s) => (
            <li>
              <a href="#services">{s.title}</a>
            </li>
          ))
        }
      </ul>
    </div>
    <div>
      <h3>{t('footer.legalTitle')}</h3>
      <ul>
        <li><a href="#">{t('footer.legal.mentions')}</a></li>
        <li><a href="#">{t('footer.legal.privacy')}</a></li>
        <li><a href="#">{t('footer.legal.cgv')}</a></li>
      </ul>
    </div>
    <div>
      <h3>{t('footer.followTitle')}</h3>
      <div class="footer-social">
        {
          SOCIAL_LINKS.map((s) => (
            <a href={s.href} title={s.label} aria-label={s.label} rel="noopener noreferrer">
              {s.abbr}
            </a>
          ))
        }
      </div>
    </div>
  </div>
  <p class="footer-copy">© {year} {AGENCY.name}. {t('footer.rights')}</p>

  <style>
    footer {
      background: var(--color-navy-2);
      padding: 64px 5% 32px;
      border-top: 1px solid var(--color-gray-2);
    }
    .footer-grid {
      max-width: var(--content-max);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 32px;
    }
    .footer-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.2rem;
    }
    .footer-brand p {
      color: var(--color-gray);
      margin: 8px 0;
    }
    footer h3 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-cyan);
      margin-bottom: 14px;
    }
    footer ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    footer a {
      color: var(--color-gray);
      text-decoration: none;
      font-size: 0.92rem;
    }
    footer a:hover {
      color: var(--color-white);
    }
    .footer-social {
      display: flex;
      gap: 10px;
    }
    .footer-social a {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      border: 1px solid var(--color-gray-2);
      text-transform: uppercase;
      font-size: 0.75rem;
    }
    .footer-copy {
      text-align: center;
      color: var(--color-gray);
      font-size: 0.85rem;
      margin-top: 40px;
    }
    @media (max-width: 860px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  </style>
</footer>
```

> Note: `new Date().getFullYear()` runs at build time in Astro (static) — acceptable here. If `astro check` flags it under any rule, replace with a `COPYRIGHT_YEAR` constant in `lib/constants.ts`.

- [ ] **Step 6: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean.

```bash
git add src/scripts src/layouts src/components/molecules/NavMenu.astro src/components/organisms/Nav.astro src/components/organisms/Footer.astro
git commit -m "feat(layout): add MainLayout, reveal script, Nav and Footer"
```

---

## Task 6: Content molecules

**Files:** Create `src/components/molecules/{ServiceCard,FeatureItem,TechLogo,ProcessStep,WhyPoint,StatCard,ProjectCard,PricingCard,SocialLink}.astro`.

Each is a small presentational component taking one typed prop. Follow the `ServiceCard` pattern below for all of them: typed `Props`, no logic in markup, scoped `<style>` ported from the matching `index.html` CSS class. Use the `Tag` atom where tags appear.

- [ ] **Step 1: `ServiceCard.astro`** (worked example — match this structure for the rest)

```astro
---
import Tag from '@/components/atoms/Tag.astro';
import type { Service } from '@/types';

interface Props {
  service: Service;
}
const { service } = Astro.props;
---

<article class="service-card fade-up">
  <div class="service-icon">{service.icon}</div>
  <h3 class="service-title">{service.title}</h3>
  <p class="service-desc">{service.description}</p>
  <div class="service-tags">
    {service.tags.map((tag) => <Tag label={tag} />)}
  </div>
</article>

<style>
  .service-card {
    background: var(--color-navy-2);
    border: 1px solid var(--color-gray-2);
    border-radius: var(--radius-lg);
    padding: 28px;
    transition:
      border-color 0.3s,
      transform 0.3s,
      box-shadow 0.3s;
  }
  .service-card:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 153, 255, 0.4);
    box-shadow: 0 16px 48px rgba(0, 87, 231, 0.15);
  }
  .service-icon {
    font-size: 2rem;
  }
  .service-title {
    font-family: var(--font-display);
    font-size: 1.15rem;
    margin: 14px 0 10px;
  }
  .service-desc {
    color: var(--color-gray);
    font-size: 0.95rem;
  }
  .service-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
</style>
```

- [ ] **Step 2: Create the remaining molecules**, each taking its typed prop and porting the corresponding `index.html` styles:
  - `FeatureItem.astro` — prop `feature: Feature`; renders icon + title + subtitle (ports `.feat-item`, `index.html:1079-1082`).
  - `TechLogo.astro` — prop `logo: TechLogo`; renders icon (with `style={`color:${logo.color}`}` — color is data, acceptable) + name (ports `.tech-logo`, `index.html:1181`).
  - `ProcessStep.astro` — prop `step: ProcessStep`; renders num badge + title + description (ports `.step`, `index.html:1206-1210`).
  - `WhyPoint.astro` — prop `point: WhyPoint`; renders icon + title + description (ports `.why-item`, `index.html:1240-1243`).
  - `StatCard.astro` — prop `stat: Stat`; renders value + label (ports `.why-stat`, `index.html:1273-1276`).
  - `ProjectCard.astro` — prop `project: Project`; renders thumb (`style={`background:${project.gradient}`}` + emoji) + category + title + description (ports `.real-card`, `index.html:1304-1310`).
  - `PricingCard.astro` — prop `plan: PricingPlan` + `locale`; renders popular badge (if `plan.popular`, label from `t('pricing.popular')`), name, price, description, features list, CTA `Button` (label from `t('cta.' + plan.ctaKey)`) (ports `.tarif-card`, `index.html:1347-1360`).
  - `SocialLink.astro` — prop `link: SocialLink`; renders an `<a rel="noopener noreferrer">` with abbr + `aria-label` (ports `.social-btn`).

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean (0 errors/0 warnings). If any component exceeds 150 lines, split per CLAUDE.md rule #1.

```bash
git add src/components/molecules
git commit -m "feat(molecules): add content cards (service, feature, tech, process, why, stat, project, pricing, social)"
```

---

## Task 7: Section organisms

**Files:** Create `src/components/organisms/{Hero,FeaturesStrip,ServicesSection,StackSection,ProcessSection,WhySection,ProjectsSection,PricingSection,ContactSection}.astro`.

Each organism: imports its data + `useTranslations(locale)`, renders a `<section id="...">` with a `SectionBadge` + title (`Highlight` for the `.hl` span) + sub, then maps data to molecules. **No fabricated content.** Section ids match the nav anchors (`hero, services, techno, processus, pourquoi, realisations, tarifs, contact`). Port the section-shell CSS (`.section-inner`, `.section-title`, `.section-sub`, grids) from `index.html`.

- [ ] **Step 1: `Hero.astro`** — ports `index.html:1048-1073`; uses `astro:assets` `<Image>` for the hero PNG (moved in Task 8 — import from `@/assets/hero.png`). Title uses `Highlight` for "sites web". CTAs use `Button`.

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/hero.png';
import Highlight from '@/components/atoms/Highlight.astro';
import Button from '@/components/atoms/Button.astro';
import SectionBadge from '@/components/atoms/SectionBadge.astro';
import { useTranslations } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
---

<section id="hero">
  <div class="hero-inner">
    <SectionBadge label={t('hero.badge')} />
    <h1 class="hero-title">
      Nous créons des <Highlight text="sites web" /> qui propulsent votre entreprise.
    </h1>
    <p class="hero-sub">
      Karib Teck accompagne les entreprises, entrepreneurs et marques des DOM dans leur
      transformation digitale avec des sites modernes, rapides et performants.
    </p>
    <div class="hero-ctas">
      <Button href="#services" variant="primary">{t('cta.discoverServices')}</Button>
      <Button href="#realisations" variant="outline">{t('cta.seeProjects')}</Button>
    </div>
  </div>
  <div class="hero-img-col">
    <Image
      src={heroImage}
      alt="Karib Teck – Solutions digitales"
      widths={[480, 768, 1100]}
      sizes="(max-width: 860px) 90vw, 45vw"
      loading="eager"
      fetchpriority="high"
    />
  </div>
</section>

<style>
  #hero {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
    gap: 40px;
    max-width: var(--content-max);
    margin: 0 auto;
    padding: calc(var(--nav-height) + 64px) 5% 64px;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    line-height: 1.1;
    margin: 18px 0;
  }
  .hero-sub {
    color: var(--color-gray);
    max-width: 46ch;
  }
  .hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 28px;
  }
  .hero-img-col :global(img) {
    width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
  }
  @media (max-width: 860px) {
    #hero {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create the remaining organisms** (each maps data → molecules; port section CSS from `index.html`):
  - `FeaturesStrip.astro` — maps `FEATURES` → `FeatureItem` (ports `.features-strip`, `index.html:1076-1098`). No badge/title (it's a strip).
  - `ServicesSection.astro` — `<section id="services">`, badge `t('services.badge')`, title `t('services.title.lead')` + `<Highlight text={t('services.title.hl')} />`, sub `t('services.sub')`, grid of `SERVICES` → `ServiceCard`.
  - `StackSection.astro` — `<section id="techno">`, label `Des technologies modernes pour des résultats durables` (put this string in `ui.ts` as `stack.label`), `STACK` → `TechLogo`.
  - `ProcessSection.astro` — `<section id="processus">`, badge/title/sub from `process.*`, `PROCESS_STEPS` → `ProcessStep`.
  - `WhySection.astro` — `<section id="pourquoi">`, two-column: left badge/title (lead + `Highlight` hl + tail)/sub + `WHY_POINTS` → `WhyPoint`; right `WHY_STATS` → `StatCard` grid + expertise box (`t('why.expertiseLabel')` + `EXPERTISE_TAGS` → `Tag`).
  - `ProjectsSection.astro` — `<section id="realisations">`, badge/title/sub from `projects.*`, `PROJECTS` → `ProjectCard`, closing CTA `Button` (`t('cta.discussProject')` → `#contact`).
  - `PricingSection.astro` — `<section id="tarifs">`, badge/title/sub from `pricing.*`, `PRICING_PLANS` → `PricingCard locale={locale}`.
  - `ContactSection.astro` — `<section id="contact">`, badge/title/sub + intro + the static form (ports `index.html:1393-1480`). Form has NO `action` and a real `<button type="submit">` but is non-functional (Phase 6 wires it). Labels from `contact.form.*`. Include the email line `AGENCY.email`. Add `aria-label`s to inputs.

> Each organism that needs `locale` accepts `interface Props { locale?: Locale }` defaulting to `DEFAULT_LOCALE`, exactly like `Hero.astro`.

- [ ] **Step 3: Add the two extra `ui.ts` keys used above** — `stack.label` and re-verify all `t(...)` keys exist:

```ts
// add inside ui.fr
'stack.label': 'Des technologies modernes pour des résultats durables',
```

- [ ] **Step 4: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean. No organism > 150 lines (split if needed).

```bash
git add src/components/organisms src/i18n/ui.ts
git commit -m "feat(organisms): add all landing sections (hero, services, stack, process, why, projects, pricing, contact)"
```

---

## Task 8: Move hero image + compose the home page

**Files:**

- Create: `src/assets/hero.png` (move from repo root)
- Modify: `src/pages/index.astro` (replace placeholder)

- [ ] **Step 1: Move the hero image into assets**

Run:

```bash
git mv "ChatGPT Image 26 mai 2026, 13_16_51.png" src/assets/hero.png
```

(If `git mv` fails because the file isn't tracked, use `mv "ChatGPT Image 26 mai 2026, 13_16_51.png" src/assets/hero.png`.)
Expected: `src/assets/hero.png` exists; `Hero.astro`'s `import heroImage from '@/assets/hero.png'` now resolves.

- [ ] **Step 2: Replace `src/pages/index.astro`** with the composition (page only composes — no logic, no inline content)

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import Nav from '@/components/organisms/Nav.astro';
import Hero from '@/components/organisms/Hero.astro';
import FeaturesStrip from '@/components/organisms/FeaturesStrip.astro';
import ServicesSection from '@/components/organisms/ServicesSection.astro';
import StackSection from '@/components/organisms/StackSection.astro';
import ProcessSection from '@/components/organisms/ProcessSection.astro';
import WhySection from '@/components/organisms/WhySection.astro';
import ProjectsSection from '@/components/organisms/ProjectsSection.astro';
import PricingSection from '@/components/organisms/PricingSection.astro';
import ContactSection from '@/components/organisms/ContactSection.astro';
import Footer from '@/components/organisms/Footer.astro';

const title = 'Karib Teck – Agence Web aux Antilles';
const description =
  'Karib Teck, agence web aux Antilles. Création de sites web, applications mobiles et solutions digitales clé en main pour les entreprises des DOM.';
---

<MainLayout title={title} description={description}>
  <Nav slot="nav" />
  <Hero />
  <FeaturesStrip />
  <ServicesSection />
  <StackSection />
  <ProcessSection />
  <WhySection />
  <ProjectsSection />
  <PricingSection />
  <ContactSection />
  <Footer slot="footer" />
</MainLayout>
```

- [ ] **Step 3: Build + visual check**

Run: `npm run check && npm run build`
Expected: 0 errors/0 warnings; build succeeds; `dist/index.html` generated; optimized hero image emitted under `dist/_astro/`.

Run: `npm run dev` → open `http://localhost:4321`. Verify visual parity with the original `index.html` (nav, hero with image, features strip, all sections in order, pricing, contact form, footer), fade-up animations on scroll, mobile burger menu works. Stop the server when confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/assets/hero.png src/pages/index.astro
git commit -m "feat(pages): compose landing home from organisms + move hero image to assets"
```

---

## Task 9: Remove legacy index.html + final gate

**Files:**

- Delete: `index.html`

- [ ] **Step 1: Delete the legacy monolith**

Run: `git rm index.html`
Expected: removed from the repo (the Astro `src/pages/index.astro` now owns `/`).

- [ ] **Step 2: Full quality gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check`
Expected: `astro check` 0/0; build success; lint clean; "All matched files use Prettier code style!". (Run `npm run format` once if format flags new files, then re-check and amend.)

- [ ] **Step 3: Confirm parity checklist** (manual, against the original look):
  - Nav fixed, logo, 6 links + devis button, burger on mobile.
  - Hero: badge, title with gradient "sites web", sub, 2 CTAs, image.
  - Features strip: 5 items.
  - Services: 6 cards with tags.
  - Techno: 8 logos.
  - Processus: 5 steps.
  - Pourquoi: 4 points + **honest** stats (no "50+/98%") + expertise tags.
  - Réalisations: 3 project cards + CTA.
  - Tarifs: 3 plans, Business marked popular.
  - Contact: heading + intro + static form + email.
  - Footer: brand, services, legal, social, copyright.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove legacy index.html (replaced by Astro landing)"
```

---

## Self-review notes (against spec §5, §6.1 and CLAUDE.md)

- **Design system (spec §5):** tokens already in Phase 0; gradient/layout tokens added Task 1; atoms in Task 4. ✅
- **Landing parity (spec §6.1, existing sections):** Hero, Services, Stack, Process, Why, Projects, Pricing, Contact + Nav/Footer/Features — all ported (Tasks 5-8). ✅
- **Honesty (spec §3):** fabricated stats removed in `why.ts`; projects reframed as capability examples. ✅
- **No hardcoded UI strings (CLAUDE.md):** chrome + headings via `ui.ts`/`useTranslations`; list content in `data/`. Inline `style` only for data-driven colors/gradients (tech logo color, project gradient, hero clip) — acceptable (values are data/tokens, not hardcoded design colors). ✅
- **Atomic design + page composes only (CLAUDE.md #1, #7):** `index.astro` is composition-only; logic in data/i18n. ✅
- **Images via astro:assets (CLAUDE.md):** hero moved to `src/assets` + `<Image>` (Task 8). ✅
- **a11y:** skip-link, `lang` from locale, focus ring (Phase 0), `aria-label` on burger/social/inputs, reduced-motion on fade-up. ✅
- **Deferred (correctly absent):** EN mirror/LangToggle (Phase 2), `<SeoHead>`/JSON-LD (Phase 3), Équipe/Garanties/FAQ (Phase 1b/3), working form/Cal/WhatsApp (Phase 6). Noted, not gaps.
- **Placeholder scan:** Task 6 Step 2 and Task 7 Step 2 describe several components by pattern rather than full code — each names its exact prop type, the exact `index.html` source lines to port, and the worked example (`ServiceCard`/`Hero`) to mirror. This is a bounded port, not an open TODO. Acceptable; the implementer has everything needed.

```

```
