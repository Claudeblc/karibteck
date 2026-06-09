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

function hasOrganization(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.some((m) => {
    try {
      const json = JSON.stringify(JSON.parse(m[1]));
      return json.includes('"Organization"');
    } catch {
      return false;
    }
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
