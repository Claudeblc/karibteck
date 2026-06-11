# KaribTeck Blog Redesign + New Articles — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `/blog` index to match the Stitch maquette (hero · featured article · grid of cards with gradient covers · CtaBand) and seed the blog with 6 new bilingual articles, reusing existing blog loaders + Stitch patterns.

**Architecture:** New presentational components (`ArticleCover` deterministic gradient cover, `FeaturedArticle` 2-col lead) + enrich the existing `ArticleCard` with a cover; recompose `/blog/index.astro` (FR+EN) using `PageHero` + `CtaBand`. Add 6 FR/EN MDX article pairs to the existing `blog` content collection. No new content backend, no newsletter, no fake photos.

**Tech Stack:** Astro 6 Content Collections + MDX, Tailwind 4 Maritime tokens, TS strict. Builds on the completed Maritime + Stitch multi-page redesign.

> **Spec:** `docs/superpowers/specs/2026-06-11-karibteck-blog-redesign-design.md`. **Conventions:** `CLAUDE.md`. Reuse: `loadPosts(locale)`, `loadPostsByTag`, `allTags`, `findTranslation`, `entrySlug` (`@/lib/blog`); `computeReadingTime` (`@/lib/readingTime`); `formatDate` (`@/lib/dates`); `PageHero`, `CtaBand`, `SectionHeader`, `Tag`, `Highlight`; `useTranslations`, `localizeBlogPostPath`, `localizeTagPath`, `localizePath`; `buildBlogIndexGraph`/`buildBlogPostGraph` (`@/lib/jsonLd`); `JsonLd` atom. Icons via `astro-icon`.

---

## Phase A — Components

### Task 1: Cover gradient tokens + `ArticleCover`

**Files:** Modify `src/styles/theme.css` (add cover gradients in `:root`); Create `src/components/molecules/ArticleCover.astro`.

- [ ] **Step 1: Add 4 cover gradients to `:root` in `theme.css`** (alongside `--gradient-accent`)

```css
  --gradient-cover-a: linear-gradient(135deg, #001f34, #007ea7);
  --gradient-cover-b: linear-gradient(135deg, #003554, #3dbeff);
  --gradient-cover-c: linear-gradient(135deg, #051923, #00658d);
  --gradient-cover-d: linear-gradient(135deg, #007ea7, #3dbeff);
```

- [ ] **Step 2: Create `src/components/molecules/ArticleCover.astro`** — deterministic gradient (by `seed` hash) + category label chip.

```astro
---
interface Props {
  seed: string;
  category?: string;
  size?: 'lg' | 'sm';
}
const { seed, category, size = 'sm' } = Astro.props;
const LETTERS = ['a', 'b', 'c', 'd'] as const;
let hash = 0;
for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
const letter = LETTERS[hash % LETTERS.length];
---

<div class:list={['cover', `cover-${size}`]} style={`background: var(--gradient-cover-${letter})`}>
  {category && <span class="cover-cat">{category}</span>}
</div>

<style>
  .cover {
    position: relative;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: flex;
    align-items: flex-end;
    padding: 16px;
  }
  .cover-sm {
    height: 160px;
  }
  .cover-lg {
    height: 100%;
    min-height: 280px;
    border-radius: var(--radius-lg);
  }
  .cover-cat {
    background: rgba(255, 255, 255, 0.15);
    color: var(--color-on-primary);
    font-family: var(--font-label);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: var(--radius-pill);
    backdrop-filter: blur(4px);
  }
</style>
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/styles/theme.css src/components/molecules/ArticleCover.astro
git commit -m "feat(blog): add gradient cover tokens and ArticleCover"
```

### Task 2: Enrich `ArticleCard` with a cover

**Files:** Modify `src/components/molecules/ArticleCard.astro`.

- [ ] **Step 1: Read the current `ArticleCard.astro`** to learn its exact props (it takes the post's href/title/excerpt/date/readingMinutes/tags/locale or similar). Add an `<ArticleCover>` at the TOP of the card: import `ArticleCover`, render `<ArticleCover seed={<the post slug or translationKey available to the card>} category={tags[0]} size="sm" />` above the card body. The card keeps its white floating style (border `--color-surface-gray` + `--shadow-card`); remove its top padding so the cover sits flush to the top corners (cover has top radius; card keeps bottom radius). Pass whatever the card already receives — if it lacks a `seed`, derive from the existing `href`/`title`.

- [ ] **Step 2: Verify + commit**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint`
Expected: clean; the existing `/blog/` and `/blog/tags/*` pages now show cards with gradient covers (cards render via ArticleCard).

```bash
git add src/components/molecules/ArticleCard.astro
git commit -m "feat(blog): add gradient cover to ArticleCard"
```

### Task 3: `FeaturedArticle` + i18n strings

**Files:** Create `src/components/organisms/FeaturedArticle.astro`; modify `src/i18n/ui.ts`.

- [ ] **Step 1: i18n** — add to BOTH `ui.fr`/`ui.en` (symmetry guard): `blog.hero.badge`, `blog.hero.title.lead`, `blog.hero.title.hl`, `blog.hero.sub`, `blog.recent.badge`, `blog.recent.title.lead`, `blog.recent.title.hl`, `blog.featuredLabel`, `blog.by`, `blog.author`, `cta.readArticle` (if not present). FR e.g. hero badge "Le blog", title lead "Idées &" hl "Innovation", sub "Conseils, retours d'expérience et décryptages sur le web, le mobile et l'IA aux Antilles."; `blog.author` "L'équipe Karib Teck"; `blog.featuredLabel` "À la une"; `blog.by` "Par". EN equivalents ("The blog", "Ideas &" / "Innovation", …, "The Karib Teck team", "Featured", "By").

- [ ] **Step 2: Create `src/components/organisms/FeaturedArticle.astro`** — 2-col lead block.

```astro
---
import ArticleCover from '@/components/molecules/ArticleCover.astro';
import Tag from '@/components/atoms/Tag.astro';
import { formatDate } from '@/lib/dates';
import { useTranslations, localizeBlogPostPath } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';
import type { BlogEntry } from '@/lib/blog';

interface Props {
  entry: BlogEntry;
  slug: string;
  locale?: Locale;
  readingMinutes: number;
}
const { entry, slug, locale = DEFAULT_LOCALE, readingMinutes } = Astro.props;
const t = useTranslations(locale);
const href = localizeBlogPostPath(slug, locale);
const category = entry.data.tags[0];
---

<section class="featured">
  <div class="featured-inner">
    <a class="featured-cover" href={href} aria-label={entry.data.title}>
      <ArticleCover seed={entry.data.translationKey} category={category} size="lg" />
    </a>
    <div class="featured-body">
      <span class="featured-label">{t('blog.featuredLabel')}</span>
      <h2 class="featured-title"><a href={href}>{entry.data.title}</a></h2>
      <p class="featured-excerpt">{entry.data.excerpt}</p>
      <p class="featured-meta">
        {t('blog.author')} · {formatDate(entry.data.date, locale)} · {readingMinutes}
        {t('blog.readingTime')}
      </p>
      <a class="featured-link" href={href}>{t('cta.readArticle')} →</a>
    </div>
  </div>

  <style>
    .featured {
      padding: var(--section-pad-y) 5% 0;
    }
    .featured-inner {
      max-width: var(--content-max);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: stretch;
    }
    .featured-cover {
      display: block;
      min-height: 320px;
    }
    .featured-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .featured-label {
      font-family: var(--font-label);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-teal-text);
    }
    .featured-title {
      font-family: var(--font-display);
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      margin: 12px 0 14px;
    }
    .featured-title a {
      color: var(--color-on-surface);
      text-decoration: none;
    }
    .featured-title a:hover {
      color: var(--color-teal);
    }
    .featured-excerpt {
      color: var(--color-on-surface-variant);
      font-size: 1.02rem;
    }
    .featured-meta {
      color: var(--color-on-surface-variant);
      font-size: 0.85rem;
      margin: 16px 0;
    }
    .featured-link {
      color: var(--color-teal);
      font-weight: 600;
      text-decoration: none;
    }
    @media (max-width: 860px) {
      .featured-inner {
        grid-template-columns: 1fr;
      }
      .featured-cover {
        min-height: 220px;
      }
    }
  </style>
</section>
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean.

```bash
git add src/components/organisms/FeaturedArticle.astro src/i18n/ui.ts
git commit -m "feat(blog): add FeaturedArticle lead block + blog i18n strings"
```

---

## Phase B — `/blog` index recompose

### Task 4: Rebuild `/blog/index.astro` (FR + EN)

**Files:** Modify `src/pages/blog/index.astro` and `src/pages/en/blog/index.astro`.

- [ ] **Step 1: Read both current index files** to keep their MainLayout/JsonLd/Nav/Footer wiring. Recompose the body to: `PageHero` (blog.hero strings) · `FeaturedArticle` (the most recent post) · a "recent" section (`SectionHeader` with blog.recent strings + grid of the REMAINING posts as `ArticleCard`) · `CtaBand` · Footer. Logic:

```astro
---
// …existing imports (MainLayout, Nav, Footer, JsonLd, buildBlogIndexGraph) …
import PageHero from '@/components/organisms/PageHero.astro';
import FeaturedArticle from '@/components/organisms/FeaturedArticle.astro';
import CtaBand from '@/components/organisms/CtaBand.astro';
import ArticleCard from '@/components/molecules/ArticleCard.astro';
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import { loadPosts, entrySlug } from '@/lib/blog';
import { computeReadingTime } from '@/lib/readingTime';
import { useTranslations } from '@/i18n/utils';
import type { Locale } from '@/types';

const locale: Locale = 'fr'; // 'en' in the EN mirror
const t = useTranslations(locale);
const posts = await loadPosts(locale);
const [featured, ...rest] = posts;
---

<MainLayout title={…} description={…} locale={locale} route="blog" localizedPaths={{ fr:'/blog/', en:'/en/blog/' }}>
  <Fragment slot="head"><JsonLd data={buildBlogIndexGraph(locale)} /></Fragment>
  <Nav slot="nav" locale={locale} altHref={locale === 'fr' ? '/en/blog/' : '/blog/'} />
  <PageHero
    badge={t('blog.hero.badge')}
    titleLead={t('blog.hero.title.lead')}
    titleHl={t('blog.hero.title.hl')}
    sub={t('blog.hero.sub')}
  />
  {featured && (
    <FeaturedArticle entry={featured} slug={entrySlug(featured)} locale={locale} readingMinutes={computeReadingTime(featured.body ?? '')} />
  )}
  {rest.length > 0 && (
    <section class="blog-recent">
      <div class="blog-recent-inner">
        <SectionHeader badge={t('blog.recent.badge')} lead={t('blog.recent.title.lead')} highlight={t('blog.recent.title.hl')} />
        <div class="blog-grid">
          {rest.map((entry) => (
            <ArticleCard
              entry={entry}
              slug={entrySlug(entry)}
              locale={locale}
              readingMinutes={computeReadingTime(entry.body ?? '')}
            />
          ))}
        </div>
      </div>
    </section>
  )}
  <CtaBand slot="footer-pre" locale={locale} />  {/* or just before Footer */}
  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .blog-recent { padding: var(--section-pad-y) 5%; }
  .blog-recent-inner { max-width: var(--content-max); margin: 0 auto; }
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }
</style>
```

> Adapt `ArticleCard`'s actual prop names (read it — Task 2 may have set them). `CtaBand` is a normal section before `<Footer>` (not a slot) — place it in the default content flow right before the Footer slot. Keep the existing `MainLayout` title/description (or move to `blog.hero`-derived). Ensure the featured post is NOT repeated in the grid (`rest` excludes it).

- [ ] **Step 2: EN mirror** — same with `locale='en'`, `altHref='/blog/'`.

- [ ] **Step 3: Verify + commit**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run validate:jsonld`
Expected: green; `/blog/` FR+EN show hero + featured + grid + CtaBand; validator still ✓.

```bash
git add src/pages/blog/index.astro src/pages/en/blog/index.astro
git commit -m "feat(blog): recompose blog index (hero, featured, grid, CtaBand)"
```

---

## Phase C — 6 new articles

### Task 5: Write the 6 bilingual article pairs

**Files:** Create under `src/content/blog/fr/` and `src/content/blog/en/` (12 `.mdx` files).

For EACH article: create the FR file and the EN file sharing a `translationKey`. Frontmatter schema (Zod): `title, date (YYYY-MM-DD literal), locale, translationKey, tags[], excerpt, draft: false`. Body = ~3-5 `##` sections, **factual, expert, non-promotional**, no fabricated proof/client claims, moderate em-dash use, ends with a brief practical takeaway. Use staggered dates (most recent first becomes the featured post).

- [ ] **Step 1: Article 1 — App mobile pour son commerce** (`translationKey: app-mobile-commerce-dom`, `tags: ['mobile','business']`, date `2026-06-04`)
  - FR `src/content/blog/fr/2026-06-app-mobile-commerce-dom.mdx` — title "Votre commerce aux Antilles a-t-il besoin d'une application mobile ?"; excerpt about when an app pays off vs a good mobile site. Sections: quand une app a du sens (fidélité, usage récurrent, notifications) · quand un site mobile suffit · coûts & délais · comment décider.
  - EN `src/content/blog/en/2026-06-mobile-app-business-dom.mdx` — faithful English translation.

- [ ] **Step 2: Article 2 — Core Web Vitals & performance** (`translationKey: core-web-vitals`, `tags: ['performance','seo']`, date `2026-05-28`)
  - FR title "Core Web Vitals : pourquoi la vitesse de votre site fait vendre"; sections: LCP/INP/CLS expliqués · l'impact sur conversion & référencement · le contexte 4G aux DOM · comment on optimise. EN mirror.

- [ ] **Step 3: Article 3 — L'IA pour les PME antillaises** (`translationKey: ia-pme-antilles`, `tags: ['ia','business']`, date `2026-05-15`)
  - FR title "L'intelligence artificielle pour les PME antillaises : cas d'usage concrets"; sections: chatbots & service client · automatisation des tâches · analyse de données · où l'IA n'apporte pas (encore) de valeur. EN mirror.

- [ ] **Step 4: Article 4 — E-commerce aux DOM** (`translationKey: ecommerce-dom`, `tags: ['e-commerce','business']`, date `2026-05-06`)
  - FR title "Lancer son e-commerce aux DOM : logistique, paiement, livraison"; sections: spécificités logistiques locales · solutions de paiement · livraison & expédition · choisir sa plateforme. EN mirror.

- [ ] **Step 5: Article 5 — Cahier des charges web** (`translationKey: cahier-des-charges`, `tags: ['methode','business']`, date `2026-04-24`)
  - FR title "Réussir le cahier des charges de son projet web"; sections: définir l'objectif & les utilisateurs · le contenu avant le design · fonctionnalités essentielles vs nice-to-have · budget & planning · pièges fréquents. EN mirror.

- [ ] **Step 6: Article 6 — Sécurité & maintenance** (`translationKey: securite-maintenance`, `tags: ['securite','maintenance']`, date `2026-04-12`)
  - FR title "Sécurité et maintenance : protéger son site dans la durée"; sections: pourquoi la maintenance n'est pas optionnelle · mises à jour & correctifs · sauvegardes & restauration · HTTPS/SSL & bonnes pratiques · que couvre un contrat de maintenance. EN mirror.

- [ ] **Step 7: Sync + verify + commit**

Run: `npm run astro sync && rm -rf dist .astro && npm run check && npm run build && npm run validate:jsonld`
Expected: build now includes 8 articles × 2 + new tag pages (`ia`, `e-commerce`, `methode`, `securite`, `maintenance`); validator ✓ all pages.

```bash
git add src/content/blog
git commit -m "content(blog): add 6 bilingual articles (mobile, perf, IA, e-commerce, specs, security)"
```

---

## Phase D — QA

### Task 6: Full gate + visual QA

- [ ] **Step 1: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`
Expected: all green; page count grew (8 FR + 8 EN articles + new tag pages + the 2 index pages). Validator ✓ every page (Organization on all; BlogPosting on articles).

- [ ] **Step 2: RSS** — `dist/rss.xml` + `dist/en/rss.xml` list all 8 posts (FR/EN). Valid XML.

- [ ] **Step 3: Honesty grep** — `grep -rEn "50\+|98%|120\+|Clients satisfaits|Projets livrés|transformations" dist src` → nothing. Articles contain no fabricated metrics/clients.

- [ ] **Step 4: Visual QA** (dev server) — `/blog/` FR + EN: hero (light text on deep-ocean), featured 2-col block with gradient cover, grid of cards with gradient covers + category chips, CtaBand. A `/blog/tags/<tag>` page shows cards with covers. An article page still renders (prose unchanged). Responsive: featured → 1 col, grid → 1 col on mobile. The featured post is NOT duplicated in the grid.

- [ ] **Step 5: Commit (touch-ups)**

```bash
git add -A
git commit -m "test(blog): verify blog redesign + new articles (FR/EN, covers, RSS, JSON-LD)" --allow-empty
```

---

## Self-review notes (against spec §3–§6)

- **Index redesign (spec §3):** PageHero + FeaturedArticle + grid + CtaBand (Tasks 3-4); covers via ArticleCover (Task 1) on featured + cards. ✅
- **Components (spec §4):** ArticleCover (Task 1), FeaturedArticle (Task 3), ArticleCard enriched (Task 2), index recomposed (Task 4), i18n (Task 3). ✅
- **6 articles (spec §5):** the 4 kept + 2 replacements (cahier des charges, sécurité/maintenance); SEO + WordPress topics dropped per the user. Exact frontmatter + outlines (Task 5). ✅
- **Honesty/scope (spec §6):** gradient covers (no fake photos), no newsletter (CtaBand), agency author; `/blog/[slug]` prose unchanged; RSS auto-includes new posts; validator gate (Task 6). ✅
- **Placeholder scan:** the 6 articles give exact frontmatter + section outlines; bodies are prose the implementer writes per the honest/non-promotional brief (content, not code — bounded by title/tags/excerpt/outline). ArticleCard Task 2 says "read current props" — necessary because its exact prop names predate this plan; the target behavior (add cover at top) is explicit. No code-step placeholders.
```
