# KaribTeck Phase 4 — Dedicated Service Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a dedicated, bilingual page per service (`/services/<slug>` + `/en/services/<slug>`), generated from the service data, each with richer copy, a `Service` + `BreadcrumbList` + `Organization` JSON-LD graph, hreflang, and a contact CTA — to target local long-tail SEO. Link the landing's service cards to these pages.

**Architecture:** Extend the existing `services.ts` (`Localized` fields + getters) with per-service `intro` + `benefits`. Two dynamic routes (`src/pages/services/[slug].astro`, `src/pages/en/services/[slug].astro`) use `getStaticPaths` over the services list. A `ServiceDetail` organism renders the page body; `MainLayout` gains an optional `localizedPaths` prop (and `LangToggle` an optional `altHref`) so canonical/hreflang/toggle work for dynamic slugs without disturbing the home flow. JSON-LD reuses `lib/jsonLd.ts`.

**Tech Stack:** Astro 6 static + `getStaticPaths`, TS strict. Builds on Phases 0–3.

> **Content authored here** (FR + EN), honest (capability-focused, no fabricated clients/metrics). Slugs are shared across locales (neutral). **Spec:** §6.2 (dedicated service pages, local-SEO long-tail), §8.1 (Service JSON-LD). **Conventions:** `CLAUDE.md`.

---

## Scope

**In scope:** per-service `intro`+`benefits` (FR+EN) + `getServiceBySlug`; `MainLayout.localizedPaths` + `LangToggle.altHref`; `localizeServicePath` helper; service-page UI strings; `buildServiceGraph`; `ServiceDetail` organism; FR + EN `[slug]` routes; landing service cards link to their detail page; sitemap auto-includes them; validator covers them.

**NOT in scope:** a `/services` index page (nav keeps the `#services` anchor; index can come later), blog (Phase 5), contact wiring (Phase 6), real NAP.

---

## Task 1: Extend service data with detail content (FR + EN)

**Files:** Modify `src/types/index.ts`, `src/data/services.ts`.

- [ ] **Step 1: Extend the `Service` type** in `src/types/index.ts` — add detail fields (cards ignore them):

```ts
export interface Service {
  slug: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  intro: string;
  benefits: string[];
}
```

- [ ] **Step 2: Add `intro` + `benefits` (`Localized`) to each entry in `SERVICES_DATA`** and map them in `getServices`. Also add a `getServiceBySlug`. Use this content (append `intro`/`benefits` to the existing 6 entries — keep existing `slug`/`icon`/`tags`/`title`/`description`):

```ts
// creation-sites-web
intro: {
  fr: 'Nous concevons des sites web sur mesure pour les entreprises des Antilles : vitrines élégantes, sites e-commerce et portails corporate, pensés pour être rapides, bien référencés et faciles à gérer.',
  en: 'We design custom websites for businesses in the French West Indies: elegant brochure sites, e-commerce stores and corporate portals — built to be fast, well-ranked and easy to manage.',
},
benefits: {
  fr: ['Design unique aligné sur votre marque', 'Optimisation SEO et performance dès la conception', '100% responsive, adapté à tous les écrans', 'Interface d’administration simple à prendre en main'],
  en: ['Unique design aligned with your brand', 'SEO and performance built in from the start', '100% responsive across every screen', 'Simple, easy-to-learn admin interface'],
},
// applications-mobiles
intro: {
  fr: 'Nous développons des applications iOS et Android natives ou cross-platform pour digitaliser votre activité : commandes, réservations, suivi client, tableaux de bord.',
  en: 'We build native or cross-platform iOS and Android apps to digitize your business: orders, bookings, customer tracking, dashboards.',
},
benefits: {
  fr: ['Une seule base de code pour iOS et Android', 'Expérience fluide et intuitive', 'Publication sur l’App Store et Google Play', 'Notifications, hors-ligne et intégrations sur mesure'],
  en: ['A single codebase for iOS and Android', 'Smooth, intuitive experience', 'Publishing to the App Store and Google Play', 'Notifications, offline mode and custom integrations'],
},
// logiciels-metier
intro: {
  fr: 'Nous créons des logiciels métier sur mesure — ERP, CRM, outils de facturation et de gestion — qui automatisent votre cœur d’activité et remplacent les tableurs éparpillés.',
  en: 'We build custom business software — ERP, CRM, invoicing and management tools — that automates the core of your activity and replaces scattered spreadsheets.',
},
benefits: {
  fr: ['Adapté exactement à vos processus', 'Centralisation de vos données', 'Automatisation des tâches répétitives', 'Évolutif au rythme de votre croissance'],
  en: ['Tailored exactly to your processes', 'Your data, centralized', 'Automation of repetitive tasks', 'Scales with your growth'],
},
// e-commerce
intro: {
  fr: 'Nous lançons des boutiques en ligne performantes et sécurisées, du catalogue au paiement, prêtes à vendre auprès de vos clients antillais et au-delà.',
  en: 'We launch fast, secure online stores, from catalog to checkout, ready to sell to your customers in the West Indies and beyond.',
},
benefits: {
  fr: ['Paiement en ligne sécurisé', 'Gestion des stocks et des expéditions', 'Optimisé pour la conversion', 'Fidélisation et promotions intégrées'],
  en: ['Secure online payments', 'Inventory and shipping management', 'Conversion-optimized', 'Built-in loyalty and promotions'],
},
// hebergement-devops
intro: {
  fr: 'Nous gérons toute l’infrastructure technique de vos applications : déploiement, cloud, CI/CD, sauvegardes et maintenance, pour que vous restiez concentré sur votre business.',
  en: 'We handle the entire technical infrastructure of your applications: deployment, cloud, CI/CD, backups and maintenance, so you stay focused on your business.',
},
benefits: {
  fr: ['Hébergement fiable et sécurisé (SSL inclus)', 'Déploiements automatisés (CI/CD)', 'Sauvegardes et supervision', 'Maintenance et mises à jour de sécurité'],
  en: ['Reliable, secure hosting (SSL included)', 'Automated deployments (CI/CD)', 'Backups and monitoring', 'Maintenance and security updates'],
},
// intelligence-artificielle
intro: {
  fr: 'Nous intégrons l’intelligence artificielle dans vos outils : chatbots, analyse de données, automatisation et recommandations — uniquement là où elle apporte une réelle valeur.',
  en: 'We integrate artificial intelligence into your tools: chatbots, data analysis, automation and recommendations — only where it brings real value.',
},
benefits: {
  fr: ['Chatbots et assistants intelligents', 'Automatisation des tâches à faible valeur', 'Analyse et exploitation de vos données', 'Intégration dans vos outils existants'],
  en: ['Smart chatbots and assistants', 'Automation of low-value tasks', 'Analysis and use of your data', 'Integration into your existing tools'],
},
```

Update `getServices` to also map `intro: s.intro[locale]` and `benefits: s.benefits[locale]`, and add:

```ts
export function getServiceBySlug(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/types/index.ts src/data/services.ts
git commit -m "feat(data): add per-service intro and benefits (FR+EN) + getServiceBySlug"
```

---

## Task 2: i18n — localized service paths, MainLayout localizedPaths, LangToggle altHref

**Files:** Modify `src/i18n/utils.ts`, `src/layouts/MainLayout.astro`, `src/components/molecules/LangToggle.astro`, `src/components/organisms/Nav.astro`, `src/i18n/ui.ts`.

- [ ] **Step 1: Add `localizeServicePath` to `src/i18n/utils.ts`**

```ts
/** Path to a service detail page for a locale (slug shared across locales). */
export function localizeServicePath(slug: string, locale: Locale): string {
  return locale === 'fr' ? `/services/${slug}/` : `/en/services/${slug}/`;
}
```

- [ ] **Step 2: `MainLayout.astro` — accept `localizedPaths?: { fr: string; en: string }`.** When provided, use it for canonical + hreflang instead of `routes[locale][route]`:

```ts
interface Props {
  title: string;
  description: string;
  locale?: Locale;
  route?: RouteKey;
  ogImage?: string;
  localizedPaths?: { fr: string; en: string };
}
const { title, description, locale = DEFAULT_LOCALE, route = 'home', ogImage, localizedPaths } =
  Astro.props;
const frPath = localizedPaths ? localizedPaths.fr : routes.fr[route];
const enPath = localizedPaths ? localizedPaths.en : routes.en[route];
const canonical = new URL(locale === 'fr' ? frPath : enPath, SITE_URL).href;
const frHref = new URL(frPath, SITE_URL).href;
const enHref = new URL(enPath, SITE_URL).href;
```

(Keep the existing hreflang/og markup; it already uses `frHref`/`enHref`/`canonical`.)

- [ ] **Step 3: `LangToggle.astro` — accept optional `altHref?: string`.** Use it when provided; else fall back to `alternateUrl(route, locale)`:

```ts
interface Props {
  locale: Locale;
  route: RouteKey;
  altHref?: string;
}
const { locale, route, altHref } = Astro.props;
const other = alternateLocale(locale);
const href = altHref ?? alternateUrl(route, locale);
```

- [ ] **Step 4: `Nav.astro` — pass through an optional `altHref`.** Add `altHref?: string` to Nav props and forward it to `LangToggle`. (Home doesn't pass it → unchanged behavior.)

- [ ] **Step 5: `ui.ts` — add service-page chrome keys** (FR + EN, symmetric):

```ts
// fr
'services.detail.breadcrumb': 'Services',
'services.detail.benefitsTitle': 'Ce que vous obtenez',
'services.detail.techTitle': 'Technologies',
'services.detail.cta': 'Discuter de ce projet',
'services.detail.backToServices': 'Tous nos services',
// en
'services.detail.breadcrumb': 'Services',
'services.detail.benefitsTitle': 'What you get',
'services.detail.techTitle': 'Technologies',
'services.detail.cta': 'Discuss this project',
'services.detail.backToServices': 'All our services',
```

- [ ] **Step 6: Verify + commit**

Run: `npm run check && npm run build`
Expected: 0/0; home still builds with correct hreflang (regression check — home passes no `localizedPaths`, so it uses `routes`).

```bash
git add src/i18n/utils.ts src/layouts/MainLayout.astro src/components/molecules/LangToggle.astro src/components/organisms/Nav.astro src/i18n/ui.ts
git commit -m "feat(i18n): support dynamic localized paths for canonical/hreflang/toggle"
```

---

## Task 3: Service JSON-LD graph

**Files:** Modify `src/lib/jsonLd.ts`.

- [ ] **Step 1: Add `buildServiceGraph`** (single Service + Organization + BreadcrumbList home › services › service)

```ts
import { localizeServicePath } from '@/i18n/utils';
import type { Service } from '@/types';

export function buildServiceGraph(locale: Locale, service: Service, url: string) {
  const t = useTranslations(locale);
  const homeUrl = new URL(routesHome(locale), SITE_URL).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      {
        '@type': 'Service',
        name: service.title,
        description: service.intro,
        serviceType: service.title,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: AREA_SERVED.map((name) => ({ '@type': 'AdministrativeArea', name })),
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('nav.home'), item: homeUrl },
          { '@type': 'ListItem', position: 2, name: t('services.detail.breadcrumb'), item: `${homeUrl}#services` },
          { '@type': 'ListItem', position: 3, name: service.title, item: url },
        ],
      },
    ],
  };
}
```

> Add the needed imports (`AREA_SERVED` is already imported; add `routes` usage). For `routesHome(locale)` just inline `routes[locale].home` (import `routes` from `@/i18n/ui` if not already). Ensure no circular import: `jsonLd.ts` importing `localizeServicePath` from `utils` is fine (utils doesn't import jsonLd). If a cycle appears, inline the service-path string instead.

- [ ] **Step 2: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/lib/jsonLd.ts
git commit -m "feat(seo): add per-service JSON-LD graph (Service + Breadcrumb + Organization)"
```

---

## Task 4: ServiceDetail organism

**Files:** Create `src/components/organisms/ServiceDetail.astro`.

- [ ] **Step 1: Create `ServiceDetail.astro`** — hero (icon, breadcrumb, title, intro, CTA), benefits list, tech tags, back link. Takes `service` + `locale`.

```astro
---
import Tag from '@/components/atoms/Tag.astro';
import Button from '@/components/atoms/Button.astro';
import { useTranslations, localizePath } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale, Service } from '@/types';

interface Props {
  service: Service;
  locale?: Locale;
}
const { service, locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
const homePath = localizePath('home', locale);
const contactHref = `${homePath}#contact`;
const servicesHref = `${homePath}#services`;
---

<article class="service-detail">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href={homePath}>{t('nav.home')}</a>
    <span aria-hidden="true">›</span>
    <a href={servicesHref}>{t('services.detail.breadcrumb')}</a>
  </nav>

  <header class="head">
    <div class="icon" aria-hidden="true">{service.icon}</div>
    <h1>{service.title}</h1>
    <p class="intro">{service.intro}</p>
    <Button href={contactHref} variant="primary">{t('services.detail.cta')}</Button>
  </header>

  <section class="benefits">
    <h2>{t('services.detail.benefitsTitle')}</h2>
    <ul>
      {service.benefits.map((b) => <li>{b}</li>)}
    </ul>
  </section>

  <section class="tech">
    <h2>{t('services.detail.techTitle')}</h2>
    <div class="tags">{service.tags.map((tag) => <Tag label={tag} />)}</div>
  </section>

  <a class="back" href={servicesHref}>← {t('services.detail.backToServices')}</a>
</article>

<style>
  .service-detail {
    max-width: 820px;
    margin: 0 auto;
    padding: calc(var(--nav-height) + 64px) 5% 96px;
  }
  .crumbs {
    display: flex;
    gap: 10px;
    color: var(--color-gray);
    font-size: 0.85rem;
    margin-bottom: 32px;
  }
  .crumbs a {
    color: var(--color-gray);
    text-decoration: none;
  }
  .crumbs a:hover {
    color: var(--color-cyan);
  }
  .head .icon {
    font-size: 2.6rem;
  }
  .head h1 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3rem);
    margin: 12px 0 16px;
  }
  .intro {
    color: var(--color-gray);
    font-size: 1.05rem;
    margin-bottom: 28px;
  }
  .benefits,
  .tech {
    margin-top: 48px;
  }
  .benefits h2,
  .tech h2 {
    font-family: var(--font-display);
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
  .benefits ul {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 12px;
  }
  .benefits li {
    padding-left: 28px;
    position: relative;
    color: var(--color-gray);
  }
  .benefits li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-cyan);
    font-weight: 700;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .back {
    display: inline-block;
    margin-top: 48px;
    color: var(--color-cyan);
    text-decoration: none;
  }
</style>
```

- [ ] **Step 2: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean; ≤150 lines.

```bash
git add src/components/organisms/ServiceDetail.astro
git commit -m "feat(organisms): add ServiceDetail page body"
```

---

## Task 5: Dynamic routes (FR + EN)

**Files:** Create `src/pages/services/[slug].astro`, `src/pages/en/services/[slug].astro`.

- [ ] **Step 1: `src/pages/services/[slug].astro`** (FR)

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import Nav from '@/components/organisms/Nav.astro';
import Footer from '@/components/organisms/Footer.astro';
import ServiceDetail from '@/components/organisms/ServiceDetail.astro';
import JsonLd from '@/components/atoms/JsonLd.astro';
import { getServices } from '@/data/services';
import { buildServiceGraph } from '@/lib/jsonLd';
import { localizeServicePath } from '@/i18n/utils';
import { SITE_URL } from '@/lib/constants';
import type { GetStaticPaths } from 'astro';
import type { Locale } from '@/types';

const locale: Locale = 'fr';

export const getStaticPaths = (() => {
  return getServices('fr').map((service) => ({ params: { slug: service.slug }, props: { service } }));
}) satisfies GetStaticPaths;

const { service } = Astro.props;
const paths = { fr: localizeServicePath(service.slug, 'fr'), en: localizeServicePath(service.slug, 'en') };
const url = new URL(paths.fr, SITE_URL).href;
const graph = buildServiceGraph(locale, service, url);
const title = `${service.title} aux Antilles | Karib Teck`;
---

<MainLayout title={title} description={service.intro} locale={locale} localizedPaths={paths}>
  <Fragment slot="head"><JsonLd data={graph} /></Fragment>
  <Nav slot="nav" locale={locale} altHref={paths.en} />
  <ServiceDetail service={service} locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

> `Astro.props.service` comes from `getStaticPaths`. Since `getServices('fr')` returns the resolved FR `Service`, the page gets the FR-localized service. (EN page mirrors with `'en'`.)

- [ ] **Step 2: `src/pages/en/services/[slug].astro`** (EN) — same with `locale='en'`, `getServices('en')`, `url` from `paths.en`, `altHref={paths.fr}`, title `` `${service.title} in the French West Indies | Karib Teck` ``.

- [ ] **Step 3: Verify + build**

Run: `rm -rf dist .astro && npm run check && npm run build`
Expected: 0/0; build emits `dist/services/<slug>/index.html` for all 6 FR slugs and `dist/en/services/<slug>/index.html` for all 6 EN slugs (12 service pages). Each has its Service+Organization+Breadcrumb JSON-LD and hreflang FR↔EN.

```bash
git add src/pages/services/[slug].astro src/pages/en/services/[slug].astro
git commit -m "feat(pages): add bilingual dynamic service detail routes"
```

---

## Task 6: Link landing service cards to detail pages

**Files:** Modify `src/components/molecules/ServiceCard.astro`, `src/components/organisms/ServicesSection.astro`.

- [ ] **Step 1: `ServiceCard.astro`** — accept an optional `href?: string`; when present, wrap the title (and make the whole card clickable) in an `<a>`. Keep the card presentational.

```astro
---
import Tag from '@/components/atoms/Tag.astro';
import type { Service } from '@/types';

interface Props {
  service: Service;
  href?: string;
}
const { service, href } = Astro.props;
---

<article class="service-card fade-up">
  <div class="service-icon">{service.icon}</div>
  <h3 class="service-title">
    {href ? <a href={href}>{service.title}</a> : service.title}
  </h3>
  <p class="service-desc">{service.description}</p>
  <div class="service-tags">{service.tags.map((tag) => <Tag label={tag} />)}</div>
</article>

<style>
  /* keep existing styles; add: */
  .service-title a {
    color: inherit;
    text-decoration: none;
  }
  .service-title a:hover {
    color: var(--color-cyan);
  }
</style>
```

> Preserve the existing `service-card` styles; only add the `.service-title a` rules.

- [ ] **Step 2: `ServicesSection.astro`** — pass the localized href:

```astro
---
import { localizeServicePath } from '@/i18n/utils';
// …existing imports…
const services = getServices(locale);
---
…
{services.map((service) => <ServiceCard service={service} href={localizeServicePath(service.slug, locale)} />)}
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run build && npm run lint`
Expected: clean; landing service cards now link to `/services/<slug>/` (FR) and `/en/services/<slug>/` (EN).

```bash
git add src/components/molecules/ServiceCard.astro src/components/organisms/ServicesSection.astro
git commit -m "feat(landing): link service cards to their detail pages"
```

---

## Task 7: Final gate

- [ ] **Step 1: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`
Expected: all green. `validate:jsonld` now checks 14 pages (home FR/EN + 12 service pages) — all must have Organization JSON-LD.

- [ ] **Step 2: Spot-checks**
  - 6 FR pages under `dist/services/*/index.html`, 6 EN under `dist/en/services/*/index.html`.
  - A FR service page (e.g. `dist/services/creation-sites-web/index.html`): `<html lang="fr">`, `<h1>` = service title, intro, benefits list, tags, JSON-LD with a `Service` node + `BreadcrumbList` (3 items) + Organization; canonical = `https://karibteck.com/services/creation-sites-web/`; hreflang fr→that, en→`/en/services/creation-sites-web/`; LangToggle "EN" → EN page.
  - The EN mirror has English title/intro/benefits + `inLanguage`/locale en.
  - `dist/sitemap-0.xml` (or sitemap-index) includes the service URLs.
  - Landing: service cards link to the detail pages (FR → `/services/<slug>/`, EN → `/en/services/<slug>/`).
  - Honesty: `grep -rEn "50\+|98%|Clients satisfaits|Projets livrés" dist src` → nothing.

- [ ] **Step 3: Commit (if touch-ups)**

```bash
git add -A
git commit -m "test(services): verify bilingual service pages, JSON-LD and hreflang" --allow-empty
```

---

## Self-review notes (against spec §6.2, §8.1, CLAUDE.md)

- **Dedicated service pages (spec §6.2):** 6 services × 2 locales = 12 pages, generated from data; local long-tail title (`… aux Antilles` / `… in the French West Indies`). ✅
- **Service JSON-LD (spec §8.1):** per-page Service + Organization + BreadcrumbList; validator covers all pages. ✅
- **i18n correctness:** dynamic `localizedPaths` for canonical/hreflang/toggle without disturbing home; slugs shared across locales. ✅
- **Integration:** landing service cards link to detail pages. ✅
- **Honesty:** copy is capability-focused, no fabricated proof. ✅
- **Conventions:** data in `data/`, builders in `lib/`, organism ≤150 lines, no hardcoded UI strings (chrome via `ui.ts`), `astro:assets` n/a (no new images), TS strict. ✅
- **Deferred (correctly absent):** `/services` index page (nav anchor kept), blog, contact wiring, real NAP. Noted, not gaps.
- **Placeholder scan:** Task 5 Step 2 describes the EN route by analogy to the fully-shown FR route (same code, `'en'` + mirrored title/altHref) — bounded, unambiguous.
```
