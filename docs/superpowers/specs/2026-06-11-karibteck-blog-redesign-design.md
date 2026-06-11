# Spec de design — Refonte page Blog + nouveaux articles

**Date** : 2026-06-11
**Statut** : validé en brainstorming, à exécuter
**Branche** : `feat/astro-refonte`
**Source** : maquette Stitch `/Users/aymeric/Downloads/stitch_antilles_digital_agency 2/` (page blog « Insights & Innovation »). Système visuel Maritime Professional déjà en place + patterns Stitch (PageHero, CtaBand, BentoGrid).

---

## 1. Objectif

Aligner la page index `/blog` sur la maquette Stitch (hero · article à la une · grille de cartes à couverture · bande de fin) et **remplir le blog** avec 6 nouveaux articles bilingues (le blog n'en a que 2). Re-skin + contenu, sans toucher au reste du site.

Honnêteté : **pas de fausses photos** (couvertures en dégradé déterministe), **pas de newsletter** (V1 — remplacée par la `CtaBand`), auteur = l'agence (avatar initiales). Articles factuels et non-promotionnels.

---

## 2. Décisions validées

| Sujet | Décision |
|---|---|
| Page /blog | Refonte façon maquette : Hero · Article à la une · Articles récents (grille) · CtaBand |
| Couvertures | **Dégradé déterministe** (par tag/titre) + label catégorie — pas d'images réelles/fausses |
| Newsletter | **Non** (V1) — la bande « Restez informés » est remplacée par `CtaBand` |
| Auteur | « L'équipe Karib Teck », avatar initiales (pas de photo) |
| Nouveaux articles | **6** (FR+EN), je rédige ; +2 existants = 8 au total |
| Pages d'articles `/blog/[slug]` | **Inchangées** (prose actuelle) — couverture éventuelle plus tard |

---

## 3. Page `/blog` (FR + EN)

Composition (réutilise `loadPosts(locale)`/`entrySlug`/`findTranslation` existants) :
1. **Hero** — `PageHero` (deep-ocean) : badge `blog.hero.badge` (« Le blog »), titre `blog.hero.title.*` (« Idées & Innovation »), sous-titre.
2. **Article à la une** — `FeaturedArticle.astro` : le post le plus récent, bloc 2 colonnes (→ 1 col mobile) : `ArticleCover` (dégradé + catégorie) à gauche, carte blanche à droite (catégorie · `<h2>` titre · extrait · auteur initiales · date · temps de lecture · lien « Lire l'article » → post).
3. **Articles récents** — `SectionHeader` (`blog.recent.*`) + grille 3 colonnes (→ 1 col mobile) des **autres** posts en `ArticleCard` enrichi (couverture en haut + catégorie · titre · extrait · date · lecture). S'il ne reste qu'un post, la grille s'adapte.
4. **`CtaBand`** (à la place de la newsletter).
5. `Footer`.

EN miroir `/en/blog/` identique avec `locale='en'`.

---

## 4. Composants

- **`ArticleCover.astro`** (molecule) — vignette couverture : fond `--gradient-accent` OU dégradé déterministe choisi dans un petit set Maritime selon un hash de `translationKey` (variété sans alourdir), + un label catégorie (premier tag) en chip, + une icône lucide optionnelle. Aucune image. Props `{ tag?: string; seed: string; size?: 'lg'|'sm' }`.
- **`FeaturedArticle.astro`** (organism) — le bloc 2 colonnes de l'article à la une. Props `{ entry, slug, locale, readingMinutes }`.
- **`ArticleCard.astro`** (molecule, existant) — **enrichi** : ajoute `ArticleCover` en tête de carte (la carte reste flottante : bordure `surface-gray` + ombre douce). Utilisé sur l'index ET les pages tags → les tags en profitent.
- **`/blog/index.astro`** + `/en/blog/index.astro` — recomposés (PageHero · FeaturedArticle · grille · CtaBand). Le reste (`/blog/[slug]`, `/blog/tags/[tag]`, RSS) inchangé sauf l'`ArticleCard` enrichi.
- **i18n** : `blog.hero.badge/title.lead/title.hl/sub`, `blog.recent.badge/title.lead/title.hl`, `blog.featuredLabel` (« À la une »), `blog.by` (« Par »), `blog.author` (« L'équipe Karib Teck ») — FR+EN symétriques. (`blog.readingTime`/`backToBlog` existent déjà.)

---

## 5. Nouveaux articles (6 paires FR/EN)

Sous `src/content/blog/{fr,en}/`, chaque paire reliée par un `translationKey` commun, frontmatter Zod complet (`title, date, locale, translationKey, tags, excerpt, draft:false`). Dates échelonnées (literals, pas de `Date.now()`). Contenu **factuel, non-promotionnel, sans fausse preuve**, ~3-5 sections `##`, ton expert et concret (pas de remplissage IA, tirets cadratins modérés).

1. **App mobile pour son commerce aux DOM** — tags `[mobile, business]` — quand une app a du sens vs un bon site mobile, coûts, exemples locaux.
2. **Core Web Vitals & performance** — tags `[performance, seo]` — LCP/INP/CLS, pourquoi la vitesse convertit, surtout en 4G aux Antilles.
3. **L'IA pour les PME antillaises** — tags `[ia, business]` — cas d'usage concrets (chatbot, automatisation, analyse), où l'IA apporte/n'apporte pas de valeur.
4. **Lancer son e-commerce aux DOM** — tags `[e-commerce, business]` — logistique, paiement, livraison locale, plateformes.
5. **Réussir son cahier des charges web** — tags `[methode, business]` — comment préparer un projet, questions à se poser, pièges.
6. **Sécurité & maintenance d'un site** — tags `[securite, maintenance]` — mises à jour, sauvegardes, SSL, pourquoi la maintenance compte.

> Tags : réutiliser/étendre le set existant (`seo, performance, mobile, business` déjà utilisés). Les nouveaux tags (`ia, e-commerce, methode, securite, maintenance`) créent des pages `/blog/tags/<tag>` automatiquement (content collection). Vérifier que les pages tags rendent bien avec le nouvel `ArticleCard`.

---

## 6. Périmètre / hors périmètre

**Dans le périmètre** : refonte `/blog` index (composants ci-dessus), `ArticleCard` enrichi (couverture), 6 articles FR+EN, i18n, bilingue + hreflang, RSS (intègre auto les nouveaux posts).

**Hors périmètre** : refonte des pages d'articles `/blog/[slug]` (prose conservée) ; vraies images de couverture ; newsletter ; nouveau contenu hors blog. JSON-LD : `BlogPosting` par article + Organization déjà gérés — les nouveaux posts en héritent ; vérifier `validate-jsonld`.

---

## 7. Livraison par phases (pour le plan)

- **A — Composants** : `ArticleCover`, `FeaturedArticle`, `ArticleCard` enrichi + i18n. (vérifiable sur l'index existant)
- **B — Page /blog** : recompose index FR+EN (PageHero · FeaturedArticle · grille · CtaBand).
- **C — Articles** : 6 paires MDX FR/EN (contenu rédigé).
- **D — QA** : build (pages +12 articles + nouvelles pages tags), `validate-jsonld`, RSS, hreflang, honnêteté grep, QA visuelle FR+EN vs maquette + responsive (grille → 1 col, featured → 1 col).

---

## 8. Risques

- **Couvertures dégradé** : doivent rester lisibles et variées (label catégorie contrasté). Déterminisme via hash du `translationKey` (pas de `Math.random`).
- **Article à la une vs grille** : éviter de dupliquer le post à la une dans la grille (la grille = `loadPosts` sauf le premier).
- **Volume tags** : nouveaux tags → nouvelles pages tags (compte de pages augmente) ; OK, vérifier rendu.
- **Honnêteté** : articles sans fausse preuve ni promesse client inventée ; auteur = agence.
