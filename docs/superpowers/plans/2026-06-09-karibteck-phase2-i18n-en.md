# KaribTeck Phase 2 — i18n & EN Mirror Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the landing fully bilingual — add English to every UI string and every piece of data content, publish an `/en/` mirror of the home page, add a FR↔EN language toggle and `hreflang` alternates, without changing the FR rendering.

**Architecture:** UI chrome stays in `src/i18n/ui.ts` (now with an `en` dict). Translatable DATA fields become `Localized<T> = Record<Locale, T>`; each data module exposes a `getX(locale)` getter that resolves to plain (locale-flattened) objects, so the Phase-1 presentational cards stay unchanged — only data modules and organisms change. A `routes` map drives `localizePath`/`alternateUrl` for the toggle and hreflang.

**Tech Stack:** Astro 6 native i18n (FR default no-prefix, EN under `/en/`), Tailwind 4, TS strict. Builds on Phases 0–1.

> **Translations:** the English copy in this plan is authored here (the user opted for AI-generated EN). Use it verbatim. **Placeholders stay generic** (no real NAP/names yet). **Spec:** `…specs/2026-06-09-karibteck-astro-refonte-design.md`. **Conventions:** `CLAUDE.md`.

---

## Scope

**In scope:** `en` UI dict; `Localized` data + `getX(locale)` getters; organisms consume getters + pass `locale`; `LangToggle`; `hreflang` alternates + `x-default`; `/en/` home mirror; `getLocaleFromUrl`/`alternateLocale`/`routes` helpers.

**NOT in scope:** `<SeoHead>`/JSON-LD (Phase 3), service pages, blog, working form/Cal/WhatsApp, real NAP/engineer data. Only the home route is mirrored (other routes arrive with their phases, each adding its own `routes` entry + `/en/` page).

---

## Task 1: i18n core — Localized type, routes, locale helpers

**Files:**

- Modify: `src/types/index.ts`
- Modify: `src/i18n/ui.ts`
- Modify: `src/i18n/utils.ts`

- [ ] **Step 1: Add the `Localized` helper type to `src/types/index.ts`** (top, after the `Locale` import line)

```ts
/** A value translated into every supported locale. */
export type Localized<T> = Record<Locale, T>;
```

- [ ] **Step 2: Add the `routes` map to `src/i18n/ui.ts`** (after the `ui` object, before the `UiKey`/helpers). Each route key maps to its localized path.

```ts
export const routes = {
  fr: {
    home: '/',
  },
  en: {
    home: '/en/',
  },
} as const;

export type RouteKey = keyof (typeof routes)['fr'];
```

- [ ] **Step 3: Extend `src/i18n/utils.ts`** with locale detection, route localization, and alternate-locale helpers (keep existing `useTranslations`/`localizePath`; replace the file with the version below so `localizePath` is route-based like the reference)

```ts
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/constants';
import { getUiDict, routes, type UiKey, type RouteKey } from '@/i18n/ui';
import type { Locale } from '@/types';

/** Returns a translator bound to the given locale (falls back to default). */
export function useTranslations(locale: Locale = DEFAULT_LOCALE) {
  const dict = getUiDict(locale);
  function t(key: UiKey): string {
    return dict[key];
  }
  t.path = (route: RouteKey): string => routes[locale][route];
  return t;
}

/** Localized path for a known route key. */
export function localizePath(route: RouteKey, locale: Locale = DEFAULT_LOCALE): string {
  return routes[locale][route];
}

/** Detects the locale from a URL pathname (first segment). */
export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if ((SUPPORTED_LOCALES as readonly string[]).includes(first)) return first as Locale;
  return DEFAULT_LOCALE;
}

/** The other locale. */
export function alternateLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

/** The same route's path in the other locale (for hreflang / lang toggle). */
export function alternateUrl(route: RouteKey, locale: Locale): string {
  return routes[alternateLocale(locale)][route];
}
```

> Note: this changes `localizePath`'s signature from `(path, locale)` to `(route, locale)`. Phase 1 did not call `localizePath` anywhere yet (nav uses anchors), so nothing breaks. Verify with `grep -rn "localizePath" src` → only the definition.

- [ ] **Step 4: Verify + commit**

Run: `npm run check`
Expected: 0 errors, 0 warnings.

```bash
git add src/types/index.ts src/i18n/ui.ts src/i18n/utils.ts
git commit -m "feat(i18n): add Localized type, routes map and locale helpers"
```

---

## Task 2: English UI dictionary

**Files:**

- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Add the `en` dict inside the `ui` object** (sibling of `fr`). Keys MUST match `fr` exactly. Use this English copy verbatim:

```ts
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.projects': 'Work',
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'cta.requestQuote': 'Request a quote',
    'cta.discoverServices': 'Explore our services',
    'cta.seeProjects': 'See our work',
    'cta.discussProject': 'Discuss your project',
    'cta.contactUs': 'Contact us',
    'hero.badge': 'Web agency in the French West Indies',
    'hero.title.lead': 'We build',
    'hero.title.hl': 'websites',
    'hero.title.tail': 'that grow your business.',
    'hero.sub':
      'Karib Teck helps businesses, entrepreneurs and brands across the French overseas territories go digital with modern, fast and high-performing websites.',
    'services.badge': 'Our Services',
    'services.title.lead': 'Solutions',
    'services.title.hl': 'tailored to your ambitions',
    'services.sub':
      'From an online storefront to a complex business application, we cover your entire digital needs with sharp, senior expertise.',
    'stack.label': 'Modern technologies for results that last',
    'process.badge': 'Our Method',
    'process.title.lead': 'A',
    'process.title.hl': 'simple and transparent',
    'process.sub':
      'From the first meeting to go-live, we support you at every step with clarity and rigor.',
    'why.badge': 'Why Karib Teck',
    'why.title.lead': 'An agency',
    'why.title.hl': 'rooted in the West Indies,',
    'why.title.tail': 'open to the world',
    'why.sub':
      'We know the realities of the local overseas market while mastering the international standards of web and software development.',
    'why.expertiseLabel': 'Our areas of expertise',
    'projects.badge': 'Our Work',
    'projects.title.lead': 'Projects that',
    'projects.title.hl': 'speak for themselves',
    'projects.sub':
      'Examples of the projects we design and build for businesses in Guadeloupe, Martinique and the French overseas territories.',
    'pricing.badge': 'Pricing',
    'pricing.title.lead': 'Transparent',
    'pricing.title.hl': 'offers',
    'pricing.sub':
      'Every project is unique. These prices are indicative — contact us for a tailored quote matched to your exact needs.',
    'pricing.popular': '⭐ Most chosen',
    'contact.badge': 'Contact',
    'contact.title.lead': "Let's talk about your",
    'contact.title.hl': 'project',
    'contact.intro':
      'An idea, a need, a project to launch? Fill in the form or reach out directly. We reply within 24h.',
    'contact.form.firstName': 'First name',
    'contact.form.lastName': 'Last name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.company': 'Company',
    'contact.form.message': 'Your message',
    'contact.form.submit': 'Send my quote request',
    'footer.servicesTitle': 'Services',
    'footer.companyTitle': 'Company',
    'footer.legalTitle': 'Legal',
    'footer.followTitle': 'Follow us',
    'footer.legal.mentions': 'Legal notice',
    'footer.legal.privacy': 'Privacy policy',
    'footer.legal.cgv': 'Terms of sale',
    'footer.rights': 'All rights reserved.',
  },
```

> Also add the EN equivalents for the keys added during the Phase-1 quality fixes (`meta.home.title`, `meta.home.description`, and the `contact.form.*.placeholder` keys). Read the current `ui.fr` to enumerate the exact key set, then add a matching `en` value for EVERY `fr` key — the dicts must be symmetric. Suggested EN values:
>
> - `meta.home.title`: `'Karib Teck – Web Agency in the French West Indies'`
> - `meta.home.description`: `'Karib Teck, web agency in the French West Indies. Websites, mobile apps and turnkey digital solutions for businesses across the French overseas territories.'`
> - placeholders: translate naturally (e.g. `'Jean'`→`'John'`, `'Dupont'`→`'Doe'`, `'jean@entreprise.com'`→`'john@company.com'`, company/message placeholders accordingly).

- [ ] **Step 2: Add a compile-time symmetry guard** at the end of `src/i18n/ui.ts` (catches any missing EN key at build)

```ts
// Ensures every locale defines exactly the same keys as the default locale.
type AssertSameKeys<A, B extends A> = B;
type _UiSymmetry = AssertSameKeys<Record<keyof (typeof ui)['fr'], string>, (typeof ui)['en']>;
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0 errors, 0 warnings. (If `_UiSymmetry` errors, an EN key is missing/extra — fix until symmetric.)

```bash
git add src/i18n/ui.ts
git commit -m "feat(i18n): add English UI dictionary with symmetry guard"
```

---

## Task 3: Localize data content (FR + EN) with locale getters

**Files:** Modify all of `src/data/{services,features,process,why,projects,pricing}.ts`; `src/data/agency.ts` (CONTACT_DETAILS location). `stack.ts` and `socialLinks.ts` stay as-is (neutral content).

Pattern for each module: keep neutral fields plain; wrap translatable fields in `Localized<…>`; export a `getX(locale)` that returns the Phase-1 presentational type (plain strings). **The presentational interfaces in `types/index.ts` (Service, Project, …) stay unchanged** — getters resolve to them, so the cards from Phase 1 don't change.

- [ ] **Step 1: `services.ts`** (worked example — mirror this shape for the others)

```ts
import type { Locale, Localized, Service } from '@/types';

interface ServiceData {
  slug: string;
  icon: string;
  tags: string[];
  title: Localized<string>;
  description: Localized<string>;
}

const SERVICES_DATA: ServiceData[] = [
  {
    slug: 'creation-sites-web',
    icon: '🌐',
    tags: ['WordPress', 'Next.js', 'Figma', 'SEO'],
    title: { fr: 'Création de Sites Web', en: 'Website Design & Development' },
    description: {
      fr: 'Sites vitrines, landing pages, sites e-commerce et portails corporate. Des designs modernes, rapides et optimisés SEO qui convertissent vos visiteurs en clients.',
      en: 'Brochure sites, landing pages, e-commerce stores and corporate portals. Modern, fast, SEO-optimized designs that turn visitors into customers.',
    },
  },
  {
    slug: 'applications-mobiles',
    icon: '📱',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    title: { fr: 'Applications Mobiles', en: 'Mobile Apps' },
    description: {
      fr: 'Applications iOS et Android sur mesure pour votre activité. Gestion de commandes, suivi client, tableaux de bord — nous transformons vos processus en apps intuitives.',
      en: 'Custom iOS and Android apps for your business. Order management, customer tracking, dashboards — we turn your processes into intuitive apps.',
    },
  },
  {
    slug: 'logiciels-metier',
    icon: '⚙️',
    tags: ['PHP / Laravel', 'Node.js', 'PostgreSQL', 'API REST'],
    title: { fr: 'Logiciels Métier (ERP / CRM)', en: 'Business Software (ERP / CRM)' },
    description: {
      fr: 'Progiciels de gestion sur mesure : ERP, CRM, outils de facturation, gestion des stocks et des RH. Des solutions clé en main qui automatisent votre cœur de métier.',
      en: 'Custom management software: ERP, CRM, invoicing, inventory and HR tools. Turnkey solutions that automate the core of your business.',
    },
  },
  {
    slug: 'e-commerce',
    icon: '🛒',
    tags: ['WooCommerce', 'Shopify', 'Paiement sécurisé'],
    title: { fr: 'E-Commerce', en: 'E-Commerce' },
    description: {
      fr: 'Boutiques en ligne performantes et sécurisées. Paiement en ligne, gestion des stocks, expéditions, fidélisation — tout le nécessaire pour vendre efficacement sur le web.',
      en: 'High-performing, secure online stores. Online payments, inventory, shipping, loyalty — everything you need to sell effectively online.',
    },
  },
  {
    slug: 'hebergement-devops',
    icon: '☁️',
    tags: ['AWS / VPS', 'Docker', 'CI/CD', 'SSL'],
    title: { fr: 'Hébergement & DevOps', en: 'Hosting & DevOps' },
    description: {
      fr: 'Déploiement, infrastructure cloud, CI/CD et maintenance. Nous gérons toute la partie technique pour que vous vous concentriez sur votre business.',
      en: 'Deployment, cloud infrastructure, CI/CD and maintenance. We handle the entire technical side so you can focus on your business.',
    },
  },
  {
    slug: 'intelligence-artificielle',
    icon: '🤖',
    tags: ['ChatGPT API', 'Python', 'Automatisation'],
    title: { fr: 'Intelligence Artificielle', en: 'Artificial Intelligence' },
    description: {
      fr: "Intégration d'IA dans vos outils existants : chatbots intelligents, analyse de données, automatisation des tâches répétitives et recommandations personnalisées.",
      en: 'AI integrated into your existing tools: smart chatbots, data analysis, automation of repetitive tasks, and personalized recommendations.',
    },
  },
];

export function getServices(locale: Locale): Service[] {
  return SERVICES_DATA.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    tags: s.tags,
    title: s.title[locale],
    description: s.description[locale],
  }));
}
```

- [ ] **Step 2: `features.ts`** — `title`/`subtitle` → `Localized`; export `getFeatures(locale): Feature[]`. EN:
  - 🎨 `Modern sites` / `Premium, unique design`
  - 🔒 `Secure` / `Advanced protection`
  - 📱 `100% Responsive` / `Optimized for every screen`
  - ⚡ `Fast` / `Maximum performance`
  - 🛟 `7/7 Support` / `Continuous support`

- [ ] **Step 3: `process.ts`** — `title`/`description` → `Localized`; export `getProcessSteps(locale): ProcessStep[]` (`num` stays plain). EN:
  1. `Listen & Analyze` — `We take the time to understand your business, goals and constraints before proposing any solution.`
  2. `Design` — `Mockups, functional architecture, technology choices — we present a detailed plan before writing a single line of code.`
  3. `Development` — `Iterative deliveries with regular check-ins. You follow progress in real time and validate each step.`
  4. `Testing & QA` — `Thorough testing across all devices and browsers. Zero surprises at go-live.`
  5. `Launch & Follow-up` — `Go-live, training if needed, then post-launch follow-up to keep your solution running smoothly.`

- [ ] **Step 4: `why.ts`** — `WHY_POINTS` title/description, `WHY_STATS` label (value plain), `EXPERTISE_TAGS` → `Localized<string[]>`; export `getWhyPoints(locale)`, `getWhyStats(locale)`, `getExpertiseTags(locale)`. EN:
  - Points: `Solid technical expertise` / `Senior developers specialized in web, mobile and business software, with a quality bar on every line of code.` · `Local field knowledge` / `We understand the specifics of West Indian businesses: taxation, logistics, regulatory constraints.` · `Results-driven` / `Every project is measured on concrete KPIs: traffic, conversion, ROI. We deliver value, not just code.` · `Long-term partnership` / `We don't disappear after delivery. Maintenance, evolutions, support — we stay by your side.`
  - Stats labels: `Tailor-made`, `Support available`, `Reply to your request`, `Generic template` (values `100%`, `7/7`, `24h`, `0` stay plain).
  - Expertise tags EN: `Brochure sites`, `E-commerce`, `Business apps`, `Custom ERP`, `CRM`, `Mobile apps`, `API integration`, `Artificial Intelligence`.

- [ ] **Step 5: `projects.ts`** — `category`/`title`/`description` → `Localized` (`emoji`/`gradient` plain); export `getProjects(locale): Project[]`. EN:
  - `E-Commerce` / `Online store — Food distribution` / `A complete e-commerce platform with inventory management, local delivery and online payment, designed for a food distributor in the overseas territories.`
  - `Business Software` / `Management ERP — Construction company` / `An integrated management suite covering quotes, invoicing, site management and HR tracking for a construction SME.`
  - `Mobile App` / `Booking app — Water activities` / `An iOS & Android app to book sea excursions, with a dashboard for the local provider.`

- [ ] **Step 6: `pricing.ts`** — `name`/`price`/`description`/`features` → `Localized` (`popular`/`ctaKey` plain); export `getPricingPlans(locale): PricingPlan[]`. EN:
  - `Starter` / `From €990` / `For micro-businesses, freelancers and project owners who want a professional web presence.` / features: `5-page brochure site`, `Custom design`, `100% Responsive`, `Basic SEO optimization`, `Contact form`, `1 year hosting included`.
  - `Business` / `From €2,900` / `For SMEs that want a high-performing site or a web app with advanced features.` / features: `Up to 20 pages`, `Client area / extranet`, `CRM or ERP integration`, `Advanced SEO + analytics`, `E-commerce or booking`, `Training & documentation`, `6 months support included`.
  - `Enterprise` / `On quote` / `For complex projects: business software, mobile apps, ERP and turnkey solutions.` / features: `Custom web application`, `iOS/Android mobile app`, `ERP / CRM / business software`, `Scalable cloud architecture`, `AI integration`, `Maintenance & evolutions`, `Dedicated SLA and support`.

  > Keep the FR `name` values as-is except localize `Entreprise`→`Enterprise`. `Starter`/`Business` are identical in both.

- [ ] **Step 7: `agency.ts`** — make `CONTACT_DETAILS.location` a `Localized<string>` (fr `Guadeloupe, Antilles Françaises` / en `Guadeloupe, French West Indies`) and `hours` a `Localized<string>` (en `Mon–Fri: 8am – 6pm • Sat: 9am – 1pm`); keep `email`/`phone` plain. Export a `getContactDetails(locale)` returning plain strings. `AGENCY.tagline` → `Localized` (en `Web agency in the French West Indies`) with a `getTagline(locale)` or inline resolution. Update `NAV_LINKS` — unchanged (labelKey resolves via `t`).

- [ ] **Step 8: Verify + commit**

Run: `npm run check`
Expected: 0 errors, 0 warnings. (Organisms still reference the old constant names at this point — if you changed export names, update organisms in Task 4; to keep `check` green here, ADD the `getX` getters without removing usage until Task 4, OR do Tasks 3–4 together before running check. Prefer doing 3+4 then check.)

```bash
git add src/data
git commit -m "feat(data): localize content (FR+EN) via Localized fields and locale getters"
```

---

## Task 4: Organisms consume locale getters

**Files:** Modify `src/components/organisms/{Hero,FeaturesStrip,ServicesSection,StackSection,ProcessSection,WhySection,ProjectsSection,PricingSection,ContactSection,Footer}.astro` and `src/components/molecules/NavMenu.astro` / `Nav.astro`.

- [ ] **Step 1: For each organism that renders data**, replace the direct data import (e.g. `import { SERVICES }`) with the getter (`import { getServices }`) and resolve with the locale prop:

```astro
---
import { getServices } from '@/data/services';
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import ServiceCard from '@/components/molecules/ServiceCard.astro';
import { useTranslations } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
const services = getServices(locale);
---
```

Apply the analogous change to: `FeaturesStrip` (`getFeatures`), `ServicesSection` (`getServices`), `ProcessSection` (`getProcessSteps`), `WhySection` (`getWhyPoints`/`getWhyStats`/`getExpertiseTags`), `ProjectsSection` (`getProjects`), `PricingSection` (`getPricingPlans`), `ContactSection` (`getContactDetails`), `Footer` (`getServices` for the services column, `getContactDetails`/tagline). Every organism takes `locale?: Locale` defaulting to `DEFAULT_LOCALE`. The presentational cards (ServiceCard, etc.) are UNCHANGED — they keep receiving plain objects.

- [ ] **Step 2: `Nav.astro` / `NavMenu.astro`** — already take `locale`; no data change, they use `t`. Verify they forward `locale` (Nav → NavMenu). No change expected beyond confirming.

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run build && npm run lint`
Expected: all green; FR home unchanged.

```bash
git add src/components
git commit -m "refactor(organisms): consume locale-aware data getters"
```

---

## Task 5: LangToggle + Nav integration

**Files:**

- Create: `src/components/molecules/LangToggle.astro`
- Modify: `src/components/organisms/Nav.astro` (add the toggle)

- [ ] **Step 1: Create `src/components/molecules/LangToggle.astro`**

```astro
---
import { alternateLocale, alternateUrl } from '@/i18n/utils';
import type { Locale, RouteKey } from '@/types';
import type { RouteKey as _RK } from '@/i18n/ui';

interface Props {
  locale: Locale;
  route: RouteKey;
}
const { locale, route } = Astro.props;
const other = alternateLocale(locale);
const href = alternateUrl(route, locale);
---

<a
  class="lang-toggle"
  href={href}
  hreflang={other}
  aria-label={`Switch language to ${other.toUpperCase()}`}
>
  {other.toUpperCase()}
</a>

<style>
  .lang-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    height: 32px;
    padding: 0 10px;
    border-radius: var(--radius-card);
    border: 1px solid var(--color-border-accent);
    color: var(--color-white);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 600;
    transition:
      border-color 0.2s,
      color 0.2s;
  }
  .lang-toggle:hover {
    color: var(--color-cyan);
    border-color: var(--color-cyan);
  }
</style>
```

> `RouteKey` must be exported from `@/types` too, or import it from `@/i18n/ui`. To keep imports clean, re-export it: add `export type { RouteKey } from '@/i18n/ui';` to `src/types/index.ts` and import `RouteKey` from `@/types`. Remove the duplicate `_RK` import line above once done.

- [ ] **Step 2: Add `LangToggle` to `Nav.astro`** — accept a `route` prop (defaulting to `'home'`), render `<LangToggle locale={locale} route={route} />` next to the devis button (inside the nav, after `NavMenu`). Update `Nav`'s `Props` to `{ locale?: Locale; route?: RouteKey }`.

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean.

```bash
git add src/components/molecules/LangToggle.astro src/components/organisms/Nav.astro src/types/index.ts
git commit -m "feat(i18n): add FR/EN language toggle in the nav"
```

---

## Task 6: hreflang alternates in MainLayout

**Files:**

- Modify: `src/layouts/MainLayout.astro`

- [ ] **Step 1: Add an optional `route` prop + hreflang links.** MainLayout already takes `locale`; add `route?: RouteKey` (default `'home'`) and emit alternates in `<head>`:

```astro
---
import { DEFAULT_LOCALE, SITE_URL } from '@/lib/constants';
import { routes } from '@/i18n/ui';
import type { Locale, RouteKey } from '@/types';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@/styles/global.css';

interface Props {
  title: string;
  description: string;
  locale?: Locale;
  route?: RouteKey;
}
const { title, description, locale = DEFAULT_LOCALE, route = 'home' } = Astro.props;
const canonical = new URL(routes[locale][route], SITE_URL).href;
const frHref = new URL(routes.fr[route], SITE_URL).href;
const enHref = new URL(routes.en[route], SITE_URL).href;
---
```

Then in `<head>`, after the canonical link:

```astro
<link rel="canonical" href={canonical} />
<link rel="alternate" hreflang="fr" href={frHref} />
<link rel="alternate" hreflang="en" href={enHref} />
<link rel="alternate" hreflang="x-default" href={frHref} />
<slot name="head" />
```

> Add a `<slot name="head" />` (used by Phase 3 for JSON-LD). Keep the rest of the layout intact.

- [ ] **Step 2: Verify + commit**

Run: `npm run check && npm run build`
Expected: green; `dist/index.html` now has 3 `hreflang` alternates + canonical.

```bash
git add src/layouts/MainLayout.astro
git commit -m "feat(seo): emit hreflang alternates and head slot in MainLayout"
```

---

## Task 7: EN home mirror + FR page route prop

**Files:**

- Modify: `src/pages/index.astro` (pass `locale="fr"` + `route="home"` explicitly)
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Update `src/pages/index.astro`** to pass locale + route explicitly to layout, Nav, and every organism

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
import { useTranslations } from '@/i18n/utils';
import type { Locale } from '@/types';

const locale: Locale = 'fr';
const t = useTranslations(locale);
---

<MainLayout
  title={t('meta.home.title')}
  description={t('meta.home.description')}
  locale={locale}
  route="home"
>
  <Nav slot="nav" locale={locale} route="home" />
  <Hero locale={locale} />
  <FeaturesStrip locale={locale} />
  <ServicesSection locale={locale} />
  <StackSection locale={locale} />
  <ProcessSection locale={locale} />
  <WhySection locale={locale} />
  <ProjectsSection locale={locale} />
  <PricingSection locale={locale} />
  <ContactSection locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 2: Create `src/pages/en/index.astro`** — identical composition with `locale = 'en'`

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
import { useTranslations } from '@/i18n/utils';
import type { Locale } from '@/types';

const locale: Locale = 'en';
const t = useTranslations(locale);
---

<MainLayout
  title={t('meta.home.title')}
  description={t('meta.home.description')}
  locale={locale}
  route="home"
>
  <Nav slot="nav" locale={locale} route="home" />
  <Hero locale={locale} />
  <FeaturesStrip locale={locale} />
  <ServicesSection locale={locale} />
  <StackSection locale={locale} />
  <ProcessSection locale={locale} />
  <WhySection locale={locale} />
  <ProjectsSection locale={locale} />
  <PricingSection locale={locale} />
  <ContactSection locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

- [ ] **Step 3: Verify + commit**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check`
Expected: all green; build emits BOTH `dist/index.html` and `dist/en/index.html`.

```bash
git add src/pages/index.astro src/pages/en/index.astro
git commit -m "feat(pages): add EN home mirror and explicit locale/route on FR home"
```

---

## Task 8: Bilingual verification gate

No new files.

- [ ] **Step 1: Build and verify both locales**

Run: `rm -rf dist .astro && npm run build`
Expected: `dist/index.html` (FR) and `dist/en/index.html` (EN) both exist.

- [ ] **Step 2: FR page checks** — `dist/index.html`:
  - `<html lang="fr">`, French nav ("Accueil", "Services", …), French hero ("Nous créons des … sites web …").
  - hreflang: `fr` → `https://karibteck.com/`, `en` → `https://karibteck.com/en/`, `x-default` → FR. Canonical → `https://karibteck.com/`.
  - LangToggle shows "EN" linking to `/en/`.

- [ ] **Step 3: EN page checks** — `dist/en/index.html`:
  - `<html lang="en">`, English nav ("Home", "Services", "Work", "About", "Pricing", "Contact"), English hero ("We build … websites … that grow your business.").
  - All sections translated: services titles/descriptions, process steps, why points + honest stats labels ("Tailor-made", "Support available", …), projects, pricing ("From €990", "Enterprise", "On quote").
  - hreflang identical set; canonical → `https://karibteck.com/en/`. LangToggle shows "FR" → `/`.
  - **Honesty preserved in EN:** `grep -E "50\+|98%|clients satisfied|projects delivered" dist/en/index.html` → nothing.

- [ ] **Step 4: Symmetry + no fabricated EN** — confirm `ui.fr` and `ui.en` have identical key sets (the `_UiSymmetry` guard enforces this at build) and every data getter returns content for both locales.

- [ ] **Step 5: Final commit** (if any formatting/touch-ups)

```bash
git add -A
git commit -m "test(i18n): verify FR/EN parity, hreflang and honesty across both locales" --allow-empty
```

---

## Self-review notes (against spec §2 langues, §4 i18n, CLAUDE.md)

- **Bilingual FR/EN, FR default no-prefix, EN `/en/` (spec §2):** Astro i18n already configured (Phase 0); EN dict (Task 2), localized data (Task 3), `/en/` mirror (Task 7). ✅
- **hreflang on every bilingual page (spec §8.1):** MainLayout emits fr/en/x-default (Task 6). ✅
- **No hardcoded UI strings / Localized data pattern mirrors reference:** `{fr,en}` fields + getters; presentational cards unchanged. ✅
- **Honesty preserved in both locales (spec §3):** EN copy carries no fabricated proof; verified Task 8 Step 3. ✅
- **`localizePath` signature change:** route-based now; Phase 1 had no callers (verified Task 1 Step 3). ✅
- **head slot added** for Phase 3 JSON-LD — forward-looking, no behavior change. ✅
- **Deferred (correctly absent):** `<SeoHead>`/JSON-LD (Phase 3), service/blog routes + their `/en/` mirrors and `routes` entries (their phases), real NAP/names (generic placeholders kept). Noted, not gaps.
- **Placeholder scan:** Task 3 Steps 2–7 give EN copy as bullet lists rather than full file code, but each names the exact field→Localized change, the getter to add, and the verbatim EN strings — a bounded, unambiguous transformation with the worked `services.ts` example to mirror. Not an open TODO.

```

```
