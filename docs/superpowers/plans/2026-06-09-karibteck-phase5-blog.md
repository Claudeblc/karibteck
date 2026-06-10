# KaribTeck Phase 5 — Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual blog (Astro Content Collections + MDX) — index, article pages, tag pages, RSS feeds — with `BlogPosting` JSON-LD per article and a FR↔EN translation link, seeded with 2 article pairs, to establish topical authority for SEO/GEO.

**Architecture:** A Zod-validated `blog` collection under `src/content/blog/{fr,en}`; pure-logic loaders in `src/lib/blog.ts`; a `BlogLayout` for articles; molecules `ArticleCard`/`TagPill`; static routes for index/[slug]/tags + `rss.xml`, mirrored under `/en/`. JSON-LD reuses `lib/jsonLd.ts` (Organization + BlogPosting + Breadcrumb). FR↔EN pairing via a shared `translationKey` (toggle/hreflang only when the translation exists).

**Tech Stack:** Astro 6 Content Collections + `@astrojs/mdx` + `@astrojs/rss` + `reading-time`. Builds on Phases 0–4.

> **Seed content authored here** (2 FR + 2 EN, honest, agency-relevant). **Spec:** §6.3 (blog), §8.2 (BlogPosting JSON-LD), §4 (structure). **Conventions:** `CLAUDE.md` (esp. the bilingual-notes `translationKey` rule).

---

## Scope

**In scope:** MDX/RSS deps + config; `blog` collection schema; 2 article pairs (FR+EN); `lib/blog.ts` + `lib/dates.ts` + `lib/readingTime.ts`; `BlogLayout`; `ArticleCard`; routes `/blog`, `/blog/[slug]`, `/blog/tags/[tag]` + `/en/` mirror + `rss.xml.ts` (FR) + `en/rss.xml.ts`; `BlogPosting`/blog-index JSON-LD; nav + footer blog link; `routes.blog`; `llms.txt` lists posts.

**NOT in scope:** comments, search, pagination (few posts), author photos, contact wiring (Phase 6), real NAP. Drafts supported via `draft: true` (excluded from build lists).

---

## Task 1: Dependencies + Astro config (MDX)

**Files:** Modify `package.json`, `astro.config.mjs`.

- [ ] **Step 1: Add deps** to `package.json` dependencies: `"@astrojs/mdx": "^5.0.6"`, `"@astrojs/rss": "^4.0.18"`, `"reading-time": "^1.5.0"`. Run `npm install`.

- [ ] **Step 2: Register MDX** in `astro.config.mjs` — import `mdx from '@astrojs/mdx'` and add `mdx()` to `integrations` (after `sitemap()`, `icon()`).

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run build`
Expected: 0/0; build unaffected (no content yet).

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "chore: add MDX + RSS + reading-time for the blog"
```

---

## Task 2: Blog content collection schema + seed articles

**Files:** Create `src/content.config.ts`; create `src/content/blog/fr/*.mdx` + `src/content/blog/en/*.mdx`.

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    locale: z.enum(['fr', 'en']),
    translationKey: z.string(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

> The glob `id` will include the locale folder (e.g. `fr/2026-06-...`). `lib/blog.ts` derives the slug by stripping the locale prefix.

- [ ] **Step 2: Create seed article pair 1** — `src/content/blog/fr/2026-06-site-rapide-antilles.mdx` and `src/content/blog/en/2026-06-fast-website-west-indies.mdx`, sharing `translationKey: site-rapide-antilles`.

FR frontmatter + body:

```mdx
---
title: 'Pourquoi un site web rapide change tout pour une entreprise aux Antilles'
date: 2026-06-02
locale: fr
translationKey: site-rapide-antilles
tags: ['seo', 'performance']
excerpt: 'Un site lent fait fuir vos visiteurs et plombe votre référencement. Voici pourquoi la vitesse est un enjeu business, surtout aux Antilles.'
---

La vitesse d'un site web n'est pas un détail technique : c'est un enjeu commercial direct. Un visiteur qui attend plus de trois secondes repart, souvent vers un concurrent.

## La performance, c'est du chiffre d'affaires

Chaque seconde de chargement supplémentaire réduit le taux de conversion. Pour un commerce en ligne ou une vitrine qui génère des contacts, cela se traduit en clients perdus.

## Aux Antilles, le contexte compte

Les connexions mobiles ne sont pas toujours optimales dans les DOM. Un site léger, optimisé et bien hébergé reste rapide même en 4G, là où un site lourd devient inutilisable.

## Ce que nous faisons concrètement

Nous construisons des sites statiques ou optimisés, sans surcharge inutile, avec des images compressées et un hébergement adapté. Résultat : un site rapide, bien référencé, et agréable à utiliser.
```

EN (`en/2026-06-fast-website-west-indies.mdx`):

```mdx
---
title: 'Why a fast website changes everything for a business in the French West Indies'
date: 2026-06-02
locale: en
translationKey: site-rapide-antilles
tags: ['seo', 'performance']
excerpt: 'A slow site drives visitors away and hurts your ranking. Here is why speed is a business issue, especially in the French West Indies.'
---

Website speed is not a technical detail: it is a direct business issue. A visitor who waits more than three seconds leaves — often for a competitor.

## Performance is revenue

Every extra second of load time lowers your conversion rate. For an online store or a lead-generating site, that means lost customers.

## In the West Indies, context matters

Mobile connections are not always optimal across the overseas territories. A light, optimized, well-hosted site stays fast even on 4G, where a heavy site becomes unusable.

## What we actually do

We build static or optimized sites, with no needless bloat, compressed images and the right hosting. The result: a fast, well-ranked, pleasant-to-use website.
```

- [ ] **Step 3: Create seed article pair 2** — `src/content/blog/fr/2026-05-app-mobile-commerce.mdx` + `src/content/blog/en/2026-05-mobile-app-local-business.mdx`, `translationKey: app-mobile-commerce`, `tags: ['mobile', 'business']`, `date: 2026-05-20`.
  - FR title: `'Votre commerce a-t-il vraiment besoin d'une application mobile ?'` — excerpt: `'Une app mobile n'est pas toujours la bonne réponse. Voici comment savoir si elle apportera de la valeur à votre activité.'` — body (≈3 `##` sections): when an app makes sense (loyalty, recurring use, notifications), when a good mobile site is enough, and how Karib Teck helps decide.
  - EN title: `'Does your business really need a mobile app?'` — mirror the FR structure/sections in natural English.

- [ ] **Step 4: Sync + verify**

Run: `npm run astro sync && npm run check`
Expected: collection types generated; 0/0.

```bash
git add src/content.config.ts src/content/blog
git commit -m "feat(blog): add blog collection schema and 2 bilingual seed articles"
```

---

## Task 3: Blog logic helpers

**Files:** Create `src/lib/dates.ts`, `src/lib/readingTime.ts`, `src/lib/blog.ts`.

- [ ] **Step 1: `src/lib/dates.ts`**

```ts
import type { Locale } from '@/types';

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

- [ ] **Step 2: `src/lib/readingTime.ts`**

```ts
import readingTime from 'reading-time';

export function computeReadingTime(body: string): number {
  return Math.max(1, Math.round(readingTime(body).minutes));
}
```

- [ ] **Step 3: `src/lib/blog.ts`** — load/filter/sort; slug derivation; translation lookup.

```ts
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/types';

export type BlogEntry = CollectionEntry<'blog'>;

/** Slug without the locale folder prefix (e.g. "fr/foo" -> "foo"). */
export function entrySlug(entry: BlogEntry): string {
  return entry.id.replace(/^(fr|en)\//, '').replace(/\.mdx$/, '');
}

export async function loadPosts(locale: Locale): Promise<BlogEntry[]> {
  const all = await getCollection('blog');
  return all
    .filter((e) => e.data.locale === locale && !e.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function loadPostsByTag(locale: Locale, tag: string): Promise<BlogEntry[]> {
  return (await loadPosts(locale)).filter((e) => e.data.tags.includes(tag));
}

export async function allTags(locale: Locale): Promise<string[]> {
  const posts = await loadPosts(locale);
  return [...new Set(posts.flatMap((e) => e.data.tags))].sort();
}

/** The same article in the other locale, if it exists. */
export async function findTranslation(
  entry: BlogEntry,
  target: Locale,
): Promise<BlogEntry | undefined> {
  const all = await getCollection('blog');
  return all.find(
    (e) => e.data.locale === target && e.data.translationKey === entry.data.translationKey,
  );
}
```

- [ ] **Step 4: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/lib/dates.ts src/lib/readingTime.ts src/lib/blog.ts
git commit -m "feat(blog): add date, reading-time and blog loader helpers"
```

---

## Task 4: BlogPosting JSON-LD + routes/ui keys

**Files:** Modify `src/lib/jsonLd.ts`, `src/i18n/ui.ts`, `src/i18n/utils.ts`.

- [ ] **Step 1: Add `buildBlogPostGraph` and `buildBlogIndexGraph` to `jsonLd.ts`**

```ts
export function buildBlogPostGraph(
  locale: Locale,
  post: { title: string; excerpt: string; date: Date; url: string },
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date.toISOString(),
        inLanguage: locale,
        url: post.url,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: post.url,
      },
    ],
  };
}

export function buildBlogIndexGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildOrganization(locale), buildWebSite(locale)],
  };
}
```

- [ ] **Step 2: Add `routes.blog`** to `src/i18n/ui.ts` (`fr: '/blog/'`, `en: '/en/blog/'`), and blog UI keys (FR+EN symmetric): `nav.blog` (Blog/Blog), `blog.title`, `blog.sub`, `blog.readingTime` (e.g. fr `min de lecture` / en `min read`), `blog.backToBlog`, `blog.tagsTitle`, `blog.allArticles`, `blog.tagPrefix` (fr `Articles : ` / en `Articles: `). Use sensible copy.

- [ ] **Step 3: Add `localizeBlogPostPath(slug, locale)` and `localizeTagPath(tag, locale)` to `utils.ts`** (mirror `localizeServicePath`: fr `/blog/<slug>/`, en `/en/blog/<slug>/`; tags `/blog/tags/<tag>/`).

- [ ] **Step 4: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/lib/jsonLd.ts src/i18n/ui.ts src/i18n/utils.ts
git commit -m "feat(blog): add BlogPosting JSON-LD, blog routes and i18n keys"
```

---

## Task 5: ArticleCard + BlogLayout

**Files:** Create `src/components/molecules/ArticleCard.astro`, `src/layouts/BlogLayout.astro`, `src/styles/prose.css`.

- [ ] **Step 1: `ArticleCard.astro`** — props `{ href, title, excerpt, date, readingMinutes, tags, locale }`; renders a linked card with date · reading time, title, excerpt, tag pills. Use tokens; `fade-up`.

- [ ] **Step 2: `src/styles/prose.css`** — typography for rendered MDX (`.prose h2/h3/p/ul/a/code/blockquote`) using theme tokens (headings `--font-display`, links `--color-cyan`, comfortable spacing/measure).

- [ ] **Step 3: `BlogLayout.astro`** — wraps an article: `MainLayout` (with `localizedPaths` when a translation exists, `BlogPosting` JSON-LD via head slot), Nav (+ `altHref` when translated), a `<article class="prose">` with title, date · reading time, tags, then `<slot />` (the MDX), a back-to-blog link, Footer. Props: `{ entry, locale, translationSlug? }`.

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import Nav from '@/components/organisms/Nav.astro';
import Footer from '@/components/organisms/Footer.astro';
import JsonLd from '@/components/atoms/JsonLd.astro';
import Tag from '@/components/atoms/Tag.astro';
import { buildBlogPostGraph } from '@/lib/jsonLd';
import { formatDate } from '@/lib/dates';
import { useTranslations, localizeBlogPostPath, localizePath } from '@/i18n/utils';
import { SITE_URL } from '@/lib/constants';
import '@/styles/prose.css';
import type { Locale } from '@/types';
import type { BlogEntry } from '@/lib/blog';

interface Props {
  entry: BlogEntry;
  slug: string;
  locale: Locale;
  readingMinutes: number;
  translationSlug?: string;
}
const { entry, slug, locale, readingMinutes, translationSlug } = Astro.props;
const t = useTranslations(locale);
const selfPath = localizeBlogPostPath(slug, locale);
const url = new URL(selfPath, SITE_URL).href;
const localizedPaths = translationSlug
  ? {
      fr: localizeBlogPostPath(locale === 'fr' ? slug : translationSlug, 'fr'),
      en: localizeBlogPostPath(locale === 'en' ? slug : translationSlug, 'en'),
    }
  : undefined;
const altHref = localizedPaths ? (locale === 'fr' ? localizedPaths.en : localizedPaths.fr) : undefined;
const graph = buildBlogPostGraph(locale, {
  title: entry.data.title,
  excerpt: entry.data.excerpt,
  date: entry.data.date,
  url,
});
const blogHref = localizePath('blog', locale);
---

<MainLayout
  title={`${entry.data.title} | Karib Teck`}
  description={entry.data.excerpt}
  locale={locale}
  localizedPaths={localizedPaths}
>
  <Fragment slot="head"><JsonLd data={graph} /></Fragment>
  <Nav slot="nav" locale={locale} altHref={altHref} />
  <article class="prose">
    <p class="meta">{formatDate(entry.data.date, locale)} · {readingMinutes} {t('blog.readingTime')}</p>
    <h1>{entry.data.title}</h1>
    <div class="tags">{entry.data.tags.map((tag) => <Tag label={tag} />)}</div>
    <slot />
    <p><a href={blogHref}>← {t('blog.backToBlog')}</a></p>
  </article>
  <Footer slot="footer" locale={locale} />
</MainLayout>

<style>
  .prose {
    max-width: 720px;
    margin: 0 auto;
    padding: calc(var(--nav-height) + 64px) 5% 96px;
  }
  .prose .meta {
    color: var(--color-gray);
    font-size: 0.9rem;
  }
  .prose h1 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 2.8rem);
    margin: 8px 0 16px;
  }
  .prose .tags {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
  }
</style>
```

- [ ] **Step 4: Verify + commit**

Run: `npm run check && npm run lint`
Expected: clean.

```bash
git add src/components/molecules/ArticleCard.astro src/layouts/BlogLayout.astro src/styles/prose.css
git commit -m "feat(blog): add ArticleCard, BlogLayout and prose styles"
```

---

## Task 6: Blog routes (index, article, tags) FR + EN + RSS

**Files:** Create `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/blog/tags/[tag].astro`, `src/pages/rss.xml.ts`, and the `src/pages/en/...` mirror + `src/pages/en/rss.xml.ts`.

- [ ] **Step 1: `src/pages/blog/index.astro`** (FR) — `loadPosts('fr')`, render `MainLayout` (route `blog`, `buildBlogIndexGraph` JSON-LD via head slot) + Nav + a header (`blog.title`/`blog.sub`) + grid of `ArticleCard` (href via `localizeBlogPostPath`, reading time via `computeReadingTime(entry.body)`) + tag list (links via `localizeTagPath`) + Footer. EN mirror at `src/pages/en/blog/index.astro` with `'en'` + `altHref`/`localizedPaths` (blog index translation always exists → toggle to the other index).

- [ ] **Step 2: `src/pages/blog/[slug].astro`** (FR) — `getStaticPaths` over `loadPosts('fr')` (slug via `entrySlug`); in the page, `render(entry)` the MDX, compute reading time, look up `findTranslation(entry,'en')` → its slug for `translationSlug`, render through `BlogLayout` with `<Content />`. EN mirror under `en/blog/[slug].astro` with `'en'`/`findTranslation(...,'fr')`.

```astro
---
import BlogLayout from '@/layouts/BlogLayout.astro';
import { loadPosts, entrySlug, findTranslation } from '@/lib/blog';
import { computeReadingTime } from '@/lib/readingTime';
import { render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import type { Locale } from '@/types';

const locale: Locale = 'fr';

export const getStaticPaths = (async () => {
  const posts = await loadPosts('fr');
  return Promise.all(
    posts.map(async (entry) => {
      const translation = await findTranslation(entry, 'en');
      return {
        params: { slug: entrySlug(entry) },
        props: { entry, translationSlug: translation ? entrySlug(translation) : undefined },
      };
    }),
  );
}) satisfies GetStaticPaths;

const { entry, translationSlug } = Astro.props;
const { Content } = await render(entry);
const readingMinutes = computeReadingTime(entry.body);
const slug = entrySlug(entry);
---

<BlogLayout entry={entry} slug={slug} locale={locale} readingMinutes={readingMinutes} translationSlug={translationSlug}>
  <Content />
</BlogLayout>
```

- [ ] **Step 3: `src/pages/blog/tags/[tag].astro`** (FR) — `getStaticPaths` over `allTags('fr')`; page lists `loadPostsByTag('fr', tag)` as `ArticleCard`s under a `blog.tagPrefix + tag` header, with `buildBlogIndexGraph` JSON-LD (Organization present → validator passes). EN mirror under `en/blog/tags/[tag].astro`.

- [ ] **Step 4: `src/pages/rss.xml.ts`** (FR) + `src/pages/en/rss.xml.ts` (EN) using `@astrojs/rss`:

```ts
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadPosts, entrySlug } from '@/lib/blog';
import { localizeBlogPostPath } from '@/i18n/utils';
import { ORGANIZATION_NAME } from '@/lib/constants';

export async function GET(context: APIContext) {
  const posts = await loadPosts('fr');
  return rss({
    title: `${ORGANIZATION_NAME} — Blog`,
    description: 'Articles de Karib Teck, agence web aux Antilles.',
    site: context.site!,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.excerpt,
      pubDate: entry.data.date,
      link: localizeBlogPostPath(entrySlug(entry), 'fr'),
    })),
  });
}
```

(EN: `loadPosts('en')`, English title/description, `localizeBlogPostPath(..., 'en')`.)

- [ ] **Step 5: Verify + build**

Run: `rm -rf dist .astro && npm run check && npm run build`
Expected: 0/0; emits `dist/blog/index.html`, `dist/blog/<slug>/index.html` (×2), `dist/blog/tags/<tag>/index.html`, `dist/rss.xml`, and the `dist/en/...` mirror.

```bash
git add src/pages/blog src/pages/rss.xml.ts src/pages/en/blog src/pages/en/rss.xml.ts
git commit -m "feat(blog): add blog index, article, tag pages and RSS (FR+EN)"
```

---

## Task 7: Wire blog into nav/footer + llms.txt + final gate

**Files:** Modify `src/data/agency.ts` (nav), `src/components/organisms/Footer.astro` (link), `src/lib/geo.ts` (list posts), then gate.

- [ ] **Step 1: Add blog to nav** — `NAV_LINKS` gets `{ labelKey: 'nav.blog', href: ... }`. Since nav links are same-page anchors but blog is a real route, make the blog nav item a real localized link. Simplest: render nav links that start with `#` as anchors and others as full paths. Add the blog link in `NavMenu` pointing to `localizePath('blog', locale)`. (Adjust `NavMenu` to handle a route-based blog link alongside anchor links — e.g. add a dedicated blog `<li>` after the anchor list, before the devis button.)

- [ ] **Step 2: Footer** — add a "Blog" link (`localizePath('blog', locale)`) in the company/links column.

- [ ] **Step 3: `lib/geo.ts`** — extend `buildLlmsFullTxt` (and optionally `buildLlmsTxt`) to list published FR posts (`loadPosts('fr')`): title + excerpt + link. (These builders become async — update the `.txt.ts` route handlers to `await`.)

- [ ] **Step 4: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`
Expected: all green. `validate:jsonld` now covers the blog pages too (index, 2 articles, tag pages, EN mirror) — all carry Organization JSON-LD.

- [ ] **Step 5: Spot-checks**
  - `dist/blog/index.html` lists 2 articles (FR); `dist/en/blog/index.html` lists 2 (EN).
  - An article page (`dist/blog/site-rapide-antilles/index.html`): rendered MDX (h2 sections), date + reading time, tags, `BlogPosting` JSON-LD (parses, has `headline`/`datePublished`/`inLanguage:fr`) + Organization; canonical + hreflang to the EN translation; LangToggle → EN article.
  - `dist/blog/tags/seo/index.html` lists the tagged post(s).
  - `dist/rss.xml` + `dist/en/rss.xml` valid, list the posts.
  - Nav + footer have a working Blog link (both locales).
  - Honesty: `grep -rEn "50\+|98%|Clients satisfaits|Projets livrés" dist src` → nothing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(blog): wire blog into nav/footer and llms.txt; verify bilingual blog" 
```

---

## Self-review notes (against spec §6.3, §8.2, CLAUDE.md)

- **Bilingual blog (spec §6.3):** collection FR/EN, index/[slug]/tags, RSS, `translationKey` pairing, toggle/hreflang only when translation exists. ✅
- **BlogPosting JSON-LD (spec §8.2):** per-article + Organization (validator covers all blog pages). ✅
- **GEO:** `llms-full.txt` lists posts → AI-citable. ✅
- **Conventions:** logic in `lib/blog.ts` (no logic in markup), Zod schema in `content.config.ts`, no hardcoded UI strings, `BlogLayout` composes, `<Image>` n/a (no post images yet), TS strict. ✅
- **Honesty:** seed articles are genuine, non-promotional, no fabricated proof. ✅
- **Deferred (correctly absent):** pagination/search/comments, post cover images + OG-per-post (V1.1), real NAP. Noted, not gaps.
- **Placeholder scan:** Tasks 2/6 describe the 2nd article pair and the EN route mirrors by analogy to fully-shown FR examples — bounded, unambiguous (mirror the structure, translate the copy). Seed dates are fixed literals (no `Date.now`).
```
