# KaribTeck — site vitrine

Site de **KaribTeck**, agence web aux Antilles/DOM (Guadeloupe, Martinique, Guyane…).
Site **statique Astro 6, bilingue FR (par défaut) / EN**, optimisé SEO local + GEO (moteurs IA).

> Pour les conventions de code détaillées (règles clean-code, i18n, SEO, a11y), voir **[`CLAUDE.md`](./CLAUDE.md)**.
> Pour le « pourquoi » des décisions produit/design, voir les specs et plans dans **[`docs/superpowers/`](./docs/superpowers/)**.

---

## Stack

| Couche       | Choix                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------- |
| Framework    | **Astro 6** (output statique, zéro-JS par défaut)                                           |
| Styling      | **Tailwind 4** (`@theme` + variables CSS), sans framework UI                                |
| Langage      | **TypeScript strict**                                                                       |
| Contenu      | **Astro Content Collections** + MDX (blog), validé par Zod                                  |
| i18n         | Astro i18n natif — `fr` par défaut sans préfixe, `en` sous `/en/`                           |
| SEO local    | `@astrojs/sitemap` + JSON-LD `Organization`/`ProfessionalService` (NAP, `areaServed` DOM)   |
| GEO (IA)     | `llms.txt` / `llms-full.txt` / `ai.txt`, `robots.txt` crawlers IA, `FAQPage`/`BlogPosting`  |
| Contact      | **Web3Forms** (statique) + **Cal.com** + **WhatsApp**                                       |
| Qualité / CI | `astro check` · ESLint · Prettier · Husky/lint-staged · validateur JSON-LD (GitHub Actions) |

Pas de framework JS additionnel (React/Vue/Svelte). Astro statique pur : hydratation = zéro par défaut.

---

## Prérequis

- **Node.js 20+** (la CI tourne sur Node 20)
- **npm**

---

## Démarrage rapide

**Node 20+ requis** (voir `.nvmrc`).

```bash
git clone git@github.com:Claudeblc/karibteck.git
cd karibteck
npm install        # deps + bootstrap auto (postinstall) : .env, agent skills, husky
npm run verify     # prouve que tout build et passe les gates (check + build + lint + format + JSON-LD)
npm run dev        # http://localhost:4321
```

`npm install` lance `scripts/bootstrap.mjs` (idempotent) qui crée `.env` depuis `.env.example` s'il manque et restaure les agent skills — aucune étape manuelle. Le site fonctionne **sans `.env`** ; les variables `PUBLIC_*` n'activent que le formulaire/Cal/WhatsApp (voir « Variables d'environnement »).

> Un agent (ou la CI) peut amener le projet à un état prouvé fonctionnel avec la seule séquence `npm install && npm run verify`. Le détail du contrat de bootstrap est dans [`CLAUDE.md`](./CLAUDE.md).

---

## Scripts npm

```bash
npm run dev             # serveur de dev — http://localhost:4321
npm run build           # build statique → ./dist
npm run preview         # sert ./dist localement
npm run check           # astro check (TypeScript + diagnostics Astro)
npm run lint            # ESLint
npm run lint:fix        # ESLint --fix
npm run format          # Prettier --write
npm run format:check    # Prettier --check
npm run validate:jsonld # vérifie qu'aucune page du dist n'oublie son JSON-LD Organization (à lancer après build)
npm run verify          # porte de preuve : check + build + lint + format:check + validate:jsonld
npm run bootstrap       # (ré)exécute le setup idempotent (.env, agent skills) — lancé auto au postinstall
```

---

## Structure du projet

```
src/
├─ assets/                 images optimisées (hero…) via astro:assets
├─ components/
│  ├─ atoms/               Button, Tag, Highlight, SectionBadge, JsonLd…
│  ├─ molecules/           ServiceCard, FaqItem, ContactForm, LangToggle, CalButton…
│  └─ organisms/           Nav, Hero, ServicesSection, …, Footer, HomePage, ServiceDetail, LegalPage, BlogLayout
├─ content/blog/{fr,en}/   articles .mdx (paire FR/EN reliée par translationKey)
├─ content.config.ts       schéma Zod de la collection blog
├─ data/                   contenu typé : services, projects, team, faq, pricing, legal, agency…
├─ i18n/
│  ├─ ui.ts                chaînes d'interface FR + EN (symétriques) + map des routes
│  └─ utils.ts             useTranslations, localizePath, alternateUrl…
├─ layouts/                MainLayout.astro (head SEO + hreflang), BlogLayout.astro
├─ lib/                    constants, jsonLd, geo, blog, dates, readingTime
├─ pages/                  routes (FR à la racine, EN sous /en/) + endpoints .txt/.xml
├─ scripts/reveal.ts       animations au scroll + menu mobile (seul JS client)
└─ styles/                 global.css, theme.css (tokens), prose.css (MDX)
scripts/validate-jsonld.mjs  validateur JSON-LD utilisé en CI
```

### Pages générées

`/` (accueil) · `/services/<slug>` (6 services) · `/blog`, `/blog/<slug>`, `/blog/tags/<tag>` · `/mentions-legales`, `/confidentialite`, `/cgv` · `/merci` — et **leur miroir EN sous `/en/`**. Plus les endpoints `robots.txt`, `llms.txt`, `llms-full.txt`, `ai.txt`, `rss.xml`, `sitemap-index.xml`.

---

## Travailler dans le projet

### i18n — règle d'or

**Aucune chaîne d'interface en dur.** Toute chaîne visible passe par `src/i18n/ui.ts`, consommée via `useTranslations(locale)` :

```astro
---
import { useTranslations } from '@/i18n/utils';
const t = useTranslations(locale);
---

<a href={t.path('blog')}>{t('nav.blog')}</a>
```

Une nouvelle clé doit être ajoutée **dans `fr` ET dans `en`** — une garde de type (`_UiSymmetry`) fait échouer le build si les deux dictionnaires divergent.

### Données localisées

Le contenu (services, FAQ, équipe…) vit dans `src/data/*.ts`. Les champs traduisibles utilisent `Localized<T>` (`{ fr, en }`) et chaque module expose un getter `getX(locale)` qui renvoie le contenu résolu :

```ts
export function getServices(locale: Locale): Service[] {
  /* … */
}
```

Les composants présentationnels reçoivent des objets déjà résolus (chaînes simples) — ils ne connaissent pas la locale.

### Ajouter un article de blog

Créer la paire FR/EN sous `src/content/blog/{fr,en}/` avec le **même `translationKey`** :

```yaml
---
title: "Mon titre d'article" # apostrophe en YAML : la doubler, ou utiliser des guillemets doubles
date: 2026-06-10
locale: fr
translationKey: mon-article # identique dans les 2 fichiers
tags: ['seo', 'performance']
excerpt: 'Résumé court pour les listes et le RSS.'
draft: false # true = exclu du build
---
```

Le toggle FR↔EN ne s'affiche sur un article que si sa traduction existe. Un article peut n'exister qu'en une seule langue.

### Ajouter un service

Ajouter une entrée dans `src/data/services.ts` (slug, icône, tags, `title`/`description`/`intro`/`benefits` en `Localized`). La page `/services/<slug>` (FR+EN), la carte sur l'accueil et le JSON-LD `Service` sont générés automatiquement.

### Règles de design

Les couleurs, rayons et polices vivent dans `src/styles/theme.css` (`@theme`). **Aucune couleur en dur** hors de ce fichier — utiliser les tokens (`var(--color-navy)`, `var(--gradient-accent)`, `var(--radius-card)`…).

---

## SEO / GEO

- **JSON-LD** sur chaque page : `Organization`/`ProfessionalService` (NAP + `areaServed` DOM), `Service`, `FAQPage`, `BlogPosting`, `BreadcrumbList` — construits dans `src/lib/jsonLd.ts`.
- **GEO** : `/llms.txt`, `/llms-full.txt`, `/ai.txt`, et un `robots.txt` autorisant explicitement les crawlers IA (GPTBot, ClaudeBot, PerplexityBot…). Générés depuis `src/lib/geo.ts`.
- **Garde-fou** : `npm run validate:jsonld` (exécuté en CI) échoue si une page publique du `dist` n'a pas son JSON-LD `Organization`.
- **hreflang** FR↔EN sur toutes les pages.

---

## Variables d'environnement

Copier `.env.example` → `.env`. Toutes les variables sont préfixées `PUBLIC_` (site statique, aucun secret serveur). Le site fonctionne sans, mais ces valeurs activent les fonctionnalités de contact :

```bash
PUBLIC_WEB3FORMS_KEY=      # clé d'accès Web3Forms — active l'envoi du formulaire de contact
PUBLIC_CALCOM_URL=         # URL de réservation Cal.com — affiche le bouton « Réserver un appel »
PUBLIC_WHATSAPP_NUMBER=    # numéro au format international (chiffres seuls, ex. 590690000000) — affiche le bouton WhatsApp
PUBLIC_PLAUSIBLE_DOMAIN=   # domaine analytics (optionnel)
```

Les boutons Cal et WhatsApp ne s'affichent que si leur variable est définie (dégradation gracieuse).

---

## Données à compléter

Le site est livré avec des **placeholders génériques** à remplacer par les vraies valeurs :

- **Équipe** : noms des ingénieurs (`[Prénom Nom]`) dans `src/data/team.ts`
- **Coordonnées (NAP)** : téléphone / adresse dans `src/data/agency.ts`
- **Entité légale** : raison sociale, SIRET, RCS, hébergeur (`[…]`) dans `src/data/legal.ts`
- **Variables `PUBLIC_`** ci-dessus

---

## Qualité & CI

À chaque push / PR sur `main`, GitHub Actions exécute : `lint` → `format:check` → `check` → `build` → `validate:jsonld`. Tout doit être au vert.

Localement, un hook **pre-commit** (Husky + lint-staged) lance ESLint + Prettier sur les fichiers modifiés.

Conventions clés (détail dans `CLAUDE.md`) : composant Astro ≤ 150 lignes, fonction ≤ 20 lignes, TypeScript strict (0 `any`), pas de logique dans le markup, alias d'import `@/`, commits conventionnels.

---

## Skills de dev (agent skills)

Le projet utilise des **agent skills** partagés (outils d'assistant, ex. audit SEO) gérés par le CLI [`skills`](https://skills.sh/). On suit le **modèle lockfile** : seul **`skills-lock.json`** est versionné (il épingle chaque skill par source + hash d'intégrité). Les fichiers des skills et les liens par agent sont **restaurés localement**, pas commités.

```bash
npx skills experimental_install   # restaure les skills épinglés depuis skills-lock.json
npx skills list                   # liste les skills installés
npx skills check                  # vérifie les mises à jour
npx skills add <owner/repo@skill> # ajoute un skill (met à jour le lock — à committer)
```

Versionné : `skills-lock.json` uniquement.
Ignoré (régénéré par la restauration) : `.agents/`, `.claude/skills/`, `*.local.json`.

> Astuce : pour automatiser la restauration au `npm install`, ajouter `"postinstall": "skills experimental_install || true"` dans `package.json`. Note : les commandes `experimental_*` peuvent évoluer — le `skills-lock.json` reste le contrat stable.

---

## Déploiement

Build statique (`npm run build` → `./dist`) destiné à être servi par **nginx sur un VPS**, via GitHub Actions.

> ⏸️ **Le pipeline de déploiement est en standby** tant que l'infrastructure n'est pas validée. Le build est produit et vérifié en CI ; seule l'étape de publication reste à brancher.
