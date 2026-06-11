import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function typeIncludesOrganization(node) {
  if (!node || typeof node !== 'object') return false;
  const t = node['@type'];
  return t === 'Organization' || (Array.isArray(t) && t.includes('Organization'));
}

function hasOrganization(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.some((m) => {
    let parsed;
    try {
      parsed = JSON.parse(m[1]);
    } catch {
      return false;
    }
    const nodes = Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed];
    return nodes.some(typeIncludesOrganization);
  });
}

const files = await htmlFiles(DIST);
const missing = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (!hasOrganization(html)) missing.push(file);
}

if (missing.length) {
  console.error(`✗ ${missing.length} page(s) missing Organization JSON-LD:`);
  for (const f of missing) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`✓ All ${files.length} page(s) have Organization JSON-LD.`);
