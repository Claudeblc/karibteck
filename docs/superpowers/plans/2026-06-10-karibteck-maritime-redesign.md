# KaribTeck Maritime Professional Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the KaribTeck Astro site from the current dark navy/cyan theme to the light "Maritime Professional" design system (deep-ocean + caribbean-teal + sunset, Sora/Plus Jakarta Sans/Hanken Grotesk), without changing architecture, content, i18n, routing, or SEO.

**Architecture:** Pure visual-layer change. Rewrite design tokens in `src/styles/theme.css`, swap fonts, and update the scoped `<style>` of every atom/molecule/organism/layout. A token **migration map** (old → new) makes most edits mechanical; the structure, props, markup, data, and JSON-LD are untouched.

**Tech Stack:** Astro 6 static, Tailwind 4 `@theme`, `@fontsource-variable` (Sora, Plus Jakarta Sans, Hanken Grotesk). Builds on the completed Phases 0–6.

> **Spec:** `docs/superpowers/specs/2026-06-10-karibteck-maritime-redesign-design.md`. **Conventions:** `CLAUDE.md`.
>
> **Critical gotcha:** a missing CSS custom property does NOT fail the build — it renders as nothing/inherited silently. So the completeness gate is **grep (no old token names remain) + visual QA**, not just `npm run build`.

---

## Token migration map (old → new)

Apply everywhere a `var(--old)` appears in component `<style>` blocks. Old tokens are removed from `theme.css`; new ones defined in Task 1.

| Old token | New token | Notes |
|---|---|---|
| `--color-navy` | `--color-surface` | page bg: dark → light `#f8f9fa` |
| `--color-navy-2` | `--color-surface-alt` | alt sections / was dark card bg |
| `--color-navy-3` | `--color-surface-gray` | inputs / soft fills |
| `--color-white` (as text) | `--color-on-surface` | body text dark on light |
| `--color-gray` (muted text) | `--color-on-surface-variant` | |
| `--color-gray-2` (borders) | `--color-outline-variant` | card borders |
| `--color-cyan` (accent/links/focus) | `--color-teal` | action color |
| `--color-blue-1` / `--color-blue-2` | `--color-teal` / `--color-teal-bright` | |
| `--gradient-accent` | `--gradient-accent` (re-pointed to teal) | keep name, new value |
| `--color-border-accent*` | `--color-outline-variant` | |
| `--color-overlay-accent*` | `rgba(0,126,167,0.08)` via `--color-overlay-teal` | soft teal tint |
| `--shadow-accent*` | `--shadow-card` / `--shadow-card-hover` | blue-tinted ambient |
| `--ring-accent` | `--color-teal` | focus ring |
| `--gradient-stat` / `--gradient-icon*` | `--gradient-accent` | teal gradient |

**Dark bands exception (Hero + Footer):** these sit on `--color-primary`/`--color-deep-ocean`, so their inner text uses `--color-on-primary` (white) and `--color-on-primary-variant` (muted light), NOT `--color-on-surface`. Handle per Task 7/8.

---

## Phase A — Foundation (tokens, fonts, base)

### Task 1: Rewrite design tokens

**Files:** Modify `src/styles/theme.css` (full rewrite of the token set).

- [ ] **Step 1: Replace the entire `src/styles/theme.css`** with the Maritime token set. First read the current file to enumerate every token name components reference (grep `grep -rohE "var\(--[a-z0-9-]+\)" src | sort -u`); EVERY referenced name must be defined below or covered by the migration map (so no `var()` resolves to nothing). Content:

```css
/* KaribTeck — "Maritime Professional" design tokens (light theme).
   Tailwind 4 exposes @theme tokens as utilities (bg-surface, text-teal, rounded-card…). */
@theme {
  /* Surfaces (light) */
  --color-surface: #f8f9fa;
  --color-surface-card: #ffffff;
  --color-surface-alt: #f3f4f5;
  --color-surface-gray: #e9ecef;

  /* Deep ocean (dark bands + strong text) */
  --color-deep-ocean: #051923;
  --color-primary: #001f34;
  --color-primary-container: #003554;

  /* Text */
  --color-on-surface: #191c1d;
  --color-on-surface-variant: #42474d;
  --color-on-primary: #ffffff;
  --color-on-primary-variant: #779ec2;

  /* Accents */
  --color-teal: #007ea7;
  --color-teal-bright: #3dbeff;
  --color-sunset: #ffbf69;

  /* Lines */
  --color-outline: #72787e;
  --color-outline-variant: #c2c7ce;

  /* Radii */
  --radius-sm: 0.25rem;
  --radius-card: 0.5rem;
  --radius-lg: 1.5rem;
  --radius-pill: 9999px;

  /* Fonts (self-hosted variable, loaded in MainLayout) */
  --font-display: 'Sora Variable', sans-serif;
  --font-body: 'Plus Jakarta Sans Variable', sans-serif;
  --font-label: 'Hanken Grotesk Variable', sans-serif;
}

/* Non-utility custom properties (used as var() in scoped styles). */
:root {
  --gradient-accent: linear-gradient(135deg, #007ea7, #3dbeff);
  --color-overlay-teal: rgba(0, 126, 167, 0.08);
  --shadow-card: 0 4px 20px rgba(0, 53, 84, 0.08);
  --shadow-card-hover: 0 12px 32px rgba(0, 53, 84, 0.14);
  --nav-height: 80px;
  --section-pad-y: 96px;
  --section-gap: 120px;
  --content-max: 1280px;
}
```

> Keep BOTH the old-name compatibility and clarity in mind: it's fine to also alias any old token name you find still referenced (e.g. `--color-cyan: var(--color-teal);`) TEMPORARILY, but the goal is to migrate refs (Tasks 4–8) and end with NO old names. Simplest: define the new set above, then Tasks 4–8 migrate refs per the map. Do not leave dangling `var()`.

- [ ] **Step 2: Inventory token usage** (drives later tasks):

Run: `grep -rohE "var\(--[a-z0-9-]+\)" src --include=*.astro --include=*.css | sort -u`
Expected: a list; every name must be in the new `theme.css` after migration. Note which old names still appear — those are the migration targets for Tasks 4–8.

- [ ] **Step 3: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat(design): rewrite tokens for Maritime Professional light theme"
```

### Task 2: Swap fonts

**Files:** Modify `package.json`, `src/layouts/MainLayout.astro`.

- [ ] **Step 1: Update deps.** In `package.json` dependencies, remove `@fontsource-variable/inter` and `@fontsource-variable/space-grotesk`; add `"@fontsource-variable/sora": "^5.2.7"`, `"@fontsource-variable/plus-jakarta-sans": "^5.2.7"`, `"@fontsource-variable/hanken-grotesk": "^5.2.7"`. Run `npm install`.

- [ ] **Step 2: Update font imports in `MainLayout.astro`.** Replace the two `@fontsource-variable/inter` + `space-grotesk` imports with:

```astro
import '@fontsource-variable/sora';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/hanken-grotesk';
```

- [ ] **Step 3: Verify font family names.** Build, then confirm the emitted CSS exposes `'Sora Variable'`, `'Plus Jakarta Sans Variable'`, `'Hanken Grotesk Variable'` (inspect `node_modules/@fontsource-variable/sora/index.css` for the exact `font-family`). If a name differs, fix `--font-*` in `theme.css` to match.

Run: `npm run build`
Expected: success; fonts emitted under `dist/_astro/`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/layouts/MainLayout.astro
git commit -m "feat(design): self-host Sora + Plus Jakarta Sans + Hanken Grotesk"
```

### Task 3: Base styles (global.css)

**Files:** Modify `src/styles/global.css`.

- [ ] **Step 1: Update `global.css`** for the light base + teal focus ring. Set `body { background: var(--color-surface); color: var(--color-on-surface); font-family: var(--font-body); }`. Change the focus ring to teal: `*:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--color-teal); }`. Keep the `@import 'tailwindcss'`, `@import './theme.css'`, the `.fade-up` rules, skip-link, and `prefers-reduced-motion` block — only the colors/font change.

- [ ] **Step 2: Verify + commit**

Run: `npm run build`
Expected: success.

```bash
git add src/styles/global.css
git commit -m "feat(design): light base + teal focus ring in global.css"
```

---

## Phase B — Atoms

### Task 4: Restyle atoms

**Files:** Modify `src/components/atoms/{Button,Tag,Highlight,SectionBadge}.astro`.

- [ ] **Step 1: `Button.astro`** — primary = teal pill (min 160px), secondary = outline deep-ocean, devis = teal. Replace the `<style>` (keep props/markup):

```astro
<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--font-label);
    font-weight: 600;
    text-decoration: none;
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      background 0.2s,
      color 0.2s;
  }
  .btn-primary {
    min-width: 160px;
    padding: 14px 28px;
    border-radius: var(--radius-pill);
    background: var(--color-teal);
    color: var(--color-on-primary);
    box-shadow: var(--shadow-card);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }
  .btn-outline {
    padding: 13px 26px;
    border-radius: var(--radius-pill);
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }
  .btn-outline:hover {
    background: var(--color-primary);
    color: var(--color-on-primary);
  }
  .btn-devis {
    padding: 10px 22px;
    border-radius: var(--radius-pill);
    background: var(--color-teal);
    color: var(--color-on-primary);
  }
  .btn-devis:hover {
    background: var(--color-primary-container);
  }
</style>
```

> Note: on dark bands (Hero), a secondary/outline button needs light borders — Hero passes its buttons in a dark context; handle in Task 7 by allowing a `class` override or a light-on-dark variant. For now keep `btn-outline` deep-ocean; Hero will use `btn-primary` (teal) + a light-outline tweak in its scoped styles.

- [ ] **Step 2: `Tag.astro`** — light teal-tint chip, `--font-label`:

```astro
<style>
  .tag {
    display: inline-block;
    padding: 5px 12px;
    border-radius: var(--radius-pill);
    background: var(--color-overlay-teal);
    border: 1px solid var(--color-outline-variant);
    color: var(--color-teal);
    font-family: var(--font-label);
    font-size: 0.78rem;
    font-weight: 600;
  }
</style>
```

- [ ] **Step 3: `Highlight.astro`** — teal gradient clip (reads on light bg). Change the gradient to `var(--gradient-accent)` (already teal) — verify the existing rule uses `var(--gradient-accent)`; no change needed beyond confirming. If it referenced a removed token, point it to `--gradient-accent`.

- [ ] **Step 4: `SectionBadge.astro`** — teal tint, label font:

```astro
<style>
  .badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: var(--radius-pill);
    background: var(--color-overlay-teal);
    color: var(--color-teal);
    font-family: var(--font-label);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 5: Verify + commit**

Run: `npm run check && npm run build && grep -rn "color-navy\|color-cyan\|color-blue-\|color-gray\b" src/components/atoms || echo "atoms clean"`
Expected: build OK; grep returns "atoms clean" (no old tokens left in atoms).

```bash
git add src/components/atoms
git commit -m "feat(design): restyle atoms for Maritime theme (teal pills, chips, badges)"
```

---

## Phase C — Molecules

### Task 5: Restyle molecules

**Files:** Modify all of `src/components/molecules/*.astro`.

**Card pattern (apply to ServiceCard, ProjectCard, PricingCard, TeamMemberCard, GuaranteeItem, ArticleCard, FaqItem, StatCard where they're card-like):**
- background `var(--color-surface-card)` (white), border `1px solid var(--color-outline-variant)`, `border-radius: var(--radius-lg)`.
- hover: `border-color: transparent; box-shadow: var(--shadow-card-hover); transform: translateY(-4px);`
- titles `--font-display`, body `--color-on-surface-variant`, icons `var(--color-teal)`.

- [ ] **Step 1: `ServiceCard.astro` (worked example — mirror for other cards):**

```astro
<style>
  .service-card {
    background: var(--color-surface-card);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 28px;
    transition:
      border-color 0.3s,
      transform 0.3s,
      box-shadow 0.3s;
  }
  .service-card:hover {
    transform: translateY(-4px);
    border-color: transparent;
    box-shadow: var(--shadow-card-hover);
  }
  .service-icon {
    font-size: 2rem;
  }
  .service-icon :global(svg) {
    width: 30px;
    height: 30px;
    color: var(--color-teal);
  }
  .service-title {
    font-family: var(--font-display);
    font-size: 1.15rem;
    margin: 14px 0 10px;
    color: var(--color-on-surface);
  }
  .service-title a {
    color: inherit;
    text-decoration: none;
  }
  .service-title a:hover {
    color: var(--color-teal);
  }
  .service-desc {
    color: var(--color-on-surface-variant);
    font-size: 0.95rem;
  }
  .service-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
</style>
```

- [ ] **Step 2: `ContactForm.astro` — underlined inputs** (Maritime signature). Inputs: `background: var(--color-surface-gray); border: none; border-bottom: 2px solid var(--color-outline-variant); border-radius: var(--radius-sm) var(--radius-sm) 0 0;` and `:focus { border-bottom-color: var(--color-teal); }`. Labels `--font-label`, text `--color-on-surface`. Submit button keeps `btn-submit`/primary teal.

- [ ] **Step 3: Restyle the remaining molecules** applying the migration map + card/icon pattern: `FeatureItem` (icon teal, text on-surface), `TechLogo` (keep data-driven brand `color`; label `--color-on-surface-variant`), `ProcessStep` (number badge teal bg / on-primary text), `WhyPoint` (icon teal), `StatCard` (big number `--color-teal` or `--gradient-accent`, label muted), `ProjectCard` (white card; the gradient thumb keeps its data gradient, icon white on it), `PricingCard` (white card; popular = `--color-teal` accent border + sunset "popular" badge), `SocialLink` (border `outline-variant`, icon `on-surface-variant` → teal on hover), `NavMenu` (links `--color-on-surface-variant` → teal hover; `--font-label`), `SectionHeader` (title `--font-display` `--color-on-surface`, `.hl` via Highlight, sub `--color-on-surface-variant`), `LangToggle` (border outline-variant, teal hover), `CalButton`/`WhatsAppButton` (outline/teal per Button language), `TeamMemberCard` (white card; initials avatar keeps data `accent`), `GuaranteeItem` (white card; icon teal), `FaqItem` (`<details>`: white card, border outline-variant; chevron teal).

- [ ] **Step 4: Verify + commit**

Run: `npm run check && npm run build && grep -rn "color-navy\|color-cyan\|color-blue-\|color-gray\b\|--ring-accent\|--shadow-accent\|--color-border-accent\|--color-overlay-accent\|--gradient-stat\|--gradient-icon" src/components/molecules || echo "molecules clean"`
Expected: build OK; grep prints "molecules clean".

```bash
git add src/components/molecules
git commit -m "feat(design): restyle molecules (white cards, underlined inputs, teal accents)"
```

---

## Phase D — Organisms & layouts

### Task 6: Nav (glassmorphism light)

**Files:** Modify `src/components/organisms/Nav.astro`.

- [ ] **Step 1:** nav bar → light glass. Replace its background/border styles:

```astro
<style>
  nav {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 1000;
    height: var(--nav-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 0 5%;
    background: rgba(248, 249, 250, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-outline-variant);
  }
  .nav-logo-name {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: 0.04em;
  }
  .nav-logo-sub {
    font-size: 0.62rem;
    color: var(--color-on-surface-variant);
    letter-spacing: 0.05em;
  }
  .burger span {
    width: 24px;
    height: 2px;
    background: var(--color-primary);
  }
  /* keep existing layout/burger display rules; only colors change */
</style>
```

Also the mobile `.nav-links` open panel (in `NavMenu`) bg → `var(--color-surface)`.

- [ ] **Step 2: Verify + commit**

Run: `npm run build`

```bash
git add src/components/organisms/Nav.astro src/components/molecules/NavMenu.astro
git commit -m "feat(design): light glassmorphism nav"
```

### Task 7: Hero (deep-ocean band)

**Files:** Modify `src/components/organisms/Hero.astro`.

- [ ] **Step 1:** Hero `#hero` background → deep-ocean; inner text light. Set `#hero { background: var(--color-primary); color: var(--color-on-primary); }`, `.hero-title { font-family: var(--font-display); letter-spacing: -0.02em; }` (color inherits white; the `<Highlight>` keeps the teal gradient which reads on dark), `.hero-sub { color: var(--color-on-primary-variant); }`. The CTAs: primary teal (`btn-primary` works on dark); the secondary "Voir nos réalisations" needs a light outline on dark — add a scoped override: `.hero-ctas :global(.btn-outline){ color: var(--color-on-primary); border-color: rgba(255,255,255,0.4);} .hero-ctas :global(.btn-outline):hover{ background: rgba(255,255,255,0.1);}`. Keep the `<Image>`.

- [ ] **Step 2: Verify + commit**

```bash
git add src/components/organisms/Hero.astro
git commit -m "feat(design): deep-ocean hero band with light text"
```

### Task 8: Footer (deep-ocean band)

**Files:** Modify `src/components/organisms/Footer.astro`.

- [ ] **Step 1:** `footer { background: var(--color-deep-ocean); }`, headings `--color-on-primary-variant` → titles, links `--color-on-primary-variant` → `--color-on-primary` on hover, brand name white, social-btn borders `rgba(255,255,255,0.2)`. Migrate all old tokens per the map (dark-band variants).

- [ ] **Step 2: Verify + commit**

```bash
git add src/components/organisms/Footer.astro
git commit -m "feat(design): deep-ocean footer band"
```

### Task 9: Content sections + page layouts (light)

**Files:** Modify `src/components/organisms/{FeaturesStrip,ServicesSection,StackSection,ProcessSection,WhySection,ProjectsSection,PricingSection,ContactSection}.astro`, `src/components/organisms/{ServiceDetail,LegalPage,HomePage}.astro`, `src/layouts/BlogLayout.astro`, `src/styles/prose.css`.

- [ ] **Step 1: Each content section** → light. Section shells: background `var(--color-surface)` (or alternate `var(--color-surface-alt)` on every other section for rhythm), titles via `SectionHeader` (already), generous vertical padding (`var(--section-pad-y)`). `WhySection` stat block + expertise box → light surfaces with teal accents (and the contact-detail icons teal). `ContactSection` form area → `var(--color-surface-card)` panel with `var(--shadow-card)`. Migrate every old token per the map.

- [ ] **Step 2: `FeaturesStrip`** → light strip `var(--color-surface-alt)`, icons teal, text on-surface.

- [ ] **Step 3: `ServiceDetail`, `LegalPage`** → light; headings `--font-display` `--color-primary`; benefits check-icon teal; breadcrumb muted → teal hover. `prose.css` → light: text `--color-on-surface`, headings `--color-primary` `--font-display`, links `--color-teal`, code/blockquote on `--color-surface-gray`. `BlogLayout` `.prose` inherits.

- [ ] **Step 4: Full completeness grep + verify**

Run: `npm run check && npm run build && grep -rn "color-navy\|color-cyan\|color-blue-\|color-gray\b\|--ring-accent\|--shadow-accent\|--color-border-accent\|--color-overlay-accent\|--gradient-stat\|--gradient-icon" src || echo "ALL CLEAN"`
Expected: build OK; grep prints "ALL CLEAN" (zero old tokens anywhere in `src`).

```bash
git add src/components/organisms src/layouts/BlogLayout.astro src/styles/prose.css
git commit -m "feat(design): light content sections and page layouts"
```

---

## Phase E — QA

### Task 10: Contrast/a11y pass + visual QA + full gate

- [ ] **Step 1: Contrast audit.** Verify: body text `--color-on-surface` on `--color-surface` (AAA); `--color-teal` used for links/UI only (check small teal text ≥ 4.5:1 — if any small body text is teal, switch to `--color-primary`); `--color-sunset` NEVER as text on light (only as bg with dark text, or on dark bands); focus ring visible on both light sections and dark bands (Hero/Footer). Fix any violation.

- [ ] **Step 2: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`
Expected: all green; 36 pages; validator ✓ 36/36 (content/SEO unchanged).

- [ ] **Step 3: Completeness grep (whole repo src)**

Run: `grep -rn "color-navy\|color-cyan\|color-blue-\|color-gray\b" src && echo "FOUND OLD TOKENS — fix" || echo "NO OLD TOKENS ✓"`
Expected: `NO OLD TOKENS ✓`.

- [ ] **Step 4: Visual QA** (dev server `npm run dev`): screenshot and review FR + EN on `/`, a `/services/<slug>/`, `/blog/`, a `/blog/<slug>/`, `/mentions-legales/`. Confirm: light theme, deep-ocean hero + footer, white cards w/ hover shadow, teal CTAs/pills, Sora headings, real icons intact, no dark-navy remnants, no unreadable contrast. Fix visual regressions.

- [ ] **Step 5: Commit any QA fixes**

```bash
git add -A
git commit -m "fix(design): contrast and visual QA fixes for Maritime theme" --allow-empty
```

---

## Self-review notes (against spec §3–§8)

- **Tokens (spec §3):** full rewrite in Task 1 + migration map covers all referenced names (grep gates in Tasks 4/5/9/10). ✅
- **Fonts (spec §4):** Task 2 swaps deps + imports + verifies family names. ✅
- **Components (spec §5):** atoms (Task 4), molecules + underlined inputs + card pattern (Task 5), Nav glass (6), Hero/Footer dark bands (7/8), sections + layouts + prose (9). ✅
- **a11y/contrast (spec §6):** Task 10 Step 1 explicit; sunset-never-as-text and teal-contrast rules enforced. ✅
- **Scope (spec §7):** only `theme.css`/`global.css`/`prose.css` + component `<style>` + fonts touched; no markup/content/i18n/SEO change — JSON-LD validator (36) re-checked in Task 10 proves SEO intact. ✅
- **Icons:** lucide/simple-icons untouched (only their `color` may shift to teal in card styles). ✅
- **Completeness gotcha:** grep gates at every phase catch un-migrated tokens (build alone wouldn't). ✅
- **Placeholder scan:** Task 5 Step 3 and Task 9 describe several components by the shared card/migration rubric + a fully-coded worked example (ServiceCard, ContactForm) — bounded, mechanical, with the exact token map; not open TODOs. The implementer reads each file and applies the map + pattern.
```
