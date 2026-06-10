# KaribTeck Phase 6 — Functional Contact + Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the contact section functional — a working Web3Forms submission (static-friendly), a Cal.com booking CTA, and a WhatsApp CTA — plus a thank-you page and the three legal pages (legal notice / privacy / terms), all bilingual. Wire the footer's dead legal links.

**Architecture:** The form posts natively to Web3Forms with an access key from `PUBLIC_WEB3FORMS_KEY`, a honeypot, and a `redirect` to a localized thank-you page (zero JS). Cal/WhatsApp are localized link buttons driven by `PUBLIC_CALCOM_URL` / `PUBLIC_WHATSAPP_NUMBER`. Legal content lives in `src/data/legal.ts` (`Localized`), rendered by a `LegalPage` organism through `MainLayout`. New `routes` entries (translated slugs) drive nav/footer links + hreflang. Every new page carries Organization JSON-LD (validator).

**Tech Stack:** Astro 6 static, Web3Forms (no backend), TS strict. Builds on Phases 0–5. **All external IDs are `PUBLIC_` env placeholders** — the site is fully functional once real values are set; with empty values the CTAs degrade gracefully.

> **Legal copy authored here** as honest GENERIC TEMPLATES with explicit `[…]` placeholders for the legal entity (raison sociale, SIRET, RCS, directeur de publication, hébergeur). **Spec:** §6.1 (contact), §6.4 (legal pages), §9 (Web3Forms + Cal + WhatsApp). **Conventions:** `CLAUDE.md`.

---

## Scope

**In scope:** Web3Forms wiring on `ContactForm` (access key, honeypot, names, required, redirect) + thank-you pages (FR `/merci`, EN `/en/thank-you`); `CalButton` + `WhatsAppButton` molecules in `ContactSection`; footer WhatsApp link; `src/data/legal.ts` + `LegalPage` organism + 3 legal pages × 2 locales; `routes` entries (legalNotice/privacy/terms/thankYou); footer legal links wired; `env.d.ts` typing for the new `PUBLIC_` vars; Organization JSON-LD on every new page.

**NOT in scope:** server-side form handling (Web3Forms is the backend), real legal-entity data (placeholders), an inline Cal embed widget (a link button is used; full embed is a later option), VPS deploy (Phase 7, standby).

---

## Task 1: Env typing + contact constants

**Files:** Create `src/env.d.ts`; modify `src/lib/constants.ts`.

- [ ] **Step 1: Create `src/env.d.ts`** typing the public env vars

```ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_KEY?: string;
  readonly PUBLIC_CALCOM_URL?: string;
  readonly PUBLIC_WHATSAPP_NUMBER?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 2: Add accessors to `src/lib/constants.ts`** (read env with safe fallbacks)

```ts
export const WEB3FORMS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
export const CALCOM_URL = import.meta.env.PUBLIC_CALCOM_URL ?? '';
export const WHATSAPP_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '';
```

- [ ] **Step 3: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/env.d.ts src/lib/constants.ts
git commit -m "chore: type PUBLIC_ env vars and add contact constants"
```

---

## Task 2: Wire the Web3Forms submission + thank-you pages

**Files:** Modify `src/components/molecules/ContactForm.astro`; add `routes.thankYou` + UI keys; create `src/pages/merci.astro`, `src/pages/en/thank-you.astro`.

- [ ] **Step 1: `routes` + UI keys.** In `src/i18n/ui.ts` add `routes.thankYou` (`fr: '/merci/'`, `en: '/en/thank-you/'`) and keys (FR+EN symmetric): `contact.form.firstNamePlaceholder`-style keys already exist; add `thankYou.title`, `thankYou.body`, `thankYou.back`. Also a `contact.form.required` note is optional.

- [ ] **Step 2: `ContactForm.astro` — make it submit to Web3Forms.** Read `WEB3FORMS_KEY` + `localizePath('thankYou', locale)`; build an absolute redirect URL (`new URL(thankYouPath, SITE_URL).href`). Set the form `action="https://api.web3forms.com/submit"` `method="POST"`. Add hidden inputs: `access_key` (= WEB3FORMS_KEY), `redirect` (= absolute thank-you URL), `subject` (e.g. "Nouvelle demande de devis — Karib Teck"), `from_name` ("Karib Teck"), and a honeypot `<input type="checkbox" name="botcheck" class="hidden" style="display:none">`. Give every real field a `name` (`first_name`, `last_name`, `email`, `phone`, `company`, `message`) and add `required` to the essential ones (email, message). The form must `accept` locale as a prop (it already does or gets it).

```astro
---
import { useTranslations, localizePath } from '@/i18n/utils';
import { WEB3FORMS_KEY, SITE_URL } from '@/lib/constants';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
const redirectUrl = new URL(localizePath('thankYou', locale), SITE_URL).href;
---

<form action="https://api.web3forms.com/submit" method="POST" class="contact-form">
  <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
  <input type="hidden" name="redirect" value={redirectUrl} />
  <input type="hidden" name="subject" value="Nouvelle demande — Karib Teck" />
  <input type="hidden" name="from_name" value="Karib Teck" />
  <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" />
  <!-- existing fields, each given name + label/aria; email & message required -->
  …
  <button type="submit" class="btn-submit">{t('contact.form.submit')}</button>
</form>

<style>
  .hp {
    display: none !important;
  }
  /* keep existing styles */
</style>
```

> Preserve the existing field markup/labels/styles; only add `name`/`required`, the hidden inputs, the honeypot, and the `action`/`method`. If `WEB3FORMS_KEY` is empty (no env set), the form still renders — submission just won't be configured until the key is set; that's the intended placeholder behavior. Do NOT hardcode a key.

- [ ] **Step 3: Thank-you pages.** `src/pages/merci.astro` (FR) + `src/pages/en/thank-you.astro` (EN): `MainLayout` (route `thankYou`, `buildSimplePageGraph` JSON-LD — add this builder in Task 4 OR reuse `buildBlogIndexGraph` which is Organization+WebSite) + Nav + a centered confirmation (`thankYou.title`/`thankYou.body` + a button back to home) + Footer. `<meta name="robots" content="noindex">` on these (thank-you pages shouldn't be indexed) — add an optional `noindex?: boolean` prop to MainLayout that emits `<meta name="robots" content="noindex">` when true.

- [ ] **Step 4: Verify + commit**

Run: `npm run check && npm run build`
Expected: 0/0; `dist/merci/index.html` + `dist/en/thank-you/index.html` built; form has the Web3Forms action + honeypot.

```bash
git add src/components/molecules/ContactForm.astro src/i18n/ui.ts src/layouts/MainLayout.astro src/pages/merci.astro src/pages/en/thank-you.astro
git commit -m "feat(contact): wire Web3Forms submission with honeypot and thank-you pages"
```

---

## Task 3: Cal.com + WhatsApp CTAs

**Files:** Create `src/components/molecules/CalButton.astro`, `src/components/molecules/WhatsAppButton.astro`; modify `src/components/organisms/ContactSection.astro`, `src/components/organisms/Footer.astro`; add UI keys.

- [ ] **Step 1: UI keys** (FR+EN symmetric): `contact.cal` (fr "Réserver un appel" / en "Book a call"), `contact.whatsapp` (fr "Discuter sur WhatsApp" / en "Chat on WhatsApp"), `contact.orDirect` (fr "Ou contactez-nous directement" / en "Or reach us directly").

- [ ] **Step 2: `CalButton.astro`** — renders a link button to `CALCOM_URL` only if set; otherwise renders nothing (graceful). `target="_blank" rel="noopener noreferrer"`.

```astro
---
import Button from '@/components/atoms/Button.astro';
import { CALCOM_URL } from '@/lib/constants';
import { useTranslations } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
---

{
  CALCOM_URL && (
    <a href={CALCOM_URL} target="_blank" rel="noopener noreferrer" class="cal-btn">
      📅 {t('contact.cal')}
    </a>
  )
}

<style>
  .cal-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: var(--radius-card);
    border: 1px solid var(--color-border-accent);
    color: var(--color-white);
    text-decoration: none;
    font-weight: 600;
  }
  .cal-btn:hover {
    border-color: var(--color-cyan);
  }
</style>
```

- [ ] **Step 3: `WhatsAppButton.astro`** — link to `https://wa.me/<WHATSAPP_NUMBER>` (digits only) with a prefilled message, only if `WHATSAPP_NUMBER` set. `target="_blank" rel="noopener noreferrer"`.

```astro
---
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { useTranslations } from '@/i18n/utils';
import { DEFAULT_LOCALE } from '@/lib/constants';
import type { Locale } from '@/types';

interface Props {
  locale?: Locale;
}
const { locale = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(locale);
const href = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : undefined;
---

{
  href && (
    <a href={href} target="_blank" rel="noopener noreferrer" class="wa-btn">
      💬 {t('contact.whatsapp')}
    </a>
  )
}

<style>
  .wa-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: var(--radius-card);
    background: var(--color-navy-3);
    border: 1px solid var(--color-gray-2);
    color: var(--color-white);
    text-decoration: none;
    font-weight: 600;
  }
  .wa-btn:hover {
    border-color: var(--color-cyan);
  }
</style>
```

- [ ] **Step 4: `ContactSection.astro`** — add a CTA row (`contact.orDirect` label + `<CalButton>` + `<WhatsAppButton>`) near the contact details/form. Pass `locale`.

- [ ] **Step 5: `Footer.astro`** — make the WhatsApp social link use the real `wa.me` URL when `WHATSAPP_NUMBER` is set (else keep `#`). (Email already mailto.)

- [ ] **Step 6: Verify + commit**

Run: `npm run check && npm run lint && npm run build`
Expected: clean. With empty env, Cal/WhatsApp buttons render nothing (graceful) — that's expected.

```bash
git add src/components/molecules/CalButton.astro src/components/molecules/WhatsAppButton.astro src/components/organisms/ContactSection.astro src/components/organisms/Footer.astro src/i18n/ui.ts
git commit -m "feat(contact): add Cal.com and WhatsApp CTAs (env-driven, graceful)"
```

---

## Task 4: Legal content + LegalPage + simple-page JSON-LD

**Files:** Create `src/data/legal.ts`, `src/components/organisms/LegalPage.astro`; modify `src/lib/jsonLd.ts`, `src/types/index.ts`.

- [ ] **Step 1: Types** — add to `src/types/index.ts`:

```ts
export interface LegalSection {
  heading: string;
  paragraphs: string[];
}
export interface LegalDoc {
  title: string;
  updated: string;
  sections: LegalSection[];
}
```

- [ ] **Step 2: `src/data/legal.ts`** — `Localized` content with `getLegalNotice/getPrivacy/getTerms(locale): LegalDoc`. Honest generic templates with explicit `[…]` placeholders for entity data. Cover at minimum:
  - **Legal notice (mentions légales)**: éditeur (`[Raison sociale]`, `[forme juridique]`, `[SIRET]`, `[RCS]`, `[adresse]`, `[email]`), directeur de publication (`[Nom]`), hébergeur (`[Hébergeur — à compléter]`), propriété intellectuelle.
  - **Privacy (confidentialité, RGPD)**: données collectées (formulaire de contact : nom, email, téléphone, message), finalité (répondre aux demandes), base légale (consentement), conservation, droits (accès/rectification/suppression — contact `contact@karibteck.com`), sous-traitants (Web3Forms pour l'envoi du formulaire, hébergeur), cookies (analytics si activé).
  - **Terms (CGV)**: objet, devis & commande, tarifs, paiement, délais, livraison & recette, propriété (transfert à paiement complet), responsabilité, droit applicable (français).
  - EN translations of all three.
  - `updated`: a fixed literal date string (e.g. `'2026-06-09'`), NOT `Date.now()`.

  Provide complete FR + EN text. Keep each doc to a handful of concise sections — real, usable placeholder legal text, not lorem ipsum.

- [ ] **Step 3: `buildSimplePageGraph(locale)` in `jsonLd.ts`** (Organization + WebSite) — or reuse `buildBlogIndexGraph` if identical; legal + thank-you pages use it so the validator passes.

- [ ] **Step 4: `LegalPage.astro` organism** — takes `doc: LegalDoc` + `locale`; renders `.prose` with `<h1>{doc.title}`, an "updated" line, and each section as `<h2>` + paragraphs. Reuse `prose.css`.

- [ ] **Step 5: Verify + commit**

Run: `npm run check`
Expected: 0/0.

```bash
git add src/types/index.ts src/data/legal.ts src/lib/jsonLd.ts src/components/organisms/LegalPage.astro
git commit -m "feat(legal): add bilingual legal content, LegalPage and simple-page JSON-LD"
```

---

## Task 5: Legal routes + wire footer links

**Files:** Create `src/pages/{mentions-legales,confidentialite,cgv}.astro` + `src/pages/en/{legal-notice,privacy,terms}.astro`; add `routes` entries; modify `src/components/organisms/Footer.astro`.

- [ ] **Step 1: `routes` entries** in `src/i18n/ui.ts`:

```ts
  fr: { home: '/', blog: '/blog/', legalNotice: '/mentions-legales/', privacy: '/confidentialite/', terms: '/cgv/', thankYou: '/merci/' },
  en: { home: '/en/', blog: '/en/blog/', legalNotice: '/en/legal-notice/', privacy: '/en/privacy/', terms: '/en/terms/', thankYou: '/en/thank-you/' },
```

(Keep any existing keys; add the legal ones.)

- [ ] **Step 2: Legal pages** — each composes `MainLayout` (its route key + `buildSimplePageGraph` JSON-LD via head slot + `localizedPaths` for FR↔EN) + Nav (+`altHref`) + `LegalPage` + Footer. Example `src/pages/mentions-legales.astro`:

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import Nav from '@/components/organisms/Nav.astro';
import Footer from '@/components/organisms/Footer.astro';
import LegalPage from '@/components/organisms/LegalPage.astro';
import JsonLd from '@/components/atoms/JsonLd.astro';
import { getLegalNotice } from '@/data/legal';
import { buildSimplePageGraph } from '@/lib/jsonLd';
import { routes } from '@/i18n/ui';
import type { Locale } from '@/types';

const locale: Locale = 'fr';
const doc = getLegalNotice(locale);
const localizedPaths = { fr: routes.fr.legalNotice, en: routes.en.legalNotice };
const graph = buildSimplePageGraph(locale);
---

<MainLayout title={`${doc.title} | Karib Teck`} description={doc.title} locale={locale} localizedPaths={localizedPaths}>
  <Fragment slot="head"><JsonLd data={graph} /></Fragment>
  <Nav slot="nav" locale={locale} altHref={localizedPaths.en} />
  <LegalPage doc={doc} locale={locale} />
  <Footer slot="footer" locale={locale} />
</MainLayout>
```

Mirror for `confidentialite.astro`/`cgv.astro` (getPrivacy/getTerms, their route keys) and the EN trio under `src/pages/en/` (`legal-notice.astro`/`privacy.astro`/`terms.astro`, `locale='en'`, `altHref` = FR path).

- [ ] **Step 3: Wire footer legal links** — in `Footer.astro` replace the three `href="#"` legal links with `localizePath('legalNotice'|'privacy'|'terms', locale)`.

- [ ] **Step 4: Verify + commit**

Run: `rm -rf dist .astro && npm run check && npm run build`
Expected: 0/0; emits the 6 legal pages + thank-you pages; footer links resolve.

```bash
git add src/pages/mentions-legales.astro src/pages/confidentialite.astro src/pages/cgv.astro src/pages/en src/i18n/ui.ts src/components/organisms/Footer.astro
git commit -m "feat(legal): add bilingual legal pages and wire footer links"
```

---

## Task 6: Final gate

- [ ] **Step 1: Full gate**

Run: `rm -rf dist .astro && npm run check && npm run build && npm run lint && npm run format:check && npm run validate:jsonld`
Expected: all green; `validate:jsonld` covers the new legal + thank-you pages (all have Organization JSON-LD).

- [ ] **Step 2: Spot-checks**
  - `dist/index.html` contact section: form `action="https://api.web3forms.com/submit"`, hidden `access_key`, `redirect` → `https://karibteck.com/merci/`, honeypot `botcheck`, `name` on every field, `required` on email/message.
  - Cal/WhatsApp buttons: with no env set they're ABSENT (graceful); document that setting `PUBLIC_CALCOM_URL`/`PUBLIC_WHATSAPP_NUMBER` enables them. (Optionally test by building with a temp `.env` containing dummy values → buttons appear → then remove.)
  - `dist/merci/index.html` + `dist/en/thank-you/index.html`: confirmation text + `noindex`.
  - Legal pages: `dist/mentions-legales/index.html`, `confidentialite`, `cgv` + EN `legal-notice`/`privacy`/`terms`; each has `<h1>`, sections, Organization JSON-LD, hreflang FR↔EN. Footer legal links point to them (no more `#`).
  - Honesty: `grep -rEn "50\+|98%|Clients satisfaits|Projets livrés" dist src` → nothing.
  - `.env.example` already documents the three PUBLIC_ vars (Phase 0) — confirm still accurate.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test(contact): verify Web3Forms wiring, CTAs and legal pages" --allow-empty
```

---

## Self-review notes (against spec §6.1, §6.4, §9, CLAUDE.md)

- **Functional contact (spec §9):** Web3Forms native POST + honeypot + redirect to thank-you; Cal + WhatsApp env-driven CTAs; no backend. ✅
- **Legal pages (spec §6.4):** 3 docs × 2 locales, footer links wired (no more dead `#`). ✅
- **Graceful placeholders:** empty env → form renders (key blank), CTAs hidden; real values via `.env` enable everything. No invented keys/numbers. ✅
- **i18n/SEO:** legal/thank-you pages bilingual with hreflang + Organization JSON-LD (validator). Thank-you pages `noindex`. ✅
- **Conventions:** legal content in `data/`, builders in `lib/`, no hardcoded UI strings (chrome via `ui.ts`), organisms ≤150 lines, TS strict, env typed in `env.d.ts`. ✅
- **Honesty:** legal text is honest template with explicit `[…]` placeholders for the agency to complete (raison sociale, SIRET, hébergeur). ✅
- **Deferred (correctly absent):** inline Cal embed widget, real legal-entity data, VPS deploy (Phase 7). Noted, not gaps.
- **Placeholder scan:** Tasks 3/5 describe the WhatsApp/EN-legal mirrors by analogy to fully-shown examples — bounded. The `[…]` tokens in legal text are intentional content placeholders for the user.
```
