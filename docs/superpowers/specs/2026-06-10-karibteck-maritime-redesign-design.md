# Spec de design — Refonte visuelle « Maritime Professional »

**Date** : 2026-06-10
**Statut** : validé en brainstorming, à exécuter
**Branche** : `feat/astro-refonte` (continuité du chantier, commits `feat(design)`)
**Source** : design system Stitch dans `/Users/aymeric/Downloads/stitch_antilles_digital_agency/` (`DESIGN (2).md` + pages d'exemple accueil/services/à-propos/contact).

---

## 1. Objectif

Remplacer l'identité visuelle actuelle (tout sombre, navy/cyan, Inter + Space Grotesk) par le design system **« Maritime Professional »** de Stitch : **Corporate Modern + Minimaliste**, thème **clair** avec bandes deep-ocean, palette teal/sunset, polices Sora / Plus Jakarta Sans / Hanken Grotesk, ombres bleutées douces.

**Re-skin de la couche visuelle uniquement.** L'architecture (composants atomic, `data/`, i18n, routing, SEO/JSON-LD/GEO) **ne change pas**. On ne touche qu'aux tokens (`theme.css`), aux styles scopés des composants, et aux polices. Aucun changement de contenu, de structure de page, de clés i18n, ni de balisage SEO.

**Light-only** : pas de toggle sombre en V1. Les tokens sont structurés pour permettre l'ajout d'un mode sombre plus tard (M3 fournit les rôles `inverse-*`), mais hors périmètre.

---

## 2. Décisions validées

| Sujet | Décision |
|---|---|
| Ampleur | Refonte visuelle **complète**, **toutes les pages** |
| Thème | **Clair** (base `#f8f9fa`) + bandes **deep-ocean** (hero, footer) |
| Palette | Deep Ocean `#001f34`/`#051923` · Caribbean Teal `#007EA7` (actions) · Sunset Warmth `#FFBF69` (accents rares) · surface-gray `#E9ECEF` |
| Polices | **Sora** (titres) · **Plus Jakarta Sans** (corps) · **Hanken Grotesk** (labels/nav), self-hosted `@fontsource-variable`. Retrait d'Inter + Space Grotesk |
| Icônes | **Conservées** : lucide + simple-icons (pas les Material Symbols de Stitch) |
| Mode sombre | **Non** (light-only V1) |
| Périmètre | Couche visuelle uniquement — 0 changement structure/contenu/i18n/SEO |

---

## 3. Tokens (`src/styles/theme.css`, `@theme` Tailwind 4)

On remplace les tokens navy/cyan actuels par un sous-ensemble propre de Maritime Professional (pas les 50 rôles M3 — YAGNI). Noms conservés autant que possible pour limiter le churn des composants ; sinon, on adapte les composants.

```
/* Surfaces (clair) */
--color-surface:        #f8f9fa   /* fond de page */
--color-surface-card:   #ffffff   /* cartes */
--color-surface-alt:    #f3f4f5   /* sections alternées */
--color-surface-gray:   #e9ecef   /* inputs, fonds doux */
/* Deep ocean (bandes sombres + texte) */
--color-deep-ocean:     #051923   /* bande la plus foncée (footer/CTA) */
--color-primary:        #001f34   /* hero, titres forts */
--color-primary-container: #003554
/* Texte */
--color-on-surface:     #191c1d   /* corps */
--color-on-surface-variant: #42474d /* texte atténué */
--color-on-primary:     #ffffff   /* texte sur bandes sombres */
--color-on-primary-variant: #779ec2 /* texte atténué sur sombre */
/* Accents */
--color-teal:           #007ea7   /* action principale, liens */
--color-teal-bright:    #3dbeff   /* hover/illustration */
--color-sunset:         #ffbf69   /* accent rare (badges, chips prio) */
/* Lignes */
--color-outline:        #72787e
--color-outline-variant: #c2c7ce  /* bordures de cartes */
/* Rayons */
--radius-sm: 0.25rem  --radius-card: 0.5rem  --radius-lg: 1.5rem  --radius-pill: 9999px
/* Polices */
--font-display: 'Sora Variable', sans-serif
--font-body:    'Plus Jakarta Sans Variable', sans-serif
--font-label:   'Hanken Grotesk Variable', sans-serif
```

Hors `@theme` (`:root`), pour les usages non-utilitaires :
```
--shadow-card:       0 4px 20px rgba(0, 53, 84, 0.08);
--shadow-card-hover: 0 12px 32px rgba(0, 53, 84, 0.14);
--gradient-accent:   linear-gradient(135deg, #007ea7, #3dbeff); /* teal, lisible sur clair */
--nav-height: 80px; --section-gap: 120px; --content-max: 1280px;
```

> Les anciens tokens (`--color-navy*`, `--color-cyan`, `--color-blue-*`, `--color-gray*`) sont **supprimés** ; les composants qui les référencent sont migrés vers les nouveaux (voir §5). Les tokens dérivés ajoutés en Phase 1b/3 (`--color-border-accent`, `--color-overlay-accent*`, `--gradient-stat`, `--ring-accent`, etc.) sont redéfinis sur la nouvelle palette.

---

## 4. Polices

- Dépendances : ajouter `@fontsource-variable/sora`, `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/hanken-grotesk` ; retirer `@fontsource-variable/inter` et `@fontsource-variable/space-grotesk`.
- Import dans `MainLayout.astro` (remplace les imports actuels). Vérifier les noms de familles exposés (`'Sora Variable'`, `'Plus Jakarta Sans Variable'`, `'Hanken Grotesk Variable'`).
- `body` → `--font-body` ; titres `<h1>/<h2>/<h3>` → `--font-display` (tracking serré sur les gros titres : `letter-spacing: -0.02em` sur display, `-0.01em` sur headline) ; nav/labels/badges → `--font-label` (uppercase, `letter-spacing: 0.05em`).

---

## 5. Restyle des composants (inventaire)

Chaque composant garde sa structure et ses props ; seuls les `<style>` scopés (et `global.css`) changent.

- **`global.css`** : `body` fond clair + texte `--color-on-surface` ; `*:focus-visible` → anneau **teal** (`box-shadow: 0 0 0 2px var(--color-teal)`) ; skip-link adapté ; `.fade-up` inchangé.
- **Atoms** : `Button` (primaire **teal pill** min 160px, secondaire **outline deep-ocean 2px**, variante devis) · `Tag`/chip (tint teal ; variante sunset pour priorité) · `Highlight` (dégradé **teal** clippé — lisible sur fond clair) · `SectionBadge` (tint teal, `--font-label`).
- **Molecules** : `ServiceCard`, `FeatureItem`, `TechLogo`, `ProcessStep`, `WhyPoint`, `StatCard`, `ProjectCard`, `PricingCard`, `SocialLink`, `NavMenu`, `SectionHeader`, `LangToggle`, `ContactForm` (**inputs soulignés** : fond `surface-gray`, bordure-bas qui passe teal au focus), `CalButton`, `WhatsAppButton`, `ArticleCard`, `TeamMemberCard`, `GuaranteeItem`, `FaqItem`. Cartes : **blanches, bordure `outline-variant` 1px → bordure transparente + `--shadow-card-hover` au hover**.
- **Organisms** : `Nav` (**glassmorphism clair** : `background: rgba(248,249,250,0.8)` + `backdrop-filter: blur(12px)` + fine bordure-bas) · `Hero` (**bande deep-ocean** `--color-primary`, texte `--color-on-primary`, garde l'image) · `Footer` (**bande deep-ocean** `--color-deep-ocean`) · toutes les sections de contenu (`Features`, `Services`, `Stack`, `Process`, `Why`, `Projects`, `Team`, `Guarantees`, `Pricing`, `FAQ`, `Contact`) → **fond clair**, cartes blanches, `--section-gap` vertical · `HomePage`, `ServiceDetail`, `LegalPage`, `BlogLayout` (prose) adaptés au fond clair.

**Bandes sombres = Hero + Footer.** Tout le reste est clair. (Pas de nouvelle bande CTA « Prêt à transformer » : ce serait une nouvelle structure, hors périmètre re-skin.)

---

## 6. Accessibilité & contraste (vigilance passage au clair)

- Texte de corps en `--color-on-surface` (#191c1d) sur clair → contraste élevé. **Teal `#007EA7` réservé aux liens/UI** ; pour du petit texte teal sur blanc, vérifier ≥ 4.5:1 (sinon assombrir vers `--color-primary`).
- **Sunset `#FFBF69`** : jamais comme couleur de texte sur clair (échoue WCAG) — uniquement en fond (avec texte foncé) ou sur bande sombre. Même logique que l'ancien interdit sur le cyan.
- Focus-ring teal visible sur clair ET sur les bandes sombres (vérifier les deux).
- Re-valider : `@axe-core` (si branché) et **Lighthouse a11y = 100** restent l'objectif. Hiérarchie de titres et `<h1>` unique inchangés (structure non modifiée).

---

## 7. Périmètre / hors périmètre

**Dans le périmètre** : tokens, polices, styles de tous les composants/layouts, `global.css`. Re-vérification contraste/a11y.

**Hors périmètre** : toute modification de structure de page, de contenu (textes, data), de clés i18n, de routing, de JSON-LD/SEO/GEO, du JS (`reveal.ts`). Pas de nouvelle section (ex. bande CTA Stitch). Pas de mode sombre. Pas de changement d'icônes (lucide/simple-icons conservés). Les noms « Antilles Digital » des exemples Stitch ne sont **pas** repris — on reste **KaribTeck**.

---

## 8. Livraison par phases (pour le plan)

- **A — Fondation** : deps polices, `theme.css` (tokens Maritime), `global.css` (base claire + focus teal), imports polices dans `MainLayout`. Build + capture de contrôle.
- **B — Atoms** : Button, Tag, Highlight, SectionBadge.
- **C — Molecules** : toutes les molecules (cartes blanches + ombres, inputs soulignés, chips).
- **D — Organisms & layouts** : Nav glassy, Hero + Footer deep-ocean, sections claires, ServiceDetail/LegalPage/BlogLayout/prose.
- **E — QA** : passe contraste/a11y, QA visuelle FR + EN sur accueil/service/blog/légales, gate complète (`check` + `build` + `lint` + `format` + `validate:jsonld`) + axe/Lighthouse si dispo.

Chaque phase finit par un build vert ; aucune régression de `validate:jsonld` (36 pages) ni du contenu.

---

## 9. Risques

- **Churn de tokens** : beaucoup de composants référencent les anciens `--color-navy/cyan/...`. Mitigation : faire `theme.css` d'abord, puis migrer composant par composant, build à chaque étape (un token manquant = build cassé, détecté tôt).
- **Contraste** : le plus gros risque du passage au clair — traité en §6 + phase E.
- **Polices** : confirmer les noms de familles `@fontsource-variable` au build (sinon fallback system-font silencieux). Vérifier le rendu Sora/Jakarta/Hanken.
