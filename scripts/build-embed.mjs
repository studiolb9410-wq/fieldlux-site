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

/* (d) Vercel Analytics and Speed Insights are compiled into the app bundle and
   each requests /_vercel/<name>/script.js as it boots. That endpoint is served
   by the Vercel platform only where the feature is switched on for the project;
   here the path is nothing, so every hero load spent two requests to earn two
   404s, two "Refused to execute script" MIME errors and two library warnings —
   six console lines on the marketing site's front page, on every visit.

   These two tags are the fix, and they are not a hack: BOTH libraries guard
   their injection with

       if (document.head.querySelector(`script[src*="${src}"]`)) return;

   so finding a script already claiming that src is the supported way to tell
   them the page has this handled. The type is deliberately not a JavaScript
   MIME type, which makes the element non-executable and — this is the part that
   matters — means the browser never fetches its src. So the tags satisfy the
   guard, the libraries return before creating anything, and no request is made
   at all. Same result in development and in production, which serving a stub
   file could not promise: /_vercel is a reserved path that the platform routes
   before it ever reaches our static files.

   TO TURN ANALYTICS ON: delete these two tags and enable Web Analytics on the
   SITE's Vercel project. The libraries then inject normally and the platform
   serves the real scripts. */
const VERCEL_STUBS =
  '    <script type="text/fieldlux-disabled" src="/_vercel/insights/script.js"></script>\n' +
  '    <script type="text/fieldlux-disabled" src="/_vercel/speed-insights/script.js"></script>\n';

/* (e) HOST-SIDE INTERACTION LAYER.
   Three things the hero needs that the chromeless route does not ship. All
   three attach to contracts the app already publishes — the .flx-embed-stage
   element, its data-engaged attribute, and the .flx-embed-hint node — so none
   of this reaches into React state or depends on a minified name.

   CURSOR. The canvas computed `cursor: auto`, so a viewport you are meant to
   drag looked like a picture. grab/grabbing is the one convention every visitor
   already knows. :active rather than [data-engaged] is deliberate — engagement
   outlives the pointer (it is about who owns the WHEEL, and is only released
   when the pointer leaves the hero), so keying the closed hand to it would
   leave the cursor grabbing over a scene nobody is holding.

   SCROLL. The app's own wheel listener is registered passive, so it is
   structurally unable to cancel anything: un-engaged it declines to zoom and
   hands the wheel to this page, which is right — a hero that eats the wheel on
   hover is a scroll trap. But once a visitor HAS engaged, the page scrolling
   out from under the scene they are steering is the bug they reported. This
   listener is non-passive and cancels the default ONLY while the stage says it
   is engaged. preventDefault stops the page scrolling; it does not stop
   propagation, so the scene still receives the wheel and still zooms.

   BUBBLE. The app already renders the prompt and already fades it on first
   interaction (.flx-embed-hint[data-seen="true"]). What it lacked was any
   presence: 306x28 of plain text lying on a dark 3D scene. It becomes a
   speech bubble with a tail here, in CSS only — rewriting its TEXT from out
   here would fight React the moment data-seen re-renders it. */
const HERO_UX = `    <style>
      /* --- cursor -------------------------------------------------------
         The owner's pointer: white arrow, cyan edge, ring at the tail. Drawn
         as an inline SVG data URI rather than a PNG so it stays sharp on a
         HiDPI display and costs no request.

         The trailing ', grab' is not decoration. A url() cursor is IGNORED in
         several real cases — the SVG failing to parse, a size over the
         platform cap, and every browser with SVG cursors disabled — and
         without a keyword after it the element would silently fall back to the
         default arrow, which is the one thing this replaces. grab is the
         honest fallback: it still says draggable.

         '6 4' is the hotspot, on the arrow's point. It has to be stated: the
         default is 0,0, which here is empty canvas above and left of the tip,
         so every click would land up-left of where the visitor aimed. */
      .flx-embed-stage canvas {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><g fill='%23FFFFFF' stroke='%2322D3EE' stroke-width='2.4' stroke-linejoin='round' stroke-linecap='round'><path d='M6 4 L6 22.5 L10.8 18 L14.2 25 L17.8 23.2 L14.4 16.4 L20.6 16.2 Z'/><circle cx='24' cy='7.5' r='4.2'/></g></svg>") 6 4, grab;
      }
      /* Closed hand while the pointer is down — the drag itself keeps the
         convention every visitor already knows, and the custom arrow would
         read as "still idle" mid-drag. */
      .flx-embed-stage canvas:active { cursor: grabbing; }

      /* --- the prompt, as a bubble ---------------------------------------
         !important on exactly the properties the component writes INLINE
         (colour, size, padding, radius, fill, edge) and on nothing else. A
         stylesheet rule cannot outrank an inline declaration, and without this
         the bubble silently kept the app's 10.5px grey pill — which is how it
         first shipped from here. The app also writes 'transform:
         translateX(-50%)' inline to centre it: that one is deliberately NOT
         overridden, it is preserved inside the keyframes below.
         (No backticks in this block — it lives inside a template literal.) */
      .flx-embed-hint {
        padding: 9px 15px 10px !important;
        border-radius: 13px !important;
        background: rgba(8, 22, 28, 0.82) !important;
        border: 1px solid rgba(190, 240, 255, 0.22) !important;
        color: #EAF7FB !important;
        font-size: 12.5px !important;
        letter-spacing: 0.005em !important;
        line-height: 1.25;
        /* The scene behind it is unpredictable, so the bubble carries its own
           ground rather than trusting contrast with whatever is rendered. */
        backdrop-filter: blur(9px) saturate(1.15);
        -webkit-backdrop-filter: blur(9px) saturate(1.15);
        box-shadow: 0 10px 28px -14px rgba(0, 0, 0, 0.85);
      }
      /* The tail. Rotated square rather than a border triangle so the 1px
         edge and the blur continue around it instead of stopping at a
         hard-cornered wedge. */
      .flx-embed-hint::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -5px;
        inline-size: 10px;
        block-size: 10px;
        margin-inline-start: -5px;
        background: inherit;
        border-inline-end: 1px solid rgba(190, 240, 255, 0.22);
        border-block-end: 1px solid rgba(190, 240, 255, 0.22);
        transform: rotate(45deg);
        backdrop-filter: inherit;
        -webkit-backdrop-filter: inherit;
      }
      /* One slow breath, so it reads as an invitation without becoming motion
         the visitor has to wait out. It stops the moment the hint is seen, and
         never starts under reduced motion. */
      @media (prefers-reduced-motion: no-preference) {
        .flx-embed-hint[data-seen="false"] { animation: flx-hint-breathe 3.2s ease-in-out 1.1s infinite; }
        /* BOTH axes, every frame. An animated 'transform' replaces the whole
           property, inline value included, so a keyframe that named only
           translateY would drop the app's translateX(-50%) and throw the
           bubble half its own width to the right for the length of the
           animation. Keep the centring in each stop. */
        @keyframes flx-hint-breathe {
          0%, 100% { transform: translate(-50%, 0); }
          50%      { transform: translate(-50%, -3px); }
        }
      }
      /* The app fades it on data-seen; stop the loop so a faded bubble is not
         still animating. Its transform is left to the inline rule. */
      .flx-embed-hint[data-seen="true"] { animation: none !important; }
    </style>
    <script>
      /* Scroll containment — see (e) in scripts/build-embed.mjs. */
      (function () {
        document.addEventListener('wheel', function (event) {
          var stage = document.querySelector('.flx-embed-stage[data-engaged="true"]');
          if (stage && stage.contains(event.target)) event.preventDefault();
        }, { capture: true, passive: false });
      })();
    </script>
`;

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
  '      html, body, #root { background: transparent !important; }\n    </style>\n' + VERCEL_STUBS + HERO_UX + '  </head>');

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
