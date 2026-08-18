/* Rebuild the bundled 3D hero (/embed) from the app repository.
 *
 *   node scripts/build-embed.mjs [pathToAppCheckout]
 *
 * WHY THIS SCRIPT EXISTS
 *   embed/ is a BUILD ARTIFACT that is committed, because this site deploys
 *   its repository root as-is (vercel.json outputDirectory "."). Committed
 *   generated code rots silently: three hand-edits are required after every
 *   build, and a future rebuild that skips them reintroduces a data leak, two
 *   console errors and a visibly black hero, with nothing to catch it. So the
 *   edits live here as code, and the leak check is a gate rather than a habit.
 *
 * THE APP REPOSITORY IS READ-ONLY TO US
 *   Nothing here writes into the app checkout. Vite insists on creating its
 *   default dist/ next to the project even when --outDir points elsewhere, so
 *   that directory is removed afterwards; it is gitignored there, but leaving
 *   100+ MB inside someone else's worktree is not ours to do.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

/* fs.cpSync({recursive:true}) hard-crashes node on this platform — exit
   0xC0000409, STACK_BUFFER_OVERRUN, no JS exception to catch — somewhere past
   a hundred entries. Copy with an explicit worklist instead; it is also the
   version that reports what it did. */
function copyTree(from, to) {
  let n = 0;
  const work = [['', '']];
  while (work.length) {
    const [rel] = work.pop();
    const src = join(from, rel);
    const dst = join(to, rel);
    if (statSync(src).isDirectory()) {
      mkdirSync(dst, { recursive: true });
      for (const entry of readdirSync(src)) work.push([join(rel, entry)]);
    } else {
      mkdirSync(dirname(dst), { recursive: true });
      copyFileSync(src, dst);
      n += 1;
    }
  }
  return n;
}

const SITE = resolve(import.meta.dirname, '..');
const APP = resolve(process.argv[2] || 'C:/fieldlux-embed-0814');
const OUT = join(tmpdir(), `fieldlux-embed-build-${process.pid}`);

/* Which projected clip the hero ships with, and which one the scene asks for. */
const HERO_CLIP = 'test-patterns/fieldlux-ripple-1080p.mp4';
const SOURCE_CLIP_URL = '/test-patterns/fieldlux-ripple-4k.mp4';

const die = (msg) => { console.error(`\n  FAILED: ${msg}\n`); process.exit(1); };
const step = (msg) => console.log(`  ${msg}`);

if (!existsSync(join(APP, 'src/components/EmbedViewer.jsx'))) {
  die(`${APP} has no src/components/EmbedViewer.jsx.\n` +
      `  The /embed route lives on the app branch 0814-embed. Pass the path to a\n` +
      `  checkout of that branch:  node scripts/build-embed.mjs C:/path/to/app`);
}

/* ── 1. build ────────────────────────────────────────────────────────────────
   FIELDLUX_SECURE=1 is NOT optional. It swaps two imports for their stripped
   twins (officialCalculatorSpec -> .client, lenses.json -> lenses.secure.json).
   Without it Vite inlines src/data/officialCalculatorSpecs.json — 12.6 MB of
   verbatim manufacturer calibration records — straight into the entry chunk,
   which this PUBLIC site would then serve to anyone who asks. The gate in step
   2 exists because that mistake is invisible: the build succeeds, the hero
   works, and the only symptom is an entry chunk that grew to 7.6 MB.

   We call vite directly rather than `npm run build`, which additionally runs
   the two generate-secure-*.mjs scripts — those WRITE tracked files in the app
   repository, and this script does not modify that repository. */
step('building (FIELDLUX_SECURE=1, base=/embed/) …');
const vite = join(APP, 'node_modules/vite/bin/vite.js');
if (!existsSync(vite)) die(`vite not found at ${vite} — run npm install in the app checkout`);
execFileSync(process.execPath, [vite, 'build', APP, '--base=/embed/', '--outDir', OUT, '--emptyOutDir'], {
  stdio: 'inherit',
  env: { ...process.env, FIELDLUX_SECURE: '1' },
});
rmSync(join(APP, 'dist'), { recursive: true, force: true });

/* ── 2. leak gate ───────────────────────────────────────────────────────────
   Field NAMES that only ever appear as JSON keys in the proprietary dataset.
   The trailing quote-colon is what makes this a data check and not an
   identifier check: minified code still reads `x.rawOfficialFields`, and that
   is a property access, not the records themselves. */
const MARKERS = ['rawOfficialFields":', 'distanceFormulaMin":', 'distanceFormulaMax":',
                 'LightAxisRatio":', 'reducedBrightness":', 'LensShiftVp":',
                 'A1Const":', 'A1MinSlope":', 'A1MaxSlope":', 'L1Slope_m_per_inch":'];
step('scanning the bundle for proprietary data …');
const chunks = readdirSync(join(OUT, 'assets')).filter((f) => f.endsWith('.js'));
const leaks = [];
for (const f of chunks) {
  const text = readFileSync(join(OUT, 'assets', f), 'utf8');
  const hit = MARKERS.filter((m) => text.includes(m));
  if (hit.length) leaks.push(`${f}: ${hit.join(', ')}`);
}
if (leaks.length) die(`proprietary data found in the bundle — NOT copied:\n    ${leaks.join('\n    ')}`);
step('  clean — no proprietary data inlined');

/* ── 3. copy only what the hero fetches ─────────────────────────────────────
   vite copies the app's whole public/ into the build (118 MB, most of it test
   patterns and reference models). A live hero requests exactly three files
   beyond its own /embed/ assets, so only those are taken.

   The scene assets do NOT go under /embed/. EmbedViewer resolves them from the
   runtime literal '/demo-scenes/', which Vite's base does not rewrite, and it
   rejects any model path that does not match ^/demo-scenes/ — a rejected model
   renders as a proxy box. They belong at the site root. */
step('copying …');
mkdirSync(join(SITE, 'embed'), { recursive: true });
// Cleared, not merged: chunk names are content-hashed, so copying over the top
// would accumulate every chunk every previous build ever emitted.
rmSync(join(SITE, 'embed/assets'), { recursive: true, force: true });
const copied = copyTree(join(OUT, 'assets'), join(SITE, 'embed/assets'));
copyFileSync(join(OUT, 'fieldlux-logo-mark.png'), join(SITE, 'embed/fieldlux-logo-mark.png'));
for (const rel of [
  'demo-scenes/hero.json',
  'demo-scenes/building_04.glb',
  HERO_CLIP,
]) {
  mkdirSync(dirname(join(SITE, rel)), { recursive: true });
  copyFileSync(join(OUT, rel), join(SITE, rel));
}

/* The scene names the 4K clip, and the hero is a frame a few hundred pixels
   tall showing it projected onto a facade and then scaled down again — 4K is
   6.6 MB of bytes no visitor can perceive. Every visitor pays it, so the
   reference is rewritten to the 1080p master that ships beside it. Rewriting
   the scene rather than renaming the file keeps the app's own asset-path rules
   satisfied and leaves the app repository untouched. */
const scenePath = join(SITE, 'demo-scenes/hero.json');
const sceneText = readFileSync(scenePath, 'utf8');
const refs = sceneText.split(SOURCE_CLIP_URL).length - 1;
if (!refs) die(`hero.json no longer references ${SOURCE_CLIP_URL} — update HERO_CLIP`);
writeFileSync(scenePath, sceneText.split(SOURCE_CLIP_URL).join(`/${HERO_CLIP}`));
step(`  ${copied} chunks + 3 scene assets (clip -> ${HERO_CLIP.split('/').pop()}, ${refs} refs rewritten)`);

/* ── 4. the three patches ───────────────────────────────────────────────────
   Applied to our copy of the built document, never to app source. */
step('patching embed/index.html …');
let html = readFileSync(join(OUT, 'index.html'), 'utf8');

// (a) External fonts. This site's CSP is style-src 'self' / font-src 'self',
//     so the Google Fonts stylesheet is refused by the browser and every load
//     carries two console errors. Geist is already self-hosted inside
//     /embed/assets, which is why the app's own markup called this a fallback.
// Anchored on the comment and closed on the stylesheet link's own `/>`; the
// trailing newline is deliberately NOT part of the match, because this file is
// checked out with CRLF and `\n` alone silently fails to match `\r\n`.
const fonts = /\s*<!-- Geist \(Vercel\)[\s\S]*?rel="stylesheet"\s*\/>/;
if (!fonts.test(html)) die('the Google Fonts block was not found — check the app template and update this patch');
html = html.replace(fonts, '');

// (b) + (c) The frame must be see-through from the FIRST paint, so the site's
//     poster shows through while the app boots and any time it cannot render.
//     #root is painted #0A0A0A by styles/tokens.css and EmbedViewer's runtime
//     override only releases html and body — that is the upstream bug. body
//     additionally carries an INLINE #000000 which nothing can outrank until
//     React has mounted, several seconds into a cold load.
if (!html.includes('background: #000000')) die('the inline body background was not found — check the app template');
html = html.replace('background: #000000', 'background: transparent');
html = html.replace('</head>',
  '    <style>\n      /* see scripts/build-embed.mjs — transparent from the first paint */\n' +
  '      html, body, #root { background: transparent !important; }\n    </style>\n  </head>');

writeFileSync(join(SITE, 'embed/index.html'), html);
rmSync(OUT, { recursive: true, force: true });

const mb = (p) => (statSync(p).isDirectory()
  ? readdirSync(p, { recursive: true }).reduce((n, f) => {
      const s = statSync(join(p, f)); return n + (s.isFile() ? s.size : 0);
    }, 0)
  : statSync(p).size) / 1048576;
step(`done — embed/ ${mb(join(SITE, 'embed')).toFixed(1)} MB, ` +
     `demo-scenes/ ${mb(join(SITE, 'demo-scenes')).toFixed(1)} MB, ` +
     `test-patterns/ ${mb(join(SITE, 'test-patterns')).toFixed(1)} MB`);
