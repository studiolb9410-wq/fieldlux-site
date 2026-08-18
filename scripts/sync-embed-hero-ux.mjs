/* Re-emit the HERO_UX block of embed/index.html from scripts/build-embed.mjs.
 *
 *   node scripts/sync-embed-hero-ux.mjs          # write
 *   node scripts/sync-embed-hero-ux.mjs --check  # verify only, non-zero if stale
 *
 * WHY THIS EXISTS. embed/ is a build artifact and the rule is that it is never
 * hand-edited: it is produced by scripts/build-embed.mjs, which runs a full
 * FIELDLUX_SECURE=1 Vite build of the app repo. That build is the right tool
 * when the APP changes, and much too big a hammer when only the host-side
 * interaction layer changes -- the cursor, the intro, the scroll guards -- none
 * of which touch a single app module.
 *
 * That layer is one template literal, HERO_UX, and it is injected verbatim
 * immediately before </head>. So it can be re-emitted on its own, and the
 * artifact stays byte-identical to what a full rebuild would produce, without
 * rebuilding 12 MB of bundle to change a CSS rule.
 *
 * The two markers are structural, not guessed: build-embed.mjs assembles the
 * head as `... + VERCEL_STUBS + HERO_UX + '  </head>'`, so HERO_UX is exactly
 * the span between the last `text/fieldlux-disabled` stub and `  </head>`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const GEN = join(ROOT, 'scripts/build-embed.mjs');
const ART = join(ROOT, 'embed/index.html');
const CHECK = process.argv.includes('--check');

const die = (msg) => { console.error(`\n  FAILED: ${msg}\n`); process.exit(1); };

/* ---- 1. lift HERO_UX out of the generator ------------------------------- */
const genLines = readFileSync(GEN, 'utf8').split(/\r?\n/);
const openIdx = genLines.findIndex((l) => l.startsWith('const HERO_UX = `'));
if (openIdx < 0) die(`${GEN} has no \`const HERO_UX = \`` + '`' + ' declaration.');

let closeIdx = -1;
for (let i = openIdx + 1; i < genLines.length; i++) {
  if (genLines[i] === '`;') { closeIdx = i; break; }
}
if (closeIdx < 0) die('HERO_UX is never closed by a line reading exactly "`;".');

/* The opening line carries the first line of the literal after the backtick,
   and the literal ends with a newline, which shows up as a trailing empty
   element. Both are template-literal mechanics, not content. */
const body = [genLines[openIdx].replace('const HERO_UX = `', ''), ...genLines.slice(openIdx + 1, closeIdx)];
while (body.length && body[body.length - 1] === '') body.pop();
const heroUx = body.join('\n');

if (heroUx.includes('${')) {
  die('HERO_UX has grown an interpolation. This script emits it verbatim, so it\n' +
      '  can no longer be trusted. Either keep HERO_UX static or run the full build.');
}

/* ---- 2. splice it into the artifact ------------------------------------- */
const artLines = readFileSync(ART, 'utf8').split(/\r?\n/);
const stubIdx = artLines.reduce((acc, l, i) => (l.includes('text/fieldlux-disabled') ? i : acc), -1);
if (stubIdx < 0) die(`${ART} has no Vercel stub line to anchor to.`);
const headIdx = artLines.findIndex((l, i) => i > stubIdx && l === '  </head>');
if (headIdx < 0) die(`${ART} has no "  </head>" after the stubs.`);

const next = [...artLines.slice(0, stubIdx + 1), ...heroUx.split('\n'), ...artLines.slice(headIdx)].join('\n');
const current = readFileSync(ART, 'utf8');

if (next === current) {
  console.log('  embed/index.html is in sync with build-embed.mjs.');
  process.exit(0);
}
if (CHECK) {
  die('embed/index.html is STALE against scripts/build-embed.mjs.\n' +
      '  Run: node scripts/sync-embed-hero-ux.mjs');
}
writeFileSync(ART, next);
console.log(`  embed/index.html re-emitted (${heroUx.split('\n').length} HERO_UX lines).`);
