# KaribTeck Stitch Redesign — Pages (B–F) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the multi-page Stitch structure — real `/services`, `/a-propos`, `/contact` pages (FR+EN) + a lean Stitch Accueil + multi-page nav + per-page JSON-LD — reusing the existing organisms and the Phase-A patterns.

**Architecture:** Each page = `MainLayout` (hero) + recomposed existing organisms + new patterns (`ExpertiseSection` bento, `CtaBand`, `AccentBlock`) + `Footer`, with `localizedPaths` for hreflang and a page-appropriate JSON-LD graph. Content is **recomposed, not rewritten** (reuse `data/*`). Honesty preserved (no fabricated metrics).

**Tech Stack:** Astro 6 static, Tailwind 4 Maritime tokens, TS strict. Builds on Phase A.

> **Spec:** `docs/superpowers/specs/2026-06-11-karibteck-stitch-multipage-design.md`. **Execution order (keeps the site coherent): C (/services) → D (/a-propos) → E (/contact) → B (lean Accueil + nav switch) → F (SEO/QA).** Pages C/D/E are additive (home/nav untouched); B trims the home and switches the nav once destinations exist.
>
> **Available patterns (Phase A):** `BentoGrid` (children set `--col`/`--row` inline), `ExpertiseCard` (`item: ExpertiseItem` {variant light|dark|stat, icon?, title, description, stat?, col?}), `AccentBlock` (`variant teal|sunset`, icon?, title, description?), `CtaBand` (`locale?`). Existing organisms to reuse: `Hero`, `ServicesSection`, `StackSection`, `ProcessSection`, `WhySection`, `ProjectsSection`, `TeamSection`, `GuaranteesSection`, `PricingSection`, `FaqSection`, `ContactSection`. Existing pages: `/services/[slug]`, `/blog/*`, legal, `/merci`. `localizePath(routeKey, locale)` + routes `services`/`about`/`contact` exist.

---

## Shared rule: page hero + section shell

Pages reuse a **deep-ocean hero band** (full-width `background: var(--color-primary)`, light text, inner content `max-width: var(--content-max); margin:0 auto; padding: calc(var(--nav-height)+72px) 5% 72px`). Each content section: `padding: var(--section-pad-y) 5%`, inner `max-width: var(--content-max); margin:0 auto`, alternating `background: var(--color-surface)` / `var(--color-surface-alt)` for rhythm. Every page ends with `<CtaBand locale={locale} />` before `<Footer>`. All section headings via `SectionHeader`/`ui.ts` (no hardcoded UI strings).

> To avoid markup churn, build each page's hero + bento inline in the page-specific organism, OR add a small reusable `PageHero.astro` (props: `badge?`, `titleLead`, `titleHl`, `sub`, `locale`) — recommended; create it in Phase C and reuse in D/E.

---

## Phase C — `/services` page

**Files:** Create `src/components/organisms/PageHero.astro`, `src/components/organisms/SolutionsBento.astro`, `src/data/expertise.ts` (shared, also used by Accueil/À-propos), `src/pages/services/index.astro`, `src/pages/en/services/index.astro`. Modify `src/i18n/ui.ts` (services-page strings), `src/lib/jsonLd.ts` (`buildServicesIndexGraph`).

- [ ] **Step 1: `PageHero.astro`** — deep-ocean hero band. Props `{ badge?: string; titleLead: string; titleHl: string; sub: string }`. Renders `SectionBadge` (if badge), `<h1>` with `<Highlight text={titleHl}/>`, sub paragraph. Full-width primary background, light text, content centered to `--content-max`.

- [ ] **Step 2: `SolutionsBento.astro`** — `<section id="solutions">` with `SectionHeader` + a `BentoGrid` of the 6 services as `ServiceCard`s wrapped to set `--col` (e.g. spans 6/6/4/4/4/12 for asymmetry), each linking to `/services/<slug>` via `localizeServicePath`. Reuse `getServices(locale)`. (If `ServiceCard` doesn't accept a span, wrap each in a `<div style="--col:N">`.)

- [ ] **Step 3: `src/pages/services/index.astro` (FR)** — composes: `MainLayout` (route `services`, `localizedPaths={{fr:'/services/',en:'/en/services/'}}`, `buildServicesIndexGraph` JSON-LD via head slot) · `Nav` (altHref EN) · `PageHero` (services strings) · `SolutionsBento` · `ProcessSection` · `ProjectsSection` · `PricingSection` · `CtaBand` · `Footer`. EN mirror `src/pages/en/services/index.astro` with `locale='en'`.

- [ ] **Step 4: `buildServicesIndexGraph(locale)`** in `jsonLd.ts` = `@graph`[ Organization, WebSite, ...buildServices(locale), BreadcrumbList(home›services) ]. (Reuse existing `buildOrganization`/`buildWebSite`/`buildServices`.)

- [ ] **Step 5: i18n** — `services.page.*` (hero badge/title/sub) FR+EN. **Important:** `/services/[slug]` already exists as a dynamic route; adding `/services/index.astro` is a new route at `/services/` — verify no Astro routing conflict (index vs [slug] coexist fine).

- [ ] **Step 6: Gate + commit.** `npm run check && npm run build && npm run validate:jsonld` (now 38 pages: +2). Old-token/honesty greps clean. Visual QA `/services/` FR+EN vs the `nos_services` maquette.

```bash
git add -A && git commit -m "feat(pages): add /services index page (Stitch bento solutions)"
```

---

## Phase D — `/a-propos` page

**Files:** Create `src/components/organisms/ExpertiseSection.astro` (bento, shared with Accueil), `src/pages/a-propos.astro`, `src/pages/en/about.astro`. Modify `src/i18n/ui.ts` (about-page strings), `src/lib/jsonLd.ts` (`buildAboutGraph`).

- [ ] **Step 1: `expertise.ts`** (create here if not in C) — `getExpertise(locale): ExpertiseItem[]` from `why.ts` points + `stack` count: e.g. 4 cards incl. one `dark` ("Excellence technique") and one `stat` (honest, e.g. `"24h"` réponse, or `"100%"` sur-mesure), with `col` spans for bento.

- [ ] **Step 2: `ExpertiseSection.astro`** — `<section>` + `SectionHeader` (`expertise.*` strings) + `BentoGrid` of `ExpertiseCard`(getExpertise(locale)).

- [ ] **Step 3: `src/pages/a-propos.astro` (FR)** — `MainLayout` (route `about`, `localizedPaths`, `buildAboutGraph` JSON-LD) · `Nav` · `PageHero` (about strings) · `ExpertiseSection` (standards techniques) · `GuaranteesSection` (engagements) · `WhySection` (ancrage local, with AccentBlock) · `TeamSection` (équipe) · `CtaBand` · `Footer`. EN mirror `en/about.astro`.

- [ ] **Step 4: `buildAboutGraph(locale)`** = `@graph`[ Organization, WebSite, { '@type':'AboutPage', '@id': .../#aboutpage, url, name }, BreadcrumbList ].

- [ ] **Step 5: i18n** `about.page.*` FR+EN.

- [ ] **Step 6: Gate + commit** (40 pages). Visual QA vs `propos` maquette.

```bash
git add -A && git commit -m "feat(pages): add /a-propos page (standards, engagements, team)"
```

---

## Phase E — `/contact` page

**Files:** Create `src/components/molecules/ContactInfoCard.astro`, `src/components/molecules/CalEmbed.astro`, `src/components/molecules/BudgetChips.astro`, `src/components/organisms/ContactColumns.astro`, `src/components/organisms/LocalExcellence.astro`, `src/pages/contact.astro`, `src/pages/en/contact.astro`. Modify `src/components/molecules/ContactForm.astro` (add `BudgetChips`), `src/i18n/ui.ts`, `src/lib/jsonLd.ts` (`buildContactGraph`).

- [ ] **Step 1: `BudgetChips.astro`** — radio-group styled as chips (`< 1 000 €` / `1 000–3 000 €` / `3 000–10 000 €` / `> 10 000 €`), `name="budget"`, submitted with the Web3Forms form. Labels via `ui.ts`.

- [ ] **Step 2: `ContactForm.astro`** — insert `<BudgetChips/>` before the message field (it's inside the form so Web3Forms picks up `budget`). Keep everything else.

- [ ] **Step 3: `ContactInfoCard.astro`** — `{icon, title, children/lines}` white card (office/NAP, email mailto, booking). `CalEmbed.astro` — Cal.com inline embed via official script island (`is:inline` loader) when `CALCOM_URL` set, else a `Button` link (graceful). `BudgetChips`/cards use tokens.

- [ ] **Step 4: `ContactColumns.astro`** — 2-col grid (`1fr 1fr`, → 1 col mobile): left `ContactForm`, right 3 `ContactInfoCard` (bureau via `getContactDetails`, email, RDV `CalEmbed`).

- [ ] **Step 5: `LocalExcellence.astro`** — honest "Strategic Local Excellence" band: `StatCard`/blocks with **real `AREA_SERVED` zones** (Guadeloupe, Martinique, Guyane, Saint-Martin, Saint-Barthélemy) + `AccentBlock` (support FR/EN, code propre…). **No fabricated "120+".**

- [ ] **Step 6: `src/pages/contact.astro` (FR)** — `MainLayout` (route `contact`, `buildContactGraph` JSON-LD) · `Nav` · `PageHero` (contact strings) · `ContactColumns` · `FaqSection` · `LocalExcellence` · `Footer`. (No CtaBand — the page IS the conversion.) EN mirror `en/contact.astro`.

- [ ] **Step 7: `buildContactGraph(locale)`** = `@graph`[ Organization/ProfessionalService (with NAP + areaServed + geo — reuse `buildOrganization`), { '@type':'ContactPage', url }, FAQPage (getFaq), BreadcrumbList ].

- [ ] **Step 8: i18n** `contact.page.*`, `contact.budget.*`, `contact.info.*`, `local.*` FR+EN.

- [ ] **Step 9: Gate + commit** (42 pages). Honesty grep (no `120`, no fabricated). Visual QA vs `contact` maquette (2-col, chips, calendar, honest stats).

```bash
git add -A && git commit -m "feat(pages): add /contact page (2-col form, budget chips, Cal, honest stats)"
```

---

## Phase B — Lean Accueil + multi-page nav

**Files:** Modify `src/components/organisms/HomePage.astro`, `src/data/agency.ts` (NAV_LINKS → pages), `src/components/molecules/NavMenu.astro` (page links not anchors), `src/components/organisms/Footer.astro` (links → pages).

- [ ] **Step 1: Rebuild `HomePage.astro`** to the lean Stitch composition: `Hero` · `ExpertiseSection` · `ServicesSection` (overview — keep, with a "Tous nos services" link to `/services`) · `ProjectsSection` · `WhySection` (stats + AccentBlock) · `CtaBand` · `Footer`. **Remove** from home: `StackSection`, `ProcessSection`, `TeamSection`, `GuaranteesSection`, `PricingSection`, `FaqSection`, `ContactSection` (now on /services, /a-propos, /contact). Keep the home's `buildHomeGraph` JSON-LD.

- [ ] **Step 2: Switch nav to multi-page.** `NAV_LINKS` → `[{labelKey:'nav.services', href: services route}, {nav.aboutPage → about}, {nav.projects → /services#…? no — drop projects or → /services}, {nav.pricing → /services#tarifs? }]`. Concretely set the 4 lean items: **Services (`localizePath('services')`) · À propos (`localizePath('about')`) · Blog (`localizePath('blog')`) · Contact (`localizePath('contact')`)**. Update `NavMenu.astro` to render these as full-path links (it already special-cases the blog link; generalize so all are page links, Devis button → `localizePath('contact')`). Remove the old anchor links.

- [ ] **Step 3: Footer** — point footer service links to `/services`, add À propos/Contact, legal unchanged.

- [ ] **Step 4: Gate + commit.** `validate:jsonld` still green (home keeps Organization). Visual QA: lean home FR+EN vs `accueil` maquette; nav = 4 page links + Devis; all nav links resolve (no broken anchors).

```bash
git add -A && git commit -m "feat(pages): lean Stitch home + multi-page nav"
```

---

## Phase F — SEO & QA

- [ ] **Step 1: Per-page JSON-LD verified** — `/services` Service graph, `/a-propos` AboutPage, `/contact` ContactPage+FAQPage, all carry Organization. `validate:jsonld` ✓ all pages.
- [ ] **Step 2: hreflang** on every new page (fr↔en via `localizedPaths`); sitemap includes them.
- [ ] **Step 3: Full gate** `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`.
- [ ] **Step 4: Honesty grep** `grep -rEn "50\+|98%|120\+|Clients satisfaits|Projets livrés|projects delivered" dist src` → nothing.
- [ ] **Step 5: Visual QA pass** (dev server): each page FR+EN vs its maquette; nav; responsive (bento → 1 col mobile, contact 2-col → 1 col). Fix regressions.
- [ ] **Step 6: Commit** `git commit -m "test(stitch): verify multi-page redesign vs maquettes" --allow-empty`.

---

## Self-review notes (against spec §4–§6)

- **4 pages (spec §4):** /services (C), /a-propos (D), /contact (E), lean Accueil (B) — each composing the maquette sections. ✅
- **Nav multi-page (spec §5):** Services·À propos·Blog·Contact + Devis (Phase B Step 2). ✅
- **Patterns reused:** BentoGrid/ExpertiseCard/AccentBlock/CtaBand (Phase A) + reused organisms. ✅
- **SEO (spec §6):** ServicesIndex/About/Contact graphs + Organization everywhere; hreflang; validator (Phase F). ✅
- **Honesty:** LocalExcellence uses real AREA_SERVED, no "120+"; team = initials; grep gate (Phase F). ✅
- **Order keeps site coherent:** pages built before home-trim/nav-switch. ✅
- **Note:** content recomposed from existing `data/`/organisms — no rewrite; tarifs→/services, faq→/contact, garanties→/a-propos per §2.
```
