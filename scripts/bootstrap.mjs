// Idempotent project bootstrap — runs automatically via `postinstall`,
// or manually with `npm run bootstrap`. Safe to re-run any number of times.
// Heavy verification lives in `npm run verify`, not here.
import { existsSync, copyFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const log = (msg) => console.log(`[bootstrap] ${msg}`);

// 1. Scaffold .env from .env.example if it doesn't exist (never overwrite).
if (existsSync('.env')) {
  log('.env present — left untouched');
} else if (existsSync('.env.example')) {
  copyFileSync('.env.example', '.env');
  log('created .env from .env.example (fill in PUBLIC_* when available)');
} else {
  log('no .env.example — skipped env scaffold');
}

// 2. Restore pinned agent skills from skills-lock.json (non-fatal: offline / CLI
//    unavailable must never break `npm install`).
if (existsSync('skills-lock.json')) {
  try {
    execSync('npx --yes skills experimental_install', { stdio: 'inherit' });
    log('agent skills restored from skills-lock.json');
  } catch {
    log('skills restore skipped — run `npx skills experimental_install` later');
  }
} else {
  log('no skills-lock.json — skipped skills restore');
}

log('done. Next: `npm run verify` to prove the project builds and passes all gates.');
