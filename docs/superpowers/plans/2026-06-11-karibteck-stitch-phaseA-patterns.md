# KaribTeck Stitch Redesign — Phase A: Shared Patterns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable "Stitch" layout primitives (BentoGrid, ExpertiseCard light/dark/stat, AccentBlock teal/sunset, CtaBand) + the multi-page route keys + i18n strings, so the page rebuilds (Accueil, /services, /a-propos, /contact) can compose them. No visible change to the live site yet.

**Architecture:** Pure additive — new Astro components in `src/components/`, new route keys in `src/i18n/ui.ts`, new strings in `ui.ts` (FR+EN symmetric). Existing pages/nav are untouched, so the site keeps working. Components are verified by `astro check`/`build` + a temporary scratch preview the implementer renders then removes.

**Tech Stack:** Astro 6 static, Tailwind 4 `@theme` (Maritime tokens), TS strict. Builds on the completed Maritime re-skin.

> **Spec:** `docs/superpowers/specs/2026-06-11-karibteck-stitch-multipage-design.md` (§3 patterns, §5 routes). **Conventions:** `CLAUDE.md`. Tokens available: `--color-primary`/`-container`, `--color-deep-ocean`, `--color-surface`/`-card`/`-alt`/`-gray`, `--color-teal`/`-text`/`-bright`, `--color-sunset`, `--color-on-surface`/`-variant`, `--color-on-primary`/`-variant`, `--color-outline-variant`, `--shadow-card`/`-hover`, `--radius-card`(0.5rem)/`-lg`(0.75rem)/`-pill`, `--font-display`/`-body`/`-label`, `--content-max`, `--section-pad-y`, `--gradient-accent`.

---

## Task 1: Route keys + i18n strings

**Files:** Modify `src/i18n/ui.ts`.

- [ ] **Step 1: Add route keys** to the `routes` map (both locales), alongside existing `home`/`blog`/`legal`/`thankYou`:

```ts
  fr: {
    // …existing…
    services: '/services/',
    about: '/a-propos/',
    contact: '/contact/',
  },
  en: {
    // …existing…
    services: '/en/services/',
    about: '/en/about/',
    contact: '/en/contact/',
  },
```

- [ ] **Step 2: Add shared UI strings** to BOTH `ui.fr` and `ui.en` (the bidirectional `_UiSymmetry` guard enforces parity). FR values:

```ts
    'nav.aboutPage': 'À propos',
    'cta.band.title.lead': 'Prêt à transformer',
    'cta.band.title.hl': 'votre entreprise',
    'cta.band.sub':
      'Parlons de votre projet — nous vous répondons sous 24h avec une première réponse claire.',
    'cta.band.button': 'Démarrer un projet',
    'expertise.badge': 'Notre Expertise',
    'expertise.title.lead': 'Une agence',
    'expertise.title.hl': 'ancrée et exigeante',
    'expertise.sub':
      'Le savoir-faire d’une équipe locale qui maîtrise les standards internationaux.',
```

EN values (same keys):

```ts
    'nav.aboutPage': 'About',
    'cta.band.title.lead': 'Ready to transform',
    'cta.band.title.hl': 'your business',
    'cta.band.sub':
      'Let’s talk about your project — we reply within 24h with a clear first answer.',
    'cta.band.button': 'Start a project',
    'expertise.badge': 'Our Expertise',
    'expertise.title.lead': 'An agency',
    'expertise.title.hl': 'rooted and rigorous',
    'expertise.sub':
      'The craft of a local team that masters international standards.',
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0/0 (symmetry guard passes).

```bash
git add src/i18n/ui.ts
git commit -m "feat(i18n): add multi-page routes and Stitch pattern strings"
```

---

## Task 2: BentoGrid layout

**Files:** Create `src/components/molecules/BentoGrid.astro`.

A 12-column grid wrapper; children control their own `col-span`/`row-span` via a `style` or class. Collapses to 1 column on mobile.

- [ ] **Step 1: Create `BentoGrid.astro`**

```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---

<div class:list={['bento', className]}>
  <slot />
</div>

<style>
  .bento {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 20px;
    max-width: var(--content-max);
    margin: 0 auto;
  }
  /* children set their span via inline style --col / --row (defaults: 4 cols, 1 row) */
  .bento > :global(*) {
    grid-column: span var(--col, 4);
    grid-row: span var(--row, 1);
  }
  @media (max-width: 860px) {
    .bento {
      grid-template-columns: 1fr;
    }
    .bento > :global(*) {
      grid-column: span 1;
    }
  }
</style>
```

- [ ] **Step 2: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/components/molecules/BentoGrid.astro
git commit -m "feat(patterns): add BentoGrid layout"
```

---

## Task 3: ExpertiseCard (light / dark / stat variants)

**Files:** Create `src/components/molecules/ExpertiseCard.astro`; add `src/types/index.ts` interface.

- [ ] **Step 1: Add the type** to `src/types/index.ts`:

```ts
export interface ExpertiseItem {
  variant: 'light' | 'dark' | 'stat';
  icon?: string;
  title: string;
  description: string;
  stat?: string;
  col?: number;
}
```

- [ ] **Step 2: Create `ExpertiseCard.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import type { ExpertiseItem } from '@/types';

interface Props {
  item: ExpertiseItem;
}
const { item } = Astro.props;
const colSpan = item.col ?? 4;
---

<article class:list={['xcard', `xcard-${item.variant}`]} style={`--col:${colSpan}`}>
  {item.variant === 'stat' && item.stat && <div class="xstat">{item.stat}</div>}
  {item.icon && item.variant !== 'stat' && (
    <div class="xicon" aria-hidden="true"><Icon name={item.icon} /></div>
  )}
  <h3 class="xtitle">{item.title}</h3>
  <p class="xdesc">{item.description}</p>
</article>

<style>
  .xcard {
    border-radius: var(--radius-lg);
    padding: 28px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-card);
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }
  .xcard:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);
  }
  .xcard-light {
    background: var(--color-surface-card);
    border: 1px solid var(--color-surface-gray);
  }
  .xcard-dark {
    background: var(--color-primary);
    color: var(--color-on-primary);
    justify-content: flex-end;
    min-height: 220px;
  }
  .xcard-stat {
    background: var(--color-surface-card);
    border: 1px solid var(--color-surface-gray);
    justify-content: center;
  }
  .xicon :global(svg) {
    width: 30px;
    height: 30px;
    color: var(--color-teal);
  }
  .xstat {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-teal);
    line-height: 1;
  }
  .xtitle {
    font-family: var(--font-display);
    font-size: 1.2rem;
    margin: 14px 0 8px;
  }
  .xcard-dark .xtitle {
    color: var(--color-on-primary);
  }
  .xdesc {
    color: var(--color-on-surface-variant);
    font-size: 0.95rem;
  }
  .xcard-dark .xdesc {
    color: var(--color-on-primary-variant);
  }
</style>
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/types/index.ts src/components/molecules/ExpertiseCard.astro
git commit -m "feat(patterns): add ExpertiseCard (light/dark/stat variants)"
```

---

## Task 4: AccentBlock (teal / sunset)

**Files:** Create `src/components/molecules/AccentBlock.astro`.

- [ ] **Step 1: Create `AccentBlock.astro`**

```astro
---
import { Icon } from 'astro-icon/components';

interface Props {
  variant: 'teal' | 'sunset';
  icon?: string;
  title: string;
  description?: string;
}
const { variant, icon, title, description } = Astro.props;
---

<div class:list={['accent', `accent-${variant}`]}>
  {icon && <div class="accent-icon" aria-hidden="true"><Icon name={icon} /></div>}
  <h3 class="accent-title">{title}</h3>
  {description && <p class="accent-desc">{description}</p>}
</div>

<style>
  .accent {
    border-radius: var(--radius-lg);
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .accent-teal {
    background: var(--color-teal);
    color: var(--color-on-primary);
  }
  .accent-sunset {
    background: var(--color-sunset);
    color: var(--color-primary);
  }
  .accent-icon :global(svg) {
    width: 28px;
    height: 28px;
  }
  .accent-title {
    font-family: var(--font-display);
    font-size: 1.15rem;
  }
  .accent-desc {
    font-size: 0.92rem;
    opacity: 0.95;
  }
</style>
```

> Contrast note: sunset (`#ffbf69`) uses `--color-primary` (#001f34) text → ~10:1, AA-safe. Teal block uses white text → ~4.5:1, OK for the larger title/desc here (not tiny text).

- [ ] **Step 2: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean.

```bash
git add src/components/molecules/AccentBlock.astro
git commit -m "feat(patterns): add AccentBlock (teal/sunset)"
```

---

## Task 5: CtaBand organism

**Files:** Create `src/components/organisms/CtaBand.astro`.

Full-bleed deep-ocean band used at the end of every page. Uses the `cta.band.*` strings + `Button` → `/contact`.

- [ ] **Step 1: Create `CtaBand.astro`**

```astro
---
import Highlight from '@/components/atoms/Highlight.astro';
import Button from '@/components/atoms/Button.astro';
import { useTranslations, localizePath } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
const contactHref = localizePath('contact', locale);
---

<section class="cta-band">
  <div class="cta-inner">
    <h2 class="cta-title">
      {t('cta.band.title.lead')} <Highlight text={t('cta.band.title.hl')} />
    </h2>
    <p class="cta-sub">{t('cta.band.sub')}</p>
    <Button href={contactHref} variant="primary">{t('cta.band.button')}</Button>
  </div>

  <style>
    .cta-band {
      background: var(--color-deep-ocean);
      color: var(--color-on-primary);
      padding: var(--section-pad-y) 5%;
    }
    .cta-inner {
      max-width: 760px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 18px;
    }
    .cta-title {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      letter-spacing: -0.01em;
    }
    .cta-sub {
      color: var(--color-on-primary-variant);
      max-width: 52ch;
    }
  </style>
</section>
```

> `Highlight` renders the teal gradient clip — legible on the dark band (verified in the existing Hero).

- [ ] **Step 2: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean.

```bash
git add src/components/organisms/CtaBand.astro
git commit -m "feat(patterns): add CtaBand deep-ocean section"
```

---

## Task 6: Scratch preview verification + final gate

No committed files — verify the new patterns render correctly, then ensure nothing regressed.

- [ ] **Step 1: Temporary preview.** Create `src/pages/__preview.astro` that imports `MainLayout`, `BentoGrid`, `ExpertiseCard`, `AccentBlock`, `CtaBand` and renders one of each (a bento of a light + dark + stat ExpertiseCard, a teal + sunset AccentBlock, and a CtaBand). Use sample literal props. Run `npm run dev` and open `http://localhost:4321/__preview` to confirm: bento lays out (asymmetric, collapses on mobile), dark card is deep-ocean with light text, stat card shows a big teal number, accent blocks are teal (white text) and sunset (dark text), CtaBand is a full-width deep-ocean band with a teal CTA. Screenshot for the record.

- [ ] **Step 2: DELETE the preview** (it must not ship):

Run: `rm src/pages/__preview.astro`

- [ ] **Step 3: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`
Expected: all green; **36 pages** (unchanged — no new public pages this phase); validator ✓ 36/36; the new components compile but aren't yet consumed by any shipped page.

- [ ] **Step 4: Confirm no live change**

Run: `git status -s` (clean) and confirm `src/pages/__preview.astro` is gone. The nav, home, and all existing pages are byte-identical to before this phase (only `i18n/ui.ts`, `types/index.ts`, and new component files were added).

- [ ] **Step 5: Commit (if any touch-ups)**

```bash
git add -A
git commit -m "test(patterns): verify Stitch primitives render (preview removed)" --allow-empty
```

---

## Self-review notes (against spec §3, §5)

- **Patterns (spec §3):** BentoGrid (Task 2), ExpertiseCard light/dark/stat (Task 3), AccentBlock teal/sunset (Task 4), CtaBand (Task 5). ✅ ContactInfoCard/CalEmbed/BudgetChips deferred to the `/contact` plan (Phase E) where they're consumed — noted, not a gap (they're contact-only).
- **Routes (spec §5):** `services`/`about`/`contact` route keys added (Task 1); nav switch + page creation happen in the per-page plans. ✅
- **i18n:** new strings FR+EN symmetric (guard enforced). ✅
- **No regression:** nothing shipped changes; site stays working; validator 36/36 (Task 6). ✅
- **Honesty:** no content added here (patterns only); honest content lands in the page plans. ✅
- **Placeholder scan:** the scratch `__preview.astro` (Task 6) uses literal sample props and is explicitly deleted before the gate — intentional, not shipped. No TBDs.
```
