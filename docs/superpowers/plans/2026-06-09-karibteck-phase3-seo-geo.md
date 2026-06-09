# KaribTeck Phase 3 — SEO local + GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the local-SEO + GEO layer — a schema.org JSON-LD entity graph (Organization/ProfessionalService + WebSite + Service + FAQPage + BreadcrumbList) on every page, OpenGraph/Twitter meta, AI-crawler-friendly `robots.txt`, and `llms.txt`/`llms-full.txt`/`ai.txt` — plus a CI validator that fails any public page missing its Organization JSON-LD.

**Architecture:** Pure build-time. JSON-LD builders live in `src/lib/jsonLd.ts` (consume existing `getServices`/`getFaq`/`getContactDetails`); a tiny `JsonLd` atom serializes them; `MainLayout` gains OG/Twitter meta + an `ogImage` prop; pages inject their graph through the existing `<slot name="head" />`. GEO text endpoints are Astro static route files (`*.txt.ts`) generated from `src/lib/geo.ts`. A Node script parses `dist/` and enforces the JSON-LD contract in CI.

**Tech Stack:** Astro 6 static routes, TS strict. Builds on Phases 0–2 + 1b. NAP values are the existing generic placeholders (real values dropped in later).

> **Spec:** §8.1 (local SEO: ProfessionalService/Organization, NAP, areaServed) + §8.2 (GEO: llms/ai/robots, JSON-LD graph, FAQPage). **Conventions:** `CLAUDE.md`. Mirrors the reference project's `lib/jsonLd.ts` + `pages/{robots,llms,llms-full,ai}.txt.ts` + `scripts/validate-jsonld.mjs`.

---

## Scope

**In scope:** `lib/jsonLd.ts` builders + `JsonLd` atom; OG/Twitter in `MainLayout` (+ `ogImage` prop); home graph (Organization/ProfessionalService, WebSite, Service×6, FAQPage, BreadcrumbList) on FR + EN; `robots.txt.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `ai.txt.ts` + `lib/geo.ts`; `scripts/validate-jsonld.mjs` + `validate:jsonld` npm script + CI step; `@astrojs/sitemap` already wired (Phase 0) — verify it emits.

**NOT in scope:** dynamic OG image generation via Satori (deferred V1.1 — a single static OG image is referenced, or omitted with a TODO); service/blog pages and their JSON-LD (their phases); real NAP/sameAs (placeholders; social links are `#` so `sameAs` is omitted until real URLs exist).

---

## Task 1: Agency SEO constants + NAP accessor

**Files:** Modify `src/lib/constants.ts`, `src/data/agency.ts`.

- [ ] **Step 1: Add SEO/NAP constants to `src/lib/constants.ts`** (alongside existing exports)

```ts
/** Legal/brand identifiers for schema.org. */
export const ORGANIZATION_NAME = 'Karib Teck';
export const ORGANIZATION_LEGAL_NAME = 'Karib Teck';
/** Region for PostalAddress (placeholder until full NAP is provided). */
export const ADDRESS_REGION = 'Guadeloupe';
export const ADDRESS_COUNTRY = 'FR';
/** Approx. centroid of Guadeloupe — placeholder geo until a real address exists. */
export const GEO_LATITUDE = 16.265;
export const GEO_LONGITUDE = -61.551;
```

- [ ] **Step 2: Confirm `getContactDetails(locale)`** (added in Phase 2) returns `{ email, phone, location, hours }`. If `phone`/`email` aren't exported in a build-usable way, add a plain `getContactDetails` that returns them. (No change if already present — verify by reading `src/data/agency.ts`.)

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/lib/constants.ts src/data/agency.ts
git commit -m "feat(seo): add organization NAP/geo constants"
```

---

## Task 2: JSON-LD builders

**Files:** Create `src/lib/jsonLd.ts`.

- [ ] **Step 1: Create `src/lib/jsonLd.ts`** — builders returning plain schema.org objects. Uses `@id` anchors so nodes reference each other in one `@graph`.

```ts
import {
  SITE_URL,
  ORGANIZATION_NAME,
  ORGANIZATION_LEGAL_NAME,
  ADDRESS_REGION,
  ADDRESS_COUNTRY,
  GEO_LATITUDE,
  GEO_LONGITUDE,
  AREA_SERVED,
} from '@/lib/constants';
import { getServices } from '@/data/services';
import { getFaq } from '@/data/faq';
import { getContactDetails } from '@/data/agency';
import { useTranslations } from '@/i18n/utils';
import type { Locale } from '@/types';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function areaServedNodes() {
  return AREA_SERVED.map((name) => ({ '@type': 'AdministrativeArea', name }));
}

export function buildOrganization(locale: Locale) {
  const contact = getContactDetails(locale);
  const t = useTranslations(locale);
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: ORGANIZATION_NAME,
    legalName: ORGANIZATION_LEGAL_NAME,
    url: SITE_URL,
    email: contact.email,
    telephone: contact.phone,
    description: t('meta.home.description'),
    address: {
      '@type': 'PostalAddress',
      addressRegion: ADDRESS_REGION,
      addressCountry: ADDRESS_COUNTRY,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO_LATITUDE,
      longitude: GEO_LONGITUDE,
    },
    areaServed: areaServedNodes(),
    knowsAbout: getServices(locale).map((s) => s.title),
  };
}

export function buildWebSite(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: ORGANIZATION_NAME,
    inLanguage: locale,
    publisher: { '@id': ORG_ID },
  };
}

export function buildServices(locale: Locale) {
  return getServices(locale).map((s) => ({
    '@type': 'Service',
    name: s.title,
    description: s.description,
    serviceType: s.title,
    provider: { '@id': ORG_ID },
    areaServed: areaServedNodes(),
  }));
}

export function buildFaqPage(locale: Locale) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: getFaq(locale).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function buildBreadcrumb(locale: Locale, url: string) {
  const t = useTranslations(locale);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('nav.home'),
        item: url,
      },
    ],
  };
}

/** Full graph for the home page. */
export function buildHomeGraph(locale: Locale, url: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebSite(locale),
      ...buildServices(locale),
      buildFaqPage(locale),
      buildBreadcrumb(locale, url),
    ],
  };
}
```

> If `getContactDetails` isn't exported from `agency.ts`, add it (Task 1 Step 2). If `useTranslations` import path differs, match the existing one (`@/i18n/utils`).

- [ ] **Step 2: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/lib/jsonLd.ts
git commit -m "feat(seo): add schema.org JSON-LD builders (Organization, WebSite, Service, FAQPage, Breadcrumb)"
```

---

## Task 3: JsonLd atom + OG/Twitter meta in MainLayout

**Files:** Create `src/components/atoms/JsonLd.astro`; modify `src/layouts/MainLayout.astro`.

- [ ] **Step 1: Create `src/components/atoms/JsonLd.astro`**

```astro
---
interface Props {
  data: unknown;
}
const { data } = Astro.props;
---

<script type="application/ld+json" set:html={JSON.stringify(data)} is:inline />
```

- [ ] **Step 2: Add OG/Twitter meta + `ogImage` prop to `MainLayout.astro`.** Extend `Props` with `ogImage?: string`; build an absolute OG URL; emit OG + Twitter tags in `<head>` (after the hreflang block, before `<slot name="head" />`).

```astro
interface Props {
  title: string;
  description: string;
  locale?: Locale;
  route?: RouteKey;
  ogImage?: string;
}
const { title, description, locale = DEFAULT_LOCALE, route = 'home', ogImage } = Astro.props;
// …existing canonical/hreflang…
const ogImageUrl = ogImage ? new URL(ogImage, SITE_URL).href : undefined;
const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_US';
```

In `<head>`:

```astro
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Karib Teck" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={ogLocale} />
    {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
    <meta name="twitter:card" content={ogImageUrl ? 'summary_large_image' : 'summary'} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
    <slot name="head" />
```

> `og:image` is omitted when no `ogImage` is passed (no static OG asset exists yet — a dynamic Satori generator is deferred to V1.1). Leave a `{/* TODO Phase V1.1: dynamic OG image */}` comment near the og tags.

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run build`
Expected: 0/0; `dist/index.html` now has OG/Twitter meta.

```bash
git add src/components/atoms/JsonLd.astro src/layouts/MainLayout.astro
git commit -m "feat(seo): add JsonLd atom and OpenGraph/Twitter meta"
```

---

## Task 4: Inject the JSON-LD graph on the home page

**Files:** Modify `src/components/organisms/HomePage.astro`.

- [ ] **Step 1: Build the graph and pass it via the head slot.** In `HomePage.astro` frontmatter, build `const graph = buildHomeGraph(locale, new URL(routes[locale].home, SITE_URL).href);` and render `<JsonLd data={graph} />` inside `<Fragment slot="head">` of `MainLayout`.

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import JsonLd from '@/components/atoms/JsonLd.astro';
import { buildHomeGraph } from '@/lib/jsonLd';
import { routes } from '@/i18n/ui';
import { SITE_URL } from '@/lib/constants';
import { useTranslations } from '@/i18n/utils';
// …existing organism imports…
import type { Locale } from '@/types';

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
const t = useTranslations(locale);
const homeUrl = new URL(routes[locale].home, SITE_URL).href;
const graph = buildHomeGraph(locale, homeUrl);
---

<MainLayout title={t('meta.home.title')} description={t('meta.home.description')} locale={locale} route="home">
  <Fragment slot="head"><JsonLd data={graph} /></Fragment>
  <Nav slot="nav" locale={locale} route="home" />
  …existing organisms…
</MainLayout>
```

> Keep HomePage ≤150 lines (it's ~45). If MainLayout's title/description were built differently before, preserve the existing behavior.

- [ ] **Step 2: Verify + commit**

Run: `rm -rf dist .astro && npm run check && npm run build`
Expected: 0/0; BOTH `dist/index.html` and `dist/en/index.html` contain a `<script type="application/ld+json">` with `"@type":["Organization","ProfessionalService"]`, `FAQPage`, and 6 `Service` nodes. EN graph has `"inLanguage":"en"` + English service names.

```bash
git add src/components/organisms/HomePage.astro
git commit -m "feat(seo): inject Organization/Service/FAQPage JSON-LD graph on home (FR+EN)"
```

---

## Task 5: GEO text endpoints (robots, llms, llms-full, ai)

**Files:** Create `src/lib/geo.ts`, `src/pages/robots.txt.ts`, `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `src/pages/ai.txt.ts`.

- [ ] **Step 1: Create `src/lib/geo.ts`** — content generators (FR canonical content; the site is FR-default).

```ts
import { SITE_URL, ORGANIZATION_NAME, AREA_SERVED } from '@/lib/constants';
import { getServices } from '@/data/services';
import { getFaq } from '@/data/faq';

const AI_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
];

export function buildRobotsTxt(): string {
  const lines = ['User-agent: *', 'Allow: /', ''];
  for (const ua of AI_USER_AGENTS) {
    lines.push(`User-agent: ${ua}`, 'Allow: /', '');
  }
  lines.push(`Sitemap: ${SITE_URL}/sitemap-index.xml`, '');
  return lines.join('\n');
}

export function buildLlmsTxt(): string {
  const services = getServices('fr');
  return [
    `# ${ORGANIZATION_NAME}`,
    '',
    `> Agence web aux Antilles/DOM. Création de sites web, applications mobiles, logiciels métier, e-commerce et intégration d'IA pour les entreprises de ${AREA_SERVED.join(', ')}.`,
    '',
    '## Services',
    ...services.map((s) => `- [${s.title}](${SITE_URL}/#services): ${s.description}`),
    '',
    '## Liens',
    `- [Accueil](${SITE_URL}/)`,
    `- [Version anglaise](${SITE_URL}/en/)`,
    '',
  ].join('\n');
}

export function buildLlmsFullTxt(): string {
  const services = getServices('fr');
  const faq = getFaq('fr');
  return [
    buildLlmsTxt(),
    '## Détail des services',
    ...services.flatMap((s) => [`### ${s.title}`, s.description, `Technologies : ${s.tags.join(', ')}`, '']),
    '## FAQ',
    ...faq.flatMap((f) => [`### ${f.question}`, f.answer, '']),
  ].join('\n');
}

export function buildAiTxt(): string {
  return [
    `# AI usage policy — ${ORGANIZATION_NAME}`,
    '',
    'Content on this site may be used by AI systems to answer questions about our services,',
    'provided the agency is cited accurately and not misrepresented.',
    '',
    `Contact: ${SITE_URL}/#contact`,
    '',
  ].join('\n');
}
```

- [ ] **Step 2: Create the four route files.** Each exports a `GET` returning text. Example `src/pages/robots.txt.ts`:

```ts
import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '@/lib/geo';

export const GET: APIRoute = () =>
  new Response(buildRobotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
```

Analogously:
- `src/pages/llms.txt.ts` → `buildLlmsTxt()`
- `src/pages/llms-full.txt.ts` → `buildLlmsFullTxt()`
- `src/pages/ai.txt.ts` → `buildAiTxt()`

- [ ] **Step 3: Verify + commit**

Run: `rm -rf dist .astro && npm run check && npm run build`
Expected: build emits `dist/robots.txt`, `dist/llms.txt`, `dist/llms-full.txt`, `dist/ai.txt`. `robots.txt` lists the AI user-agents + `Sitemap:` line; `llms.txt` lists the 6 services.

```bash
git add src/lib/geo.ts src/pages/robots.txt.ts src/pages/llms.txt.ts src/pages/llms-full.txt.ts src/pages/ai.txt.ts
git commit -m "feat(geo): add robots.txt, llms.txt, llms-full.txt and ai.txt endpoints"
```

---

## Task 6: JSON-LD CI validator

**Files:** Create `scripts/validate-jsonld.mjs`; modify `package.json` (script) + `.github/workflows/ci.yml`.

- [ ] **Step 1: Create `scripts/validate-jsonld.mjs`** — parses every `dist/**/*.html` and fails if any page lacks an `Organization` JSON-LD node.

```js
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function hasOrganization(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.some((m) => {
    try {
      const json = JSON.stringify(JSON.parse(m[1]));
      return json.includes('"Organization"');
    } catch {
      return false;
    }
  });
}

const files = await htmlFiles(DIST);
const missing = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (!hasOrganization(html)) missing.push(file);
}

if (missing.length) {
  console.error(`✗ ${missing.length} page(s) missing Organization JSON-LD:`);
  for (const f of missing) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`✓ All ${files.length} page(s) have Organization JSON-LD.`);
```

- [ ] **Step 2: Add the npm script** to `package.json` `scripts`:

```json
    "validate:jsonld": "node scripts/validate-jsonld.mjs",
```

- [ ] **Step 3: Add the CI step** to `.github/workflows/ci.yml` after the `build` step:

```yaml
      - run: npm run build
      - run: npm run validate:jsonld
```

- [ ] **Step 4: Verify + commit**

Run: `rm -rf dist .astro && npm run build && npm run validate:jsonld`
Expected: `✓ All N page(s) have Organization JSON-LD.` (FR + EN home both pass). Confirm it FAILS if you temporarily break it (optional sanity check), then restore.

```bash
git add scripts/validate-jsonld.mjs package.json .github/workflows/ci.yml
git commit -m "ci: add JSON-LD validator enforcing Organization on every page"
```

---

## Task 7: Final gate

- [ ] **Step 1: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`
Expected: all green.

- [ ] **Step 2: SEO/GEO spot-checks**
  - `dist/index.html`: JSON-LD graph with `Organization`+`ProfessionalService`, `WebSite`, 6 `Service`, `FAQPage` (7 questions), `BreadcrumbList`; `areaServed` lists the 5 DOM areas; OG/Twitter meta; canonical + 3 hreflang.
  - `dist/en/index.html`: same graph with English names + `inLanguage: en`.
  - `dist/robots.txt`: AI user-agents allowed + `Sitemap:` line.
  - `dist/llms.txt`, `dist/llms-full.txt`, `dist/ai.txt` present and populated.
  - `dist/sitemap-index.xml` present (from `@astrojs/sitemap`).
  - Honesty: `grep -rEn "50\+|98%|Clients satisfaits|Projets livrés" dist src` → nothing.
  - Validate the JSON-LD parses (it's `JSON.parse`-able — the validator already confirms this).

- [ ] **Step 3: Commit (if touch-ups)**

```bash
git add -A
git commit -m "test(seo): verify JSON-LD graph, GEO endpoints and hreflang across FR/EN" --allow-empty
```

---

## Self-review notes (against spec §8.1, §8.2, CLAUDE.md)

- **Local SEO (spec §8.1):** `Organization`+`ProfessionalService` with NAP (email/phone/region), `geo`, `areaServed` (5 DOM areas), `Service` per service. hreflang already from Phase 2. ✅
- **GEO (spec §8.2):** `llms.txt`/`llms-full.txt`/`ai.txt`, AI-crawler `robots.txt`, `FAQPage` (from the Phase-1b FAQ), `BreadcrumbList`. ✅
- **CI contract (spec §10/§11):** validator fails any page without Organization JSON-LD; wired into CI. ✅
- **Conventions:** builders in `lib/` (no logic in markup), `JsonLd` atom, no hardcoded UI strings (descriptions via `ui.ts`/data), TS strict. ✅
- **Honesty:** JSON-LD carries no fabricated metrics; `knowsAbout`/services are real. ✅
- **Deferred (correctly absent):** dynamic Satori OG image (V1.1 — og:image omitted with TODO when no asset), `sameAs` (social links are `#` placeholders), service/blog page graphs (their phases), real NAP. Noted, not gaps.
- **Placeholder scan:** Task 5 Step 2 describes 3 of the 4 endpoints by analogy to the fully-shown `robots.txt.ts` — identical 3-line pattern, different builder; bounded and unambiguous. NAP/geo values are intentional documented placeholders.
```
