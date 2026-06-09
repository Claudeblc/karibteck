# Spec de design — Refonte KaribTeck en Astro

**Date** : 2026-06-09
**Statut** : validé en brainstorming, à exécuter
**Domaine** : https://karibteck.com/

---

## 1. Contexte & objectif

KaribTeck est une **agence web aux Antilles/DOM** (Guadeloupe, Martinique, Guyane, Saint-Martin…) montée par **3 ingénieurs**. Le site actuel est un fichier `index.html` monolithique (~1550 lignes, CSS + JS inline), en français, avec les sections : hero, services, techno, processus, pourquoi, réalisations, tarifs, contact.

**Objectif** : transformer ce monolithe en un projet **Astro propre, scalable et maintenable à 3 développeurs**, avec un contenu plus professionnel et une couche **SEO local + GEO IA** solide — en miroir de l'architecture du projet de référence `aymeric.dijoux.dev` (que l'équipe maîtrise).

Le **design visuel actuel est conservé** (il est jugé bon) : on le porte fidèlement, on n'effectue pas de redesign. L'effort porte sur la structure technique, la qualité du contenu, et le SEO/GEO.

---

## 2. Décisions validées

| Sujet             | Décision                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Framework         | **Astro 6**, output **static**, zéro-JS par défaut                                                          |
| Styling           | **Tailwind 4** (`@theme` + CSS vars), **pas de framework UI** (pas de React/shadcn)                         |
| Langage           | **TypeScript strict**                                                                                       |
| Langues           | **Bilingue FR (défaut, sans préfixe) / EN (`/en/`)** + hreflang                                             |
| Contenu dynamique | Astro **Content Collections** + MDX (Zod) pour le blog                                                      |
| Périmètre V1      | **Landing enrichie + pages services dédiées + blog**. Pas d'études de cas/témoignages clients (0 client)    |
| SEO               | **Local** (`ProfessionalService`/`Organization` JSON-LD, NAP, `areaServed` DOM) **+** sitemap               |
| GEO               | **IA** : `llms.txt`, `llms-full.txt`, `ai.txt`, robots IA, graphe JSON-LD d'entités, `FAQPage`              |
| Contact           | **Web3Forms** (statique, honeypot) + **Cal.com** (embed) + **WhatsApp**                                     |
| Déploiement       | Build statique → **VPS** (nginx) via **GitHub Actions** — ⏸️ **en standby** (validation infra à venir)      |
| Collaboration     | ESLint + Prettier + Husky/lint-staged + `astro check` + axe-playwright + Lighthouse CI + validateur JSON-LD |

### Choix de stack écartés

- **shadcn/ui** : écarté. C'est React + Tailwind, donc il impose une hydratation client qui annule l'avantage zéro-JS d'Astro (source des scores Lighthouse Perf ≥95 / SEO 100). Un site marketing n'a pas besoin de React. Option 1 (Astro + Tailwind zéro-JS) retenue.

---

## 3. Positionnement & honnêteté du contenu (0 client)

L'équipe démarre **sans client**. En conséquence :

- **Aucune fausse preuve sociale** : pas de faux témoignages, pas de logos clients inventés, pas de « X clients satisfaits ». Ce serait détecté (humains et IA) et détruirait la crédibilité + le GEO.
- La preuve « clients » est remplacée par de la preuve **« capacité »** :
  - **« Nos projets »** = les apps réelles de l'équipe (reprises du site actuel, voir §6.1).
  - **« Équipe »** = présentation des 3 ingénieurs (atout n°1 d'une agence locale).
  - **« Garanties / engagements »** = devis sous 24h, code propre, perf + SEO inclus, accompagnement.
  - **Chiffres uniquement réels** (années d'XP cumulées, technos maîtrisées).
- **Blog** : levier d'autorité dès le jour 1, sans besoin de clients.
- Les 3 « réalisations » présentes dans `index.html` (e-commerce alimentaire, ERP BTP, app réservation nautique) sont actuellement présentées comme _« projets réalisés pour nos clients »_. Elles sont **reprises mais reformulées** en _« exemples de projets que nous réalisons »_ / démonstration de savoir-faire — jamais présentées comme du travail client livré tant qu'il n'y en a pas.
- **Bascule future** : dès les premiers vrais projets clients, on passe « Nos projets » vers une content collection d'**études de cas** (problème → solution → résultats chiffrés). L'architecture content-collection est prête pour ça dès la V1.

---

## 4. Architecture des dossiers (miroir de la réf)

```
src/
├─ assets/                 logos apps, visuels équipe, og
├─ components/
│  ├─ atoms/               Icon, JsonLd, SectionBadge, Highlight, Button, StatusDot…
│  ├─ molecules/           ServiceCard, ProcessStep, ProjectCard, TeamMember,
│  │                       GuaranteeItem, PricingCard, FAQItem, SocialLink,
│  │                       StackGroup, LangToggle, WhatsAppButton, CalEmbed
│  ├─ organisms/           Nav, Hero, ServicesSection, StackSection, ProcessSection,
│  │                       WhySection, ProjectsSection, TeamSection, GuaranteesSection,
│  │                       PricingSection, FaqSection, ContactSection, Footer
│  └─ prose/               Callout, FileBlock… (composants MDX du blog)
├─ content/
│  └─ blog/
│     ├─ fr/               articles FR (.mdx)
│     └─ en/               articles EN (.mdx)
├─ content.config.ts       schema Zod de la collection blog
├─ data/                   agency.ts, services.ts, projects.ts, team.ts,
│                          guarantees.ts, pricing.ts, faq.ts, stack.ts, socialLinks.ts
├─ i18n/
│  ├─ ui.ts                strings UI bilingues (FR/EN)
│  └─ utils.ts             getLocale(), localizePath(), useTranslations()
├─ layouts/
│  ├─ MainLayout.astro     <head> SEO + nav + footer + skip-link
│  └─ BlogLayout.astro     layout article
├─ lib/
│  ├─ constants.ts         SITE_URL, locales, NAP, WhatsApp, Cal URL…
│  ├─ dates.ts
│  ├─ readingTime.ts
│  ├─ blog.ts              load/filter/sort des articles
│  ├─ jsonLd.ts            builders schema.org
│  ├─ geo.ts               génération llms.txt / ai.txt / robots.txt
│  └─ ogImage.ts           génération OG via Satori (optionnel V1.1)
├─ pages/
│  ├─ index.astro          home FR
│  ├─ a-propos.astro       équipe FR
│  ├─ services/[slug].astro pages services FR
│  ├─ blog/                index, [slug], tags/[tag]
│  ├─ mentions-legales.astro, confidentialite.astro, cgv.astro
│  ├─ robots.txt.ts        allow crawlers IA + lien sitemap
│  ├─ llms.txt.ts          résumé GEO
│  ├─ llms-full.txt.ts     GEO exhaustif
│  ├─ ai.txt.ts            politique d'usage IA
│  ├─ rss.xml.ts           RSS blog FR
│  ├─ 404.astro
│  └─ en/                  miroir EN (slugs traduits : about, services, blog, legal…) + en/rss.xml.ts
├─ styles/
│  ├─ global.css           reset, base, directives Tailwind
│  ├─ theme.css            @theme Tailwind 4 (tokens KaribTeck)
│  └─ prose.css            typographie MDX du blog
└─ types/                  interfaces partagées (Locale, Service, Project, TeamMember…)
public/
├─ CNAME ou config nginx   karibteck.com
└─ favicons, robots assets statiques
scripts/
└─ validate-jsonld.mjs     vérifie le JSON-LD sur chaque page du dist/
```

---

## 5. Design system (porté depuis `index.html`)

Tokens extraits de `index.html` et centralisés dans `src/styles/theme.css` (`@theme`) :

```
--navy:   #050d1f   (fond principal)
--navy2:  #0a1628    --navy3: #0f1e38
--blue1:  #0057e7    --blue2: #0099ff    --cyan: #00d4ff
--white:  #ffffff    --gray: #8a9bb5     --gray2: #1a2d4a
--accent: linear-gradient(135deg, #0057e7, #00d4ff)
--radius: 12px       --radius-lg: 20px
Fonts: Inter (corps), Space Grotesk (titres) — self-hosted via @fontsource
```

Règles : aucune couleur/taille en dur hors `theme.css`. Fonts self-hostées (`@fontsource-variable`) au lieu du `<link>` Google Fonts (perf + RGPD). Animations « fade-up » au scroll portées en CSS + petit `<script>` `IntersectionObserver` (respect `prefers-reduced-motion`).

---

## 6. Contenu des pages

### 6.1 Landing `/` (sections, dans l'ordre)

1. **Hero** — accroche + double CTA (devis / RDV).
2. **Services** — aperçu des 5 services (sites web, apps mobiles, logiciels métier, e-commerce, IA), chaque carte liée à sa page dédiée.
3. **Stack / Techno** — technologies maîtrisées (preuve de capacité).
4. **Processus** — méthode en étapes (déjà dans le site).
5. **Pourquoi KaribTeck** — ancrage Antilles + standards internationaux.
6. **Nos projets** — les apps réelles de l'équipe, reprises du site (reformulées, voir §3) : E-Commerce (distribution alimentaire), Logiciel métier (ERP BTP), Application mobile (réservation activités nautiques). Présentées comme exemples de savoir-faire.
7. **Équipe** — les 3 ingénieurs (**noms en placeholder** : `[Ingénieur 1/2/3]`, rôle, expertise).
8. **Garanties / engagements** — devis 24h, code propre, perf + SEO, accompagnement.
9. **Tarifs** — 3 offres reprises du site (Starter ~990€, Business ~2 900€, Entreprise sur devis).
10. **FAQ** — questions structurées (alimente `FAQPage` JSON-LD).
11. **Contact** — formulaire Web3Forms + Cal.com + WhatsApp + email `contact@karibteck.com`.

### 6.2 Pages services `/services/[slug]`

Une page par service, générée depuis `data/services.ts`. Contenu : description, bénéfices, process, exemples, CTA. Cible le SEO local (« création site web Guadeloupe », « application mobile Martinique »…). `Service` JSON-LD par page.

### 6.3 Blog `/blog`, `/blog/[slug]`, `/blog/tags/[tag]`

Content collection MDX bilingue (`content/blog/{fr,en}`), frontmatter Zod-validé (`title, date, locale, translationKey, tags, excerpt, draft`). Paire FR↔EN via `translationKey`. `BlogPosting` JSON-LD + RSS.

### 6.4 Pages légales

`mentions-legales`, `confidentialite` (RGPD), `cgv` — actuellement liens morts (`#`) dans le footer. À créer (gabarits simples) pour le sérieux et la conformité.

### 6.5 Miroir EN

Toutes les routes ci-dessus sous `/en/` avec slugs traduits (`about`, `services`, `blog`, `legal-notice`…). hreflang sur chaque page.

---

## 7. Modèle de données & i18n

- **`data/*.ts`** : sources de vérité typées (agency/NAP, services, projects, team, guarantees, pricing, faq, stack, socialLinks). Aucune donnée en dur dans les composants.
- **`i18n/ui.ts`** : toutes les strings UI en FR + EN. Aucune string UI hardcodée dans les composants → toujours `useTranslations(locale)`.
- **`i18n/utils.ts`** : `localizePath()`, `useTranslations()`, locale courante. Liens internes toujours via `localizePath` / `t.path` — jamais de href hardcodé.

---

## 8. SEO local + GEO IA

### 8.1 SEO local (géographique)

- **NAP** centralisé (`data/agency.ts` / `lib/constants.ts`) : nom, adresse, téléphone, email.
- **JSON-LD `ProfessionalService`** (+ `Organization`) avec `@id` canonique, `areaServed` (Guadeloupe, Martinique, Guyane, Saint-Martin, Saint-Barthélemy), `address`, `geo`, `telephone`, `email`, `url`, `sameAs` (réseaux sociaux).
- **`Service`** JSON-LD sur chaque page service.
- **`BreadcrumbList`** sur les pages navigables ; **hreflang** FR↔EN partout.
- Sitemap via `@astrojs/sitemap`.

### 8.2 GEO (moteurs IA)

- **`/llms.txt`** (résumé structuré, llmstxt.org) + **`/llms-full.txt`** (exhaustif) + **`/ai.txt`** (politique).
- **`/robots.txt`** autorisant explicitement `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`… + lien sitemap.
- **`FAQPage`** JSON-LD (repris par les IA / AI Overviews), **`BlogPosting`** par article.
- **Validateur CI** (`scripts/validate-jsonld.mjs`) : aucune page publique ne ship sans son `Organization`/`ProfessionalService` JSON-LD.

---

## 9. Contact (statique)

- **Formulaire** : POST vers **Web3Forms** (clé publique d'accès, pas de serveur), champ **honeypot** anti-spam, page/section de confirmation. Champs repris du site (prénom, nom, email, téléphone, entreprise, message).
- **Cal.com** : embed pour prise de RDV (URL en `PUBLIC_CALCOM_URL`).
- **WhatsApp** : lien `https://wa.me/<numéro>` (incontournable DOM).
- Aucune clé serveur côté client (`output: static`).

---

## 10. Qualité, conventions & collaboration (3 devs)

Reprend les **règles clean-code non négociables** du projet de référence (à inscrire dans le `CLAUDE.md`) :

1. Composant Astro ≤ 150 lignes, `.ts` ≤ 120 ; page = composition (< 80 l).
2. Fonction ≤ 20 lignes, responsabilité unique.
3. Nommage explicite (booléens `is/has/can`, constantes `SCREAMING_SNAKE_CASE`).
4. Structure imposée des composants Astro (imports → props typées → logique build → markup → styles).
5. TypeScript strict : 0 `any`, 0 cast non justifié, union types, types dans `types/`, schemas Zod dans `content.config.ts`.
6. Pas de couleur/taille en dur hors `theme.css`.
7. Pas de logique dans le markup (filtres/tris/maps → `lib/`).
8. Imports ordonnés + alias `@/`.
9. Pas de magic numbers (→ `lib/constants.ts`).
10. Un fichier = une responsabilité (pas de `helpers.ts`/`Misc.astro`).
11. `npm run build` : 0 erreur, 0 warning.

**Conventions projet** : i18n via `useTranslations` ; liens internes via `localizePath` ; liens externes `rel="noopener noreferrer"` ; images via `astro:assets` ; chaque page un `<SeoHead>` avec JSON-LD ; a11y (skip-link, focus-visible, landmarks, `prefers-reduced-motion`, un seul `<h1>`).

**Git** : conventional commits, branches `feat/fix/chore/docs/refactor`, PR → `main`, CI verte obligatoire, squash & merge.

---

## 11. Tests & budgets

| Niveau | Quoi          | Outil                                                         |
| ------ | ------------- | ------------------------------------------------------------- |
| 1      | Build & types | `astro check` + `astro build`                                 |
| 2      | A11y          | `@axe-core/playwright` sur routes critiques (FR + EN)         |
| 3      | Perf          | Lighthouse CI — **Perf ≥ 95, A11y = 100, BP ≥ 95, SEO = 100** |
| 4      | JSON-LD       | `scripts/validate-jsonld.mjs` sur `dist/`                     |

Pas de tests unitaires sur les composants. Logique pure dans `lib/` testable (Vitest) si elle devient non triviale (ex : filtre/tri blog).

---

## 12. Déploiement (VPS) — ⏸️ EN STANDBY

> La mécanique de déploiement est **gelée** tant que l'infra (VPS) n'est pas validée côté équipe. Le build statique (`dist/`) reste produit et vérifié en CI ; seule l'étape de publication sur le VPS est différée. La cible ci-dessous est la proposition par défaut, à confirmer.

- **GitHub Actions** sur push `main` : install → `astro check` + lint → `astro build` → lighthouse/axe/jsonld → **déploiement sur le VPS** (rsync/ssh du `dist/`), **nginx** sert les fichiers statiques.
- Secrets CI : hôte/clé SSH du VPS. Domaine `karibteck.com` (TLS via Let's Encrypt sur le VPS).
- `.env` : `PUBLIC_CALCOM_URL`, `PUBLIC_WEB3FORMS_KEY`, `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_PLAUSIBLE_DOMAIN` (analytics optionnel). Variables `PUBLIC_` uniquement (statique).

---

## 13. Livraison par phases

- **Phase 0 — Scaffold** : projet Astro 6 + Tailwind 4 + TS, tooling (ESLint/Prettier/Husky/lint-staged), CI de base, **`CLAUDE.md`** miroir de la réf (1er livrable), `tsconfig` alias `@/`.
- **Phase 1 — Design system + landing FR** : tokens depuis `index.html`, `MainLayout`, Nav, Footer, port de toutes les sections de la landing en organisms/molecules. `index.html` legacy supprimé une fois la parité atteinte.
- **Phase 2 — i18n + miroir EN** : `i18n/`, toutes les strings, routes `/en/`, hreflang, LangToggle.
- **Phase 3 — SEO local + GEO** : `jsonLd.ts`, `<SeoHead>`, `ProfessionalService`/`Organization`/`FAQPage`, sitemap, `robots/llms/llms-full/ai.txt`, validateur CI.
- **Phase 4 — Pages services** : `data/services.ts` + `services/[slug]`, `Service` JSON-LD.
- **Phase 5 — Blog** : content collection + `BlogLayout`, index/[slug]/tags, RSS, `BlogPosting`.
- **Phase 6 — Contact + légales** : Web3Forms, Cal embed, WhatsApp, pages légales.
- **Phase 7 — Déploiement VPS** : ⏸️ **en standby** — pipeline GitHub Actions → VPS + nginx, à débloquer une fois l'infra validée.

---

## 14. Données à fournir (placeholders en attendant)

- **Noms / rôles des 3 ingénieurs** → placeholders `[Ingénieur 1/2/3]` jusqu'à fourniture.
- **NAP** : adresse postale + numéro de téléphone (email `contact@karibteck.com` connu ; WhatsApp = ce numéro ?).
- **Cal.com** : URL publique de réservation.
- **Web3Forms** : clé d'accès publique.
- **Réseaux sociaux** : URLs LinkedIn / Instagram / Facebook / WhatsApp (placeholders `#` actuellement).
- **Apps « Nos projets »** : reprises du site (3 projets) — préciser si liens/visuels réels disponibles.

---

## 15. Hors périmètre V1

- Études de cas / témoignages / logos clients (jusqu'aux premiers vrais clients).
- Pages services au-delà des 5 définis.
- Newsletter / capture email.
- CMS externe (Content Collections suffit).
- Créole antillais (archi i18n prête, ajout ultérieur possible).
- Endpoint serveur dédié pour le formulaire (Web3Forms suffit ; un endpoint VPS reste une option future).
- Tests unitaires/E2E des composants (Playwright sert uniquement à axe-core).

```

```
