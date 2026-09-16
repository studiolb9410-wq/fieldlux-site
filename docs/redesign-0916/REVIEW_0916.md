# Redesign 0916: review verdict

Reviewer: the brief's author, judging against section F (acceptance checklist) and section G (rubric)
of `REDESIGN_BRIEF.md`. Product claims were checked against `APP_UI_INVENTORY.txt`.

- Design A: `C:/fieldlux/site-redesign-A`, branch `0916-site-redesign-A`, commit `630801d`, served at :4331.
- Design B: `C:/fieldlux/site-redesign-B`, branch `0916-site-redesign-B`, commit `94dff92`, served at :4332.
- Baseline: commit `4b4dcc6` (the copy deck), served at :4333.

Nothing in the self checks was taken on trust. Every number below was re-measured on 2026-09-17 with the
probes listed in "How this was verified" at the end of this file.

## Result

**Winner: Design A, 93 to 85.**

B fails one checklist line outright (one type scale) and breaks two layout rules the brief states in
D1/D2 (the 5/12 + 7/12 editorial split, and the column-gap step). A fails no checklist line; its faults
are finish faults, all fixable in a day. Both designs kept the hero contract, the pricing copy, the 19
chapters, the protected files and the CSS budget intact.

## Scores (section G)

| Area | Pts | A | B | Justification |
|---|---|---|---|---|
| Truth and copy discipline | 20 | 20 | 18 | A: copy is byte-identical to the deck apart from the allowed cuts (handoff trio) and six added part labels. B: same, but re-wrote the row 04 note ("no feather hides a hot spot" is new wording, not a cut) and shortened three paragraphs to fit a layout rather than for editorial reasons. Neither adds a claim, number, name or logo. |
| Typographic hierarchy | 15 | 14 | 10 | A: every font-size resolves to a C2 token; kickers 12px brand-800 / brand-300 everywhere. Loses 1 for the 3-line product H1 and the 4-line h2 in the compact band. B: `.v3-cell > p` outranks `.v3-kicker`, so 18 cell kickers render at body size (17px, ink-500 / stage-muted) instead of the kicker token; the hero H1 uses an off-scale ramp under 1024 and lands at 30px on a 390 phone, smaller than the 32px h2; tour row titles use the h2 token so nine 56px headings compete in one section; the videos H1 balances into three lines at 1920. |
| Layout and alignment | 15 | 13 | 11 | A: 5/12 copy + 7/12 shot in all nine editorial rows, pin 0/0 at 1024, 1280, 1440, 1920; every cell grid one bottom; price lines and status lines share a y; container 1680 / 1360 / 358. Loses 2: at 1024 to 1199 the frame stretches 12 to 118px below the image in rows 04 to 07, and the compact band keeps 96px padding at 390. B: pins 0/0 at 1280 and up, but the flipped rows (home 02, 04, 06, 08 and the product lighting row) put the screenshot in the 5/12 column (660px) and the copy in 7/12, against D1/D2 and "product first"; stacks at 1024 to 1279; column gap 48 at 1280 to 1439. |
| Screenshot handling | 10 | 9 | 10 | Both: no object-fit or aspect-ratio on any img, intrinsic ratio at full column width, width/height and lazy kept, `.v3-shot` frames on --stage-2 with the hairline, Heatmap PNG row 570 / 570 / 570 at 1920 with images top-aligned (509 / 509 / 568) on --panel. A loses 1 for the visible frame ground under four screenshots at 1024 to 1199. |
| Responsive | 15 | 15 | 14 | Both: zero horizontal overflow on five pages at 390, 768, 1024, 1280, 1440, 1920; hamburger works; 16px gutters; slot 1.778; 1440 reads wide (1360 container). B loses 1: phone hero H1 at 30px sits under the h2 size, and the CTA band goes left-aligned at 390. |
| Design quality and direction fit | 10 | 8 | 7 | A: quiet, hairline, product-first, cyan as signal only; the lighting row's lead floats 292px under its h2 at 1920 and the H1-beside-lead hero is competent but plain. B: keeps the owner's overlap hero, strong row titles, but half the screenshots are demoted to the narrow column and the unstyled grey cell kickers read as a bug. |
| Videos and pricing rules | 10 | 10 | 10 | Both: 19 slots with ids, role, aria-label and both spans; dashed --paper-2 slot with glyph, kicker and "Video in production"; chapters 96 apart with part dividers; part index 3 x 2; price lines on one baseline, feature lists from one y, "Planned after beta" on one y, tabs switch all three cards and the note, "No weekly pass" gets `.is-unavailable` and reads at h3 size. |
| Performance and hygiene | 5 | 4 | 5 | A: 47,918 B CSS, no console errors on seven pages at three widths, no new fonts, requests or script files, reduced motion stops ticker, caret and reveals. Loses 1: privacy.html and 404.html still carry the 300-line legacy inline IIFE next to `site-experience.js` (two click handlers on every app link, dead `.motion-toggle` and `.site-header` code). B: 47,529 B, same results, IIFE removed. |
| **Total** | **100** | **93** | **85** | |

## Checklist (section F)

PASS* means the line passes with a note that is carried into the fix list.

| # | Line | A | B |
|---|---|---|---|
| 1 | No claim absent from the inventory; no new numbers, names, testimonials, logos, "trusted by"; manufacturer names as catalogue data | PASS | PASS* (row 04 note re-worded, not cut) |
| 2 | Feature names per Appendix 2; "Lux Heatmap" only in the locked hero | PASS | PASS |
| 3 | Non-ASCII scan returns only (c), the middle dot and the existing cd/m2 superscript; `&#8599;` absent | PASS | PASS |
| 4 | One type scale and one spacing scale | PASS | **FAIL** (18 cell kickers at body size and colour; hero H1 off-scale ramp under 1024) |
| 5 | Sentence case except kickers and the locked hero H1 | PASS | PASS |
| 6 | Section padding, head-to-content, row gaps match C3 at 1920 / 1440 / 390 | PASS* (compact band 96 at 390) | PASS* (compact band 96 at 390; column gap 48 at 1280 to 1439) |
| 7 | Editorial rows: copy first line = shot top, copy last element = shot bottom (2px) | PASS (0 / 0 at 1024, 1280, 1440, 1920) | PASS* (0 / 0 at 1280 and up; stacked below 1280; flipped rows use the 5/12 column for the shot) |
| 8 | Cell grid rows one bottom; price lines one baseline; status lines one y | PASS | PASS |
| 9 | Container 1680 at 1920, 1360 at 1440, 16px gutters at 390 | PASS | PASS |
| 10 | No object-fit / aspect-ratio on img; intrinsic ratio; width / height; lazy | PASS | PASS |
| 11 | Screenshots in `.v3-shot` frames with C5 ground and border | PASS | PASS |
| 12 | Heatmap PNGs top-aligned in equal-height frames, uncropped | PASS | PASS |
| 13 | No horizontal overflow at six widths | PASS | PASS |
| 14 | Phone stacks, 16px gutters, hamburger, hero present, readouts stack, slot 16:9 | PASS | PASS* (H1 30px under the h2; CTA left-aligned) |
| 15 | `assets/tailwind.css` under 150 KB | PASS (47,918 B) | PASS (47,529 B) |
| 16 | No console errors, any page, three widths | PASS | PASS |
| 17 | No new fonts, external requests, JS files | PASS* (legacy IIFE kept beside the shared script on privacy / 404) | PASS |
| 18 | Reduced motion: only the embed moves | PASS | PASS |
| 19 | `section.hero` unchanged in classes and data attributes | PASS (byte-identical to 4b4dcc6) | PASS (byte-identical) |
| 20 | Embed mounts, ticker scrolls, caret blinks | PASS | PASS |
| 21 | Tabs switch, menu opens / closes, `siteReturnUrl`, reveals | PASS | PASS |
| 22 | 19 slots with ids; chapter text unchanged | PASS | PASS |
| 23 | Pricing copy byte-identical | PASS | PASS |
| 24 | Protected files untouched | PASS | PASS |

Failed lines, A: none.
Failed lines, B: line 4.

Brief rules outside F that B breaks: D1 / D2 editorial split (5/12 copy + 7/12 shot in every row; B
inverts it in flipped rows), C3 breakpoint (2-col at 1024; B at 1280), C3 column gap (64 at 1280; B 48),
C2 hero H1 weight (560; B 500).

Notes that apply to both and are accepted: the hero ticker is `display:none` under 1024 in both designs
and in the baseline, so "hero elements all present" on phone is read as "present in the DOM"; the videos
page shows the part label twice at the top of each part (divider plus chapter kicker), which is what D5
asks for.

## Fix list for the winner (A), in order

Each fix names the page, the element, what is wrong, what fixed looks like and how to verify.

### 1. Home tour rows 04 to 07 show frame ground under the screenshot at 1024 to 1199

- Page / element: `index.html`, `.v3-editorial` rows 04 Edge blending, 05 Heatmap, 06 Play Dock, 07
  Lighting and fog; rule `.v3-editorial{grid-template-columns:5fr 7fr}` in `src/input.css` (line 888,
  inside `@media (min-width:1024px)`).
- Wrong: the copy is taller than the 7/12 image at these widths, and the pin is kept by stretching
  `.v3-shot-frame`, so --stage-2 ground appears under the screenshot: 65 / 118 / 12 / 40 px at 1024,
  69 / 16 px (rows 05, 07) at 1100. The image bottom and the copy's last element no longer share a y.
- Fixed: no editorial row shows more than 2px of frame below its image at any width. Preferred: move the
  2-col breakpoint for `.v3-editorial` (and the product lighting row) from 1024 to 1200, keeping the
  stacked layout (shot first, 64px row gap) between 768 and 1199; record it as a one-step breakpoint
  deviation in SELF_CHECK_A. Alternative: keep 1024 and trim the four notes to one line, which the
  brief allows (cuts only, no re-wording).
- Verify: probe at 1024, 1100, 1199, 1280, 1440, 1920: for every `.v3-editorial`,
  `frame.bottom - img.bottom <= 2`; at 1280 and up `copy.firstChild.top - frame.top` and
  `copy.lastChild.bottom - frame.bottom` are within 2px.

### 2. Product lighting row: the lead floats far below its h2

- Page / element: `product.html`, "Lighting and atmosphere" `.v3-editorial--flip .v3-editorial-copy`
  (kicker, `h2#product-lighting-title`, `p.v3-lead`).
- Wrong: the lead is the pinned last element, so the gap between the h2 and the lead inflates to 292px
  at 1920, 113px at 1440, 82px at 1280. The pin is honoured, the reading order is not.
- Fixed: h2 and lead stay together (lead 24px under the h2) and a `.v3-text-link` "How to do it:
  Chapters 14 and 15" (href `/videos#ch-14`, the same string and arrow SVG the home tour uses) is the
  pinned last element. This is graft G1 below; the brief's D2 lists no CTA for the row, but the link's
  wording and target already exist on the home page, so nothing new is claimed.
- Verify: at 1920 / 1440 / 1280, `lead.top - h2.bottom` is 24px; `link.bottom - frame.bottom` within
  2px; the link's href resolves to the chapter 14 anchor.

### 3. Product "Read what lands" band: 4-line h2 and 96px padding on phone

- Page / element: `product.html` section `.v3-section--paper-2.v3-section--compact`; rules
  `.v3-section-head--band{max-width:60ch}` (line 913) and `.v3-section--compact{padding:var(--sp-96) 0}`
  (line 726) in `src/input.css`.
- Wrong: the 60ch cap is computed at body size (about 600px), so the 56px h2 wraps to four lines at 1920
  ("Surface Lux, / Pixel Density / and Luminance, / on the model.") and three at 1440; and the band's
  padding is fixed at 96 at every width, so at 390 it is the only section not at 64.
- Fixed: the cap applies to the lead only (h2 keeps its own 22ch measure), so the h2 sets on two lines
  at 1920 and 1440; the band's padding follows the section scale (96 at 768 to 1279, 64 below 768).
- Verify: h2 line count = 2 at 1920 and 1440; computed padding-top of the section = 64px at 390, 96px at
  1024; the band is still one step tighter than 128 at 1280 and up.

### 4. Privacy and 404: the legacy inline IIFE runs beside `site-experience.js`

- Page / element: `privacy.html` (script blocks at lines 35 to 44 and 348 onward) and `404.html` (lines
  21 onward and 173 onward).
- Wrong: the 300-line IIFE from the old pages still runs: it rewrites `[data-app-link]` and adds a second
  click handler, keeps a tri-state motion routine for `.motion-toggle` (no longer in the DOM) with
  `on / off` values the shared script does not read, and queries `.site-header` / `.site-footer` (removed).
  No console errors today, but every app link has two handlers and the page carries dead code.
- Fixed: the only script on both pages is `<script defer src="/scripts/site-experience.js">`, plus, if
  wanted, the same three-line pre-paint `data-motion` read that index.html uses (`reduced | full` only).
  Body markup and classes stay as they are. This is graft G2.
- Verify: `grep -c "<script" privacy.html 404.html` returns 1 (or 2 with the pre-paint snippet); the
  app link href carries `siteReturnUrl`; the footer toggle flips `html[data-motion]` and its label; the
  mobile menu opens and closes; `node scripts/shots.mjs 4331 <tmp> "privacy|privacy|" "404|404|"` prints
  no console errors at three widths.

### 5. Home hero H1 breaks into three lines on a 390 phone

- Page / element: `index.html` `h1.hero-title`; rule `.hero-title` (line 235, `src/input.css`).
- Wrong: at the 44px display floor, "ON THAT FACADE" plus the caret does not fit 358px, so the locked
  two-line H1 sets as "HOW MANY LUX / ON THAT / FACADE". (B went the other way, 30px, and dropped under
  the h2; do not copy that.)
- Fixed: two lines at 390 and 360 with the H1 still larger than the 32px h2, for example
  `@media (max-width:430px){.hero-title{font-size:2.5rem}}` (40px, one step down) or a tighter tracking
  on that band. Weight stays 560 and the markup stays byte-identical.
- Verify: probe `heroH1.lines === 2` and `fontSize >= 40px` at 390 and 360; the caret still follows
  "FACADE" on the second line; no overflow.

### 6. Product hero H1 breaks as "The whole / rig, planned / in a browser."

- Page / element: `product.html` `h1.v3-display`; `.v3-display{max-width:14ch}`.
- Wrong: the 14ch measure with `text-wrap:balance` splits the clause on "rig,".
- Fixed: two lines at 1920 and 1440: "The whole rig, / planned in a browser." Either widen the measure
  for this page hero (`.v3-page-hero .v3-display{max-width:16ch}`) or insert a `<br>` after "rig," as the
  baseline copy did for "Free during<br>open beta." (a line break is not a copy change). Three lines at
  390 are acceptable.
- Verify: H1 line count = 2 at 1920 and 1440; the words are unchanged (text diff against 4b4dcc6 stays
  empty apart from case).

### 7. Pricing status line set as an uppercase kicker

- Page / element: `pricing.html` `.v3-plan-status` ("Planned after beta"), rule at `src/input.css`
  line 1158.
- Wrong: the status is a caption, not a label, and C2 makes kickers the only uppercase text outside the
  locked hero; the string reads "PLANNED AFTER BETA".
- Fixed: caption size (14px), sentence case, --ink-400 (stage: --stage-muted), still pinned to the card
  bottom with `margin-top:auto`.
- Verify: computed `text-transform: none`, `font-size: 14px`; `statusTops` equal across the three cards at
  1920, 1440, 1280 (probe already reports them).

### 8. Record the accepted deviations in SELF_CHECK_A.md

- Add: editorial 2-col from 1200 (if fix 1 takes the preferred route); compact band scale; the
  product lighting text link; the hero ticker hidden under 1024 (inherited from the baseline); the
  `.key` chip defined but unused (D5 does not require it inside steps).
- Verify: the file lists each with the width or page it applies to.

## Optional grafts from B

Each is a portable element of B that is clearly better than A's equivalent. None is required beyond the
two referenced by the fix list.

- G1 (resolves fix 2): the product lighting row text link. Source: `C:/fieldlux/site-redesign-B/product.html`
  line 196, `a.v3-text-link[href="/videos#ch-14"]` with its inline arrow SVG; B's
  `.v3-editorial-copy > .v3-text-link{margin-top:auto}` behaviour is already present in A.
- G2 (resolves fix 4): the privacy / 404 script cleanup. Source: `C:/fieldlux/site-redesign-B/privacy.html`
  and `404.html` `<head>` (single `<script src="/scripts/site-experience.js" defer>`, no inline IIFE),
  body markup untouched.
- G3 (owner's call, not required): the hero overlap composition, the notch the owner iterated in the
  baseline, widened to the 1680 container with a 16:9 frame. Source: `C:/fieldlux/site-redesign-B/src/input.css`
  lines 160 to 260, `.hero-inner` (`--hero-gap`, `--block-overlap`), `.hero-frame{aspect-ratio:16/9;
  margin-bottom:calc(-1*(var(--hero-gap)+var(--block-overlap)))}` and `.hero-block`. Take it only if the
  owner prefers the notch to A's frame-then-H1; it replaces A's H1-beside-lead row, so A's
  `.hero-block` / `.hero-copy` rules would go with it. Do not take B's `.hero-title` ramp or weight 500.
- G4 (nice to have): B's `.v3-display{text-wrap:balance}` is the same as A's; nothing to take. B's
  sentence-case `.v3-plan-status` (caption size, `src/input.css` `.v3-plan-status`) is the model for
  fix 7.

Do not take from B: the flipped-row column swap, `.v3-cell > p` typography (it is the kicker bug), the
under-1024 hero H1 ramp, the 1280 editorial breakpoint, the 48px column gap, the re-worded row 04 note,
or `.ui-path` on prose "Where" lines (chapters 01, 08, 09, 10, 12, 13, 14, 19 read as bold sentences).

## Ship gate (re-run after the fixes, all must be clean)

1. `git diff --stat 4b4dcc6 -- embed demo-scenes vercel.json scripts/dev-server.mjs scripts/light-field.js`
   prints nothing; `git diff 4b4dcc6 -- scripts/site-experience.js` is the one "No weekly pass" line.
2. Hero contract: the `section.hero` block in `index.html` is byte-identical to 4b4dcc6 (the review's
   hero diff script), and `grep -c` returns 1 for `hero-frame-embed`, 2 for `hero-ticker-group`, 1 each
   for `type-slot`, `type-word`, `type-caret`, `type-sr`, `hero-lead`, `hero-actions`, `hero-caption`,
   3 for `hero-readout-item`.
3. Copy: the visible-text diff of `pricing.html` and `videos.html` against 4b4dcc6 is empty apart from
   the six part labels and whitespace; `index.html`, `product.html`, `measurement.html` show only the
   handoff-trio deletion, the sentence-case changes and the arrow SVG substitution; the non-ASCII scan of
   the seven files returns only U+00A9, U+00B7 and the two existing U+00B2; `grep -n "&#8599;"` is empty.
4. `npm run build`; `wc -c assets/tailwind.css` under 150 KB.
5. `node scripts/shots.mjs 4331 <tmp> "|home|" "product|product|" "measurement|measurement|"
   "pricing|pricing|" "videos#ch-05|ch05|" "privacy|privacy|" "404|404|"` prints "no console errors" and
   no "HORIZONTAL OVERFLOW" for all 21 captures; the review probe adds 768, 1024, 1280 and 1200 (new
   breakpoint) for overflow.
6. Editorial pin: at 1200 (or 1024 if fix 1 took the trim route), 1280, 1440, 1920, all eight home rows
   and the product lighting row report top and bottom deltas within 2px and `frame.bottom - img.bottom
   <= 2`.
7. Heatmap panel row: three `.v3-shot--panel` frames share one top and one height at 1920, 1440, 1280,
   1024; images at intrinsic ratio (1.054, 1.054, 0.944), `object-fit` not set.
8. Type spot check (ten elements): hero H1 88 / 40 to 44 at 1920 / 390; h2 56 / 32; h3 26 / 20; lead
   22 / 18; body 17 / 16; caption 14; kicker 12 brand-800 (stage brand-300) including every `.v3-cell`
   kicker; readout 44 / 28 weight 500; price 76 / 48; `.v3-plan-status` 14px sentence case.
9. Section padding 128 / 96 / 64 at 1920 / 1024 / 390 on every `.v3-section` including the compact band
   (96 / 96 / 64); head-to-content 48; tour rows 96 apart in 2-col, 64 stacked.
10. Pricing: weekly / monthly / yearly switch all three `[data-plan]` cards and `[data-period-note]`;
    Enterprise weekly shows "No weekly pass" with `.is-unavailable` at h3 size; price bottoms, feature-list
    tops and status tops equal across the cards at 1920, 1440, 1280.
11. Privacy and 404: one script tag (plus optional pre-paint snippet); app link carries `siteReturnUrl`;
    motion toggle and mobile menu work; no console errors at three widths.
12. Reduced motion: after the footer toggle, `.hero-ticker-track` and `.type-caret` report
    `animation-name: none`, `.v3-reveal` transition 0s, and no element on the page has a running
    animation other than inside the embed iframe.
13. Re-capture `docs/redesign-0916/shots-A/` (home, product, measurement, pricing, videos full page plus
    ch05 and ch12 viewports at 1920 / 1440 / 390) and commit them with the fixes and the updated
    SELF_CHECK_A.md.

## How this was verified

- Screenshots: every PNG in `shots-A/` and `after/` was viewed, sliced into viewport-height strips (full
  pages) and, for phone captures, tiled four strips wide; chapter layout judged from ch05 / ch12.
- `grep -rn "object-fit\|aspect-ratio" src/input.css` in both worktrees: hits only on `.hero-frame`
  (iframe host) and the empty video slot (placeholder div) in both.
- Non-ASCII scan (python, chars > 127 excluding U+00A9 and U+00B7) over the seven HTML files of A, B and
  the baseline: only U+00B2 in the two existing chapter lines, in all three.
- `git diff --stat 4b4dcc6 -- embed demo-scenes vercel.json scripts/dev-server.mjs scripts/light-field.js`:
  empty in both. Both worktrees are clean at their stated commits; the served pages and CSS match the
  committed files by md5.
- Visible-text diff (HTML parsed to text lines) of pricing, videos, index, product, measurement against
  4b4dcc6 for both designs, plus meta descriptions and titles.
- Hero contract greps and a hero-section byte comparison against 4b4dcc6.
- `wc -c assets/tailwind.css`: A 47,918, B 47,529.
- `scripts/shots.mjs` against :4331 and :4332 for home, product, measurement, pricing, videos#ch-05,
  privacy, 404 at 1920 / 1440 / 390: 21 captures each, no console errors, no HORIZONTAL OVERFLOW.
- Puppeteer DOM probe (getBoundingClientRect / getComputedStyle) on both designs at 1920, 1440, 1280,
  1024, 768, 390: container width, hero H1 size / weight / lines, ticker and caret state, embed state,
  light-field stage height, per-row column widths, gap, top / bottom pin deltas, frame-vs-image height,
  image ratios and attributes, kicker size / colour by context, section paddings, head gaps, cell grid
  bottoms, readout strips, Heatmap panel frames, pricing baselines under all three periods, tab control
  height, FAQ, slot count / ratio / contract, chapter gaps, ch05 layout, index grid, footer columns,
  fonts, scripts, external requests, reduced-motion state, mobile menu, `siteReturnUrl`; a second probe
  for privacy / 404 (header, footer, app link, motion toggle, scroll class, menu).
