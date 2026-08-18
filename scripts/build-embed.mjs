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

   (g) THE INTRO, 0818, replacing the bubble. The cyan speech bubble is
   retired at the owner's call. What stands in its place is the invitation set
   as TYPE, in the scene's own empty top-left: two lines of white display
   uppercase that rise into their own masks 90ms apart with the tracking
   settling as they land, then one small spaced line with a cyan caret.

   BUILT HERE, NOT RESTYLED. The previous pass could only dress the app's
   .flx-embed-hint node, which is React's: its text could not be changed from
   out here without being overwritten on the next data-seen render. This block
   hides that node and appends its own to <body>, outside React's tree, so the
   copy and the motion are both ours and neither can be clobbered mid-frame.
   The app's hint text stays in the document for assistive tech; the new block
   is aria-hidden, exactly as the site's own ticker is, because it is a second
   printing of words already in the tree.

   IT NEVER TAKES THE POINTER. pointer-events:none, so a visitor can start
   dragging straight through the type, and pointerdown anywhere dismisses it on
   the way down rather than after the first gesture completes. It rises and
   blurs out over 420ms and is then removed from the DOM.

   IT WAITS FOR THE CANVAS. The poll is not timing decoration: mounting the
   type while the app is still booting would advertise a 3D view that is not on
   screen yet. It gives up quietly after 20 seconds.

   (f) MIDDLE-BUTTON AUTOSCROLL, added 0818 after a visitor reported the page
   running away under a pan. Traced, not guessed:

     PAN IS A MIDDLE-BUTTON DRAG ON THIS VIEWER. `navigationMode` defaults to
     'mouse-pro' (the app's useAppStore), which maps MIDDLE to THREE.MOUSE.PAN
     (Engine3D), and the embed renders no navigation-mode control, so on /embed
     pan can never be anything else. Two comments in Engine3D still claim
     trackpad is the default and are stale.

     NOTHING CANCELS THE MIDDLE MOUSEDOWN. three-stdlib's OrbitControls
     onPointerDown never calls preventDefault (three's own r160 build differs),
     and no app code filters button 1. Chrome therefore arms its autoscroll
     anchor on top of the pan.

     THE GESTURE ESCAPES UPWARD. This document has no scrollable extent of its
     own, so the autoscroll resolves to the nearest scrollable box, which is
     the framing page. Autoscroll velocity scales with distance from the
     anchor, so a pan dragged toward the bottom edge of a short hero frame
     scrolls the host page far and fast. That is the reported bug exactly.

   It is cancelled HERE rather than in the app because the whole host-side
   interaction layer lives here, and because the wheel guard above already owns
   this contract; the app-side fix would be the same two lines in EmbedViewer.

   Deliberately narrower and wider than the wheel guard in two ways. Narrower:
   button 1 only, so left (rotate, and click-to-select-a-projector) and right
   (dolly) are untouched, and middle-click has no other default action worth
   keeping over a WebGL canvas. Wider: the selector is `.flx-embed-stage` with
   NO [data-engaged="true"], because the middle-drag IS the engagement —
   EmbedViewer sets that attribute from React state in onPointerDown and the
   re-render has not committed when mousedown fires, so gating on it would let
   the first and worst pan through.

   The wheel contract above is untouched, byte for byte: un-engaged the wheel
   still belongs to the host page (no scroll trap on hover), engaged it still
   belongs to the scene. */
const HERO_UX = `    <style>
      /* --- the headline face, inside the frame ---------------------------
         The prompt is set in the same face as the hero headline above it, so
         the two read as one voice rather than as the site and a widget. That
         face is Geologica, and it is SELF-HOSTED BY THE SITE -- this document
         is a different one, with the app's Geist loaded and no Geologica at
         all, so it has to be declared again here. Same-origin path, which is
         also what keeps it inside the CSP's font-src 'self'.

         The variable range and unicode-range are copied from the site's own
         declaration; narrowing either would silently drop weights or glyphs
         that the headline is allowed to use. */
      @font-face {
        font-family: 'Geologica';
        src: url('/assets/fonts/geologica-var-latin.woff2') format('woff2-variations');
        font-weight: 300 700; font-style: normal; font-display: swap;
        unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+2074,
                       U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2215,U+00B7;
      }

      /* --- cursor -------------------------------------------------------
         THE OWNER'S POINTER, 0818: a solid white rounded triangle with a
         concave tail, tip at the top right. Drawn to the reference the owner
         supplied, as an inline SVG data URI rather than a PNG so it stays
         sharp on a HiDPI display and costs no request.

         Geometry, so a future edit can keep the silhouette: the tip is the
         sharpest corner (about 51 degrees) at 26.6,3.4; the two tails are
         4.4,13.2 and 18.6,28.4; the edge BETWEEN THE TAILS is the concave
         one, pulled toward the tip by the quadratic control at 15.5,17.5.
         Corners are rounded by stroking the same path in the same white with
         a round linejoin rather than by hand-fitting arcs, which is what keeps
         the three radii equal.

         THE DROP SHADOW IS NOT DECORATION. The scene projects video onto the
         building, and a pure white pointer over a white projection is an
         invisible pointer. The offset black copy at 0.3 keeps the owner's
         white shape white while giving it an edge on any ground.

         The trailing ', grab' is not decoration either. A url() cursor is
         IGNORED in several real cases — the SVG failing to parse, a size over
         the platform cap, and every browser with SVG cursors disabled — and
         without a keyword after it the element would silently fall back to the
         default arrow, which is the one thing this replaces. grab is the
         honest fallback: it still says draggable.

         '27 3' is the hotspot, on the tip. It has to be stated: the default is
         0,0, which on this shape is empty canvas to the LEFT of the tip, so
         every click would land wide of where the visitor aimed. */
      .flx-embed-stage canvas,
      .flx-embed-stage canvas:active {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M27.8 4.8 L5.6 14.6 Q16.7 18.9 19.8 29.8 Z' fill='%23000000' stroke='%23000000' stroke-width='3.4' stroke-linejoin='round' stroke-linecap='round' opacity='0.3'/><path d='M26.6 3.4 L4.4 13.2 Q15.5 17.5 18.6 28.4 Z' fill='%23FFFFFF' stroke='%23FFFFFF' stroke-width='3.4' stroke-linejoin='round' stroke-linecap='round'/></svg>") 27 3, grab;
      }

      /* --- the bubble is retired -----------------------------------------
         The cyan speech bubble is gone at the owner's call, and it is hidden
         rather than restyled: it is the app's own node, it re-renders itself
         on data-seen, and a hidden node keeps the app's accessibility text in
         its own document while this layer draws the visible invitation. The
         intro below replaces it. */
      .flx-embed-hint { display: none !important; }

      /* --- the intro, set as type -----------------------------------------
         White display type in the scene's own top-left, where the building is
         not: the frame reads as one composition instead of a widget with a
         label stuck to it. Every rule here is on OUR node (.flx-intro, built
         by the script below and appended to <body>), never on a React node, so
         nothing here can be undone by a re-render.

         position:fixed, not absolute. The embed root is fixed and inset:0, and
         appending to <body> keeps this out of React's tree entirely. The block
         NEVER takes the pointer: the whole point is that a visitor can start
         dragging through it.

         86px, measured the same way the retired bubble's 46px was: the site's
         ticker band sits at --ticker-top, clamp(10px, 0.95vw, 14px), and
         stands 21-22px tall, so its lowest pixel is 36px at the wide end. 86
         clears it by 50px and puts the type in open scene rather than under a
         moving band. That variable lives on .hero-frame in the PARENT document
         and cannot be read from in here, which is why the number is inlined
         with its derivation. Re-measure if --ticker-top or --fs-micro moves.

         Every line sits in its own overflow-clip mask so the reveal is the
         type rising into a window, not a box fading in. */
      .flx-intro {
        position: fixed;
        top: 86px;
        left: clamp(20px, 3.6vw, 54px);
        z-index: 40;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        font-family: 'Geologica', 'Pretendard Variable', Pretendard, -apple-system, 'Segoe UI', Roboto, sans-serif;
        /* The scene behind this is dark but it is also MOVING, and a projected
           frame can go bright white under the type. The shadow is what keeps
           white legible on white without tinting the letterforms themselves. */
        text-shadow: 0 2px 18px rgba(0, 0, 0, 0.75), 0 1px 3px rgba(0, 0, 0, 0.55);
        transition: opacity 420ms cubic-bezier(.4, 0, .2, 1),
                    transform 420ms cubic-bezier(.4, 0, .2, 1),
                    filter 420ms cubic-bezier(.4, 0, .2, 1);
      }
      .flx-intro-mask { display: block; overflow: clip; padding-block: 0.06em; }
      .flx-intro-line {
        display: block;
        color: #FFFFFF;
        font-weight: 500;
        font-size: clamp(19px, 2.5vw, 34px);
        line-height: 1.06;
        letter-spacing: -0.022em;
        text-transform: uppercase;
        white-space: nowrap;
      }
      /* The third line steps down in size and up in tracking: it is the
         instruction, not the invitation, and the change of voice is what stops
         three stacked lines reading as one paragraph. */
      .flx-intro-line--sub {
        font-size: clamp(10px, 0.92vw, 12.5px);
        font-weight: 600;
        letter-spacing: 0.16em;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.72);
      }
      .flx-intro-sub-mask { margin-block-start: 12px; }
      /* The caret is the one cyan object in here, and it is an object, never a
         letterform: the site's palette marks --brand-500 OBJECT ONLY. */
      .flx-intro-caret {
        display: inline-block;
        inline-size: 0.5em;
        block-size: 0.5em;
        margin-inline-start: 0.7em;
        background: #20D5DE;
        vertical-align: baseline;
        transform: translateY(0.02em);
      }

      @media (prefers-reduced-motion: no-preference) {
        /* THE REVEAL. Each line starts pushed a full line below its own mask
           and skewed, then is released on a strong out-ease, 90ms apart. The
           tracking settles at the same time -- letters arriving spread and
           closing up is what makes it read as typography rather than as a div
           sliding. */
        .flx-intro-line {
          transform: translate3d(0, 110%, 0) skewY(4deg);
          opacity: 0;
          letter-spacing: 0.14em;
          animation: flx-intro-rise 900ms cubic-bezier(.16, 1, .3, 1) forwards;
        }
        .flx-intro-mask:nth-child(1) .flx-intro-line { animation-delay: 120ms; }
        .flx-intro-mask:nth-child(2) .flx-intro-line { animation-delay: 210ms; }
        .flx-intro-mask:nth-child(3) .flx-intro-line { animation-delay: 330ms; }
        @keyframes flx-intro-rise {
          from { transform: translate3d(0, 110%, 0) skewY(4deg); opacity: 0; letter-spacing: 0.14em; }
          to   { transform: none;                                opacity: 1; letter-spacing: -0.022em; }
        }
        /* The sub line keeps its own tracking, so it gets its own keyframe
           rather than inheriting a settle that would undo the 0.16em. */
        .flx-intro-line--sub {
          animation-name: flx-intro-rise-sub;
        }
        @keyframes flx-intro-rise-sub {
          from { transform: translate3d(0, 110%, 0) skewY(4deg); opacity: 0; }
          to   { transform: none;                                opacity: 1; }
        }
        .flx-intro-caret { animation: flx-intro-blink 1.15s steps(1, end) 900ms infinite; }
        @keyframes flx-intro-blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
      }

      /* SHORT FRAMES. The site's headline block hangs over the frame's lower
         left, and how far up its top edge sits depends on the frame's height:
         at 1600x950 the frame is 847px tall and the block starts 654px down,
         leaving 618px of clear scene; in a 950px-wide window the frame is
         490px tall and the block starts 145px down, leaving about 110px. This
         block is the only thing between the type and that white edge, and the
         iframe's own height is the one honest proxy for the frame's height
         that is readable from inside here. Measured, not guessed. */
      @media (max-height: 620px) {
        /* 48px, not the 86 above: measured at a 960x720 window, where the frame
           is 487px tall, the ticker's lowest pixel is 36 and the white block
           starts 141px down. 48 leaves 12px under the band and 15px above the
           block, which is the tightest this composition gets. */
        .flx-intro { top: 48px; }
        .flx-intro-line { font-size: clamp(15px, 2vw, 22px); }
        .flx-intro-sub-mask { margin-block-start: 6px; }
      }
      @media (max-height: 430px) {
        /* No room for the instruction as well as the invitation; the
           invitation is the one that has to survive. */
        .flx-intro-sub-mask { display: none; }
      }

      /* Leaving. It rises and blurs out rather than simply fading, so the
         scene reads as arriving rather than as the label switching off. */
      .flx-intro[data-out="true"] {
        opacity: 0;
        transform: translate3d(0, -14px, 0);
        filter: blur(7px);
      }
    </style>
    <script>
      /* Scroll containment — see (e) in scripts/build-embed.mjs. */
      (function () {
        document.addEventListener('wheel', function (event) {
          var stage = document.querySelector('.flx-embed-stage[data-engaged="true"]');
          if (stage && stage.contains(event.target)) event.preventDefault();
        }, { capture: true, passive: false });

        /* Middle-button autoscroll — see (f) in scripts/build-embed.mjs.
           PAN on this viewer is a MIDDLE-button drag, and nothing cancels the
           middle mousedown, so Chrome arms its autoscroll on top of every pan.
           This document has nothing of its own to scroll, so that autoscroll
           resolves up the frame tree and drags the host page instead. Cancel
           the default for button 1 only, inside the stage only. */
        var middleOnStage = function (event) {
          if (event.button !== 1) return;
          var stage = document.querySelector('.flx-embed-stage');
          if (stage && stage.contains(event.target)) event.preventDefault();
        };
        document.addEventListener('mousedown', middleOnStage, { capture: true, passive: false });
        document.addEventListener('auxclick', middleOnStage, { capture: true, passive: false });

        /* The intro — see (g) in scripts/build-embed.mjs. Built here rather
           than styled onto the app's own hint node, because the app owns that
           node and re-renders it; this one is ours, lives on <body>, outside
           React's tree, and can never be clobbered mid-animation. */
        var LINES = ['Drag to', 'look around'];
        var SUB = 'Click a projector for its light readings';

        var intro = null;
        var dismissed = false;

        function buildIntro() {
          if (intro || dismissed) return;
          intro = document.createElement('div');
          intro.className = 'flx-intro';
          /* aria-hidden, and it is not a shortcut: the app still renders its
             own hint text in this document for assistive tech (hidden only
             visually), and the framing page names the same two gestures in the
             iframe title and in the caption under the frame. This is a second,
             animated printing of words that already exist in the tree. */
          intro.setAttribute('aria-hidden', 'true');

          for (var i = 0; i < LINES.length; i++) {
            var mask = document.createElement('span');
            mask.className = 'flx-intro-mask';
            var line = document.createElement('span');
            line.className = 'flx-intro-line';
            line.textContent = LINES[i];
            mask.appendChild(line);
            intro.appendChild(mask);
          }

          var subMask = document.createElement('span');
          subMask.className = 'flx-intro-mask flx-intro-sub-mask';
          var sub = document.createElement('span');
          sub.className = 'flx-intro-line flx-intro-line--sub';
          sub.textContent = SUB;
          var caret = document.createElement('i');
          caret.className = 'flx-intro-caret';
          sub.appendChild(caret);
          subMask.appendChild(sub);
          intro.appendChild(subMask);

          document.body.appendChild(intro);
        }

        /* CLICK TAKES IT AWAY AND HANDS OVER THE SCENE. pointerdown rather
           than click, so a drag dismisses it on the way down instead of
           leaving it up for the whole first gesture. Removed from the DOM
           after the transition so nothing is left painting or animating. */
        function dismissIntro() {
          dismissed = true;
          if (!intro) return;
          var node = intro;
          intro = null;
          node.setAttribute('data-out', 'true');
          window.setTimeout(function () {
            if (node && node.parentNode) node.parentNode.removeChild(node);
          }, 500);
        }

        document.addEventListener('pointerdown', dismissIntro, { capture: true, passive: true });
        document.addEventListener('keydown', dismissIntro, { capture: true, passive: true });

        /* Wait for the scene, not for the document. Mounting the type over an
           empty frame while the app is still booting would advertise a 3D view
           that is not on screen yet, so this polls for the canvas the app
           creates and gives up quietly after 20 seconds. */
        var waited = 0;
        var poll = window.setInterval(function () {
          waited += 220;
          if (dismissed || waited > 20000) { window.clearInterval(poll); return; }
          if (document.querySelector('.flx-embed-stage canvas')) {
            window.clearInterval(poll);
            buildIntro();
          }
        }, 220);
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
