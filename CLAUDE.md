# CLAUDE.md — karibteck.com

Tu travailles sur **karibteck.com** : le site de **KaribTeck**, agence web aux Antilles/DOM (Guadeloupe, Martinique, Guyane…), montée par 2 fondateurs (Aymeric et Claude).
Site **statique Astro multi-pages, bilingue FR (par défaut) / EN**, déployé sur un VPS (nginx).

Positionnement : **agence ancrée aux Antilles, standards internationaux**. 3 verticaux : sites web, applications mobiles, intelligence artificielle (agents IA).

Spec de design source : `docs/superpowers/specs/2026-06-09-karibteck-astro-refonte-design.md`. En cas de conflit entre ce CLAUDE.md et le spec, le spec gagne pour les décisions produit/design ; ce CLAUDE.md gagne pour les règles de code.

---

## Bootstrap (mise en place autonome)

Pour mettre en place ce projet depuis un clone, exécute exactement :

```bash
npm install        # installe les deps + bootstrap auto (postinstall) : .env scaffold, agent skills, husky
npm run verify     # PREUVE que tout fonctionne (check + build + lint + format + validateur JSON-LD)
```

- Node **20+** requis (voir `.nvmrc` / `engines`).
- `npm install` lance `scripts/bootstrap.mjs` (postinstall) — **idempotent**, ré-exécutable via `npm run bootstrap`. Il crée `.env` depuis `.env.example` s'il manque (jamais écrasé) et restaure les agent skills depuis `skills-lock.json` (non bloquant si offline).
- **Ne jamais considérer la mise en place réussie tant que `npm run verify` n'est pas vert.** C'est le garde-fou : pas « j'ai installé » mais une sortie verte qui le prouve (0 erreur, 36 pages, 0 page sans JSON-LD `Organization`).
- Le site se lance et se build **sans `.env`** ; les variables `PUBLIC_*` n'activent que le formulaire/Cal/WhatsApp.

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
