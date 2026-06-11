# KaribTeck Phase 0 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a clean Astro 6 project (Tailwind 4, TypeScript strict, zero-JS) over the current repo, with the full developer toolchain, CI, design tokens, and the project `CLAUDE.md` — leaving a running, building, lint-clean app ready for the landing port (Phase 1).

**Architecture:** Manual Astro scaffold (no interactive `create astro`) layered onto the existing git repo. Tailwind 4 via the `@tailwindcss/vite` plugin with design tokens in `@theme`. Native Astro i18n configured (FR default, no prefix; EN under `/en/`). All conventions (clean-code rules, i18n, SEO, a11y) are codified in `CLAUDE.md` up front so Phases 1-7 follow them.

**Tech Stack:** Astro 6 (static), Tailwind 4, TypeScript strict, ESLint (flat config) + Prettier + Husky/lint-staged, `@astrojs/sitemap`, `astro-icon`, `@fontsource-variable` (Inter + Space Grotesk), GitHub Actions CI.

> **Reference project** (architecture to mirror): `/Users/aymeric/Documents/Code/Projects/presentation`. Its `CLAUDE.md` and `README.md` are the canonical structure. This plan adapts that structure to KaribTeck (agency context, navy/cyan design instead of Swiss Brutalist).
>
> **Spec:** `docs/superpowers/specs/2026-06-09-karibteck-astro-refonte-design.md`.

---

## File structure produced by this phase

```
package.json                     deps + scripts
tsconfig.json                    strict + @/* alias
astro.config.mjs                 site, i18n, sitemap, icon, tailwind vite plugin
eslint.config.mjs                flat config (astro + ts)
.prettierrc                      prettier + astro + tailwind plugins
.prettierignore
lint-staged.config.mjs
.husky/pre-commit                runs lint-staged
.github/workflows/ci.yml         lint + format + astro check + build (NO deploy — standby)
.gitignore                       node/astro artifacts
.env.example                     PUBLIC_ vars
src/
├─ styles/
│  ├─ global.css                 tailwind import + base reset
│  └─ theme.css                  @theme tokens (KaribTeck navy/cyan) + gradient var
├─ lib/constants.ts              SITE_URL, locales, contact constants
├─ types/index.ts                Locale + shared type re-exports
└─ pages/index.astro             temporary placeholder home (verifies tokens + fonts)
CLAUDE.md                        rewritten — full project guide (mirror of reference)
```

The existing `index.html` and `*.png` files are left untouched in Phase 0; `index.html` is ported and removed in Phase 1.

---

## Task 1: Create package.json and install dependencies

**Files:**

- Create: `package.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "karibteck",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "lint": "eslint \"src/**/*.{js,ts,astro}\"",
    "lint:fix": "eslint --fix \"src/**/*.{js,ts,astro}\"",
    "format": "prettier --write \"**/*.{astro,ts,js,mjs,css,md,mdx,json}\"",
    "format:check": "prettier --check \"**/*.{astro,ts,js,mjs,css,md,mdx,json}\"",
    "prepare": "husky"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.7.2",
    "@fontsource-variable/inter": "^5.2.7",
    "@fontsource-variable/space-grotesk": "^5.2.7",
    "@iconify-json/lucide": "^1.2.109",
    "@iconify-json/simple-icons": "^1.2.83",
    "@tailwindcss/vite": "^4.1.18",
    "astro": "^6.3.6",
    "astro-icon": "^1.1.5",
    "tailwindcss": "^4.1.18",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "@eslint/js": "^9.39.2",
    "eslint": "^9.39.2",
    "eslint-plugin-astro": "^1.5.0",
    "globals": "^17.1.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7",
    "prettier": "^3.8.1",
    "prettier-plugin-astro": "^0.14.1",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.53.1"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: dependencies resolve and a `package-lock.json` + `node_modules/` are created with no peer-dependency errors. (If `husky` prepare fails because `.husky` doesn't exist yet, that's fine — it's created in Task 6.)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: scaffold package.json with Astro 6 + tooling deps"
```

---

## Task 2: Add .gitignore and TypeScript config

**Files:**

- Create: `.gitignore`
- Create: `tsconfig.json`

- [ ] **Step 1: Create `.gitignore`**

```gitignore
# build output
dist/
# generated types & cache
.astro/
# deps
node_modules/
# env
.env
.env.production
# os / editor
.DS_Store
*.log
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "verbatimModuleSyntax": true
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore tsconfig.json
git commit -m "chore: add gitignore and strict tsconfig with @/ alias"
```

---

## Task 3: Configure Astro (site, i18n, integrations, Tailwind plugin)

**Files:**

- Create: `astro.config.mjs`

- [ ] **Step 1: Create `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://karibteck.com',
  output: 'static',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add astro.config.mjs
git commit -m "chore: configure astro (site, FR/EN i18n, sitemap, icon, tailwind 4)"
```

---

## Task 4: Design tokens and base styles

**Files:**

- Create: `src/styles/theme.css`
- Create: `src/styles/global.css`

Tokens are ported verbatim from the current `index.html` `:root` block (navy palette, blue→cyan accent, radii, fonts).

- [ ] **Step 1: Create `src/styles/theme.css`**

```css
/* KaribTeck design tokens — ported from the original index.html :root.
   Tailwind 4 exposes @theme tokens as utilities (bg-navy, text-cyan, rounded-card…). */
@theme {
  /* Backgrounds */
  --color-navy: #050d1f;
  --color-navy-2: #0a1628;
  --color-navy-3: #0f1e38;

  /* Accents */
  --color-blue-1: #0057e7;
  --color-blue-2: #0099ff;
  --color-cyan: #00d4ff;

  /* Neutrals */
  --color-white: #ffffff;
  --color-gray: #8a9bb5;
  --color-gray-2: #1a2d4a;

  /* Radii */
  --radius-card: 12px;
  --radius-lg: 20px;

  /* Fonts (self-hosted variable fonts, loaded in the layout) */
  --font-sans: 'Inter Variable', sans-serif;
  --font-display: 'Space Grotesk Variable', sans-serif;
}

/* Gradients can't be color tokens — expose as a plain custom property. */
:root {
  --gradient-accent: linear-gradient(135deg, #0057e7, #00d4ff);
}
```

- [ ] **Step 2: Create `src/styles/global.css`**

```css
@import 'tailwindcss';
@import './theme.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--color-navy);
  color: var(--color-white);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Brand focus ring (accent, visible) */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-cyan);
}

/* Respect reduced motion everywhere */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/theme.css src/styles/global.css
git commit -m "feat(styles): add KaribTeck design tokens and base styles"
```

---

## Task 5: Shared constants and types

**Files:**

- Create: `src/lib/constants.ts`
- Create: `src/types/index.ts`

- [ ] **Step 1: Create `src/lib/constants.ts`**

```ts
export const SITE_URL = 'https://karibteck.com';

export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export const DEFAULT_LOCALE = 'fr';

export const CONTACT_EMAIL = 'contact@karibteck.com';

/** Zones desservies — used for local SEO (areaServed) in Phase 3. */
export const AREA_SERVED = [
  'Guadeloupe',
  'Martinique',
  'Guyane',
  'Saint-Martin',
  'Saint-Barthélemy',
] as const;
```

- [ ] **Step 2: Create `src/types/index.ts`**

```ts
import type { SUPPORTED_LOCALES } from '@/lib/constants';

export type Locale = (typeof SUPPORTED_LOCALES)[number];
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts src/types/index.ts
git commit -m "feat(lib): add site constants and Locale type"
```

---

## Task 6: Linting, formatting, and pre-commit hooks

**Files:**

- Create: `eslint.config.mjs`
- Create: `.prettierrc`
- Create: `.prettierignore`
- Create: `lint-staged.config.mjs`
- Create: `.husky/pre-commit`

- [ ] **Step 1: Create `eslint.config.mjs`**

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
```

- [ ] **Step 2: Create `.prettierrc`**

```json
{
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "printWidth": 100,
  "singleQuote": true,
  "semi": true,
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }]
}
```

- [ ] **Step 3: Create `.prettierignore`**

```gitignore
dist/
.astro/
node_modules/
package-lock.json
```

- [ ] **Step 4: Create `lint-staged.config.mjs`**

```js
export default {
  '*.{astro,ts,js,mjs}': ['eslint --fix', 'prettier --write'],
  '*.{css,md,mdx,json}': ['prettier --write'],
};
```

- [ ] **Step 5: Initialize Husky and create the pre-commit hook**

Run: `npx husky init`
Then overwrite `.husky/pre-commit` with:

```sh
npx lint-staged
```

- [ ] **Step 6: Verify lint and format run clean on existing source**

Run: `npm run lint && npm run format:check`
Expected: ESLint reports no errors; Prettier reports all files formatted (run `npm run format` once first if it flags files, then re-run `format:check`).

- [ ] **Step 7: Commit**

```bash
git add eslint.config.mjs .prettierrc .prettierignore lint-staged.config.mjs .husky package.json
git commit -m "chore: add eslint flat config, prettier, husky + lint-staged"
```

---

## Task 7: Temporary placeholder home page (verifies the toolchain end-to-end)

**Files:**

- Create: `src/pages/index.astro`

This is a throwaway page replaced in Phase 1. It exists only to prove tokens, fonts, and Tailwind utilities all resolve.

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@/styles/global.css';
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KaribTeck — Agence web aux Antilles</title>
    <meta name="description" content="KaribTeck, agence web aux Antilles. Refonte en cours." />
  </head>
  <body class="bg-navy text-white">
    <main class="mx-auto max-w-3xl px-6 py-24">
      <h1 class="font-display text-5xl font-bold">
        Karib<span
          style={`background: var(--gradient-accent); -webkit-background-clip: text; background-clip: text; color: transparent;`}
          >Teck</span
        >
      </h1>
      <p class="text-gray mt-4">Refonte Astro en cours — fondations en place.</p>
    </main>
  </body>
</html>
```

- [ ] **Step 2: Run `astro check`**

Run: `npm run check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: build succeeds, `dist/index.html` and `dist/sitemap-index.xml` are generated, 0 errors, 0 warnings.

- [ ] **Step 4: Visual smoke check**

Run: `npm run dev` then open `http://localhost:4321`.
Expected: dark navy background, white "Karib" with a blue→cyan gradient "Teck", grey subtitle, Inter/Space Grotesk fonts loaded (no FOUT of system fonts). Stop the server when confirmed.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pages): add temporary placeholder home to verify toolchain"
```

---

## Task 8: GitHub Actions CI (build + checks, no deploy)

**Files:**

- Create: `.github/workflows/ci.yml`

Deployment is intentionally **out of scope** (VPS standby per spec §12). CI only validates quality gates.

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npm run check
      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add quality workflow (lint, format, astro check, build)"
```

---

## Task 9: Environment variable template

**Files:**

- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`**

```bash
# Public variables only (output: static — no server-side secrets).
# Copy to .env and fill in. Values prefixed PUBLIC_ are exposed to the client.

# Cal.com booking URL (Phase 6)
PUBLIC_CALCOM_URL=

# Web3Forms public access key (Phase 6)
PUBLIC_WEB3FORMS_KEY=

# WhatsApp number in international format, digits only, e.g. 590690000000 (Phase 6)
PUBLIC_WHATSAPP_NUMBER=

# Analytics domain (optional)
PUBLIC_PLAUSIBLE_DOMAIN=karibteck.com
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add .env.example for PUBLIC_ runtime config"
```

---

## Task 10: Rewrite CLAUDE.md (full project guide)

**Files:**

- Modify: `CLAUDE.md` (overwrite the current static-site version entirely)

This is the keystone deliverable: it codifies the conventions every later phase follows. It mirrors the reference project's `CLAUDE.md`, adapted to KaribTeck (agency context, navy/cyan tokens, VPS-standby deploy, local-SEO + GEO, Web3Forms/Cal/WhatsApp).

- [ ] **Step 1: Overwrite `CLAUDE.md` with the following content**

````markdown
# CLAUDE.md — karibteck.com

Tu travailles sur **karibteck.com** : le site de **KaribTeck**, agence web aux Antilles/DOM (Guadeloupe, Martinique, Guyane…), montée par 3 ingénieurs.
Site **statique Astro multi-pages, bilingue FR (par défaut) / EN**, déployé sur un VPS (nginx).

Positionnement : **agence ancrée aux Antilles, standards internationaux**. Sites web, applications mobiles, logiciels métier, e-commerce, IA.

Spec de design source : `docs/superpowers/specs/2026-06-09-karibteck-astro-refonte-design.md`. En cas de conflit entre ce CLAUDE.md et le spec, le spec gagne pour les décisions produit/design ; ce CLAUDE.md gagne pour les règles de code.

---

## Stack & versions

```
Framework        : Astro 6 (output static)
Language         : TypeScript strict
Styling          : Tailwind 4 (@theme + CSS vars), pas de framework UI
Content          : Astro Content Collections + MDX (blog)
Icons            : astro-icon + iconify (lucide, simple-icons)
Fonts            : @fontsource-variable (Inter, Space Grotesk)
i18n             : Astro i18n natif (defaultLocale fr, sans préfixe ; EN sous /en/)
SEO local        : @astrojs/sitemap + JSON-LD (ProfessionalService/Organization, areaServed, NAP)
GEO (IA)         : llms.txt + llms-full.txt + ai.txt + robots IA + graphe JSON-LD + FAQPage
Contact          : Web3Forms (statique) + Cal.com (embed) + WhatsApp
Tests            : Lighthouse CI + @axe-core/playwright + validateur JSON-LD
Deploy           : VPS via GitHub Actions (⏸️ en standby tant que l'infra n'est pas validée)
```

Pas de framework JS additionnel (React/Vue/Svelte/shadcn). Astro statique pur, hydratation = zéro par défaut. C'est ce qui garantit les scores Lighthouse Perf ≥ 95 / SEO 100.

---

## Architecture des dossiers

```
src/
├─ assets/                  logos apps, visuels équipe, og
├─ components/
│  ├─ atoms/                Icon, JsonLd, SectionBadge, Highlight, Button…
│  ├─ molecules/            ServiceCard, ProcessStep, ProjectCard, TeamMember,
│  │                        GuaranteeItem, PricingCard, FAQItem, SocialLink,
│  │                        StackGroup, LangToggle, WhatsAppButton, CalEmbed
│  ├─ organisms/            Nav, Hero, ServicesSection, StackSection, ProcessSection,
│  │                        WhySection, ProjectsSection, TeamSection, GuaranteesSection,
│  │                        PricingSection, FaqSection, ContactSection, Footer
│  └─ prose/                composants MDX du blog
├─ content/blog/{fr,en}/    articles .mdx
├─ content.config.ts        schema Zod de la collection blog
├─ data/                    agency, services, projects, team, guarantees, pricing, faq, stack, socialLinks
├─ i18n/                    ui.ts (strings FR/EN) + utils.ts (localizePath, useTranslations)
├─ layouts/                 MainLayout.astro, BlogLayout.astro
├─ lib/                     constants, dates, readingTime, blog, jsonLd, geo, ogImage
├─ pages/                   index, a-propos, services/[slug], blog/*, pages légales,
│                           robots.txt.ts, llms.txt.ts, llms-full.txt.ts, ai.txt.ts, rss.xml.ts, 404
│                           + en/ (miroir EN, slugs traduits)
├─ styles/                  global.css, theme.css, prose.css
└─ types/                   interfaces partagées (Locale, Service, Project, TeamMember…)
```

---

## Clean Code — règles non négociables

S'appliquent à chaque fichier, chaque fonction, chaque PR.

1. **Taille** : composant Astro ≤ 150 lignes, fichier `.ts` ≤ 120. Une page (`src/pages/*.astro`) **compose**, n'implémente pas (< 80 lignes). Si ça dépasse → découper (section → organism, cellule répétée → molecule, calcul → `lib/`, constantes → `data/`).
2. **Fonctions** ≤ 20 lignes, une seule responsabilité. Si tu écris « et » pour la décrire → découpe.
3. **Nommage explicite**, sans abréviation. Booléens `is/has/can/should`. Constantes `SCREAMING_SNAKE_CASE`. Async/build = verbe d'action.
4. **Structure imposée des composants Astro** : (1) imports externes→internes→types, (2) props typées, (3) logique au build, (4) markup sans logique inline, (5) styles scoped OU classes Tailwind (un seul style par composant).
5. **TypeScript strict** : 0 `any`, 0 cast non justifié. Union types plutôt que string libre. Types globaux dans `src/types/`. Schemas Zod dans `content.config.ts`. `astro check` = 0 erreur/0 warning avant commit.
6. **Pas de couleur/taille en dur** hors `src/styles/theme.css`. Manque un token ? Ajoute-le dans `theme.css`, pas dans le composant.
7. **Pas de logique dans le markup** : filtres/tris/maps/format → `lib/`. La page garde la composition.
8. **Imports ordonnés** (Astro → externes → internes via alias `@/` → `import type`).
9. **Pas de magic numbers** → `lib/constants.ts` ou constante nommée en tête de fichier.
10. **Un fichier = une responsabilité**. Pas de `helpers.ts`/`Misc.astro` fourre-tout.
11. **`npm run build` : 0 erreur, 0 warning.** Un warning se comprend et se corrige, il ne s'ignore pas.

---

## Conventions spécifiques au projet

- **i18n** : aucune string UI hardcodée → toujours `useTranslations(locale)` + clé dans `src/i18n/ui.ts` (FR + EN). Liens internes via `localizePath` / `t.path`, jamais de href hardcodé.
- **Liens externes** : `rel="noopener noreferrer"` si `target="_blank"`.
- **Images** : toujours via `astro:assets` (`<Image>`). Images dans `src/assets/` (optimisées), pas `public/`. Images au-dessus du pli → `loading="eager"` + `fetchpriority="high"`.
- **SEO/GEO** : chaque page publique passe par `<SeoHead>` (title, description, canonical, OpenGraph, hreflang FR↔EN, JSON-LD adapté). Une page sans JSON-LD n'est pas mergeable (validée par `scripts/validate-jsonld.mjs`).
- **SEO local** : graphe JSON-LD `ProfessionalService`/`Organization` avec NAP + `areaServed` (Guadeloupe, Martinique, Guyane, Saint-Martin, Saint-Barthélemy). `Service` sur chaque page service. `FAQPage` sur la FAQ.
- **A11y** : `<html lang>` correct, skip-link `#main`, focus-visible (accent cyan), landmarks ARIA, un seul `<h1>` par page, `prefers-reduced-motion` respecté sur toute animation.
- **Honnêteté contenu (0 client)** : aucune fausse preuve sociale (pas de faux témoignages/logos/« X clients satisfaits »). « Nos projets » = apps réelles de l'équipe. Chiffres uniquement réels.
- **Blog bilingue** : paire FR↔EN via `translationKey` identique dans les 2 fichiers. Le toggle FR↔EN n'apparaît que si la traduction existe. Un article peut n'exister qu'en une langue.

---

## Checklist avant commit

```
□ astro check passe (0 erreur, 0 warning)
□ npm run build passe (0 erreur, 0 warning)
□ eslint + prettier --check passent
□ Aucun composant > 150 lignes / .ts > 120 lignes ; aucune fonction > 20 lignes
□ Aucun any TS, aucun cast non justifié
□ Aucune string UI hardcodée (tout via useTranslations)
□ Aucune couleur hardcodée hors theme.css
□ Aucun href interne hardcodé (localizePath / t.path)
□ Toute page publique a un <SeoHead> avec JSON-LD adapté
□ Toute image via <Image> d'astro:assets
□ Commit en conventional commits
```

---

## Tests & budgets

| Niveau | Quoi          | Outil                                                         |
| ------ | ------------- | ------------------------------------------------------------- |
| 1      | Build & types | `astro check` + `astro build`                                 |
| 2      | A11y          | `@axe-core/playwright` sur routes critiques (FR + EN)         |
| 3      | Perf          | Lighthouse CI — **Perf ≥ 95, A11y = 100, BP ≥ 95, SEO = 100** |
| 4      | JSON-LD       | `scripts/validate-jsonld.mjs` sur `dist/`                     |

Pas de tests unitaires sur les composants Astro. Logique pure non triviale dans `lib/` → testable (Vitest) si besoin.

---

## Conventions Git

- Branches : `main` (prod), `feat/…`, `fix/…`, `chore/…`, `docs/…`, `refactor/…`.
- Conventional commits (`feat(scope): …`, `fix`, `chore`, `docs`, `refactor`, `perf`, `a11y`, `seo`).
- PR → `main`, CI verte obligatoire, squash & merge.

---

## Pièges Astro à éviter

- **Astro n'hydrate rien par défaut** : un `onClick` dans un composant Astro ne marche pas côté client. Interactivité → `<script>` (TS vanilla) en module, ou CSS-only. Pas de React.
- **Tailwind 4 = `@theme`, pas `tailwind.config.js`** : toute personnalisation passe par `src/styles/theme.css`. Ne crée pas de `tailwind.config.js` (ignoré).
- **Content collections typées au build** : après modif du schema Zod, `astro sync` pour régénérer les types.
- **`Astro.currentLocale` peut être `undefined` au top-level** : dans les composants partagés, passer la locale en props.
- **Images sous `public/` non optimisées** : pour l'optimisation auto, mettre dans `src/assets/` et importer.
- **Routes API (`.ts` exportant `GET`)** OK en statique si build-time only (`robots.txt.ts`, `rss.xml.ts`, `llms.txt.ts`…).

---

## Ce qu'on NE construit PAS en V1

- Études de cas / témoignages / logos clients (jusqu'aux premiers vrais clients).
- Newsletter / capture email. CMS externe (Content Collections suffit).
- Créole antillais (archi i18n prête, ajout ultérieur).
- Endpoint serveur dédié pour le formulaire (Web3Forms suffit).
- Tests unitaires/E2E des composants (Playwright sert uniquement à axe-core).
- Déploiement automatisé tant que l'infra VPS n'est pas validée (⏸️ standby).

---

## Référence

Spec design (le **quoi**/**pourquoi**) : `docs/superpowers/specs/2026-06-09-karibteck-astro-refonte-design.md`.
Ce CLAUDE.md décrit le **comment**. Projet d'architecture de référence : `aymeric.dijoux.dev`.
````

- [ ] **Step 2: Verify formatting passes on the rewritten file**

Run: `npm run format -- CLAUDE.md && npm run format:check -- CLAUDE.md`
Expected: Prettier reports the file is formatted.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: rewrite CLAUDE.md as full Astro project guide (mirror of reference)"
```

---

## Task 11: Phase 0 verification gate

No new files — this confirms the foundation is sound end-to-end before Phase 1.

- [ ] **Step 1: Clean build from scratch**

Run: `rm -rf dist .astro && npm run check && npm run build`
Expected: `astro check` → 0 errors/0 warnings; `astro build` → success, `dist/` contains `index.html` + `sitemap-index.xml`.

- [ ] **Step 2: Lint + format gate**

Run: `npm run lint && npm run format:check`
Expected: both pass with no errors.

- [ ] **Step 3: Confirm pre-commit hook fires**

Run: `git commit --allow-empty -m "test: verify pre-commit hook"` then inspect output.
Expected: `lint-staged` runs (no staged files → it exits cleanly). Delete the empty commit afterward: `git reset --soft HEAD~1`.

- [ ] **Step 4: Final state check**

Confirm the repo now has: `package.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc`, `.husky/pre-commit`, `.github/workflows/ci.yml`, `src/styles/{global,theme}.css`, `src/lib/constants.ts`, `src/types/index.ts`, `src/pages/index.astro`, and the rewritten `CLAUDE.md`. The original `index.html` and `*.png` are still present (ported in Phase 1).

---

## Self-review notes (against spec §2, §5, §10, §13)

- **Stack (spec §2):** Astro 6 static, Tailwind 4 `@theme`, TS strict, FR/EN i18n, sitemap, icon, fonts, ESLint/Prettier/Husky — all configured (Tasks 1-8). ✅
- **Design tokens (spec §5):** ported verbatim from `index.html` into `theme.css` (Task 4). ✅
- **Clean-code rules + conventions (spec §10):** codified in `CLAUDE.md` (Task 10). ✅
- **Deploy standby (spec §12):** CI builds but does **not** deploy (Task 8). ✅
- **Phase 0 (spec §13):** scaffold + tooling + CI + `CLAUDE.md` + alias `@/` — covered. ✅
- **Deferred to later phases (correctly absent here):** MDX/RSS/blog deps, Playwright/axe, Lighthouse CI, satori OG, `@axe-core` (Phase 3+), data files, components, i18n strings. These are installed/built in their own phase plans. Noted, not a gap.
- **Placeholder scan:** the only "placeholder" is `src/pages/index.astro`, explicitly a throwaway replaced in Phase 1 — intentional, not a plan gap. No TBD/TODO steps. ✅

```

```
