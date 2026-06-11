// One-off link auditor over dist/. Not wired into CI.
// Validates every <a href> and <form action> in the built site:
//  - internal paths resolve to an existing dist file
//  - in-page anchors (#id) point to a real id on that page
//  - external / mailto / tel / whatsapp links are reported for eyeballing
//  - flags dead markers: href="#", href="", missing
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

const htmlFiles = [];
for await (const f of glob('**/*.html', { cwd: DIST })) htmlFiles.push(f);

// Build the set of routable URL paths that exist in dist.
const existingPaths = new Set();
for (const f of htmlFiles) {
  // dist/contact/index.html -> /contact/ and /contact
  const url = '/' + f.replace(/index\.html$/, '').replace(/\.html$/, '');
  existingPaths.add(url);
  existingPaths.add(url.replace(/\/$/, '') || '/');
}
// Also accept any non-html asset that physically exists (sitemap, rss, etc.)
const assetFiles = [];
for await (const f of glob('**/*', { cwd: DIST })) assetFiles.push('/' + f);
const assetSet = new Set(assetFiles);

const ATTR = /(?:href|action)\s*=\s*"([^"]*)"/gi;
const ID = /\bid\s*=\s*"([^"]+)"/gi;

const dead = []; // {page, link, reason}
const anchors = []; // {page, link, reason}
const external = new Map(); // url -> count

function idsOf(html) {
  const s = new Set();
  let m;
  while ((m = ID.exec(html))) s.add(m[1]);
  return s;
}

for (const f of htmlFiles) {
  const html = readFileSync(join(DIST, f), 'utf8');
  const pageUrl = '/' + f.replace(/index\.html$/, '');
  const ids = idsOf(html);
  let m;
  ATTR.lastIndex = 0;
  while ((m = ATTR.exec(html))) {
    const raw = m[1].trim();
    if (raw === '' || raw === '#') {
      dead.push({ page: pageUrl, link: raw || '(empty)', reason: 'dead marker' });
      continue;
    }
    if (/^(mailto:|tel:|https?:\/\/wa\.me|https?:\/\/api\.whatsapp)/i.test(raw)) {
      external.set(raw, (external.get(raw) || 0) + 1);
      continue;
    }
    if (/^https?:\/\//i.test(raw)) {
      external.set(raw, (external.get(raw) || 0) + 1);
      continue;
    }
    if (raw.startsWith('#')) {
      const id = decodeURIComponent(raw.slice(1));
      if (!ids.has(id)) anchors.push({ page: pageUrl, link: raw, reason: 'missing #id on page' });
      continue;
    }
    // internal path: strip query + hash
    const path = raw.split('#')[0].split('?')[0];
    if (path === '') continue; // pure hash handled above
    const norm = path.endsWith('/') ? path : path; // keep as-is, test both forms
    const candidates = [
      norm,
      norm.endsWith('/') ? norm.slice(0, -1) : norm + '/',
      norm.replace(/\/$/, '') || '/',
    ];
    const ok =
      candidates.some((c) => existingPaths.has(c)) ||
      assetSet.has(path) ||
      assetSet.has(path.replace(/^\//, '/'));
    if (!ok) dead.push({ page: pageUrl, link: raw, reason: 'no matching dist page/asset' });
  }
}

console.log(`Scanned ${htmlFiles.length} pages.`);
console.log('');

if (dead.length === 0) {
  console.log('✓ No dead internal links (no href="#", no empty, no 404 path).');
} else {
  console.log(`✗ ${dead.length} DEAD link(s):`);
  for (const d of dead) console.log(`   [${d.reason}] ${d.link}  — on ${d.page}`);
}
console.log('');

if (anchors.length === 0) {
  console.log('✓ All in-page #anchors resolve to a real id.');
} else {
  console.log(`✗ ${anchors.length} BROKEN anchor(s):`);
  for (const a of anchors) console.log(`   ${a.link}  — on ${a.page}`);
}
console.log('');

console.log(`External / mailto / tel / whatsapp destinations (${external.size} unique):`);
for (const [url, n] of [...external.entries()].sort()) console.log(`   (${n}x) ${url}`);

process.exit(dead.length + anchors.length > 0 ? 1 : 0);
