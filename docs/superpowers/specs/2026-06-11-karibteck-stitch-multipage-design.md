# Spec de design — Refonte multi-pages « Stitch »

**Date** : 2026-06-11
**Statut** : validé en brainstorming, à exécuter
**Branche** : `feat/astro-refonte` (continuité, commits `feat(design)`)
**Source** : maquettes Stitch dans `/Users/aymeric/Downloads/stitch_antilles_digital_agency/` — un dossier par page : `accueil`, `nos_services`, `propos` (à propos), `contact`. Système visuel « Maritime Professional » déjà adopté (couleurs/polices/cartes).

---

## 1. Objectif

Aligner l'**architecture de l'information et les layouts** de KaribTeck sur les maquettes Stitch. Le re-skin précédent a changé couleurs/polices/cartes mais **pas la structure** : on a une longue landing à ancres + grilles 3-colonnes uniformes, là où Stitch est un **site multi-pages** avec des layouts riches (grilles bento, cartes sombres d'accent, blocs stats, accents orange, bande CTA, contact 2 colonnes + calendrier).

On passe donc à une structure **multi-pages** : Accueil allégé + vraies pages `/services`, `/a-propos`, `/contact`, chacune calquée sur sa maquette. L'identité visuelle (tokens Maritime, Sora/Jakarta/Hanken, cartes flottantes radius 0.75rem) ne change pas — on l'applique à de **nouveaux layouts**.

Honnêteté préservée : **aucun chiffre fabriqué** (la maquette Contact affiche « 120+ transformations / Presence in 4 Territories » → remplacé par des données réelles : zones desservies, engagements). Avatars équipe = initiales placeholder (pas de fausses photos).

---

## 2. Décisions validées

| Sujet | Décision |
|---|---|
| Structure | **Multi-pages** : `/` allégé + `/services` + `/a-propos` + `/contact` (vraies pages) |
| Menu | **Services · À propos · Blog · Contact** + bouton **Devis** + toggle EN (liens vers pages, plus d'ancres) |
| Tarifs | Section sur **/services** |
| FAQ | Section sur **/contact** |
| Garanties (engagements) | Section sur **/a-propos** |
| Réalisations / projets | Section sur **/** (accueil) et **/services** |
| Blog | Inchangé (`/blog` = « Insights ») |
| Identité visuelle | Inchangée (Maritime Professional) — appliquée aux nouveaux layouts |

---

## 3. Nouveaux patterns / composants partagés

Le cœur du « look Stitch ». À créer dans `src/components/`.

- **`BentoGrid`** (layout) : grille asymétrique de cartes de tailles mixtes (`grid-template-columns` 12 colonnes, cartes en `col-span` variés), responsive → 1 colonne mobile.
- **`ExpertiseCard`** avec variantes : `light` (carte blanche standard), **`dark`** (fond `--color-primary`/deep-ocean, texte clair — la carte d'accent intercalée), **`stat`** (grand chiffre `--font-display` + label).
- **`AccentBlock`** : bloc carré coloré — variante **`teal`** (`--color-teal`, texte clair) et **`sunset`** (`--color-sunset` fond, texte `--color-primary`). Utilisé dans « Pourquoi » et la bande contact.
- **`CtaBand`** (organism) : bande pleine largeur deep-ocean en fin de page — titre + sous-titre + bouton Devis. Réutilisée sur toutes les pages avant le footer.
- **`ContactInfoCard`** (molecule) : carte info (icône + titre + contenu) — bureau/NAP, email, RDV.
- **`CalEmbed`** (molecule) : embed Cal.com (script officiel `client:load` OU iframe ; activé par `PUBLIC_CALCOM_URL`, dégradation gracieuse en bouton-lien si vide).
- **`BudgetChips`** (molecule) : groupe de chips de fourchette budget (`< 1k€` / `1–3k€` / `3–10k€` / `> 10k€`) — champ radio stylé en chips, soumis avec le formulaire Web3Forms.
- **`SectionDark`** (helper) : variante sombre de shell de section (pour les sections deep-ocean intercalées).

Les composants existants (`ServiceCard`, `ProjectCard`, `PricingCard`, `TeamMemberCard`, `GuaranteeItem`, `FaqItem`, `StatCard`, `WhyPoint`) sont **réutilisés** et recomposés dans les nouveaux layouts ; restyle léger si besoin (intégration bento).

---

## 4. Pages (FR + EN)

> Chaque page : `MainLayout` (hero compris) + sections + `CtaBand` + `Footer`. Toutes bilingues (hreflang), JSON-LD adapté (voir §6). Hero = bande deep-ocean (sauf contact, hero clair possible).

### 4.1 `/` Accueil (maquette `accueil`, allégé ~5 sections)
1. **Hero** deep-ocean : titre + image + badge stat honnête (« 100% sur-mesure »).
2. **Notre Expertise** — `BentoGrid` de 3-4 `ExpertiseCard` dont **1 carte sombre** (ex. « Excellence technique »). Contenu issu des points `why.ts`.
3. **Nos Services** — 3 `ServiceCard` (aperçu) + lien « Tous nos services » → `/services`.
4. **Nos projets** — `ProjectsSection` (vos apps, reformulées).
5. **Pourquoi KaribTeck** — `StatCard` honnêtes + `AccentBlock` teal/sunset.
6. **`CtaBand`**.

### 4.2 `/services` (maquette `nos_services`)
1. **Hero** deep-ocean (« Des solutions adaptées à vos ambitions »).
2. **Strategic Solutions** — `BentoGrid` des **6 services** (tailles mixtes, une carte avec stat), chaque carte → `/services/[slug]` (pages détail existantes, restylées).
3. **Notre méthode** — `ProcessSection` (5 étapes).
4. **Réalisations** — `ProjectsSection`.
5. **Tarifs** — `PricingSection` (3 offres).
6. **`CtaBand`**.
+ pages détail `/services/[slug]` conservées (restylées au nouveau langage).

### 4.3 `/a-propos` (maquette `propos`) — page NOUVELLE
1. **Hero** deep-ocean (« Notre vision pour les Antilles » + stats honnêtes).
2. **Nos standards techniques** — `BentoGrid`/3 `ExpertiseCard` dont 1 sombre (technos maîtrisées, exigence qualité). Reprend `stack.ts` + points techniques.
3. **Nos engagements** — `GuaranteesSection` (les garanties).
4. **Notre ancrage local** — bloc image + points (`WhySection`-like) avec `AccentBlock`.
5. **L'équipe** — `TeamSection` (vous 3, avatars initiales placeholder).
6. **`CtaBand`**.

### 4.4 `/contact` (maquette `contact`) — page NOUVELLE
1. **Hero** (« Parlons de votre projet »).
2. **2 colonnes** : GAUCHE = `ContactForm` « Démarrer un projet » (+ `BudgetChips`) ; DROITE = `ContactInfoCard` ×3 (bureau/NAP, email, **RDV `CalEmbed`**).
3. **FAQ** — `FaqSection`.
4. **Bande « Excellence locale »** (honnête) : `StatCard`/blocs avec **zones desservies réelles** (Guadeloupe, Martinique, Guyane, Saint-Martin, Saint-Barthélemy) + `AccentBlock` (support FR/EN, code propre & maintenable…) — **PAS** de « 120+ » inventé.
4. **Footer**.

---

## 5. Navigation & routes

- `routes` (dans `i18n/ui.ts`) : ajouter `services` (`/services/` · `/en/services/`), `about` (`/a-propos/` · `/en/about/`), `contact` (`/contact/` · `/en/contact/`). `home`, `blog`, légales, `thankYou` inchangés.
- `NAV_LINKS` → **liens de pages** (plus d'ancres) : Services (`/services`), À propos (`/a-propos`), Blog (`/blog`), Contact (`/contact`). Le bouton Devis pointe vers `/contact`.
- Pages à créer : `src/pages/services/index.astro` + `/en/services/index.astro` ; `src/pages/a-propos.astro` + `/en/about.astro` ; `src/pages/contact.astro` + `/en/contact.astro`. (Les `/services/[slug]` existent déjà.)
- Footer : liens mis à jour vers les pages réelles.

---

## 6. SEO / contenu / transverse

- **Bilingue FR/EN** sur chaque nouvelle page, hreflang via `localizedPaths` (mécanique existante).
- **JSON-LD par page** (`lib/jsonLd.ts`) : `Organization`/`ProfessionalService` global partout (validateur) ; `Service` graph sur `/services` + `/services/[slug]` ; `AboutPage` + `Organization` sur `/a-propos` ; `ContactPage` + `LocalBusiness` (NAP, `areaServed`) sur `/contact` ; `FAQPage` (FAQ déplacée sur /contact). Sitemap auto + `validate-jsonld` doit rester vert.
- **Contenu réutilisé** : on ne réécrit pas le contenu (services, projets, équipe, garanties, tarifs, faq, why, stack) — on le **recompose** dans les nouveaux layouts. Pas de changement de `data/` sauf ajustements de structure (ex. flag « featured/size » pour le bento, fourchettes budget).
- **Honnêteté** : aucune métrique fabriquée ; zones desservies réelles ; avatars initiales ; engagements concrets.
- **i18n** : nouvelles strings (titres de sections bento, CTA band, labels contact, chips budget) ajoutées dans `ui.ts` (FR+EN symétriques).

---

## 7. Périmètre / hors périmètre

**Dans le périmètre** : patterns partagés (§3), 4 pages (§4), nav/routes multi-pages (§5), JSON-LD par page (§6), restyle léger des cartes pour le bento. Honnêteté.

**Hors périmètre** : réécriture du contenu textuel (on recompose l'existant) ; nouveau mode sombre ; refonte du blog (`/blog` inchangé) ; vraies photos d'équipe (initiales) ; vraies données NAP/clés (placeholders) ; wiring backend du formulaire au-delà de Web3Forms existant. Le Cal.com s'active via env (dégradation gracieuse).

---

## 8. Livraison par phases (pour le plan)

- **A — Patterns partagés** : `BentoGrid`, `ExpertiseCard` (light/dark/stat), `AccentBlock` (teal/sunset), `CtaBand`, `ContactInfoCard`, `CalEmbed`, `BudgetChips` + routes (`services`/`about`/`contact`) + nav multi-pages + i18n strings.
- **B — Accueil** allégé (recompose home en ~5 sections + bento Expertise + CtaBand).
- **C — `/services`** (bento Solutions + méthode + réalisations + tarifs + CtaBand) + restyle `/services/[slug]`.
- **D — `/a-propos`** (standards + engagements + ancrage local + équipe + CtaBand).
- **E — `/contact`** (2-col form+chips+infos+Cal + FAQ + bande locale honnête).
- **F — SEO & QA** : JSON-LD par page (AboutPage/ContactPage/Service), hreflang, sitemap, `validate-jsonld` vert, QA visuelle FR+EN vs maquettes, gate complète.

Chaque phase finit par un build vert + `validate-jsonld` (toutes pages avec Organization JSON-LD) + aucune régression de contenu.

---

## 9. Risques

- **Volume** : 4 pages + ~8 nouveaux composants. Mitigation : phases isolées (A patterns d'abord, puis une page par phase), réutilisation maximale des organisms existants.
- **Bento responsive** : les grilles asymétriques doivent retomber proprement en 1 colonne mobile — tester chaque page.
- **Migration de contenu** : risque de perdre une section en recomposant la home. Mitigation : checklist de mapping (chaque section actuelle → sa nouvelle page) ; `validate-jsonld` + grep honnêteté à chaque phase.
- **Cal.com** : embed client = un peu de JS (îlot) ; garder zéro-JS ailleurs ; dégradation gracieuse si pas de clé.
- **Honnêteté** : ne pas reprendre les « 120+ » / portraits de la maquette — contenu honnête imposé (§6).
