# FieldLux Site Redesign — Build Specification

**Repo:** `/Users/jaylee/Documents/fieldlux-site-0814` · **Branch:** `0814-site-redesign` · **Date:** 2026-08-14
**Status:** authoritative. This document supersedes all prior redesign notes, audits, IA drafts and design-system drafts. Where an earlier document disagrees with this one, this one wins. Every question that had two answers has exactly one answer here.

**Scope:** a complete rebuild of `index.html` and `src/input.css`, a new `videos.html`, and edits to `privacy.html`, `tailwind.config.js`, `vercel.json` and `README.md`. Three HTML pages, one CSS input, one inline IIFE per page. No bundler, no framework, no npm runtime dependencies.

---

## 1. Brief and non-negotiables

### 1.1 Owner requirements checklist

Every line below is a hard requirement from the owner's brief. The build is not done until each is ticked.

| # | Requirement | Where it is satisfied |
|---|---|---|
| R1 | Benchmark easywith.com's design direction and page mechanics | §3 layout, §5 motion, §6 section grammar |
| R2 | **WHITE background overall** | §2.1 `--paper` is the page ground. Exactly three dark elements exist site-wide (§2.4) |
| R3 | Accent colours come from the FieldLux logo mark | §2.1 brand ramp is sampled from `assets/logo-mark.png`; no other hue is introduced |
| R4 | Explain the CURRENT app features **part by part** | §6.5 — ten chapters, one per shipped app area, each with its own media and copy |
| R5 | Hero is a **3D computer/monitor screen with our simulation video playing inside it** | §6.2 + §4.4 |
| R6 | A **separate top-nav page** for per-feature explainer videos (footage arrives later) | §7 `/videos` |
| R7 | **DELETE the roadmap entirely** | §9 — removed from nav, page, modal, CSS, JS and README. Nothing replaces it |
| R8 | Reads as a high-trust, high-credibility SaaS product site | §1.2 evidence discipline, §6.13 `#limits` |

### 1.2 The evidence rule (governs every word on the site)

> **A claim ships only if a visitor could reach the thing it describes in the deployed web build today.**

This is not a style preference. It is the product's entire argument, and the site must not be the first place FieldLux overclaims. Three consequences the builder must not undo:

**(a) The verdict / stress / prescription / calibration lane does not ship on this site.** Verified in the read-only checkout: `src/components/AnalysisPanel.jsx` and `src/components/FieldLuxAnalysisPanel.jsx` have **zero import sites** — the only external reference is a contract test asserting the Play Dock does *not* import them. `runStressCheckFromStores` (`src/features/analysis/runStressCheck.js:34`) has **zero callers**. `handleSaveCalibration` and `setCalibrationProfile` exist only inside the unmounted `AnalysisPanel.jsx`. `BETA_FEATURES.equipmentSidebarAnalysisTab` has zero consumers, and `Inspector.jsx:72` actively redirects an `ANALYSIS` tab back to the object's type tab.

Therefore the site must **not** contain: a resilience score, a READY/AT_RISK/NOT_RECOMMENDED verdict, 16 weighted C-metrics, the 12-scenario stress battery, tolerance profiles, the prescription engine, per-wall room analysis, seam risk, audience-visible coverage, PVS coverage, spill/overscan metrics, the metric checklist, sample-filter transparency, confidence scoring, the RSS error-budget readout, or manual site calibration. No copy, no chapter, no video slot, no stat.

What **is** mounted and therefore claimable in the measurement lane: the Lux Heatmap legend and its accuracy-basis chip (`HeatmapLegend.jsx`), the hover probe (`ProjectionHoverProbe.jsx`), the live 13-point overlay (`engine/FieldLuxLiveOverlayHost.jsx`), the measurement target picker, the measure tool, live beam labels, the PDF Tech Rider, the neutral handoff JSON, and cloud share. Those are the measurement story.

**(b) There is no measured validation, and the site says so.** Nothing in the repo compares FieldLux output to lux-meter field data. The site therefore publishes the **frozen assumption error budgets** from `src/core/analysis/assumptions.js` (§6.13) and states plainly that no field validation exists. Publishing the worst number (±50% on room bounce) first is what buys credibility for the rest. See open question Q1.

**(c) Banned vocabulary.** These strings must not appear anywhere in `index.html`, `videos.html`, `pricing.html`, `privacy.html` or `src/input.css`:

`enterprise-ready` · `SOC 2` · `GDPR compliant` · `encrypted at rest` · `penetration tested` · `load tested` · `99.x% uptime` · `measurement-grade` · `lab-verified` · `validated against real installations` · `±X% accurate` · `real-time collaboration` · `collaboration platform` · `desktop app` · `works offline` · `exports to MadMapper` · `MPCDI` · `anamorphic` · `automatic keystone correction` · `AI depth generation` · `Google 3D Tiles` · `address search` · `CAD import` · `DWG` · `DXF` · `floor-plan tracing` · `sketch-to-3D` · `guided onboarding` · `guided tour` · `get started in 5 minutes` · `screenshot export` · `image export` · `analysis CSV export` · `Spout` · `Syphon` · `NDI` · `radiosity` · `global illumination` · `ray tracing` · `Analysis panel` · `Analyze workspace` · `roadmap` · `resilience score` · `verdict` · `stress test` · `tolerance profile` · `site calibration`

Ship gate: `grep -inE 'SOC 2|GDPR|enterprise-ready|load tested|MadMapper|MPCDI|anamorphic|radiosity|ray tracing|roadmap|resilience score|Spout|Syphon|NDI|DXF|sketch-to-3D' index.html videos.html pricing.html privacy.html src/input.css` must return nothing.

Ship gate G1b, added 2026-09-06, a manual read and never a green check: `grep -inE 'DWG' index.html videos.html pricing.html privacy.html src/input.css`. Every hit must sit in a sentence that also carries a cap, a version qualifier, or the fact that conversion is local. A DWG hit with no qualifier in its own sentence fails this gate. A `.limits-key` heading has no sentence, so it passes only when the heading itself names the cost, as `WHAT A DWG COSTS` does; a key reading `DWG IMPORT` would fail. `DWG` left the hard gate because the ban on it was lifted with a condition, and a condition cannot be tested by grepping for a word.

> **Amended 2026-09-06, `load tested`.** The ban was written when "never load tested" was the entire truth and any use of the phrase would have been a claim. A staging load test was run on 2026-08-29 (`docs/CAPACITY_SIMULATION_0829.md`), so the phrase is now permitted in exactly one shape: a sentence that says production has never been load tested, followed by a dated staging figure that names staging as a smaller instance and reads as a floor. Any other use is still banned, and a bare "load tested" with no instance and no date is still the thing the ban exists to stop.

> **Amended 2026-09-06, the drawing and modelling lane: THE BAN IS LIFTED, in the shapes named here and no others.** `CAD import`, `DWG`, `DXF`, `floor-plan tracing` and `sketch-to-3D` were banned on 2026-08-14 on one premise: the lane was disabled in production. That premise expired on 2026-08-19, and it is now further gone than that. `resolveDrawingModellingLane()` (`src/config/betaFeatures.js:24-35`) is a kill switch, not a gate: it returns `true` unless a visitor has set `localStorage 'fieldlux_beta_modelling'` to `'0'`, and it returns `true` when localStorage throws. The lane is on for every visitor of the deployed web build, both store doors (`useAppStore.ts:1112`, `:1153`) let every visitor through, and no part of it carries a desktop gate. The site underclaimed a live capability for 18 days; the owner lifted the ban on 2026-09-06 and this is the record of exactly how far.
>
> **`CAD import` and `floor-plan tracing` are unbanned outright.** The app's own menu rows read `Import Floor Plan...` and `Import CAD Drawing...` (`TopBar.jsx:1068-1073`, `:1215-1220`), and tracing is what the lane asks the user to do, on screen, in those words.
>
> **`DWG` is unbanned WITH A COST IN THE SAME SENTENCE.** Permitted only where the sentence also carries a cap, a version qualifier, or the fact that conversion is local, and only alongside a `#limits` row publishing the 8 MB input cap, the 40 MB converted cap, the 90-second watchdog, and the four measured version families against the four merely declared. A bare "imports DWG" is still the thing this ban exists to stop. The converter is a committed same-origin asset (`src/assets/dwg/dwg2dxf.wasm`, 1,108,669 bytes), so reachability is not the risk; coverage is, and a qualifier is what coverage is for. Never claimable: a consent step, an upload, a queue or a server round trip for DWG. Conversion is local wasm in the visitor's own browser, and `DWG_CONSENT` and `DWG_RETENTION` (`dwgMessages.js:172-209`) have zero production importers.
>
> **`DXF` stays banned, and the reason has inverted.** It was banned because the lane was off. It stays banned because the lane is on and the app deliberately hides this one format inside it. Commit `e274fcb5` (2026-08-17, an ancestor of deployed master `912b1980`) removed `.dxf` from the picker accept list, from both menu hints, from the drop-zone label, from the unsupported-file message and from the window drop guard, while leaving the ingest branch working. A directly dropped `.dxf` still imports. The site must not advertise what the product's own file picker refuses to offer: this string ships only after the app un-hides it, not before.
>
> **`sketch-to-3D` stays banned, and this one is permanent until the product changes.** There is no automatic conversion to promise. Room detection was built and then retired on 2026-08-03 (`PlanTraceMode.jsx:4-19`), there is no automatic wall extraction anywhere in the lane, and the app tells the user in its own caption that a picture cannot become editable lines by itself. The phrase compresses a manual drafting workflow into an automatic one.
>
> **Never claimable in this lane, for the record:** ceilings, curved walls, solid volumes, and doors or windows as objects. The first three are absent by decision; the fourth is absent because the lane has no face entity at all, and an opening is made by cutting the footprint lines.
>
> **The bullet list at the top of 1.2c is left untouched on purpose.** It is the historical record of what was banned on 2026-08-14, the same convention the `load tested` amendment used. Read the list with its amendments, never alone.

> **This gate is a manual read, not a green check.** It matches `NDI` inside ordinary words ("pending", "founding", "binding") and it matches the deliberate negations the limits section is built on. Read every hit; do not "fix" a hit that is the site refusing a claim.

**(d) The permitted stat pool.** No number may appear on the site as a headline figure unless it is in this list. Every one is verified against the shipped source.

| Stat | Exact wording | Verified against |
|---|---|---|
| Catalogue | `87 projectors · 113 lenses · 4 brands` (Epson 27/22, Panasonic 22/42, Christie 19/36, Barco 19/13) | `src/data/projectors.json`, `src/data/lenses.json` |
| Catalogue freshness | `catalogue rebuilt 2026-05-12` | `lastUpdated` in both files |
| Official cross-check | `642 combinations · 47 of 87 heads · Panasonic TDC + Epson PTDS only` (the uncovered 40 = Christie 19 + Barco 19 + 2 Panasonic models absent from the calculator) | `src/data/officialCalculatorSpecs.json` (`combos` = 642; meta lists Panasonic 20 + Epson 27) |
| Cross-check freshness | `pulled 2026-06-11` | `generatedAt` |
| Materials | `21 measured material presets` | `src/utils/materialPresets.js` |
| Projector cap | `up to 200 projectors — hard shader cap, the runtime detector can set it lower` (64 -> 96 on 2026-08-17, 96 -> 200 on 2026-08-26; the site carried 64 until 2026-09-06) | `src/utils/gpuCapabilities.js` `HARD_MAX_PROJECTORS` |
| Warp cap | `32 heads can carry a mesh warp or mask` (16 -> 32 on 2026-08-17) | `src/utils/warpMap.js` `WARP_MAP_MAX`, re-exported by `src/utils/warpMapManager.js` |
| Content slots | `4 distinct content sources` | `src/utils/contentSlots.js` |
| Probe grid | `13 probe points (9 ANSI + 4 quarter) · 16 outer-edge probes` | `src/core/analysis/fieldLuxDistribution.js` |
| Sampling | `16 × 16 = 256 sample points` | `assumptions.js` `sampling.flatGridRes` |
| Beta storage | `2 GB models (200 MB per model file) · 1 GiB media` — the per-file ceiling is on the MODEL path only; the media bucket has no per-file limit tighter than the account quota | storage migrations; `src/features/cloud/storageService.ts` `MAX_MODEL_FILE_SIZE_MB` |
| Editing cost | `0 server requests while you move, rotate and edit values` | `docs/CAPACITY_ANALYSIS_0814.md:24` (marked [M] measured: Supabase requests during normal editing = 0; no polling, no realtime subscription, local draft in localStorage only) |
| Session cost | `≈ 55 server requests in a measured one-hour session` | `docs/CAPACITY_ANALYSIS_0814.md` |
| Observed peak load | `30 requests per second, the highest traffic yet observed, measured 2026-08-14 and not re-measured since` | `docs/CAPACITY_ANALYSIS_0814.md:59` (marked [M] measured: one day of edge logs, 5,676 requests, peak 30 rps; restated at `:41` and `:179`) |
| Model import | `6 formats — FBX, GLB/GLTF, OBJ, DAE, STL, PLY` | `src/utils/loadModelFromUrl.js` |
| Hierarchy reference file | `a reference FBX with 2,020 meshes and 571 groups` | `src/components/scene-outliner/ModelHierarchyTree.jsx:38-45` (the component's own performance note; the same file is the 47 MB gallery FBX logged at `PATCH_2_TEST_MANUAL.md:37`) |
| Fixtures | `29 built-in fixtures across 8 archetypes · IES (LM-63), EULUMDAT and GDTF import` | `src/core/catalog/customFixtureFactory.js` `FIXTURE_TYPE_PRESETS` and `FIXTURE_CATALOG`, `src/utils/iesLoader.js`, `src/components/tabs/LightingTab.jsx` accept lists |
| Ambient presets | `100,000 lx direct sunlight down to 5 lx theatre, plus full blackout` | `src/components/TopBar.jsx:194-215` (`AMBIENT_PRESETS`: Direct Sunlight 100000, Theater / Concert Hall 5, Full Blackout 0, Custom null) |

| Wall build ceiling | `695 projection receivers per scene, a measured ceiling, refused above it` | `src/utils/linework/planWallExtrude.js` `WALL_COUNT_HARD_MAX`, forwarding to `src/utils/gpuCapabilities.js` `RECEIVER_SOFT_MAX` = `floor(16.7 / 0.024)`; refusal enforced scene-wide at `src/components/engine/useLineworkOperators.js:1404-1417` |
| Plan import caps | `DWG 8 MB in, 40 MB converted out, 90 s watchdog; placed underlay 2,048 px long edge, 1.5 M characters, inside a 5 MiB local save ceiling` | `src/utils/dwg/dwgTransport.js` `DWG_MAX_BYTES` / `DWG_MAX_DXF_BYTES` / `DWG_TIMEOUT_MS`; `src/utils/plan/planImageEncode.js` `PLAN_IMAGE_MAX_EDGE_PX` / `PLAN_IMAGE_MAX_CHARS`; `src/utils/safeStorage.js` `STORAGE_HARD_CEILING_BYTES` |

Anything outside this table is not a stat, it is a guess, and it does not ship.

**(e) Prices are not stats, and are deliberately kept out of the pool.** Added 2026-09-06 with
`/pricing`. The three figures on that page (`KRW 9,900` / `17,900` / `149,000`) verify against an
owner decision and nothing else: no shipped source, no log, no dated pull. Widening the pool to
admit them would trade the pool's one entry condition for the convenience of one page.

The resolution is typographic rather than editorial. Every price on `/pricing` is set as **ROLE 3,
a figure inside prose**, in `.limits-text`, in a sentence. `.stat-value` and `.hero-readout-value`
stay what §2 says they are: the only two classes allowed to print at `--fs-stat`, reserved for
figures verified against shipped source. A price never enters those, never gets a `.stat-row`, and
never takes a `.stat-unit` span (`KRW` is a currency code, not a measurement unit; the class is
inventoried as units only). Set that way the pool does not bind, and the site keeps one rule about
headline numbers rather than two.

The same clause governs any future figure whose only source is a decision: publish it as prose,
dated, with what it is a decision *about* stated in the same sentence.

### 1.3 The lux-labelling rule

Four different lux figures exist in the engine with different meanings; `src/core/analysis/photometrics.js` carries a red-flag header saying every past bug came from mixing them. **Every lux number on the site carries its qualifier inline, in the same sentence, never in a footnote.**

- `Center Surface Lux` — the panel's per-projector centre readout.
- `Center Illuminance` — the same readout when an official-calculator combo is active (the label changes in-app; the site must too).
- `Reliable Surface Lux` — **full-target 20th percentile**. Not a peak, not an average. Always written as `Reliable Surface Lux (full-target p20)` on first use per page.
- Hover-probe lux — point illuminance at the cursor, all contributing heads summed.

### 1.4 The bilingual contract

The site is EN + KO inline on every block. **No language toggle** — a toggle hides half the content from whichever audience lands first.

> **EN is the claim, set in display type. KO is the practitioner's explanation, written natively in Korean, allowed to be longer, allowed to say things the EN line does not.**

The KO line must not be recoverable from the EN by translation. Korean copy in this document is final and must be pasted verbatim — it has already been de-calqued. Terminology that is fixed and must not be "improved":

| Use | Never use |
|---|---|
| `작업면` (working plane) | `워킹 플레인` |
| `축대칭` (IES radial symmetry) | `방사 대칭` |
| `클라우드에서 다시 불러올 때` (rehydrate) | `재수화` |
| `다음 업데이트에 반영합니다` | `빌드에 반영됩니다` |
| `프로젝션 검토 씬` | `투사 스터디` |
| `투사비` (throw ratio) | `스로우비` |
| `중앙 표면 조도` (Center Surface Lux) | `중앙 조도` |

Markup pattern, used everywhere:

```html
<div class="bilingual">
  <p class="bilingual-en" lang="en">FOUR HEADS, ONE FAÇADE, ONE SET OF NUMBERS</p>
  <p class="bilingual-ko" lang="ko">헤드 4대가 파사드 하나를 맡을 때, 값이 어디서 어긋나는지 먼저 봅니다.</p>
</div>
```

### 1.5 Platform contracts that must not break

1. All six existing `vercel.json` headers, `HSTS preload` included (§10.3).
2. `cleanUrls: true`, `trailingSlash: false` — link `/privacy` and `/videos`, **never** `.html`.
3. `data-app-link` CTA rewriting **with `siteReturnUrl`** on all three pages (currently `privacy.html` omits it — fix).
4. `localStorage` keys `fieldlux_flow_app_url` and `fieldlux_discord_url` keep their names and semantics.
5. Modifier-key / middle-click passthrough on `data-app-link` clicks.
6. The `discordUrl` hostname allowlist (`discord.gg`, `discord.com`, `*.discord.com`).
7. The `.media-slot` + `data-label` / `data-caption` / `.has-media` placeholder system, and the `--media-ratio` aspect pattern.
8. `tailwind.config.js` `content` must become `['./*.html', './src/**/*.{html,js}']` **before** `videos.html` is authored, or every utility on the new page is silently purged.

---

## 2. Design tokens

### 2.1 The token block — paste verbatim at the top of `src/input.css`

```css
:root {
  color-scheme: light;

  /* ── Page + surfaces ─────────────────────────────────────────── */
  --paper:       #FFFFFF;   /* the page ground. the default. */
  --surface-100: #F4F6F7;   /* cards, inset panels, code, empty media slots */
  --surface-200: #EBEEEF;   /* pressed states, table zebra */
  --surface-tint:#ECFBFC;   /* brand wash — used sparingly, callouts only */

  /* ── Ink scale (ratios measured on --paper) ──────────────────── */
  --ink-950: #020102;   /* logo ink. display type, primary text     20.84:1 */
  --ink-900: #0B0F11;   /* headings                                 19.25:1 */
  --ink-700: #2A3338;   /* body copy                                12.89:1 */
  --ink-500: #566268;   /* secondary copy, list bodies               6.28:1 */
  --ink-400: #626E74;   /* captions, micro-labels, control borders   5.25:1 */
  --ink-300: #8A959B;   /* NON-TEXT ONLY: disabled glyphs            3.06:1 */

  /* ── Brand ramp, sampled from assets/logo-mark.png ───────────── */
  --brand-100: #ECFBFC;
  --brand-200: #C9F4F7;
  --brand-300: #7FE4EA;
  --brand-400: #3FD3DF;  /* logo light cyan  — OBJECT ONLY      1.81:1 ✗text */
  --brand-500: #20D5DE;  /* logo mid         — OBJECT ONLY      1.81:1 ✗text */
  --brand-600: #00B1C4;  /* logo mid-dark    — DECORATIVE ONLY  2.60:1 ✗text */
  --brand-700: #008DA6;  /* large text ≥24px + UI boundaries    3.92:1 */
  --brand-800: #006E87;  /* logo deep teal   — TEXT-SAFE ACCENT 5.87:1 ✓ */
  --brand-900: #00566B;  /* link hover                          8.26:1 ✓ */
  --brand-950: #003F4E;  /* pressed                            11.53:1 ✓ */

  /* ── Mass: the only dark grounds on the site ─────────────────── */
  --mass-950: #04252D;   /* monitor screen ground, video letterbox */
  --mass-900: #073644;
  --mass-800: #0B4A5C;
  --mass-ink:      #FFFFFF;              /* on mass-950   16.06:1 */
  --mass-ink-soft: #B9CDD3;              /* on mass-950    9.74:1 */
  --mass-accent:   #3FD3DF;              /* on mass-950    8.87:1 */
  --mass-line:     rgba(63,211,223,0.22);
  --mass-line-soft:rgba(255,255,255,0.12);

  /* ── Monitor bezel — desaturated ramp descended from --mass-950 ─ */
  --bezel-hi:     #21353C;  /* lit top face   */
  --bezel-mid:    #0D1A20;  /* front slab     */
  --bezel-lo:     #16272E;  /* lower-right    */
  --bezel-edge:   #0A161B;  /* extruded wall 1 */
  --bezel-wall:   #060F13;  /* extruded wall 2 */
  --bezel-stand:  #12232A;  /* neck + base    */

  /* ── Hairlines ───────────────────────────────────────────────── */
  --line:        #E4E8EA;  /* decorative hairline, the document spine */
  --line-strong: #C9D0D3;  /* emphasized rule, dashed empty-slot border */
  --line-control:#626E74;  /* ANY border that identifies a control  5.25:1 ✓ */

  /* ── Focus ───────────────────────────────────────────────────── */
  --focus:         #006E87;   /* on light  5.87:1 */
  --focus-on-mass: #3FD3DF;   /* on mass   8.87:1 */
  --focus-halo:    #FFFFFF;
}
```

**Deleted from the old system, do not carry forward:** `--stage`, `--stage-2`, `--muted`, `--soft`, `--brand-2`, `--amber`, `--blue`, `--red`, `--green`, `--surface-50`, and the old alpha-based `--line` / `--line-strong` (light-on-dark values that invert to invisible on white — all 26 references are replaced by the opaque hexes above).

**`--ramp-1…5` are deleted too.** An earlier draft hard-coded a five-stop heatmap ramp "carried from the app". It is not what the app renders, and a `.meter-strip` of invented swatches sitting in the same viewport as a screenshot showing a different ramp is a self-inflicted credibility wound. **Decision: the site never draws its own heatmap ramp.** The three real app screenshots (`analysis-heatmap-absolute.png`, `-norm.png`, `-deviation.png`) each already contain the app's own legend — the screenshot *is* the ramp. No `.meter-strip` component exists in this build.

### 2.2 Contrast ledger (WCAG 2.x relative luminance, computed — this is the acceptance test)

| Foreground | Background | Ratio | Verdict |
|---|---|---:|---|
| `--ink-950` | `--paper` | 20.84 | AAA — display, h1–h2 |
| `--ink-900` | `--paper` | 19.25 | AAA — h3–h4 |
| `--ink-700` | `--paper` | 12.89 | AAA — body |
| `--ink-500` | `--paper` | 6.28 | AA body / AAA large |
| `--ink-400` | `--paper` | 5.25 | AA — micro-labels at 11 px pass |
| `--ink-300` | `--paper` | 3.06 | **non-text only** (1.4.11 pass, 1.4.3 fail) |
| `--brand-800` | `--paper` | 5.87 | AA — links, accent text, icons |
| `--brand-900` | `--paper` | 8.26 | AAA — link hover |
| `--brand-700` | `--paper` | 3.92 | large text ≥24 px / ≥18.66 px bold + UI only |
| `--brand-600` | `--paper` | 2.60 | **decorative fill only** |
| `--brand-500` / `--brand-400` | `--paper` | 1.81 | **decorative fill only** |
| `--paper` | `--brand-800` | 5.87 | AA — solid teal button |
| `--paper` | `--brand-900` | 8.26 | AAA — its hover |
| `--ink-950` | `--brand-500` | 11.54 | AAA — **this is how cyan becomes a CTA** |
| `--ink-950` | `--brand-400` | 11.50 | AAA |
| `--paper` | `--ink-950` | 20.84 | AAA - `.btn--solid` fill and the active `.filter-chip` |
| `--mass-ink-soft` | `--ink-950` | 12.64 | AAA - the count inside an active `.filter-chip`, one ink back from `--paper` |
| `--mass-ink` | `--mass-950` | 16.06 | AAA |
| `--mass-ink-soft` | `--mass-950` | 9.74 | AAA |
| `--brand-400` | `--mass-950` | 8.87 | AAA — cyan text lives here and nowhere else |
| `--brand-600` | `--mass-950` | 6.18 | AA |
| `--ink-700` | `--surface-100` | 11.89 | AAA |
| `--ink-400` | `--surface-100` | 4.84 | AA |
| `--brand-800` | `--surface-tint` | 5.52 | AA |
| `--ink-950` | `--surface-tint` | 19.62 | AAA |
| `--line` | `--paper` | 1.23 | decorative hairline (not a control boundary) |
| `--line-strong` | `--paper` | 1.56 | decorative rule |

Any pair not in this table must be computed and added before it ships.

### 2.3 The cyan rule — cyan means "measured"

> **Cyan never carries a letterform on white.** Brand-coloured *text* on white is `--brand-800`. Brand-coloured text on a dark ground is `--brand-400`.

Beyond that, cyan is rationed. `--brand-400/500/600` may appear on white in exactly **five** places site-wide:

1. `.btn--brand` fill (with `--ink-950` text on top) — hero primary CTA only.
2. `.pin-progress-bar`.
3. `.type-caret`.
4. `.nav-link` hover underline (as a `background`, not a `color`).
5. `.monitor-logo` mask fill.

Everything else that wants to feel branded uses `--brand-800` as text, or `--line` as structure. **There is no 18×2 px cyan dash under section labels** — that device is deleted (§4.6). Reserving cyan is what lets it mean something when it appears on a product screenshot.

**Ship gate:** `grep -nE 'color:\s*var\(--brand-[456]00\)' src/input.css` must return only rules scoped inside `.section--mass`, `.monitor-*`, or `.media-slot--mass`.

### 2.4 The three dark elements

R2 says white overall. Rhythm therefore comes from **measure and mass**, not from tint bands. There is no `--surface-50` alternating band in this build — a 1.3 % luminance step is invisible in any real light and produces fifteen sections that read as one undifferentiated column.

Exactly three things on the site are dark, and each is dark because the content inside it is:

1. **The hero monitor screen** (`--mass-950`) — it is a screen.
2. **Full-bleed product video letterboxes** (`.media-slot--mass`) — the footage is dark; the ground is the film's own frame. Used at most three times on the home page.
3. **Nothing else.** The footer is `--paper` with a `--line` top hairline.

Rhythm instead comes from three devices, specified in §3.6.

---

## 3. Typography and layout system

### 3.1 Fonts — swap all three, self-host both replacements

The current stack (Geist + Inter + Manrope, ~18 weight slices from one Google Fonts request) has three problems: it is three families for two jobs, `fontFamily.mono` is misnamed and maps to nothing monospace, and **none of the three ships Hangul**, so every Korean glyph today falls back to the OS font at a mismatched x-height. On a site that is bilingual on every block, that is disqualifying.

| Role | Family | Delivery |
|---|---|---|
| Display — h1/h2/h3, micro-labels, counters, stat values, marquee | **Geologica** variable, wght 300–700 | self-host `assets/fonts/geologica-var-latin.woff2`, latin subset, ~48 KB |
| Body, UI, **all Korean** | **Pretendard Variable** | self-host the **dynamic subset** at `assets/fonts/pretendard/` — ~100 unicode-range `.woff2` chunks; a browser pulls only what the page uses, typically 30–60 KB |

Self-hosting is required, not preferred: it removes `fonts.googleapis.com` and `fonts.gstatic.com` as origins, which is what makes the CSP in §10.3 cheap, and it kills two render-blocking cross-origin round trips. Pretendard's Latin is Inter-derived, so dropping Inter costs nothing visually, and Latin + Hangul share one metric system so mixed KO/EN lines sit on one baseline.

```css
@font-face{
  font-family:'Geologica';
  src:url('/assets/fonts/geologica-var-latin.woff2') format('woff2-variations');
  font-weight:300 700; font-style:normal; font-display:swap;
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+2074,
                U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2215,U+00B7;
}
@import url('/assets/fonts/pretendard/pretendard-dynamic-subset.css');

:root{
  --font-display:'Geologica','Pretendard Variable',Pretendard,-apple-system,
                 'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif;
  --font-body:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,
              'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',
              'Segoe UI',Roboto,sans-serif;
  --font-num:'Geologica',ui-monospace,SFMono-Regular,Menlo,monospace;
  font-synthesis-weight:none;
}
body{ font-family:var(--font-body); }
.u-tabular{ font-variant-numeric:tabular-nums; }
```

Preload exactly two files in `<head>`: the Geologica variable file and the Pretendard Latin chunk. Everything else loads on demand.

### 3.2 Type scale

Fluid between **390 px and 1440 px**; every `clamp()` slope is already solved for that range.

```css
:root{
  --fs-display-1: clamp(2.75rem, 0.707rem + 8.38vw, 8.25rem);    /*  44 → 132 */
  --fs-display-2: clamp(2.125rem, 0.964rem + 4.76vw, 5.25rem);   /*  34 →  84 */
  --fs-display-3: clamp(1.75rem, 1.100rem + 2.67vw, 3.5rem);     /*  28 →  56 */
  --fs-h3:        clamp(1.5rem, 1.129rem + 1.52vw, 2.5rem);      /*  24 →  40 */
  --fs-h4:        clamp(1.1875rem, 1.071rem + 0.48vw, 1.5rem);   /*  19 →  24 */
  --fs-lead:      clamp(1.0625rem, 0.970rem + 0.38vw, 1.3125rem);/*  17 →  21 */
  --fs-body:      clamp(1rem, 0.966rem + 0.10vw, 1.0625rem);     /*  16 →  17 */
  --fs-body-sm:   clamp(0.875rem, 0.841rem + 0.10vw, 0.9375rem); /*  14 →  15 */
  --fs-micro:     clamp(0.6875rem, 0.653rem + 0.10vw, 0.75rem);  /*  11 →  12 */
  --fs-counter:   clamp(0.75rem, 0.699rem + 0.19vw, 0.875rem);   /*  12 →  14 */
  --fs-stat:      clamp(2rem, 1.257rem + 3.05vw, 4rem);          /*  32 →  64 */
}
```

| Step | Family | Weight | Line-height | Tracking | Colour | Use |
|---|---|---|---|---|---|---|
| `--fs-display-1` | display | 500 | 0.92 | −0.035em | `--ink-950` | hero `<h1>`, one per site |
| `--fs-display-2` | display | 500 | 0.96 | −0.03em | `--ink-950` | `.section-title` |
| `--fs-display-3` | display | 500 | 1.02 | −0.025em | `--ink-950` | `.chapter-title`, footer lead |
| `--fs-h3` | display | 500 | 1.12 | −0.018em | `--ink-900` | `.pin-panel` heads, `.video-card-title` |
| `--fs-h4` | body | 600 | 1.28 | −0.008em | `--ink-900` | `.chapter-point-label`, `.stat-label` |
| `--fs-lead` | body | 400 | 1.55 | −0.004em | `--ink-500` | `.hero-lead`, `.section-lead` |
| `--fs-body` | body | 400 | 1.65 | 0 | `--ink-700` | paragraphs |
| `--fs-body-sm` | body | 400 | 1.60 | 0 | `--ink-500` | captions, list bodies, footer |
| `--fs-micro` | display | 600 | 1.0 | +0.14em | `--ink-400` | `.micro-label`, badges |
| `--fs-counter` | num | 500 | 1.0 | +0.06em | `--ink-400` | `.index-counter`, tabular |
| `--fs-stat` | num | 500 | 1.0 | −0.02em | `--ink-950` | `.stat-value`, `.hero-readout-value` |

Headings never go below 500 and never above 700. The display face's 800/900 read as marketing shout.

### 3.3 Korean rendering rules (mandatory — apply before any KO copy is pasted)

```css
:lang(ko){ letter-spacing:-0.005em; word-break:keep-all; overflow-wrap:anywhere; }
:lang(ko).hero-title,
:lang(ko).section-title,
:lang(ko).chapter-title{ line-height:1.16; letter-spacing:-0.01em; font-weight:600; }
:lang(ko) p, :lang(ko) li{ line-height:1.85; }
.micro-label:lang(ko){ text-transform:none; letter-spacing:.06em; }
```

`word-break: keep-all` is the single most important line in this document's CSS. Without it Korean wraps mid-word and the page reads as machine-translated. Uppercase and wide tracking are meaningless in Hangul and shred it — hence the `.micro-label` override.

### 3.4 Container and spacing

```css
:root{
  --gutter:  clamp(20px, 4.2vw, 64px);
  --w-page:  1440px;   /* THE container. one width. */
  --w-narrow:1120px;   /* prose-forward sections, pin panels */
  --w-text:  68ch;     /* max measure for any paragraph */
  --gap:     clamp(16px, 1.8vw, 28px);
  --nav-h:   clamp(64px, 5.2vw, 84px);

  --pad-xs: clamp(40px,  5vw,  64px);
  --pad-sm: clamp(64px,  7.5vw,104px);
  --pad-md: clamp(96px, 11vw, 168px);
  --pad-lg: clamp(140px,16vw, 240px);
}
.site-shell{ width:min(var(--w-page), 100% - var(--gutter)*2); margin-inline:auto; }
.site-shell--narrow{ width:min(var(--w-narrow), 100% - var(--gutter)*2); margin-inline:auto; }
```

The old four competing max-widths (1520 / 1720 / 1400 / 1400) collapse to these two. Nav and hero use `--w-page` like everything else.

### 3.5 Grid

```css
.grid-12{ display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:var(--gap); }
```
Span classes `.col-3 .col-4 .col-5 .col-6 .col-7 .col-8 .col-12`, offsets `.start-2 .start-6 .start-7 .start-8`. At ≤1180 px every `.col-*` becomes span 6; at ≤860 px span 12.

Named two/three-part layouts so section markup stays readable: `.split-2` (1fr 1fr), `.split-2--lead-left` (1.15fr 0.85fr), `.split-2--media-right` (0.44fr 0.56fr), `.split-3`.

### 3.6 Rhythm — three devices, no tint bands

**(1) Measure jumps.** Prose runs at `--w-text` (68ch) hard-left inside the 12-column grid; media runs full `--w-page` or bleeds to the viewport. The eye reading a column jump from 68ch to 1440 px registers structure. This is the primary device.

**(2) Mass beats.** The three product captures bleed full-width on a `--mass-950` letterbox ground with `padding-block: var(--pad-xs)`. Three deliberate dark beats across an eleven-screen page. Nothing else is dark.

**(3) The document spine.** Every chapter and every section opens with a full-column `1px solid var(--line)` rule carrying its ordinal in the number face: `(03)` in `--ink-950`, the name in `--ink-400`. Repeated ten times, this alone makes the page read as a numbered technical document rather than a landing page. Detail in §4.6.

Section padding:

```css
.section{ padding-block:var(--pad-md); position:relative; }
.section--pad-xs{ padding-block:var(--pad-xs); }
.section--pad-sm{ padding-block:var(--pad-sm); }
.section--pad-lg{ padding-block:var(--pad-lg); }
.section--wash{ background:var(--surface-tint); }   /* callout bands only, max 1 per page */
.section--mass{ background:var(--mass-950); color:var(--mass-ink); }
.hero + .section{ padding-block-start:var(--pad-sm); }
```

Page rhythm: hero → `pad-sm` → `pad-md` × chapters → `pad-lg` (the one pinned block) → `pad-md` → `pad-sm` (CTA) → footer. Never two `pad-lg` in a row.

### 3.7 The bleed rule

```css
html{ overflow-x:clip; scrollbar-gutter:stable; }   /* clip, NOT hidden */
body{ overflow-x:clip; }
.site-main{ container-type:inline-size; }

.bleed-full  { inline-size:100cqw; margin-inline:calc(50% - 50cqw); }
.bleed-right { margin-inline-end:calc(50% - 50cqw); }
.bleed-left  { margin-inline-start:calc(50% - 50cqw); }
.bleed-gutter{ margin-inline:calc(var(--gutter) * -1); }
```

Two things here are load-bearing and must not be "simplified":

- **`overflow-x: clip`, never `hidden`.** `hidden` makes `html` a scroll container and silently kills `position: sticky`, which the pinned chapter (§6.10) and the sticky header depend on. This is the number-one way sticky dies.
- **Container query units, not `100vw`.** With `scrollbar-gutter: stable` reserved, `100vw` exceeds the body content width by the scrollbar width and every full-bleed element overhangs asymmetrically. `100cqw` measures the actual container.

Rules of use: only `.media-slot`, `.marquee`, `.hero-monitor` and `.pin-flow` may bleed — **never text**. A bleeding element that contains a caption keeps its own inner `padding-inline: var(--gutter)`. `.bleed-right` is the default for chapter media on odd chapters, `.bleed-left` on `.chapter--reverse`. Below 860 px all bleeds degrade to `.bleed-gutter`.

### 3.8 Breakpoints

Four, hand-written, reusing the existing vocabulary so the rewrite does not invent a fifth: **1180 / 860 / 560 / 380**. No Tailwind `screens`. (Custom properties do not work inside media queries; document them in a comment only.)

| Breakpoint | What changes |
|---|---|
| ≤1180 px | nav links → `.nav-toggle`; all two-column splits stack; monitor tilt softens; pin block unpins |
| ≤860 px | everything one column; bleeds → `.bleed-gutter`; monitor loses perspective, neck and base |
| ≤560 px | `.hero-notch` stops overlapping and stacks below; marquee speeds up; card grid one-up |
| ≤380 px | gutter floor, `--fs-display-1` at its 44 px min |

---

## 4. Component class contract

This is the complete vocabulary. **Anything not named here does not get invented.** If the build needs a class that is missing, that is a spec defect — add it here first.

### 4.1 Shell and global

| Class | Element | Notes |
|---|---|---|
| `.skip-link` | `<a href="#main">` | **first child of `<body>`**, visually hidden until `:focus-visible` |
| `.site-shell` / `.site-shell--narrow` | `div` | the only containers |
| `.site-main` | `<main id="main" tabindex="-1">` | carries `container-type: inline-size` |
| `.section` + `--pad-xs\|sm\|lg`, `--wash`, `--mass` | `<section>` | each carries `aria-labelledby` |
| `.bleed-full` `.bleed-left` `.bleed-right` `.bleed-gutter` | — | §3.7 |
| `.grid-12`, `.col-3…12`, `.start-2\|6\|7\|8` | — | §3.5 |
| `.split-2`, `.split-2--lead-left`, `.split-2--media-right`, `.split-3` | — | |
| `.bilingual`, `.bilingual-en`, `.bilingual-ko` | `div` + two `<p>` | §1.4; `lang` attribute mandatory on each child |
| `.u-visually-hidden`, `.u-text-measure`, `.u-nowrap`, `.u-tabular` | — | `.u-text-measure{max-inline-size:var(--w-text)}` |

### 4.2 Navigation

`.site-header` · `.site-header.is-scrolled` · `.nav-shell` · `.brand-lockup` · `.brand-lockup-img` · `.brand-beta` · `.nav-links` · `.nav-link` · `.nav-link[aria-current="page"]` · `.nav-actions` · `.nav-toggle` · `.nav-toggle-bar` · `.nav-overlay` · `.nav-overlay-inner` · `.nav-overlay-list` · `.nav-overlay-link` · `.nav-overlay-index` · `.nav-overlay-meta` · `body.overlay-open`

**Brand lockup — resolved.** A dark-ink wordmark asset **does exist**: `assets/logo-ink.png` (770 × 224, cyan hex-F mark + near-black `FieldLux` wordmark on transparent — verified by decoding the PNG: wordmark pixels average luminance 11.1, sampled `#0B0B0B`, versus `logo.png` at 252.2). Earlier drafts claimed no dark lockup existed and specified setting the wordmark as live text. **Do not do that** — the real wordmark is a custom geometric grotesque that Geologica does not match, and live text would ship two competing wordmarks between site and app.

```html
<a class="brand-lockup" href="/" aria-label="FieldLux — home">
  <img class="brand-lockup-img" src="/assets/logo-ink.png" width="154" height="45" alt="FieldLux">
  <span class="brand-beta">BETA</span>
</a>
```

Under `@media (forced-colors: active)` only, hide the image and render live text in `CanvasText`.

**Nav item list — final, no substitutions:**

| Label | href | Notes |
|---|---|---|
| `Product` | `#product` | anchor exists (§6.4) |
| `Measurement` | `#measure` | anchor exists (§6.10). **Not** "Analysis" — that word is banned |
| `Videos` | `/videos` | `aria-label="Feature videos"`; `aria-current="page"` on `videos.html` |
| `Discord` | `data-discord-link` | `target="_blank" rel="noopener noreferrer"` |

Plus two CTAs in `.nav-actions`: `Sign in` (`.btn--outline .btn--sm`, `data-app-link`) and `Start free` (`.btn--solid .btn--sm`, `data-app-link`). Both are always visible, including mobile. **Five nav links + two CTAs. That is the complete list.**

> **Amended 2026-09-06, second pass: `Limits` is REMOVED from the spine and `#limits` is deleted from the site.** Owner decision, taken while the paid tiers were being designed. The section published the frozen assumption constants, their error budgets, what the engine does not model, and what the product does not claim. It is gone from `index.html` in full, along with its nav mark, both CTAs that pointed at it (`SEE THE LIMITS` in the hero, `READ THE LIMITS` on `/privacy` and `/pricing`), and the page title and meta description that promised "a published error budget for every assumption".
>
> **What was deliberately KEPT, and this is the boundary of the decision:** the short qualifiers inside the chapters (an estimate labelled as an estimate, a beta feature named as beta, a desktop-only feature named as such), the whole of `privacy.html`, and the evidence rule at 1.2a. The site still may not claim what a visitor cannot reach; it simply no longer publishes a dedicated inventory of its own uncertainty. §6.13, §1.2b and the R8 row above describe a section that no longer exists and are kept as the record of what was there.

> **Amended 2026-09-06.** `Pricing` (`/pricing`) was added as the fifth mark and `Discord` moved to the sixth. It takes an ordinal because it is a page of this document, the same class of thing as `Videos`, rather than an account action. The phone header budget is untouched: `.nav-links` is `display:none` at 1180 px and below (`src/input.css:3257`), so the 380 px measurement never sees the sixth link, and above 1180 px the row has the width.

Nav links must exist below 1180 px — `.nav-toggle` opens `.nav-overlay`. The current site has no mobile nav at all; that is a defect being fixed, not a style choice.

### 4.3 Hero

`.hero` · `.hero-inner` · `.hero-copy` · `.hero-title` · `.hero-title-line` · `.hero-lead` · `.hero-actions` · `.hero-notch` · `.hero-readout` · `.hero-readout-item` · `.hero-readout-label` · `.hero-readout-value` · `.hero-readout-qual` · `.hero-scroll-hint`

Typewriter: `.type-slot` · `.type-word` · `.type-caret` · `.type-sr`

Geometry, previously unspecified and now fixed:

```css
.hero{ min-block-size:100svh; display:grid; align-content:center; padding-block-start:var(--nav-h); }
.hero-notch{
  margin-block-start: clamp(-140px, -9vw, -56px);   /* the overlap */
  inline-size: min(560px, 92%);
  background: var(--paper);
  padding: clamp(24px,3vw,40px);
  border-block-start: 1px solid var(--line);
  position: relative; z-index: 2;
}
@media (max-width:560px){ .hero-notch{ margin-block-start:0; inline-size:100%; } }
```

`.hero-notch` carries the H1 and the typewriter, overlapping the monitor's lower-left — this is benchmark mechanic M4. **It comes before `.hero-monitor` in the DOM** even though it paints on top, so focus order matches reading order.

### 4.4 The 3D monitor

`.hero-monitor` · `.monitor-stage` · `.monitor-body` · `.monitor-screen` · `.monitor-video` · `.monitor-inset` · `.monitor-chin` · `.monitor-logo` · `.monitor-neck` · `.monitor-base` · `.monitor-shadow` · `.monitor-controls` · `.monitor-pause` · `.monitor-caption`

**Deleted from earlier drafts, and they must not come back: `.monitor-glare` and `.monitor-sheen`.** Both applied `mix-blend-mode: screen` with a white gradient over the video. That colour-shifts a measurement image — most at the blue end of the heatmap ramp — on a site whose entire argument is that FieldLux does not distort numbers. **Never blend anything over a measurement image.** Depth comes from the bezel, the extruded side wall and the ground shadow, all of which are outside the screen aperture.

Full CSS in §6.2.

### 4.5 Marquee

`.marquee` · `.marquee--hairline` · `.marquee-track` · `.marquee-group` · `.marquee-item` · `.marquee-dot`

**Position — decided:** the marquee is a full-bleed hairline strip sitting **directly below the hero, above the first section** (`#who`). It does not sit over the monitor and does not float. `.marquee--hairline` gives it a `1px solid var(--line)` top and bottom and `padding-block: clamp(14px,1.6vw,22px)`.

### 4.6 Section head and the document spine

`.section-head` · `.section-head--split` · `.section-head-aside` · `.micro-label` · `.micro-label-ord` · `.micro-label-name` · `.micro-label--on-mass` · `.section-title` · `.section-title-line` · `.section-lead`

The old `.kicker` is deleted. So is the 18 × 2 px cyan dash that earlier drafts put on `.micro-label::before` — it is the most-cloned SaaS device of the last three years, it would have appeared ~30 times on the home page, and it spends cyan on decoration so that cyan means nothing when it lands on a product screenshot.

```css
.micro-label{
  display:flex; align-items:baseline; gap:.75em;
  inline-size:100%;
  border-block-start:1px solid var(--line);
  padding-block-start:10px;
  font-family:var(--font-display); font-size:var(--fs-micro); font-weight:600;
  line-height:1; letter-spacing:.14em; text-transform:uppercase;
}
.micro-label::before{ content:none; }          /* explicit: no dash, ever */
.micro-label-ord { font-family:var(--font-num); font-variant-numeric:tabular-nums;
                   color:var(--ink-950); }     /* "(03)" */
.micro-label-name{ color:var(--ink-400); }     /* "THE COVERAGE" */
.micro-label--on-mass .micro-label-ord { color:var(--mass-ink); }
.micro-label--on-mass .micro-label-name{ color:var(--mass-ink-soft); }
.micro-label--on-mass  { border-block-start-color:var(--mass-line-soft); }
```

`.section-title-line` is `display:block`; **line breaks are authored, never forced with `white-space:nowrap`.** The old hand-written nowrap-span system is deleted.

### 4.7 Feature chapter — the part-by-part explainer

`.chapters` · `.chapter` · `.chapter--reverse` · `.chapter-head` · `.chapter-title` · `.chapter-body` · `.chapter-points` · `.chapter-point` · `.chapter-point-label` · `.chapter-point-text` · `.chapter-media` · `.chapter-foot` · `.chapter-link`

One `.chapter` per shipped app area — **ten of them, listed in §6.5**. Each is a `.section .section--pad-md`, alternating `.chapter--reverse`. `.chapter--reverse` flips the media with grid `order` on the **media element only**; text DOM order never changes.

`.chapter-point` carries a `2px` left rule in `--line` that goes `--brand-500` on hover — one of the five sanctioned cyan uses is *not* this, so use `--brand-800` here. (Corrected: the hover rule is `--brand-800`.)

### 4.8 Sticky pin — used exactly once

`.pin` · `.pin-rail` · `.pin-sticky` · `.pin-flow` · `.pin-panel` · `.pin-panel.is-active` · `.pin-progress` · `.pin-progress-bar` · `.pin-counter`

```css
.pin{ position:relative; min-block-size:auto; }          /* NOT 300vh */
.pin-rail{ display:grid; grid-template-columns:0.42fr 0.58fr; gap:var(--gap); align-items:start; }
.pin-sticky{ position:sticky; inset-block-start:calc(var(--nav-h) + clamp(24px,4vh,64px));
             block-size:fit-content; }
.pin-flow{ display:grid; gap:clamp(48px,9vh,120px); }
.pin-panel{ min-block-size:62vh; }                        /* NOT 76vh */
```

**Exactly three `.pin-panel`s, exactly one `.pin` on the site** (§6.10). An earlier draft specified five panels at 76vh inside a `min-block-size:300vh` parent — that totals ~416vh, so the 300vh floor never bound and the reader scrolled four viewport heights past a heading that never changed. Three panels at 62vh is a real pin; the floor is removed because the panels already provide the height.

Pure CSS pinning. No scroll hijack, no JS positioning. The counter and progress bar update from an `IntersectionObserver` on `.pin-panel` at `threshold: 0.55`.

At ≤1180 px: `.pin-rail` becomes one column and `.pin-sticky{position:static}` — the whole thing degrades to stacked sections.

### 4.9 Media

`.media-slot` · `.media-slot.has-media` · `.media-slot--mass` · `.media-slot--wide` · `.media-frame` · `.media-video` · `.media-img` · `.media-label-badge` · `.media-caption` · `.media-poster`

The placeholder mechanism is carried forward **unchanged in behaviour**, repainted for white. It is the single source of truth for "footage not yet shot" everywhere on the site.

```css
:root{ --media-ratio: 1918 / 942; }        /* default = the app-window capture ratio */

.media-slot{
  position:relative; aspect-ratio:var(--media-ratio);
  background:var(--surface-100);
  border:1px dashed var(--line-strong);
  display:grid; place-content:center; gap:8px; text-align:center;
  overflow:hidden;
}
.media-slot::before{ content:attr(data-label);
  font-family:var(--font-display); font-size:var(--fs-micro); font-weight:600;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ink-400); }
.media-slot::after { content:attr(data-caption);
  font-family:var(--font-body); font-size:var(--fs-body-sm); color:var(--ink-400); }
.media-slot.has-media{ border-style:solid; border-color:var(--line);
  background:var(--mass-950); }
.media-slot.has-media::before,
.media-slot.has-media::after{ content:none; }
.media-video,.media-img{ inline-size:100%; block-size:100%; object-fit:cover; display:block; }
```

**Aspect ratios are per-slot, not global.** The three captures are not all the same size — two are 1918 × 942 and one is 1912 × 942. Set `style="--media-ratio: 1912 / 942"` on the hover-probe slot. Do not "normalise" them.

### 4.10 Index counter

`.index-counter` · `.index-counter-current` · `.index-counter-total` · `.index-counter-tick`

Renders `(01) / (10)` in `--font-num`, tabular, `--fs-counter`, `--ink-400`; `.index-counter-current` is `--ink-950`. `aria-hidden="true"` whenever the same ordinal already appears in the adjacent heading (which, with the `.micro-label-ord` spine, it usually does).

### 4.11 Stats and limits

`.stat-row` · `.stat` · `.stat-value` · `.stat-unit` · `.stat-label` · `.stat-note`
`.limits` · `.limits-row` · `.limits-key` · `.limits-en` · `.limits-ko`
`.speclist` · `.speclist-item` · `.speclist-index` · `.speclist-body`
`.heatmap-mode-grid` · `.heatmap-mode` · `.heatmap-mode-title` · `.heatmap-mode-body`

**Deleted and must not be built:** `.trust-quote`, `.trust-quote-body`, `.trust-quote-cite`, `.trust-logo-row`, `.trust-logo`, `.meter-strip`, `.meter-swatch`, `.meter-scale`, `.meter-scale-min`, `.meter-scale-max`, `.metric-grid`, `.metric`, `.metric-label`, `.metric-value`.

There is not one customer testimonial in existence, and the only "logos" available are the four projector brands — putting them in a logo row implies an endorsement nothing evidences, on a site whose whole argument is not overclaiming. If a coverage strip is ever wanted it is text-only: `EPSON · PANASONIC · CHRISTIE · BARCO — 87 models, 113 lenses` with a visible note that inclusion is catalogue data, not partnership. `.meter-strip` and `.metric-grid` are gone for the reason in §2.1 — the screenshots carry the real legend.

### 4.12 Buttons and links

```
.btn              base: min-block-size 48px, radius 6px, padding-inline clamp(18px,1.6vw,26px)
.btn--solid       --ink-950 fill / --paper text          20.84:1   default primary
.btn--brand       --brand-500 fill / --ink-950 text      11.54:1   hero only, 1px --brand-700 ring
.btn--outline     transparent / --ink-950 text, 1px --line-control border
.btn--text        text + arrow, no box
.btn--on-mass     inverted set for .section--mass and .monitor-*
.btn--sm          min-block-size 40px
.btn-arrow        the ↗ glyph span inside .btn--text
.btn.is-disabled  --ink-300 on --surface-200, aria-disabled="true"
.link             prose link: --brand-800, underline 1px, offset .22em; hover --brand-900 + 2px
```

Icon-only buttons get `min-inline-size: 48px`. `.button-light` and `.button-ghost` from the old system are deleted — both are dark-only and invert to invisible on white. Every CTA that points at the app keeps `data-app-link`.

### 4.13 Footer

`.site-footer` · `.footer-inner` · `.footer-lead` · `.footer-contact` · `.footer-contact-item` · `.footer-cols` · `.footer-col` · `.footer-col-title` · `.footer-links` · `.footer-link` · `.footer-meta` · `.footer-legal` · `.motion-toggle`

Footer ground is `--paper` with a `1px solid var(--line)` top rule and large left-aligned display type — **not** the old `#0d0e11` box. `.footer-link` targets are `/privacy` and `/videos`, never `.html`.

### 4.14 Video page (`/videos`)

`.videos-page` · `.video-hero` · `.video-hero-title` · `.pub-progress` · `.pub-progress-bar` · `.pub-progress-text`
`.filter-rail` · `.filter-chip` · `.filter-chip.is-active` · `.filter-toggle` · `.filter-result-sr`
`.video-chapter` · `.video-chapter-head` · `.video-chapter-title` · `.video-chapter-count`
`.video-grid` · `.video-card` · `.video-card--pending` · `.video-card-link` · `.video-card-media` · `.video-card-preview` · `.video-card-play` · `.video-card-duration` · `.video-card-duration--planned` · `.video-card-body` · `.video-card-tag` · `.video-card-title` · `.video-card-title-ko` · `.video-card-desc` · `.video-card-desc-ko` · `.video-empty-note`
`.video-lightbox` · `.video-lightbox__backdrop` · `.video-lightbox__panel` · `.video-lightbox__header` · `.video-lightbox__title` · `.video-lightbox__close` · `.video-lightbox__player` · `.video-lightbox__meta` · `.video-lightbox__nav` · `.video-lightbox__prev` · `.video-lightbox__next`

This is the contract. Earlier drafts used a parallel `.fv-card__*` / `#video-modal` / `body.modal-open` system — that is superseded; use the names above throughout.

**Card markup — `<article>`, not `<button>`.** An earlier draft made the whole card a `<button>` containing an `<h3>` and four `<p>`s. That is invalid HTML (button content model is phrasing content), it breaks heading navigation, and `disabled` on pending cards would remove all the descriptive copy from the accessibility tree — on a page whose entire value while unshot *is* the descriptive copy.

```html
<article class="video-card" data-slug="auto-edge-blend" data-chapter="ch-blend" data-len="45">
  <a class="video-card-link" href="/assets/media/features/auto-edge-blend.mp4"
     data-video-open="auto-edge-blend">
    <span class="video-card-media media-slot has-media"
          data-label="AUTO EDGE BLEND" data-caption="RECORDING · 촬영 예정">
      <img class="media-img media-poster" src="/assets/media/features/auto-edge-blend.jpg"
           alt="" loading="lazy" decoding="async">
      <span class="video-card-play" aria-hidden="true"></span>
      <span class="video-card-duration">0:45</span>
    </span>
    <span class="video-card-title">Auto edge blend detection</span>
  </a>
  <div class="video-card-body">
    <p class="video-card-tag">(03) COVERAGE &amp; BLENDING</p>
    <p class="video-card-title-ko" lang="ko">자동 엣지 블렌드 검출</p>
    <p class="video-card-desc" lang="en">Measures every head's real footprint against the target and writes the per-edge overlap widths and the blend curve itself — in one undo step.</p>
    <p class="video-card-desc-ko" lang="ko">프로젝터마다 실제로 빛이 닿는 영역을 재서, 엣지별 겹침 폭과 블렌드 커브를 직접 써 넣습니다. 되돌리기 한 번이면 전부 취소됩니다.</p>
  </div>
</article>
```

A pending card is identical except: the `<span class="video-card-media media-slot">` **omits `.has-media`** (so the dashed empty state and its label/caption render), the `<img>` and `.video-card-play` are absent, the duration span carries `.video-card-duration--planned` and reads `≈ 0:45`, and the `<a class="video-card-link">` becomes `<span class="video-card-link" aria-disabled="true">`. The `.video-card-body` copy is at **full opacity** — dimming says "degraded"; full-strength text says "documented, footage pending".

**No play triangle, no spinner, no broken-image glyph on pending cards.** A play affordance that cannot play is the thing that reads as broken.

### 4.15 Motion utilities

`.reveal` · `.reveal.is-in` · `.reveal-lines` · `.reveal-line` · `.reveal-line-inner` · `html[data-motion="on"|"off"]`

---

## 5. Motion spec

```css
:root{
  --ease-out:    cubic-bezier(.22,1,.36,1);     /* default */
  --ease-in-out: cubic-bezier(.65,.05,.36,1);   /* overlays */
  --ease-spring: cubic-bezier(.34,1.4,.44,1);   /* caret only */
  --t-fast:   160ms;
  --t-base:   260ms;
  --t-slow:   620ms;
  --t-reveal: 760ms;
  --stagger:   70ms;
}
```

### 5.1 Scroll — in-house, non-virtualized. No Lenis.

The benchmark uses Lenis (it `preventDefault`s wheel and drives `scrollTo` itself). FieldLux does not adopt it, for three reasons that are all decided, not open:

1. **Dependency envelope.** Zero npm runtime deps, no bundler, `outputDirectory: "."`. Lenis means a CDN `<script>` (which kills the CSP that self-hosted fonts make cheap) or a vendored build nobody will update.
2. **Accessibility cost.** Virtualized scroll degrades keyboard paging, find-in-page scroll-into-view, scrollbar dragging and AT virtual cursors. A product pitching engineering trust must not ship a scroll that fights the OS.
3. **It is not needed.** What Lenis actually buys is *eased values driving effects*. A lerp on a passive scroll listener gives that with none of the cost.

```js
/* replaces Lenis. One rAF loop, one lerped value, one custom property. */
const heroMon = document.querySelector('.hero-monitor');
if (heroMon) {
  let target = 0, current = 0, ticking = false;
  const lerp = (a, b, t) => a + (b - a) * t;
  const frame = () => {
    const heroH = heroMon.offsetHeight || 1;      // recomputed, never captured stale
    current = lerp(current, target, 0.11);
    if (Math.abs(target - current) < 0.05) current = target;
    heroMon.style.setProperty('--mon-tilt',
      String(1 - Math.min(1, current / (heroH * 0.6))));
    ticking = Math.abs(target - current) > 0.05;
    if (ticking) requestAnimationFrame(frame);
  };
  addEventListener('scroll', () => {
    target = scrollY;
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
}
```

Two defects from earlier drafts are fixed here and must stay fixed:

- **No `--sy` / `--syn` on `:root`.** Those were written every frame and consumed by nothing. A custom property set on `documentElement` invalidates computed style for the entire subtree — a full-document style recalc at 60 fps, permanently, for zero effect. `--mon-tilt` is set on `.hero-monitor` only.
- **The loop does not start when there is no hero.** `/videos` and `/privacy` have no `.hero-monitor`; without the guard, `heroH` was `undefined` and the property got `NaN`.

Anchor jumps use native smooth scroll:

```css
html{ scroll-behavior:smooth; scroll-padding-block-start:calc(var(--nav-h) + 16px); }
@media (prefers-reduced-motion: reduce){ html{ scroll-behavior:auto; } }
```

### 5.2 Marquee

```html
<div class="marquee marquee--hairline bleed-full" aria-hidden="true">
  <div class="marquee-track">
    <ul class="marquee-group">…items…</ul>
    <ul class="marquee-group">…identical copy…</ul>
  </div>
</div>
```
```css
.marquee{ overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent); }
.marquee-track{ display:flex; inline-size:max-content; will-change:transform;
  animation:marquee var(--marquee-dur,42s) linear infinite; }
@keyframes marquee{ to{ transform:translate3d(-50%,0,0); } }
.marquee:hover .marquee-track,
.marquee:focus-within .marquee-track{ animation-play-state:paused; }
@media (max-width:560px){
  .marquee{ --marquee-dur:28s; }
  .marquee-item{ font-size:var(--fs-micro); }
}
```

Exactly **two** identical groups — the `-50%` keyframe depends on it. `aria-hidden="true"` in full: the keywords are duplicated in the chapter titles below.

**Content (final, ten items — one per chapter, `·` separated by `.marquee-dot`):**
`THE SCENE · THE OPTICS · THE COVERAGE · THE CORRECTION · THE CONTENT · THE MEASUREMENT · THE LIGHT · THE ROOM AROUND IT · THE DELIVERABLE · THE PROJECT`

Reduced motion / `data-motion="off"`: `animation:none`, `.marquee-track{inline-size:auto}`, second group `display:none`, `.marquee{overflow-x:auto}` — it becomes a scrollable keyword strip. WCAG 2.2.2 is satisfied by that plus hover/focus pause plus the global `.motion-toggle`.

### 5.3 Scroll reveal

```css
.reveal{ opacity:0; transform:translate3d(0,22px,0);
  transition:opacity var(--t-slow) var(--ease-out),
             transform var(--t-reveal) var(--ease-out);
  transition-delay:calc(min(var(--i,0), 5) * var(--stagger)); }
.reveal.is-in{ opacity:1; transform:none; }

.reveal-line{ overflow:hidden; display:block; }
.reveal-line-inner{ display:block; transform:translate3d(0,105%,0);
  transition:transform 700ms var(--ease-out);
  transition-delay:calc(var(--i,0) * 90ms); }
.reveal-lines.is-in .reveal-line-inner{ transform:none; }
```
```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
document.querySelectorAll('.reveal, .reveal-lines').forEach((el) => {
  const group = el.closest('.section') || document;
  const sibs = [...group.querySelectorAll('.reveal, .reveal-lines')];
  el.style.setProperty('--i', String(sibs.indexOf(el) % 6));   // per-section, not global
  io.observe(el);
});
```

One-shot (`unobserve`) — nothing re-animates on scroll-back; re-triggering reads as gimmick. Stagger capped at index 5, so nothing ever waits more than 350 ms to be readable. Reduced motion: skip the observer entirely and pin `opacity:1; transform:none; transition:none`.

### 5.4 Pin progress

Second `IntersectionObserver` on `.pin-panel` (`threshold: 0.55`) sets `.is-active`, writes the ordinal into `.pin-counter`, and sets `--p` on `.pin-progress-bar`:

```css
.pin-progress-bar{ block-size:2px; background:var(--brand-500);
  transform:scaleX(var(--p,0)); transform-origin:left;
  transition:transform 320ms var(--ease-out); }
```

Reduced motion removes the `transition` only — sticky positioning is not motion and stays.

### 5.5 Typewriter

```html
<h1 class="hero-title">
  <span class="hero-title-line">CAN YOU HIT</span>
  <span class="hero-title-line">350 LUX ON THAT</span>
  <span class="type-slot" aria-hidden="true"><span class="type-word"></span><span class="type-caret">_</span></span>
  <span class="u-visually-hidden"> façade, dome, stage or tunnel?</span>
</h1>
```
```css
.type-caret{ display:inline-block; inline-size:.62em; color:var(--brand-500);
  animation:caret 1.06s steps(1,end) infinite; }
@keyframes caret{ 0%,49%{opacity:1} 50%,100%{opacity:0} }
```

Timing: type 55 ms/char, hold 1900 ms, delete 32 ms/char, gap 220 ms. Words: `FAÇADE` · `DOME` · `STAGE` · `TUNNEL`.

`.type-slot` is `aria-hidden` and the full list lives in the visually-hidden span, so assistive tech reads one coherent sentence. **No `aria-live`** — a typewriter in a live region is an accessibility disaster.

Reduced motion / `data-motion="off"`: render `FAÇADE` statically, `.type-caret{animation:none;opacity:.45}`.

### 5.6 Nav

```css
.site-header{ position:fixed; inset-block-start:0; inset-inline:0; z-index:60;
  block-size:var(--nav-h); background:transparent;
  transition:background var(--t-base) var(--ease-out),
             block-size var(--t-base) var(--ease-out),
             box-shadow var(--t-base) var(--ease-out); }
.site-header.is-scrolled{ block-size:calc(var(--nav-h) - 18px);
  background:rgba(255,255,255,.86); backdrop-filter:blur(14px) saturate(1.4);
  box-shadow:0 1px 0 var(--line); }
@supports not (backdrop-filter: blur(1px)){ .site-header.is-scrolled{ background:rgba(255,255,255,.97); } }
@media (prefers-reduced-transparency: reduce){
  .site-header.is-scrolled{ background:var(--paper); backdrop-filter:none; } }
```

Toggle `.is-scrolled` at `scrollY > 24` with a 12 px hysteresis band, from the same passive scroll listener.

Overlay nav: `clip-path: inset(0 0 100% 0)` → `inset(0)`, 420 ms `--ease-in-out`, links stagger 40 ms. Reduced motion: instant opacity swap.

### 5.7 Hover and press

All hover transforms wrapped in `@media (hover:hover) and (pointer:fine)`.

| Target | Effect | Timing |
|---|---|---|
| `.media-slot.has-media`, `.video-card-media` | inner img/video `scale(1.014)`, frame `overflow:hidden` | 520 ms `--ease-out` |
| `.btn--solid` / `.btn--brand` | background steps one token darker | `--t-fast` |
| `.btn--outline` | border `--line-control` → `--ink-950`; bg → `--surface-100` | `--t-fast` |
| `.btn--text` | `.btn-arrow` `translate(3px,-3px)` | `--t-base` |
| `.nav-link` | `::after` `scaleX(0→1)`, `background:var(--brand-500)`, 2px | `--t-base` |
| `.chapter-point` | left rule `--line` → `--brand-800` | `--t-fast` |
| `:active` on `.btn` | `scale(.985)` | 90 ms |

### 5.8 Overlay management — one system for both overlays

Two overlays exist site-wide: `.nav-overlay` (all pages) and `.video-lightbox` (`/videos` only). On `/videos` both are live at once. They therefore share **one** body-scroll lock class and **one** Escape handler that closes the topmost open overlay.

```js
const overlays = [];  // push {el, close} in DOM order; last opened is topmost
function openOverlay(rec){ overlays.push(rec); document.body.classList.add('overlay-open'); }
function closeTop(){ const r = overlays.pop(); r?.close();
  if (!overlays.length) document.body.classList.remove('overlay-open'); }
addEventListener('keydown', e => { if (e.key === 'Escape' && overlays.length) closeTop(); });
```

`body.overlay-open{ overflow:hidden }`; each panel gets `overscroll-behavior: contain`. Each overlay traps Tab, applies `inert` to `#main` and `.site-footer` while open, and **returns focus to the element that opened it**. The old `body.modal-open` class is deleted.

### 5.9 Reduced motion — designed, not merely frozen

The footer `.motion-toggle` is a real `<button aria-pressed>` labelled `Reduce motion` / `모션 줄이기`. It is **tri-state**, and this matters: a user whose OS says `prefers-reduced-motion: reduce` must still be able to turn motion *on*, or the control appears broken to exactly the audience it was built for.

- `data-motion` absent → follow the OS.
- `data-motion="off"` → motion off regardless of OS.
- `data-motion="on"` → motion on regardless of OS.

Persisted to `localStorage['fieldlux_motion']` and read by a tiny inline `<head>` script **before first paint**, to avoid a flash of animated content.

```css
@media (prefers-reduced-motion: reduce){
  html:not([data-motion="on"]) *,
  html:not([data-motion="on"]) *::before,
  html:not([data-motion="on"]) *::after{
    animation-duration:.001ms !important; animation-iteration-count:1 !important;
    transition-duration:.001ms !important; scroll-behavior:auto !important;
  }
}
html[data-motion="off"] *,
html[data-motion="off"] *::before,
html[data-motion="off"] *::after{
  animation:none !important; transition:none !important;
}
```

The `!important` blanket is the floor, not the plan — each component above still has its own reduced-motion branch so the reduced experience is designed.

### 5.10 Accessibility rules that bind every component

**Focus**
```css
:where(a,button,[tabindex],summary,input,select,textarea):focus-visible{
  outline:2px solid var(--focus); outline-offset:3px; border-radius:4px;
  box-shadow:0 0 0 5px var(--focus-halo);
}
.section--mass :focus-visible, .hero-monitor :focus-visible, .media-slot--mass :focus-visible{
  outline-color:var(--focus-on-mass); box-shadow:0 0 0 5px rgba(4,37,45,.9);
}
```
Never `outline:none` without a replacement. **The focus ring is `--focus #006E87` (5.87:1) everywhere on light.** An earlier draft specified `#00B1C4` "which clears 3:1" — it does not; it computes to 2.60:1 and fails SC 1.4.11.

**Focus order.** `.skip-link` is the first node in `<body>`. DOM order equals visual order in every section; `.chapter--reverse` flips only the media via grid `order`. `.hero-notch` precedes `.hero-monitor` in DOM.

**Semantics.** One `<h1>`, on the hero. No heading level skipped. `.micro-label` is never a heading — it is a `<p>`. Every `<section>` carries `aria-labelledby`. `.marquee` is `aria-hidden="true"`. `.nav-toggle` carries `aria-expanded` + `aria-controls="nav-overlay"` + accessible name `Menu`. `.monitor-pause` carries `aria-pressed` and a label that toggles between `Pause background video` and `Play background video`. `.filter-chip` is a plain `<button aria-pressed>` — **not** `role="tab"`; it hides and shows multiple sibling sections and sits beside an independent toggle, so a `tablist` would be a fake tab set. Filter results announce through a visually-hidden `aria-live="polite"` count node (`.filter-result-sr`).

**Images.** `.brand-lockup-img` gets `alt="FieldLux"`. `.monitor-logo` and decorative glyphs get `alt=""`. Product screenshots get alt describing the *reading*, written from the actual frame after the crop is locked — see §8.5.

**Video.** Rules in §6.2 (hero) and §7.6 (video page). Summary: nothing autoplays with sound (there is no sound — audio is stripped), everything auto-starting has a visible pause control, nothing below the fold preloads, and `saveData` / `prefers-reduced-data` skip video entirely.

**Contrast modes.**
```css
@media (prefers-contrast: more){
  :root{ --line:#8A959B; --ink-500:#2A3338; --ink-400:#566268; }
  .btn--outline{ border-color:var(--ink-950); }
}
@media (forced-colors: active){
  .monitor-shadow,.monitor-inset{ display:none; }
  .monitor-body{ border:2px solid CanvasText; background:Canvas; box-shadow:none; }
  .media-slot{ border:1px solid CanvasText; }
  .btn{ border:1px solid ButtonText; }
}
```
`forced-color-adjust: none` is not used anywhere.

---

## 6. Home page — build order, section by section

Thirteen blocks. Build them in this order; each is self-contained. All copy below is **final** — paste it verbatim, including the Korean.

| # | id | Block | Padding |
|---|---|---|---|
| S1 | — | Fixed header | — |
| S2 | `#top` | Hero: monitor + quantified H1 + real readout | `100svh` |
| S3 | — | Marquee hairline strip | `--pad-xs` |
| S4 | `#who` | Who this is for, and what it is not | `--pad-md` |
| S5 | `#product` | Chapter index (ten entries) | `--pad-sm` |
| S6 | `#ch-01` … `#ch-10` | The ten feature chapters. `#ch-06` = `#measure`, the one pinned block | `--pad-md` (pin: `--pad-lg`) |
| S7 | `#numbers` | The scale facts | `--pad-sm` |
| S8 | `#limits` | What we assume, what we do not model, what we do not claim | `--pad-md` |
| S9 | `#videos-cta` | Three preview slots → `/videos` | `--pad-sm` |
| S10 | `#beta` | Open beta, free, real limits | `--pad-md` |
| S11 | `#community` | Discord | `--pad-sm` |
| S12 | `#start` | Final CTA | `--pad-md` |
| S13 | — | Footer | `--pad-sm` |

---

### S1 — Header

Fixed, transparent at rest, `.is-scrolled` frosted white (§5.6). Contents: `.brand-lockup` (§4.2), `.nav-links` (five links, §4.2), `.nav-actions` (two CTAs), `.nav-toggle` (≤1180 px).

`.brand-beta` reads `BETA` — the only status chip in the header. There is no version number; `Beta v.2` is retired because nothing on the site otherwise references a version.

---

### S2 — Hero `#top`

**Layout.** `.hero{min-block-size:100svh; display:grid; align-content:center}`. Inside `.site-shell`: `.hero-monitor` full container width, then `.hero-notch` overlapping its lower-left by `clamp(-140px,-9vw,-56px)`, then `.hero-readout` as a three-item row beside/below the notch, then `.hero-actions`.

DOM order: `.hero-copy` (H1 + lead) inside `.hero-notch` **first**, then `.hero-monitor`, then `.hero-readout`, then `.hero-actions`, then `.monitor-caption`. Visual overlap is achieved with negative margin and `z-index`, never by reordering the DOM.

**The headline premise — decided.** The old line ("a working model before the real room is built" / "simulate the light before the room exists") addresses a customer who does not exist: projection mapping happens overwhelmingly on structures that already stand, including the building in FieldLux's own hero footage. A technical director reads that and files the product under architectural visualisation, which is a different purchase. The headline is now a quantified question.

**H1 (with typewriter, §5.5):**

```
CAN YOU HIT
350 LUX ON THAT
FAÇADE ▍
```
Rotation: `FAÇADE` · `DOME` · `STAGE` · `TUNNEL`.

**`.hero-lead` (bilingual):**

> **EN** — Four heads, the real building, the overlaps counted. FieldLux answers it before you quote — and publishes how far off it could be.
>
> **KO** — 헤드 4대, 실제로 서 있는 건물, 겹치는 구간까지. 견적을 내기 전에 FieldLux가 답을 냅니다. 그리고 그 답이 얼마나 벗어날 수 있는지도 같이 내놓습니다.

**`.hero-readout` — three real figures, selectable text, `--font-num`.** The old readout listed three feature names ("Heatmap modes / Absolute, Norm, Deviation") in a slot shaped like an instrument panel — the worst of both, since it looks like data and is not. Every value below is one the app produces and the hero footage shows.

| `.hero-readout-label` | `.hero-readout-value` | `.hero-readout-qual` |
|---|---|---|
| `SURFACE LUX` | `350 lx` | `at the cursor, all heads summed` |
| `PIXEL DENSITY` | `6.00 mm/px` | `at the same point` |
| `THROW RATIO` | `1.30 : 1` | `inside the lens's real range` |

> **Builder note, binding:** these three values must be read off the final cropped hero frame after §8.3 is done. If the locked frame shows different numbers, change these to match. **The site never prints a number the visible frame contradicts.** Do not invent a fourth row.

**`.hero-actions`:** `START FREE` (`.btn--brand`, `data-app-link`) · `SEE THE LIMITS ↗` (`.btn--text`, `href="#limits"`).

Putting the limits link in the hero is deliberate. It is the CTA that converts a skeptic.

**`.monitor-caption`** — visible text below the monitor, `--fs-body-sm`, `--ink-400`. It is also the text equivalent for the `aria-hidden` monitor, so it must describe the frame that actually shipped:

> **EN** — *TK — written from the locked hero frame.* Working draft: One Panasonic PT-RQ50K on a stone façade at 1.30 : 1 throw. Absolute-mode lux heatmap live; the cursor tooltip reads 350 lx and 6.00 mm/px.
>
> **KO** — *TK — 확정된 히어로 프레임을 보고 작성.* 초안: 석재 파사드에 Panasonic PT-RQ50K 1대, 투사비 1.30 : 1. 절대값 모드 조도 히트맵이 실시간으로 갱신되고, 커서 툴팁에 350 lx와 6.00 mm/px가 표시됩니다.

**This caption is `TK` on purpose and is a ship gate.** Earlier drafts shipped "four projectors on a façade" as final copy; the sampled frame shows `PROJECTORS 1`. A screen-reader user would have received a fabricated description of the page's main image, on a site about not fabricating things. Write it from the frame, verify it whenever the clip changes.

---

### S2b — The monitor: geometry and CSS

**Aperture ratio — and the `Coming Soon` crop.** The source `media-01-hero.mp4` is 1918 × 942, and its bottom status bar reads `ANALYSIS [Coming Soon]` for the entire loop. A site that deletes its roadmap and claims to describe only shipped work cannot open with a Coming Soon badge inside the product.

**Decision: crop it out deterministically in CSS, and re-record as a follow-up.** Set the screen aperture to `1918 / 890` and pin the video to the top of the aperture, cutting the bottom 52 px of the source — comfortably more than the status bar's height.

```css
.hero-monitor{
  --screen-ratio: 1918 / 890;     /* declared, not left to a fallback */
  --mon-rx: 7deg; --mon-ry: -13deg; --mon-tilt: 1;
  perspective: 1600px; perspective-origin: 50% 40%;
  position: relative; inline-size: 100%; margin-inline: auto;
}
.monitor-stage{
  transform-style: preserve-3d;
  transform: rotateX(calc(var(--mon-rx) * var(--mon-tilt)))
             rotateY(calc(var(--mon-ry) * var(--mon-tilt)));
  transition: transform 900ms var(--ease-out);
  will-change: transform;
}

.monitor-body{
  position: relative;
  padding: clamp(8px,.85vw,13px);
  padding-block-end: clamp(24px,2.3vw,36px);
  border-radius: clamp(10px,1vw,16px);
  background: linear-gradient(157deg, var(--bezel-hi) 0%, var(--bezel-mid) 44%, var(--bezel-lo) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.22),
    inset 0 -1px 0 rgba(0,0,0,.55),
    inset 1px 0 0 rgba(255,255,255,.08),
    -16px 12px 0 -3px var(--bezel-edge),      /* extruded left wall, matches rotateY(-13deg) */
    -22px 18px 0 -6px var(--bezel-wall),
    0 26px 38px -22px rgba(2,37,45,.50),
    0 84px 120px -58px rgba(2,37,45,.34);
}
.monitor-screen{
  position: relative; aspect-ratio: var(--screen-ratio);
  border-radius: clamp(4px,.4vw,7px); overflow: hidden;
  background: var(--mass-950); isolation: isolate;
}
.monitor-video{
  position: absolute; inset: 0; inline-size: 100%; block-size: 100%;
  object-fit: cover; object-position: 50% 0%;      /* crops the bottom status bar */
  display: block;
}
.monitor-inset{                                     /* glass edge — outside the image, no blend */
  position: absolute; inset: 0; pointer-events: none; z-index: 2; border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.9),
              inset 0 2px 14px rgba(0,0,0,.55),
              inset 0 -8px 24px rgba(0,0,0,.35);
}
.monitor-chin{ position:absolute; inset-block-end:0; inset-inline:0;
  block-size:clamp(24px,2.3vw,36px); display:grid; place-items:center; }
.monitor-logo{ inline-size:14px; block-size:13px; opacity:.5; background:var(--brand-400);
  -webkit-mask:url('/assets/logo-mark.png') center/contain no-repeat;
          mask:url('/assets/logo-mark.png') center/contain no-repeat; }
.monitor-neck{ inline-size:clamp(56px,6vw,84px); block-size:clamp(28px,3.4vw,52px);
  margin:0 auto; background:linear-gradient(96deg, var(--bezel-stand), var(--bezel-wall) 60%, var(--bezel-lo));
  clip-path:polygon(22% 0,78% 0,92% 100%,8% 100%); transform:translateZ(-18px); }
.monitor-base{ inline-size:clamp(180px,20vw,300px); block-size:clamp(7px,.8vw,11px);
  margin:0 auto; border-radius:0 0 8px 8px;
  background:linear-gradient(180deg, var(--bezel-hi), var(--bezel-wall));
  box-shadow:0 14px 26px -14px rgba(2,37,45,.45); transform:translateZ(-18px); }
.monitor-shadow{                                    /* the ground contact */
  position:absolute; inset-block-end:-6%; inset-inline:6%; block-size:22%; z-index:-1;
  background:radial-gradient(50% 50% at 50% 50%,
    rgba(4,37,45,.30) 0%, rgba(4,37,45,.13) 46%, transparent 72%);
  filter:blur(26px); transform:rotateX(76deg) translateZ(-70px) scaleY(.55);
}
```

**Why this reads as 3D on white** — three cues, all outside the image: the two hard offset shadows are a fake extruded side wall pointing exactly where `rotateY(-13deg)` implies; the inner top highlight plus bottom darkening give the bezel a lit top face; and the blurred rotated `.monitor-shadow` ellipse anchors it to a ground plane. Without the third, a monitor on white floats like a sticker.

**Do not build a true six-face `preserve-3d` box.** The child `<video>` forces its own compositing layer and Safari z-fights the video plane against the back face.

**Markup:**

```html
<div class="hero-monitor" aria-hidden="true">
  <div class="monitor-stage">
    <div class="monitor-shadow"></div>
    <div class="monitor-body">
      <div class="monitor-screen">
        <video class="monitor-video" muted loop playsinline preload="none"
               poster="/assets/media/hero-poster.jpg" width="1918" height="942">
          <source src="/assets/media/hero-1600.webm" type="video/webm">
          <source src="/assets/media/hero-1600.mp4"  type="video/mp4">
        </video>
        <span class="monitor-inset"></span>
      </div>
      <div class="monitor-chin"><span class="monitor-logo"></span></div>
    </div>
    <div class="monitor-neck"></div>
    <div class="monitor-base"></div>
  </div>
  <div class="monitor-controls">
    <button type="button" class="monitor-pause" aria-pressed="false">
      <span class="u-visually-hidden">Pause background video</span>
    </button>
  </div>
</div>
<p class="monitor-caption" id="hero-monitor-caption">…</p>
```

**No `autoplay` attribute in markup.** JS calls `.play()` only when motion and data allow:

```js
const still = matchMedia('(prefers-reduced-motion: reduce)').matches
              && document.documentElement.dataset.motion !== 'on'
           || document.documentElement.dataset.motion === 'off';
const conn = navigator.connection;
const lean = conn?.saveData === true
          || matchMedia('(prefers-reduced-data: reduce)').matches;
if (!still && !lean) video.play().catch(() => {});   // poster stays if play() rejects
```

When `still` or `lean`, the poster shows and `.monitor-pause` flips to a **play** affordance (`aria-pressed="true"`, label `Play background video`) so the user can opt in. The monitor sits square (`--mon-tilt:0`) and still reads as a screen because the bezel, inset and ground shadow are all static.

**Scroll settle.** `--mon-tilt` goes 1 → 0 across the first 60 % of the hero (§5.1). The 900 ms `transition` on `.monitor-stage` absorbs rAF jitter for free — leave it in place.

**Responsive:**

| Condition | Behaviour |
|---|---|
| ≤1180 px | `--mon-rx:4deg; --mon-ry:-7deg` |
| ≤860 px | `perspective:none; --mon-tilt:0`; `.monitor-neck` and `.monitor-base` `display:none`; bezel padding 6 px / 16 px; `.monitor-shadow` opacity ×0.6 |
| ≤560 px | `.monitor-body` radius 8 px — a flat framed card; `.hero-notch` stacks below |
| `(hover:none)` or `saveData` | poster only; pause button becomes play |
| `forced-colors: active` | §5.10 |
| No JS | poster renders; `.monitor-pause` is `hidden`; `.monitor-caption` still describes the scene |

---

### S3 — Marquee

`.marquee.marquee--hairline.bleed-full`, ten items (§5.2), `aria-hidden="true"`, `.section--pad-xs` worth of breathing room above and below via its own padding.

---

### S4 — `#who` · Who this is for, and what it is not

**Layout.** `.split-2--lead-left` inside `.site-shell--narrow`. Left: `.micro-label` + `.section-title`. Right: two `.bilingual` blocks and a three-item `.speclist` of "not this".

**`.micro-label`:** `(00)` `WHO THIS IS FOR` — KO variant `이 도구를 쓰는 사람`

**`.section-title`:**
```
FOR THE PERSON
WHO HAS TO QUOTE THE JOB.
```

**Body (bilingual):**

> **EN** — FieldLux is for the technical director, projection designer or AV integrator who has to answer *how many, which lens, from where, how bright* before anyone signs. It is not a media server, not a warping tool, and not a renderer.
>
> **KO** — 계약서에 서명이 들어가기 전에 "몇 대, 어떤 렌즈, 어디서, 얼마나 밝게"를 답해야 하는 사람 — 테크니컬 디렉터, 프로젝션 디자이너, AV 인테그레이터를 위한 도구입니다. 미디어 서버도 아니고, 워핑 툴도 아니고, 렌더러도 아닙니다.

> **EN** — The manufacturer's calculator gives you one projector on a flat screen. FieldLux gives you four heads on the actual building, with the overlaps counted and the surface angles honoured. A visualiser gives you a picture; FieldLux gives you a lux figure with its assumptions attached.
>
> **KO** — 제조사 계산기는 평면 스크린에 프로젝터 한 대를 올려 줍니다. FieldLux는 실제로 서 있는 건물에 여러 대를 올리고, 겹치는 구간과 면이 기울어진 각도까지 함께 계산합니다. 비주얼라이저는 그림을 주고, FieldLux는 어떤 전제로 나온 값인지가 붙은 조도 수치를 줍니다.

**`.speclist` — "what it is not", three items:**

| `.speclist-index` | EN | KO |
|---|---|---|
| `(01)` | **Not a media server.** Nothing here plays your show. The Play Dock previews content so the beams show the right picture — it does not run the venue. | **미디어 서버가 아닙니다.** 여기서 본 공연이 나가지는 않습니다. Play Dock은 빔에 올바른 화면이 뜨도록 콘텐츠를 미리 보는 곳이지, 현장을 돌리는 장비가 아닙니다. |
| `(02)` | **Not a warping tool for the rig.** The Warp & Blend Studio corrects the simulated beam so the coverage picture stays truthful. Your on-site correction still happens on the processor. | **현장 워핑 장비가 아닙니다.** Warp & Blend Studio는 커버리지 그림이 사실대로 남도록 시뮬레이션 빔을 보정합니다. 현장 보정은 여전히 프로세서에서 합니다. |
| `(03)` | **Not a photoreal renderer.** Surfaces are Lambertian. There is no haze, no lens distortion, no chromatic aberration, no specular BRDF. The picture exists to make the number legible, not the other way round. | **포토리얼 렌더러가 아닙니다.** 표면은 램버시안으로만 다룹니다. 헤이즈, 렌즈 왜곡, 색수차, 정반사 BRDF는 계산하지 않습니다. 그림은 숫자를 읽기 쉽게 하려고 있는 것이지, 그 반대가 아닙니다. |

---

### S5 — `#product` · The chapter index

**One taxonomy, ten chapters.** Earlier drafts carried four incompatible chapter sets (5 / 9 / 11 / a six-item marquee). This is the only one. It is used identically by the home chapters, the marquee, the `/videos` chapters, and every index counter on the site.

| # | id | EN name | KO name | Shipped area it explains |
|---|---|---|---|---|
| 01 | `ch-scene` | THE SCENE | 씬 | Import, unit/axis detection, layer hierarchy, rooms, curves and domes, floor plan import at real size, linework drawing, walls and floors from lines, materials, walk mode, outliner, undo, units |
| 02 | `ch-optics` | THE OPTICS | 광학 | Catalogue, official cross-check, custom heads, throw ratio and lens shift, out-of-spec refusal, UST, arrays, axis locks |
| 03 | `ch-blend` | THE COVERAGE | 커버리지 | Auto edge blend, light-conserving ramps, dome/mesh blend, Canvas Sets, Quick Wrap, plane picker |
| 04 | `ch-warp` | THE CORRECTION | 보정 | Corner-pin, mesh warp, feathered masks, per-edge soft edge, calibration patterns |
| 05 | `ch-content` | THE CONTENT | 콘텐츠 | Mapping Stage, media library and drag-to-surface, transport and playlists, content slot budget |
| 06 | `ch-measure` | THE MEASUREMENT | 계측 | Heatmap modes and scales, hover probe, 13-point overlay, lens view, measure tool, beam labels, target picker |
| 07 | `ch-render` | THE LIGHT | 빛 | Additive projection into PBR, depth occlusion and projector shadows, ambient presets and contrast, exposure and Layout View |
| 08 | `ch-lighting` | THE ROOM AROUND IT | 주변 환경 | Stage/architectural fixtures, IES import, isolux working plane, LED walls and their spill |
| 09 | `ch-deliver` | THE DELIVERABLE | 산출물 | PDF Tech Rider, neutral handoff JSON, blend-domain declaration, share links, capabilities, receipt, what-if |
| 10 | `ch-project` | THE PROJECT | 프로젝트 | Project Home, sample scenes, autosave, version history, roll-forward restore, read-only safe mode, storage |

**Layout.** `.site-shell`, `.section--pad-sm`. `.micro-label` reads `(00)` `THE PRODUCT, PART BY PART` / `제품을 파트별로`. Then `.section-title`:

```
TEN PARTS.
EACH ONE SHIPPED.
```

Then a ten-row `.speclist` where each `.speclist-item` is an anchor to `#ch-NN` carrying `.speclist-index` `(01)`, the EN name in `--fs-h4`, the KO name in `--ink-400`, and a one-line summary. Hover moves the row's left rule to `--brand-800`.

**`.section-lead` (bilingual):**

> **EN** — Every chapter below is something you can open in the app today. Where a capability is gated, in beta, or desktop-only, this page says so in the same sentence as the capability.
>
> **KO** — 아래 열 개 챕터는 전부 지금 앱에서 열어 볼 수 있는 것들입니다. 기능이 잠겨 있거나, 베타이거나, 데스크톱 전용이면 그 기능을 설명하는 바로 그 문장 안에 그렇게 적어 둡니다.

---

### S6 — The ten chapters

**Shared structure for every chapter** (build once, repeat ten times):

```html
<section class="section section--pad-md chapter" id="ch-01" aria-labelledby="ch-01-title">
  <div class="site-shell">
    <p class="micro-label">
      <span class="micro-label-ord">(01)</span>
      <span class="micro-label-name">THE SCENE</span>
    </p>
    <div class="split-2--media-right">
      <div class="chapter-head">
        <h2 class="chapter-title reveal-lines" id="ch-01-title">…</h2>
        <div class="bilingual chapter-body u-text-measure">…</div>
        <ul class="chapter-points">
          <li class="chapter-point">
            <p class="chapter-point-label">…</p>
            <p class="chapter-point-text" lang="en">…</p>
            <p class="chapter-point-text" lang="ko">…</p>
          </li>
        </ul>
      </div>
      <figure class="chapter-media reveal">
        <div class="media-slot" data-label="…" data-caption="RECORDING · 촬영 예정"></div>
        <figcaption class="media-caption">…</figcaption>
      </figure>
    </div>
  </div>
</section>
```

Even chapters add `.chapter--reverse`. Every `<figure class="chapter-media">` carries a `<figcaption>` naming what the media shows — this is the text equivalent, and it is required whether the slot is filled or empty.

**Chapter media rules** (previously unspecified, now binding):

- Filled slots: `preload="none"`, mandatory `poster`, **no `autoplay` attribute**. Play only while `isIntersecting` **and** motion allows **and** `saveData` is false; pause on exit. Under reduced motion or reduced data the poster is all that ever loads.
- Empty slots: `.media-slot` with `data-label` + `data-caption="RECORDING · 촬영 예정"`, no `.has-media`. Never a grey box, never a spinner.
- Every filled chapter slot on the home page is `.media-slot--mass .bleed-right` (or `.bleed-left` on reverse chapters) — those are the mass beats from §3.6, and there are **exactly three of them** (Ch 01, Ch 06, Ch 09).

**Asset assignment — decided, no chapter is left guessing:**

| Chapter | Media | State |
|---|---|---|
| Ch 01 THE SCENE | `software-demo` (re-encoded, `.bleed-right`, `--mass`) | **filled day one** |
| Ch 02 THE OPTICS | `media-slot`, `data-label="THROW & LENS SHIFT"` | empty |
| Ch 03 THE COVERAGE | `media-slot`, `data-label="AUTO EDGE BLEND"` | empty |
| Ch 04 THE CORRECTION | `media-slot`, `data-label="WARP & BLEND STUDIO"` | empty |
| Ch 05 THE CONTENT | `media-slot`, `data-label="MAPPING STAGE"` | empty |
| Ch 06 THE MEASUREMENT | pinned block — three panels using `analysis-heatmap-absolute.png`, `-norm.png`, `-deviation.png`; plus `hover-probe-demo` (re-encoded, `.bleed-full`, `--mass`) and `analysis-13pt-diagnostics.png` | **filled day one** |
| Ch 07 THE LIGHT | `hero-stitch-01.png` (`.media-img`, not mass — it is a light composite on a light ground) | **filled day one** |
| Ch 08 THE ROOM AROUND IT | `media-slot`, `data-label="ISOLUX WORKING PLANE"` | empty |
| Ch 09 THE DELIVERABLE | `media-slot`, `data-label="PDF TECH RIDER"` (`--mass`, `.bleed-left`) | empty |
| Ch 10 THE PROJECT | `media-slot`, `data-label="PROJECT HOME"` | empty |

Five of ten chapters carry real media at launch. That is honest and it looks finished, because the empty state is designed.

---

#### Ch 01 · `#ch-01` · THE SCENE / 씬

**Title:** `ONE SCENE HOLDS ALL OF IT.`

**Body:**

> **EN** — One scene holds the building, the heads, the lens on each, the surfaces you care about and the ones you must not spill onto. Change any of them and every number downstream recomputes from the same geometry. There is no second model to keep in sync.
>
> **KO** — 하나의 씬 안에 건물, 프로젝터, 각각에 물린 렌즈, 맞혀야 할 면과 빛이 새면 안 되는 면이 같이 들어갑니다. 이 중 무엇을 건드리든 뒤따르는 값이 전부 같은 형상에서 다시 계산됩니다. 따로 맞춰 둘 두 번째 모델이 없습니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `IMPORT, UNITS SOLVED` | Six formats — FBX, GLB/GLTF, OBJ, DAE, STL, PLY. Units come from the file's own metadata; OBJ is sniffed for a `# Units:` comment; STL and PLY fall back to a bounding-box heuristic. Up-axis is read from the file where the format states it, with a Y/Z/X-up toggle as the deterministic fallback and a warning chip when the largest dimension looks implausible. | 여섯 가지 포맷 — FBX, GLB/GLTF, OBJ, DAE, STL, PLY. 단위는 파일 자체 메타데이터에서 읽고, OBJ는 `# Units:` 주석을 훑고, STL·PLY는 바운딩 박스로 추정합니다. 업축은 포맷이 명시하는 경우 파일에서 읽으며, 안 되면 Y/Z/X-up 토글로 확정합니다. 최대 치수가 이상하면 경고 칩이 뜹니다. |
| `THE LAYER TREE SURVIVES` | The group hierarchy your DCC authored arrives intact — per-node hide, lock, delete, material override, local axes and sub-layer isolate. Tested against a reference FBX with 2,020 meshes and 571 groups; only expanded branches reach the DOM. | Cinema 4D·Vectorworks·Blender·Max에서 짜 둔 그룹 계층이 그대로 들어옵니다. 노드별 숨김·잠금·삭제·재질 오버라이드·로컬 축·하위 레이어 아이솔레이트가 다 됩니다. 메시 2,020개, 그룹 571개짜리 FBX로 확인했고, 펼친 가지만 DOM에 올라갑니다. |
| `ROOMS, CURVES, DOMES` | A parametric room resolves as six addressable walls, each with its own basis. Curved walls, cylinders, domes and floor slabs generate with correct normals and a facing rule per shape — a dome is lit on its concave interior, a cylinder from outside. | 파라메트릭 룸은 여섯 면이 각각 독립된 기준면으로 잡힙니다. 곡면 벽, 실린더, 돔, 바닥 슬랩은 노멀과 향하는 방향까지 형상별 규칙에 맞춰 생성됩니다. 돔은 오목한 안쪽에, 실린더는 바깥쪽에 빛이 갑니다. |
| `21 MEASURED MATERIALS` | Concrete, brick, glass, limestone, stage wood, screen fabric, scrim, blackout — each carrying reflectance, projection gain, gain half-angle, transmittance, scatter and shadow opacity. An opaque preset's rendered luminance equals its authored reflectance, so a dark preset both looks and calculates dark. | 콘크리트, 벽돌, 유리, 석회암, 무대용 목재, 스크린 원단, 스크림, 암막 등 21종. 각각 반사율, 프로젝션 게인, 게인 반각, 투과율, 산란, 그림자 불투명도를 들고 있습니다. 불투명 프리셋은 화면상 휘도가 설정된 반사율과 같아서, 어두운 재질은 보기에도 계산에도 어둡습니다. |
| `WALK IT` | Press **G** and walk the venue in first person. Walk speed re-samples the scene bounds every couple of seconds, so a 10 m studio and a kilometre-wide site both feel right — and imported reference drawings are excluded from the bounds so a large plan does not inflate your speed. | **G** 키를 누르면 1인칭으로 현장을 걸어 다닙니다. 이동 속도는 몇 초마다 씬 크기를 다시 재서 맞추기 때문에 10 m 스튜디오와 km 단위 부지가 둘 다 자연스럽습니다. 크게 깔아 둔 참조 도면은 범위 계산에서 빼기 때문에 속도가 엉뚱하게 빨라지지 않습니다. |

**`figcaption`:** `Screen recording: placing projectors in a scene in the shipped app.` / `실제 앱에서 씬에 프로젝터를 배치하는 화면 녹화입니다.`

---

#### Ch 02 · `#ch-02` · THE OPTICS / 광학

**Title:** `THE NUMBERS COME OFF THE SPEC SHEET.`

**Body:**

> **EN** — 87 projectors and 113 lenses across Epson, Panasonic, Christie and Barco, each field carrying the URL of the manufacturer PDF it came from. Catalogue rebuilt 2026-05-12. No Digital Projection, no Sony, no NEC/Sharp yet.
>
> **KO** — Epson·Panasonic·Christie·Barco의 프로젝터 87종, 렌즈 113종. 항목의 수치마다 어느 제조사 PDF에서 가져왔는지 주소가 붙어 있습니다. 카탈로그는 2026-05-12에 다시 만들었습니다. Digital Projection, Sony, NEC/Sharp는 아직 없습니다.

> **EN** — If your head is not in the list you build it as a custom head from its spec sheet, and every number it produces is marked user-entered from then on.
>
> **KO** — 보유 장비가 목록에 없으면 스펙시트를 보고 커스텀 헤드로 직접 등록합니다. 그렇게 만든 장비에서 나온 값은 이후 모든 화면에서 '사용자 입력'으로 표시됩니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `642 COMBINATIONS CHECKED AGAINST THE MAKER'S OWN CALCULATOR — 47 OF 87 HEADS` | We ran Panasonic's TDC and Epson's PTDS calculators over every projector-lens pair we could reach and stored the manufacturer's own Center Illuminance formula beside ours — 642 combinations, pulled 2026-06-11, covering 20 Panasonic and 27 Epson heads. When a combination is covered, FieldLux computes from the manufacturer's formula, labels the readout **Center Illuminance**, and clamps lens shift to the official envelope. **Christie and Barco publish no calculator we can query, so their 38 heads carry no cross-check** — and the app says so on the head itself, not in a footnote. | Panasonic TDC와 Epson PTDS 계산기를 돌려 닿을 수 있는 프로젝터-렌즈 조합을 전부 대조하고, 제조사 자체 Center Illuminance 공식을 우리 값 옆에 저장해 뒀습니다. 2026-06-11 기준 642조합이며, Panasonic 20종·Epson 27종을 덮습니다. 해당하는 조합이면 FieldLux는 제조사 공식으로 계산하고, 읽는 값 이름을 **Center Illuminance**로 바꾸고, 렌즈 시프트를 공식 범위 안으로 제한합니다. **Christie와 Barco는 조회할 수 있는 공식 계산기가 없어서 38종에는 교차검증이 없습니다.** 이 사실은 각주가 아니라 해당 장비 항목 자체에 표시됩니다. |
| `DRAG THE THROW, WATCH THE NUMBERS` | The throw slider is bounded by the selected lens's real range. Beam W/H, axial distance, Center Surface Lux, surface tilt, pixel density in mm/px and effective projection resolution all move with it, live. Vertical and horizontal lens shift are clamped to the lens's real envelope — rectangular or diamond — and to the official envelope when one exists. | 투사비 슬라이더는 선택한 렌즈의 실제 범위 안에서만 움직입니다. 빔 가로·세로, 축 방향 거리, 중앙 표면 조도, 면 기울기, mm/px 픽셀 밀도, 실효 투사 해상도가 슬라이더를 따라 실시간으로 같이 바뀝니다. 상하·좌우 렌즈 시프트는 렌즈의 실제 범위 — 사각형이든 마름모든 — 안으로, 공식 값이 있으면 그 범위로 제한됩니다. |
| `IT REFUSES TO SHOW AN UNREACHABLE NUMBER` | Place a head outside its catalogue throw-distance envelope and the beam and lux cards reskin to a muted amber diagnostic block with the values struck through, stating plainly they are not achievable with that projector. Silently showing an unreachable figure is how a plan gets signed and then fails on site. | 카탈로그상 투사 거리 범위를 벗어난 위치에 프로젝터를 놓으면, 빔과 조도 카드가 앰버색 진단 블록으로 바뀌고 수치에 취소선이 그어집니다. 그 장비로는 낼 수 없는 값이라고 그대로 적습니다. 못 내는 값을 조용히 보여 주는 것이 승인은 났는데 현장에서 안 되는 계획을 만듭니다. |
| `UST OPTICS BEND FOR REAL` | Mirror-UST and periscope lenses resolve to the mirror's beam-exit point and the bent forward vector — in the 3D cone, in the shader, in the depth pass and in blend detection, not just in the picture. Custom heads pick from four modelled lens geometries including Panasonic ET-D75LE95, ET-ELU20 and Epson ELPLX02S. | 미러형 초단초점과 페리스코프 렌즈는 미러의 빔 출사점과 꺾인 진행 방향으로 계산됩니다. 그림만 꺾이는 게 아니라 3D 콘, 셰이더, 뎁스 패스, 블렌드 검출까지 전부 같은 값을 씁니다. 커스텀 헤드도 Panasonic ET-D75LE95, ET-ELU20, Epson ELPLX02S를 포함한 네 가지 렌즈 형상 중에서 고를 수 있습니다. |
| `ARRAYS THAT STAY PARAMETRIC` | Generate a linear run, a circular ring on a radius with a shared aim target, or a mirrored pair — then edit radius, spacing or count and every member re-solves. Freeze any of a head's six transform channels; the lock is enforced at every commit site, including group moves and array re-solves, not just by greying an input. | 선형 배치, 반경과 공통 조준점을 가진 원형 링, 대칭 페어를 만들 수 있고, 반경·간격·개수를 바꾸면 전체가 다시 풀립니다. 프로젝터의 여섯 축 중 원하는 것을 잠글 수 있으며, 이 잠금은 입력란만 비활성화하는 게 아니라 그룹 이동과 어레이 재계산을 포함한 모든 확정 지점에서 강제됩니다. |

**`figcaption`:** `Coming soon: the throw-ratio slider driving beam size, distance and Center Surface Lux together.` / `준비 중 — 투사비 슬라이더가 빔 크기·거리·중앙 표면 조도를 함께 움직이는 화면입니다.`

---

#### Ch 03 · `#ch-03` · THE COVERAGE / 커버리지

**Title:** `MANY HEADS, ONE CONTINUOUS IMAGE.`

**Body:**

> **EN** — Hand-dialling overlap percentages for six heads is the tedious, error-prone middle of every immersive job. FieldLux derives them from the footprints the beams actually make.
>
> **KO** — 프로젝터 여섯 대의 겹침 비율을 손으로 맞추는 일은 몰입형 작업마다 반복되는, 지루하고 틀리기 쉬운 구간입니다. FieldLux는 빔이 실제로 만드는 투사 영역을 재서 그 값을 뽑습니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `AUTO EDGE BLEND` | Analyses every head's real footprint against the target — ray-plane intersection through the optical frame, using fresh raycast distances — and writes per-edge overlap widths, per-edge on/off flags and a blend curve, in one undo step. A stale badge appears when the geometry has moved since the last detect. | 블렌드 그룹 안 모든 프로젝터의 실제 투사 영역을 대상 면과 대조합니다. 광학 프레임을 통과하는 레이-평면 교차와 그때그때 다시 잰 레이캐스트 거리를 씁니다. 엣지별 겹침 폭, 엣지별 on/off, 블렌드 커브를 되돌리기 한 번 분량으로 씁니다. 마지막 검출 이후 형상이 움직였으면 '오래됨' 배지가 뜹니다. |
| `THE SEAM DISAPPEARS, IT DOESN'T MOVE` | Three curves — linear, gamma 2.2, s-curve — plus a Dynamic Blend profile with Power, Gamma, Sharpness and Black Level. Ramps apply to scene-linear radiance before tone mapping, and the CPU implementation is a bit-for-bit twin of the GLSL, so the invariant `blendRamp(t) + blendRamp(1−t) = 1` is unit-tested. A blend that does not conserve light produces a visible band at every seam. | 램프 커브 세 종 — 선형, 감마 2.2, S커브 — 에 Power·Gamma·Sharpness·Black Level을 갖춘 Dynamic Blend 프로파일이 더해집니다. 램프는 톤 매핑 전 씬 선형 복사량에 적용되고, CPU 구현이 GLSL과 비트 단위로 같은 쌍이라 `blendRamp(t) + blendRamp(1−t) = 1` 불변식을 단위 테스트로 붙잡아 둡니다. 광량이 보존되지 않는 블렌드는 이음매마다 눈에 보이는 띠를 만듭니다. |
| `DOMES GET MEASURED, NOT APPROXIMATED` | For domes and curved models the planar overlap model is abandoned: an image-UV grid is raycast onto the real mesh, each landing point is tested against the partner head's frustum, and feather widths come from measured penetration depth per image edge. A sphere is least-squares fitted to all heads' landing points to detect "these beams are all looking at one dome". On a hemisphere, planar math saturates at its own clamp and writes 50 % feathers where the real overlap is 30 %. | 돔과 곡면 모델에서는 평면 겹침 모델을 버립니다. 이미지 UV 그리드를 실제 메시에 레이캐스트하고, 각 착지점이 상대 프로젝터 절두체 안에 들어가는지 검사한 뒤, 이미지 엣지별로 실측한 침투 깊이에서 페더 폭을 뽑습니다. 모든 프로젝터의 착지점에 구를 최소제곱으로 맞춰 "이 빔들이 전부 같은 돔을 보고 있다"는 상황을 감지합니다. 반구에서 평면 계산은 자기 제한값에 걸려, 실제 겹침이 30 %인 자리에 50 % 페더를 써 버립니다. |
| `ONE VIDEO ACROSS MANY SURFACES` | A blend group is one flat plane by design. Continuity across walls, floor and ceiling is a **Canvas Set** — coordinated groups sharing one master video, each taking a crop of the master UV space and mapping it to one face. Created in one undo step with per-panel auto-blend applied as it builds. | 블렌드 그룹은 설계상 평면 하나입니다. 벽과 바닥, 천장을 넘어가는 연속성은 **캔버스 세트**로 만듭니다. 여러 그룹이 마스터 영상 하나를 공유하고, 각 그룹이 마스터 UV 공간의 일부를 잘라 한 면에 매핑합니다. 되돌리기 한 번 분량으로 만들어지며, 만들어지는 동안 패널마다 자동 블렌드가 적용됩니다. |
| `REGIONS FROM WHERE THE LIGHT LANDS` | Quick Wrap does not unfold a target into named box faces. It detects regions from where the beams actually land: heads landing near each other on similarly-oriented surface form one region, sized to the union of their footprints. Aim, regions appear, pick a video, Apply. Regions freeze as manual plane references on apply, with an explicit **Refit** verb — moving a projector later never silently re-derives your content geometry. | Quick Wrap은 대상을 상자 면 이름으로 펼치지 않습니다. 빔이 실제로 닿는 자리에서 영역을 찾습니다. 비슷한 방향의 면에 서로 가까이 닿는 프로젝터들이 하나의 영역이 되고, 크기는 그 투사 영역들의 합집합입니다. 조준하면 영역이 나타나고, 영상을 고르고, 적용합니다. 적용 시점에 영역은 수동 평면 기준으로 고정되며 **Refit** 명령이 따로 있습니다. 나중에 프로젝터를 옮겨도 콘텐츠 형상이 조용히 다시 계산되는 일은 없습니다. |
| `THREE CLICKS DEFINE A PLANE` | Click three points on the geometry to define a canvas plane. It writes the same manual plane reference the eight numeric inputs write, and those stay live for fine tuning. Collinear or coincident picks are rejected with a plain explanation. | 형상 위 세 점을 클릭하면 캔버스 평면이 정의됩니다. 숫자 입력란 여덟 개가 쓰는 것과 같은 수동 평면 기준을 쓰고, 그 입력란은 미세 조정을 위해 계속 살아 있습니다. 한 직선 위에 있거나 겹치는 점을 찍으면 이유를 적어 거부합니다. |

**`figcaption`:** `Coming soon: aiming four heads at a façade and letting Quick Wrap find the regions.` / `준비 중 — 파사드에 프로젝터 4대를 조준하고 Quick Wrap이 영역을 찾아내는 화면입니다.`

---

#### Ch 04 · `#ch-04` · THE CORRECTION / 보정 · `.chapter--reverse`

**Title:** `THE CORRECTION CUTS THE REAL BEAM.`

**Body:**

> **EN** — Corner-pin that only lives in a 2D panel tells you nothing about how the beam lands. In the Warp & Blend Studio the correction renders in the actual 3D beam, and the 2D preview uses the same maths twin, so preview and render agree by construction.
>
> **KO** — 2D 패널 안에서만 움직이는 코너핀은 빔이 실제로 어떻게 닿는지 알려 주지 않습니다. Warp & Blend Studio에서는 보정이 실제 3D 빔에 렌더링되고, 2D 미리보기가 같은 계산을 그대로 쓰기 때문에 미리보기와 결과가 어긋날 구조 자체가 없습니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `CORNER-PIN, LIVE IN 3D` | Drag four corners to match the surface perspective. The homography goes in as shader uniforms, so the corrected image renders in the beam, not only in the panel. | 네 모서리를 끌어 면의 원근에 맞춥니다. 호모그래피가 셰이더 유니폼으로 들어가서, 보정된 화면이 패널 안이 아니라 빔에 렌더링됩니다. |
| `MESH WARP AND FEATHERED MASKS` | Subdividable warp grids with draggable interior points and a Spherize control for domes, plus click-drawn feathered polygon masks that can be inverted and stacked. Heads needing either get a baked RGBA warp map written into one scene-shared array texture. **Cap: 16 map-using heads**, surfaced as a budget chip. | 세분화 가능한 워프 그리드에 내부 점을 끌 수 있고, 돔용 Spherize가 있습니다. 클릭으로 그리는 페더 폴리곤 마스크는 반전과 중첩이 됩니다. 둘 중 하나라도 쓰는 프로젝터는 RGBA 워프 맵으로 구워져 씬 공유 배열 텍스처에 들어갑니다. **한도는 16대**이며, 예산 칩으로 표시됩니다. |
| `SEE THE SEAM SOFTEN WHILE YOU DRAG` | Per-edge blend widths authored in the Studio write straight to the shipped edge-blend pipeline, so the seam softens in the viewport as you drag. An Auto button derives all widths from the group's measured footprint overlaps on that face in one undo step. Seeing the seam change while you set the width is the only way to judge a blend; everything else is a spreadsheet. | Studio에서 잡은 엣지별 블렌드 폭은 실제 엣지 블렌드 경로로 바로 들어갑니다. 그래서 끄는 동안 뷰포트의 이음매가 같이 부드러워집니다. Auto 버튼은 그 면에서 실측한 겹침에서 전체 폭을 되돌리기 한 번 분량으로 뽑아 줍니다. 폭을 잡는 동안 이음매가 변하는 걸 봐야 블렌드를 판단할 수 있습니다. 나머지는 그냥 표입니다. |
| `TEST PATTERNS FROM THE REAL BEAM` | Grid, crosshair, greyscale and colour bars projected live from a selected head, as a view-tier override — the pattern appears without touching the group's content or the playlist, works mid-video with the shared decoder still running, and toggling off restores the picture with zero undo entries. Exactly the on-site workflow: throw a grid, set the blend and the mask, drop back to content. | 그리드, 크로스헤어, 그레이스케일, 컬러바를 선택한 프로젝터에서 실제 빔으로 쏩니다. 뷰 계층 오버라이드라서 그룹 콘텐츠나 재생목록을 건드리지 않고, 영상 재생 중에도 공유 디코더를 그대로 둔 채 동작하며, 끄면 되돌리기 기록 없이 원래 화면으로 돌아옵니다. 현장에서 하는 순서 그대로입니다. 그리드 쏘고, 블렌드와 마스크 잡고, 콘텐츠로 복귀. |

**`figcaption`:** `Coming soon: dragging a corner-pin and watching the beam follow in 3D.` / `준비 중 — 코너핀을 끌면 3D 빔이 따라오는 화면입니다.`

---

#### Ch 05 · `#ch-05` · THE CONTENT / 콘텐츠

**Title:** `DRAG THE IMAGE IN 2D, THE BEAMS FOLLOW IN 3D.`

**Body:**

> **EN** — The Play Dock is the show console at the bottom of the editor. It closes the loop between the 2D content rectangle and the 3D light — and it shows you the parts that get cut, as cut.
>
> **KO** — Play Dock은 에디터 아래쪽에 붙는 콘솔입니다. 2D 콘텐츠 사각형과 3D 빛 사이를 이어 주고, 잘려 나가는 부분을 잘렸다고 그대로 보여 줍니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `MAPPING STAGE` | A camera-style 2D editor over the group's projection face — wheel zooms at the cursor, drag pans, fit-to-canvas and fit-to-face, a metre grid and a scale chip. Dragging the canvas quad updates the 3D beams live and commits one store batch on release. Beam regions falling outside the canvas render as hatched **no content** zones with a one-click Fit canvas to beams. Feather bands show the stored blend widths the 3D shader actually renders. | 그룹의 투사 면 위에 얹히는 카메라식 2D 에디터입니다. 휠은 커서 위치 기준 확대, 드래그는 이동, 캔버스 맞춤과 면 맞춤, 미터 그리드와 축척 칩이 있습니다. 캔버스 사각형을 끌면 3D 빔이 실시간으로 따라오고, 손을 떼는 순간 한 번에 확정됩니다. 캔버스 밖으로 나간 빔 영역은 빗금 친 **콘텐츠 없음** 구역으로 그려지고, 클릭 한 번으로 캔버스를 빔에 맞출 수 있습니다. 페더 띠는 3D 셰이더가 실제로 렌더링하는 블렌드 폭을 보여 줍니다. |
| `POINT AT THE WALL` | Upload images (jpeg/png/webp/gif) and video (mp4/webm/ogg) with storage accounting, then drag a media chip into the 3D viewport. The cursor ray resolves against the scene's canonical faces — not render meshes — a hover chip previews the target, and the drop commits one batch, or funnels into Quick Wrap pre-filled when the face has no coverage yet. | 이미지(jpeg/png/webp/gif)와 영상(mp4/webm/ogg)을 사용량 집계와 함께 올린 뒤, 미디어 칩을 3D 뷰포트로 끌어다 놓습니다. 커서 광선은 렌더 메시가 아니라 씬의 기준 면을 찾고, 호버 칩이 대상 면을 미리 보여 주고, 놓는 순간 한 번에 확정됩니다. 아직 그 면을 덮는 빔이 없으면 대상과 미디어가 채워진 Quick Wrap으로 이어집니다. |
| `THE FASTSTART WARNING` | Uploads are sniffed for non-faststart mp4 — `moov` after `mdat` — and warned about at the one moment you can still re-export. That is a class of stuttering playback otherwise diagnosed on site. | 업로드한 mp4가 faststart가 아닌지 — `moov`가 `mdat` 뒤에 있는지 — 검사해서, 아직 다시 내보낼 수 있는 그 순간에 알려 줍니다. 안 그러면 현장에서야 원인을 찾게 되는 종류의 재생 끊김입니다. |
| `A LOUD REFUSAL, BEFORE THE WRITE` | Distinct content sources are counted against a **4-slot** GPU budget. Groups claim first, then ungrouped projectors, and calibration patterns claim a slot like anything else. A drop that would exceed the budget is refused explicitly *before* any write. The alternative is a silent texture drop that looks like a bug. | 서로 다른 콘텐츠 소스는 GPU **슬롯 4개** 예산으로 셉니다. 그룹이 먼저 잡고, 그 다음 그룹에 안 든 프로젝터, 캘리브레이션 패턴도 다른 것과 똑같이 한 슬롯을 씁니다. 예산을 넘기는 드롭은 아무것도 쓰기 **전에** 명시적으로 거부합니다. 안 그러면 텍스처가 조용히 빠지고, 그건 버그처럼 보입니다. |

**`figcaption`:** `Coming soon: dragging the canvas quad in 2D while the 3D beams follow.` / `준비 중 — 2D에서 캔버스를 끌면 3D 빔이 따라오는 화면입니다.`

---

#### Ch 06 · `#ch-06` (**also `id="measure"` via a nested anchor span**) · THE MEASUREMENT / 계측 · **the one pinned block**

This chapter is `.section--pad-lg` and uses the `.pin` layout (§4.8). It is the only pinned block on the site, and it earns the pin because the three heatmap screenshots are genuinely a sequence.

**Anchor:** the nav's `Measurement` link targets `#measure`. Put `<span id="measure" class="u-visually-hidden" aria-hidden="true"></span>` immediately inside the section so both `#ch-06` and `#measure` resolve here.

**Title:** `THE SURFACE BECOMES A LIGHT METER.`

**Body:**

> **EN** — The measurement layer renders directly on the 3D scene: false-colour maps in three data modes and three scales, a probe that reads any point under the cursor, and the 13-point grid drawn on the surface in world space. A viewport screenshot is already a readable coverage diagram.
>
> **KO** — 계측 화면은 3D 씬 위에 바로 그려집니다. 세 가지 데이터 모드와 세 가지 스케일의 컬러 맵, 커서 아래 아무 지점이나 읽어 주는 프로브, 그리고 표면 위 월드 좌표에 그려지는 13포인트 격자. 뷰포트를 그냥 캡처하면 그게 읽을 수 있는 커버리지 도면이 됩니다.

**`.pin-sticky` (left rail, 0.42fr):** `.micro-label` `(06) THE MEASUREMENT`, the title, the body, then `.pin-counter` reading `(01) / (03)` and `.pin-progress` with its bar.

**`.pin-flow` (right, 0.58fr) — exactly three `.pin-panel`s:**

**Panel 1 — `ABSOLUTE`**
Media: `analysis-heatmap-absolute.png`, `.media-img`, `--media-ratio: 442 / 673` (after the re-crop in §8.4).

> **EN** — Absolute maps 0 lx to a Max lux you set. The ramp, the scale and the projector count in this panel are the app's own legend, captured from the shipped build. Three data modes share it: **Surface Lux** in lx, **Pixel Density** in mm/px, and **Luminance** in cd/m².
>
> **KO** — 절대값 모드는 0 lx부터 직접 정한 최댓값까지를 매핑합니다. 이 화면의 컬러 램프와 축척, 프로젝터 대수는 실제 빌드에서 캡처한 앱 자체 범례입니다. 데이터 모드 세 가지가 이 범례를 공유합니다. **표면 조도**(lx), **픽셀 밀도**(mm/px), **휘도**(cd/m²).

**Panel 2 — `NORMALIZED`**
Media: `analysis-heatmap-norm.png`.

> **EN** — Normalized maps everything against a Reference lux you set, from 0.0× to 2.0×. Absolute answers "how many lux". Normalized starts answering the question that actually decides whether a blend reads as one image: is it **even**?
>
> **KO** — 정규화 모드는 직접 정한 기준 조도에 대해 0.0배부터 2.0배까지로 매핑합니다. 절대값은 "몇 lx냐"에 답합니다. 정규화는 블렌드가 한 장의 그림으로 읽히느냐를 실제로 가르는 질문 — **고른가** — 에 답하기 시작합니다.

**Panel 3 — `DEVIATION`**
Media: `analysis-heatmap-deviation.png`.

> **EN** — Deviation shows ±10 %, ±20 % or ±30 % around the reference on a diverging ramp. This is the mode you use to chase uniformity — and the mode that makes a dim corner impossible to miss.
>
> **KO** — 편차 모드는 기준값 대비 ±10 %, ±20 %, ±30 %를 발산형 램프로 보여 줍니다. 균일도를 잡으러 다닐 때 쓰는 모드이고, 어두운 모서리를 놓칠 수 없게 만드는 모드입니다.

**Below the pin, three more blocks in normal flow:**

**(a) `hover-probe-demo` — `.media-slot--mass .bleed-full .has-media`**, `--media-ratio: 1912 / 942`.

| Label | EN | KO |
|---|---|---|
| `LUX AND MM/PX UNDER THE CURSOR` | Move the cursor over any projection receiver and read illuminance in lx, luminance in cd/m² and pixel density in mm/px at that exact point, with every contributing projector summed and the surface's material and facing honoured. It hides where no projector contributes, and in lens view it hides outside the selected head's lit area. The fastest way to check the dim corner without running anything. | 투사를 받는 면 위로 커서를 옮기면 그 지점의 조도(lx), 휘도(cd/m²), 픽셀 밀도(mm/px)를 읽습니다. 기여하는 프로젝터를 전부 합산하고, 그 면의 재질과 향하는 방향을 반영합니다. 닿는 빔이 없는 곳에서는 표시되지 않고, 렌즈 뷰에서는 선택한 프로젝터가 비추는 영역 밖에서 사라집니다. 아무것도 돌리지 않고 어두운 모서리를 확인하는 가장 빠른 방법입니다. |

`figcaption`: `Screen recording: the hover probe reading lux and mm/px across a normalized-mode heatmap.` / `호버 프로브가 정규화 모드 히트맵 위에서 조도와 mm/px를 읽는 화면 녹화입니다.`

**(b) `analysis-13pt-diagnostics.png` — `.media-img .media-slot--wide .has-media`**, `--media-ratio: 1917 / 944`.

| Label | EN | KO |
|---|---|---|
| `13 POINTS, DRAWN ON THE SURFACE` | Nine ANSI points plus four quarter-points, placed on the target's projector-facing plane and drawn in world space with connected grid lines and the numeric readout in the active map mode and unit. A second ring of 16 outer-edge probes covers the perimeter, where the 13-point grid never reaches — edge falloff is where blends and masking fail. The grid follows a projector as you drag it and recomputes at full quality when you let go. | ANSI 9점에 사분점 4개를 더해, 대상 면의 프로젝터를 향한 평면에 배치하고 월드 좌표로 그립니다. 격자선과 함께 현재 맵 모드·단위의 수치가 표시됩니다. 13점 격자가 닿지 않는 가장자리는 별도의 외곽 프로브 16개가 덮습니다. 블렌드와 마스킹이 실패하는 곳이 바로 그 가장자리입니다. 프로젝터를 끄는 동안 격자가 따라오고, 손을 떼면 전체 품질로 다시 계산합니다. |
| `LENS VIEW` | One click frames the camera along the selected head's optical axis, fitted to the probe bounds, so you see the field the way that head sees it. Uniformity and keystone read completely differently head-on. | 클릭 한 번으로 카메라가 선택한 프로젝터의 광축에 정렬되고, 프로브 범위에 맞게 잡힙니다. 그 프로젝터가 보는 대로 보게 됩니다. 균일도와 키스톤은 정면에서 볼 때 전혀 다르게 읽힙니다. |
| `SNAP TO THE LENS EXIT POINT` | The measure tool snaps to mesh vertices, bounding-box corners, imported-model centres, projector body centres, receiver surface points **and the beam-origin point where light actually leaves the lens**. That last one is the difference between a rough distance and the throw distance the optics use. Measurements save with the scene, list in the outliner, and can be hidden individually. | 측정 툴은 정점, 바운딩 박스 모서리, 임포트한 모델의 중심, 프로젝터 본체 중심, 투사면 위의 점, **그리고 빛이 실제로 렌즈를 떠나는 출사점**에 스냅합니다. 마지막 항목이 대충 잰 거리와 광학이 실제로 쓰는 투사 거리를 가릅니다. 측정값은 씬에 저장되고, 아웃라이너에 목록으로 남고, 하나씩 숨길 수 있습니다. |

`figcaption`: `Full app window: a blend group of four projectors with the 13 labelled probe points on the target.` / `앱 전체 화면 — 프로젝터 4대로 이루어진 블렌드 그룹과, 대상 면에 표시된 13개 프로브 지점입니다.`

**(c) Two trust points in plain flow, no media:**

| Label | EN | KO |
|---|---|---|
| `EVERY MAP SAYS WHERE ITS NUMBERS CAME FROM` | The legend carries an accuracy-basis chip — **Physics Model (estimated)**, **Spec-based (datasheet)**, **Calibrated** or **Measured** — colour-coded, with a tooltip listing the inputs: geometry, lumens, throw ratio, surface angle, optical profile, calibration basis. A simulated number should never be mistaken for a measured one. | 범례에는 이 값이 어디서 나왔는지 알려 주는 칩이 붙습니다. **Physics Model(추정)**, **Spec-based(데이터시트)**, **Calibrated**, **Measured** 중 하나이고, 색으로 구분되며, 툴팁에 입력값이 나열됩니다 — 형상, 광속, 투사비, 면 기울기, 광학 프로파일, 보정 근거. 시뮬레이션 값이 실측값으로 오해받으면 안 됩니다. |
| `ONE DROPDOWN FIXES WHAT "THIS SURFACE" MEANS` | The measurement target picker fixes which surface every lux and mm/px reading is measured against — including which of a room's six walls — for both the viewport and the exported PDF, with an amber chip that appears exactly when the default auto-election would make the two disagree. Ambiguity about which surface a number describes is the quietest way for a report to be wrong. | 측정 대상 선택기가 모든 조도·mm/px 값이 어느 면을 기준으로 나온 값인지 고정합니다. 룸의 여섯 면 중 어느 벽인지까지 포함해서, 뷰포트와 내보낸 PDF 양쪽에 같이 적용됩니다. 기본 자동 선택이 둘을 어긋나게 만들 상황에서만 앰버색 칩이 뜹니다. 그 숫자가 어느 면 이야기인지 불분명한 것이, 리포트가 틀리는 가장 조용한 방식입니다. |

---

#### Ch 07 · `#ch-07` · THE LIGHT / 빛 · `.chapter--reverse`

Media: `hero-stitch-01.png`, `.media-img`, `--media-ratio: 1363 / 805`, **not** `--mass` (it is a light composite and sits fine on white).

**Title:** `LIGHT BEHAVES LIKE LIGHT.`

**Body:**

> **EN** — Projector light composites additively onto the surface's own shading rather than being pasted over it. A white beam on a dark wall brightens the wall while its texture stays visible; a black frame adds nothing. This is the whole reason a simulated result reads as light rather than as a sticker.
>
> **KO** — 프로젝터 빛은 표면 위에 덧붙는 게 아니라, 그 면이 원래 갖고 있는 음영 위에 가산 합성됩니다. 어두운 벽에 흰 빔을 쏘면 벽이 밝아지면서 벽의 질감이 그대로 보이고, 검은 프레임은 아무것도 더하지 않습니다. 시뮬레이션 결과가 스티커가 아니라 빛으로 읽히는 이유가 이것 하나입니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `ONE SHADER CORE, TWO PATHS` | The same GLSL projection core is injected into both the projection-surface path and the imported-model PBR path, so a parametric wall and a 2,000-mesh imported venue behave identically. | 같은 GLSL 투사 코어가 투사면 경로와 임포트 모델 PBR 경로 양쪽에 주입됩니다. 그래서 파라메트릭 벽과 메시 2,000개짜리 임포트 현장이 똑같이 동작합니다. |
| `REAL PROJECTOR SHADOWS` | Each projector renders a depth map into a shared array texture before the main pass, so objects block the beam and cast real projector shadows. Dirty tracking hashes each projector's matrix and skips unchanged heads entirely — a fully static scene costs zero depth work. Occlusion quality is selectable: Sharp, Normal, Soft. "Will that truss shadow land on the logo?" is only answerable this way. | 프로젝터마다 메인 패스 전에 뎁스맵을 공유 배열 텍스처로 렌더링합니다. 그래서 물체가 빔을 막고 실제 그림자를 드리웁니다. 프로젝터 행렬을 해시해서 안 움직인 장비는 통째로 건너뜁니다. 완전히 정지한 씬은 뎁스 계산 비용이 0입니다. 오클루전 품질은 Sharp·Normal·Soft 중에서 고릅니다. "저 트러스 그림자가 로고 위에 떨어지나?"는 이 방식이라야 답이 나옵니다. |
| `IS 20,000 LUMENS ENOUGH? DEPENDS.` | Grouped ambient presets from direct sunlight at 100,000 lx down to theatre at 5 lx and full blackout, or a custom value, with a live contrast-ratio chip rating the result Optimal / Excellent / Good / Fair / Poor / Not viable. Brightness alone means nothing in a lit room. | 직사광 100,000 lx부터 극장 5 lx, 완전 암전까지 묶여 있는 주변광 프리셋과 직접 입력값. 결과를 Optimal / Excellent / Good / Fair / Poor / Not viable로 평가하는 명암비 칩이 같이 뜹니다. 조명이 켜진 공간에서 밝기 하나만으로는 아무 의미가 없습니다. |
| `SHOW MODE vs LOOK MODE` | A manual exposure slider, an optional auto-exposure, and a **Layout View** that brightens the whole scene for placement and client demos with its own 10–500 % brightness scale — all display-only. Analysis keeps reading your real ambient value. A blackout scene is correct for the numbers and useless for showing a client where the projectors are; separating the two lets both be right. | 수동 노출 슬라이더, 선택형 자동 노출, 그리고 배치 작업과 고객 시연을 위해 씬 전체를 밝히는 **Layout View**(밝기 10–500 %). 전부 표시 전용입니다. 계산은 계속 실제 주변광 값을 씁니다. 암전 씬은 숫자로는 맞지만 프로젝터 위치를 보여 주기에는 쓸모가 없습니다. 둘을 분리해야 둘 다 맞을 수 있습니다. |
| `IT REPAIRS ITSELF AFTER A RESTORE` | After a restore, a share-load or a re-import, the app scans for models whose PBR material never received the projection injection, or that were never registered as receivers or occluders, repairs them in place, and escalates to you if repair fails. The symptom it prevents — "the model loads but nothing projects onto it until you import a second model" — is exactly the kind of failure that destroys trust in a simulation. | 복원, 공유 링크 열기, 재임포트 후에 앱이 스스로 훑습니다. PBR 재질에 투사 주입이 안 들어간 모델, 수광체나 차폐물로 등록되지 않은 모델을 찾아 그 자리에서 고치고, 못 고치면 사용자에게 알립니다. 막으려는 증상은 "모델은 올라왔는데 두 번째 모델을 임포트하기 전까지 아무것도 투사되지 않는" 것인데, 그게 딱 시뮬레이션에 대한 신뢰를 무너뜨리는 종류의 고장입니다. |

**`figcaption`:** `Composite from the shipped app: a façade with four projectors and an absolute-mode lux heatmap.` / `실제 앱 화면 합성 — 프로젝터 4대가 있는 파사드와 절대값 모드 조도 히트맵입니다.`

> **Builder note:** verify the projector count in `hero-stitch-01.png` before pasting this figcaption; if the frame shows a different count, change the number. Do not describe a frame you have not looked at.

---

#### Ch 08 · `#ch-08` · THE ROOM AROUND IT / 주변 환경

**Title:** `PROJECTION NEVER SHIPS ALONE.`

**Body:**

> **EN** — Stage and architectural fixtures and LED walls live in the same scene as the projectors, so the contrast judgement is about the real room. They are kept in a strictly separate estimate lane — the fixture module is forbidden from importing the projector photometry path, and a test checks its import list stays clean.
>
> **KO** — 무대 조명, 건축 조명, LED 월이 프로젝터와 같은 씬 안에 들어갑니다. 그래야 명암 판단이 실제 공간 이야기가 됩니다. 다만 이쪽은 참고용 추정치 영역으로 확실히 분리돼 있습니다. 조명 모듈은 프로젝터 광학 계산 코드를 아예 불러오지 못하게 막혀 있고, 임포트 목록이 깨끗한지 테스트가 매번 확인합니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `EIGHT FIXTURE TYPES, SEEDED FROM SPEC SHEETS` | Moving head spot, wash and beam; LED PAR and static wash; profile/ellipsoidal; Fresnel/PC; flood/cyc/blinder; strobe — each with realistic lumens, CCT, CRI, beam and field angle and power, rendering a live 3D beam cone. Drag an aim handle to point one at a spot in the scene. | 무빙 스팟·워시·빔, LED PAR·스태틱 워시, 프로파일/엘립소이달, 프레넬/PC, 플러드/사이클로라마/블라인더, 스트로브. 각각 실제에 가까운 광속, 색온도, 연색성, 빔각과 필드각, 소비전력을 갖고 3D 빔 콘을 그립니다. 조준 핸들을 끌면 씬 안 원하는 지점을 향하게 됩니다. |
| `REAL PHOTOMETRY, NOT A CONE` | Upload a manufacturer `.ies` file (LM-63): the parser reads the vertical-angle/candela distribution and measured peak, stores the profile inline on the fixture so it round-trips with the project, and scales the file's peak to the fixture's current output. The same curve drives the rendered beam cookie **and** the illuminance estimate, so they cannot disagree. Asymmetric IES files are averaged into an axially symmetric approximation, and the app says so. | 제조사 `.ies` 파일(LM-63)을 올리면, 수직각별 광도 분포와 실측 최댓값을 읽어 프로파일을 픽스처에 그대로 저장합니다. 프로젝트를 저장했다 열어도 같이 따라옵니다. 파일의 최댓값은 현재 설정한 출력에 맞춰 스케일됩니다. 같은 곡선이 화면에 그려지는 빔 쿠키와 조도 추정값을 동시에 몰기 때문에 둘이 어긋날 수가 없습니다. 비대칭 IES 파일은 축대칭 형태로 평균 내어 쓰고, 앱에도 그렇게 표시됩니다. |
| `THE ISOLUX PLOT, IN THE SAME 3D SCENE` | The fixture illuminance grid renders as a DIALux-style false-colour plane at your working-plane height, with optional isolux contour lines — the same wall-occluded, all-fixtures estimate the panel reports as Eavg / Emin / Emax and uniformity U0 and Ud. It is display-only: excluded from projector light, from the projector heatmap and from occlusion, and not selectable. **It is stamped "estimate" in code and in the UI — direct light only, no interreflection.** | 조명 조도 격자가 지정한 작업면 높이에서 DIALux 스타일 컬러 면으로 그려지고, 등조도선을 켤 수 있습니다. 패널이 Eavg / Emin / Emax와 균일도 U0·Ud로 보고하는, 벽 차폐를 반영한 전체 픽스처 추정치와 같은 값입니다. 표시 전용이라 프로젝터 빛·프로젝터 히트맵·오클루전에서 제외되고 선택도 안 됩니다. **코드와 화면 양쪽에서 "estimate"로 표기되며, 직접광만 계산하고 상호반사는 없습니다.** |
| `LED WALLS AND THEIR SPILL` | Add a spatial LED wall from a real cabinet profile — pixel pitch, cabinet dimensions, nits, refresh, viewing angles, weight, average and peak W/m², service access, curve support — with cabinet resolution derived from pitch. It plays video content and models its own emission into the scene, giving contrast before and after, contrast drop and a LOW/MEDIUM/HIGH washout risk. Hybrid stages are common and the wall routinely washes out the projected image. | 실제 캐비닛 프로파일 — 픽셀 피치, 캐비닛 치수, 니트, 리프레시, 시야각, 무게, 평균·피크 W/m², 서비스 접근 방향, 곡면 지원 — 에서 공간상의 LED 월을 만듭니다. 해상도는 피치에서 계산됩니다. 영상을 재생하고 자기 발광을 씬에 모델링해서, 적용 전후 명암비와 저하율, 워시아웃 위험도(LOW/MEDIUM/HIGH)를 냅니다. 하이브리드 무대는 흔하고, LED 월이 투사 화면을 씻어 버리는 일도 흔합니다. |
| `THE PAPERWORK` | Copy every scene fixture to the clipboard as CSV — name, type, manufacturer, model, lumens, peak candela, beam and field angle, CCT, CRI, watts, pan/tilt, IES source — with total fixture count and total connected load. | 씬의 모든 조명을 CSV로 클립보드에 복사합니다. 이름, 종류, 제조사, 모델, 광속, 최대 광도, 빔각·필드각, 색온도, 연색성, 소비전력, 팬/틸트, IES 출처. 총 대수와 총 부하가 마지막 줄에 붙습니다. |
| `GDTF / MVR — BETA` | Reads `.gdtf` fixture files and `.mvr` scenes with their placement matrices using the browser's native decompression, no extra dependency. **Code-complete but not yet validated against real vendor files — labelled beta in-product.** We do not promise specific fixture-library compatibility. | `.gdtf` 픽스처 파일과 배치 행렬이 들어 있는 `.mvr` 씬을 브라우저 내장 압축 해제로 읽습니다. 추가 의존성이 없습니다. **코드는 완성됐지만 실제 벤더 파일로 검증되지 않았고, 앱 안에서도 베타로 표기돼 있습니다.** 특정 픽스처 라이브러리와의 호환은 약속하지 않습니다. |

**`figcaption`:** `Coming soon: the isolux working plane and projector beams in one scene.` / `준비 중 — 등조도 작업면과 프로젝터 빔이 한 씬에 같이 있는 화면입니다.`

---

#### Ch 09 · `#ch-09` · THE DELIVERABLE / 산출물 · `.chapter--reverse`

Media: `.media-slot--mass .bleed-left`, `data-label="PDF TECH RIDER"`, empty.

**Title:** `WHAT LEAVES THE APP.`

**Body:**

> **EN** — A one-click PDF an operator types into a media server and a client files with the contract; a vendor-neutral JSON for the integrator; and a read-only link that is a dated receipt of what was planned, not a live mirror.
>
> **KO** — 오퍼레이터가 미디어 서버에 옮겨 치고 고객이 계약서와 함께 보관하는 PDF, 인테그레이터가 받는 벤더 중립 JSON, 그리고 계획한 내용을 날짜와 함께 박아 둔 읽기 전용 링크. 이 링크는 실시간 미러가 아닙니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `PDF TECH RIDER, ONE CLICK` | A4: the captured 3D viewport with its matching heatmap legend and mode name, a simulation disclaimer band, project setup, a projector settings index, then **one page per projector** — equipment, lens model, throw ratio and lens shift, position and orientation, axial throw, shifted centre distance, beam W/H and area at reference, then surface sampling: beam size at the sampled point, **Center Surface Lux**, Center Surface Luminance in cd/m², surface tilt, pixel density and hits-target. Every row carries a footnoted measurement note. Edge-blending pages carry a blend-domain warning. | A4 문서입니다. 3D 뷰포트 캡처와 그에 맞는 히트맵 범례·모드 이름, 시뮬레이션 고지 띠, 프로젝트 설정, 프로젝터 설정 색인, 그리고 **프로젝터 1대당 1페이지** — 장비, 렌즈 모델, 투사비와 렌즈 시프트, 위치와 자세, 축 방향 투사 거리, 시프트된 중심까지의 거리, 기준 지점에서의 빔 가로·세로와 면적, 이어서 표면 샘플링 — 샘플 지점의 빔 크기, **중앙 표면 조도**, 중앙 표면 휘도(cd/m²), 면 기울기, 픽셀 밀도, 대상 명중 여부. 각 항목에 측정 주석이 각주로 붙습니다. 엣지 블렌딩 페이지에는 블렌드 도메인 경고가 들어갑니다. |
| `THE DISCLAIMER IS PRINTED, NOT BURIED` | The PDF prints an explicit banner — *Simulation preview — configured projector specs + scene geometry — not a field measurement* — and per-row footnotes clarifying, for example, that surface lux is the manufacturer Lumens/Area figure with angle acting as a facing gate only, not an incidence dimming term. That pre-empts the single most common misreading of a photometric report, on the page a client actually reads. | PDF에는 고지 띠가 그대로 인쇄됩니다 — *시뮬레이션 미리보기입니다. 설정한 프로젝터 사양과 씬 형상으로 계산한 값이며, 현장 실측이 아닙니다.* 그리고 항목별 각주가 붙습니다. 예를 들어 표면 조도는 제조사 광속을 면적으로 나눈 값이고, 각도는 빛이 닿는지 여부만 가르지 조도를 깎는 항이 아니라는 설명입니다. 광학 리포트에서 가장 흔한 오독을, 고객이 실제로 읽는 그 페이지에서 미리 막습니다. |
| `EVERY BLEND NUMBER SHIPS WITH ITS DOMAIN` | Every export carrying blend values also carries an explicit statement that FieldLux ramps are **light-linear** — a partition of unity in luminous flux — and must not be typed verbatim into a signal-space media-server blend UI, which would produce roughly a −56 % dark band at seam centre. That prevents a specific, expensive and very common on-site failure. | 블렌드 값이 들어가는 내보내기에는 반드시 도메인 설명이 같이 갑니다. FieldLux의 램프는 **광량 선형**이며 광속 기준으로 합이 1이 되게 나눈 값이라, 신호 공간을 쓰는 미디어 서버 블렌드 화면에 그대로 옮겨 적으면 이음매 중앙에 약 −56 % 암부가 생깁니다. 비싸고 흔한 현장 사고 하나를 이 문장이 막습니다. |
| `NEUTRAL HANDOFF JSON` | A versioned, vendor-neutral file (schema 1.2.0) declaring its coordinate system — right-handed, +X/+Y/−Z, metres, degrees — then every projector's transform, optics, lens shift, equipment, blend and warp; every target with an ordered corner plane basis; bindings, blend groups and per-edge blends. The integrator's bridge without a bespoke exporter. **There is no MadMapper-format export** — only this neutral file. | 좌표계를 선언하는 버전 관리된 벤더 중립 파일입니다(스키마 1.2.0). 오른손 좌표계, +X/+Y/−Z, 미터, 도. 이어서 프로젝터마다 변환, 광학, 렌즈 시프트, 장비, 블렌드, 워프가 들어가고, 대상마다 순서가 정해진 코너 평면 기준이 들어가고, 바인딩·블렌드 그룹·엣지별 블렌드가 들어갑니다. 전용 익스포터 없이 인테그레이터에게 넘기는 다리입니다. **MadMapper 전용 포맷 내보내기는 없습니다.** 이 중립 파일 하나뿐입니다. |
| `A DATED RECEIPT, NOT A LIVE MIRROR` | A share stores the scene as it was at publish time and pins the version row it came from. The viewer header shows your studio label plus *As planned — saved &lt;date&gt;, &lt;time&gt; · v&lt;n&gt;*, with the version ordinal computed server-side. Editing the project afterwards cannot rewrite what the client was shown. | 공유 링크는 게시한 시점의 씬을 그대로 저장하고, 그 시점의 버전 행을 고정합니다. 뷰어 상단에 스튜디오 이름과 함께 *계획 시점 — 저장 &lt;날짜&gt;, &lt;시각&gt; · v&lt;번호&gt;* 가 표시되며, 버전 번호는 서버에서 계산합니다. 이후에 프로젝트를 고쳐도 고객이 본 내용은 바뀌지 않습니다. |
| `DECIDE WHAT THE RECIPIENT CAN DO` | Per link: show your measurements, show the layers panel, show the display panel, allow the PDF download, allow walk mode, allow projector zoom within catalogue throw limits, show the projector spec sheet, open with your display state, let viewers switch between blend video and base projection. **Measurements you hide are stripped from the payload at compose time, not hidden in the UI.** An optional password, minimum six characters, is bcrypt-hashed server-side and the resolver withholds the payload until it verifies. | 링크마다 정합니다. 내 측정값 표시, 레이어 패널, 디스플레이 패널, PDF 다운로드 허용, 워크 모드 허용, 카탈로그 범위 안에서의 줌 허용, 프로젝터 사양표 표시, 내 화면 상태 그대로 열기, 블렌드 영상과 기본 투사 전환 허용. **숨긴 측정값은 화면에서 안 보이는 게 아니라 전송 데이터에서 아예 빠집니다.** 비밀번호(6자 이상)를 걸면 서버에서 bcrypt로 해시되고, 확인되기 전까지는 내용 자체가 나가지 않습니다. |
| `A BOUNDED WHAT-IF, INSIDE THE LINK` | Select a projector in the viewer and a throw slider appears, clamped to that lens's catalogue range, with beam, heatmap, labels and spec sheet recomputing live and a Reset. Fixed-throw lenses show no slider. Every viewer interaction is ephemeral — a sandbox latch blocks persistence on the share route, pinned by a contract test. The client's real question, "what if we move it back three metres", gets answered within lenses that are actually procurable. | 뷰어에서 프로젝터를 고르면 그 렌즈의 카탈로그 범위로 제한된 투사비 슬라이더가 나타납니다. 빔, 히트맵, 라벨, 사양표가 실시간으로 다시 계산되고 초기화 버튼이 있습니다. 고정 초점 렌즈에는 슬라이더가 없습니다. 뷰어에서 한 조작은 전부 휘발성이며, 공유 경로에서는 저장을 막는 걸쇠가 걸려 있고 그 사실을 테스트가 붙잡고 있습니다. 고객이 실제로 묻는 "3 m 뒤로 빼면 어떻게 되냐"에, 실제로 구할 수 있는 렌즈 범위 안에서 답이 나옵니다. |
| `EXPIRY THAT DEGRADES INSTEAD OF DYING` | Links expire on 2 / 7 / 14 / 30 days or never. With the default *keep a watermarked, view-only copy* on, an expired link still opens, readable, under an **EXPIRED — VIEW ONLY** watermark with the PDF download and the what-if slider disabled. A link sent six months ago is still the evidence, not a 404. Revoke stops a link resolving immediately and purges storage files unique to it. | 링크 만료는 2일·7일·14일·30일 또는 없음 중에서 고릅니다. 기본값인 *워터마크가 붙은 읽기 전용 사본 유지* 를 켜 두면, 만료된 링크도 열리고 읽힙니다. **EXPIRED — VIEW ONLY** 워터마크가 붙고 PDF 다운로드와 What-if 슬라이더가 비활성화됩니다. 6개월 전에 보낸 링크가 404가 아니라 여전히 근거로 남습니다. 해지하면 즉시 열람이 끊기고, 그 링크에만 딸린 저장 파일이 정리됩니다. |
| `THE PUBLIC-BUCKET CAVEAT` | Model binaries and site photos referenced by a share are served from a **public** storage bucket. Anyone who has already resolved a share can keep downloading those files after you revoke, expire or password-protect the link. This is known, documented and deliberately deferred. Revocation stops the link; it does not un-download a file. | 공유 링크가 참조하는 모델 바이너리와 현장 사진은 **공개** 스토리지 버킷에서 제공됩니다. 이미 한 번 링크를 연 사람은 링크를 해지하거나 만료시키거나 비밀번호를 걸어도 그 파일들을 계속 받을 수 있습니다. 알고 있고, 문서화돼 있고, 의도적으로 뒤로 미뤄 둔 항목입니다. 해지는 링크를 끊지, 이미 받아 간 파일을 되돌리지는 않습니다. |
| `REPORT BUILDER — BETA, NOT ON` | A section-composer that adds a branded cover, an equipment schedule and power page and an assumptions page around the optics pages. **It is behind a beta gate and disabled in deployed builds** — the File-menu row is greyed with the hint "Temporarily disabled in the open beta." Listed here so you know it exists, not so you plan around it. | 브랜딩 표지, 장비 목록과 전력 페이지, 전제 조건 페이지를 광학 페이지 앞뒤로 붙이는 섹션 구성 도구입니다. **베타 게이트 뒤에 있고 배포된 빌드에서는 꺼져 있습니다.** File 메뉴 항목이 회색으로 비활성화되고 "오픈 베타 기간 동안 일시 비활성화" 안내가 붙습니다. 존재한다는 사실만 적어 둔 것이지, 이걸 전제로 계획을 세우시라는 뜻이 아닙니다. |

**`figcaption`:** `Coming soon: exporting the Tech Rider and opening the resulting client link.` / `준비 중 — 테크 라이더를 내보내고 그 결과로 만들어진 고객용 링크를 여는 화면입니다.`

---

#### Ch 10 · `#ch-10` · THE PROJECT / 프로젝트

**Title:** `THE WORK SURVIVES THE SESSION.`

**Body:**

> **EN** — Three independent layers protect work in progress: a debounced local crash draft, a cloud autosave on an append-only version chain, and a non-destructive restore. When a project cannot be fully revived, the app refuses to write rather than overwrite your last good snapshot.
>
> **KO** — 작업 중인 내용을 세 겹이 따로 지킵니다. 브라우저에 쌓이는 크래시 드래프트, 덧붙이기만 하는 버전 사슬 위의 클라우드 자동 저장, 그리고 아무것도 지우지 않는 복원. 프로젝트를 온전히 되살릴 수 없는 상황이면, 앱은 마지막 정상 스냅샷을 덮어쓰는 대신 쓰기를 거부합니다.

**Points:**

| Label | EN | KO |
|---|---|---|
| `LAND ON YOUR PROJECTS, NOT AN EMPTY EDITOR` | After sign-in you get a grid of saved projects — name, last updated, open on click, per-card delete with confirmation. It is a plain fetch: no polling, no realtime subscription, so the page costs nothing while it sits open. | 로그인하면 저장된 프로젝트 목록이 먼저 나옵니다. 이름, 마지막 수정일, 클릭으로 열기, 카드별 삭제(확인 절차 포함). 단순 조회라서 폴링도 실시간 구독도 없고, 열어 둔 채로 있어도 비용이 들지 않습니다. |
| `TWO FINISHED SCENES, YOURS TO BREAK` | Two tiles create your own private copy of a fully-built projection study on first click and reuse it afterwards — the FieldLux Test Scene and the Play Dock Demo. Break them freely; they are your copies. | 타일 두 개가 첫 클릭 때 완성된 프로젝션 검토 씬의 개인 사본을 만들어 주고, 그 다음부터는 그 사본을 엽니다. FieldLux Test Scene과 Play Dock Demo입니다. 본인 사본이니 마음껏 부숴도 됩니다. |
| `AUTOSAVE THAT TELLS YOU WHEN IT FAILS` | Cloud autosave every 10 minutes while the project is dirty, skipping the write entirely when the canonicalised snapshot has not changed. A failed autosave is recorded on the store so the top bar shows a failure chip, and retried after 60–90 seconds with jitter — quota-exceeded and missing-model-URL cases reported separately. You find out your work is not reaching the cloud while you can still do something about it. | 프로젝트가 수정된 상태이면 10분마다 클라우드에 자동 저장하고, 정규화한 스냅샷이 그대로면 아예 쓰지 않습니다. 자동 저장이 실패하면 상단 바에 실패 칩이 뜨도록 기록되고, 60–90초 뒤 무작위 지연을 섞어 재시도합니다. 용량 초과와 모델 주소 누락은 따로 구분해서 알립니다. 작업이 클라우드에 안 올라가고 있다는 걸, 아직 손쓸 수 있을 때 알게 됩니다. |
| `REFRESH RECOVERY, AND IT SAYS IF IT'S OFF` | Every edit debounces a full scene snapshot into browser storage, force-flushed on tab close and hide. On reopen the app compares the draft's timestamp against the server version and hydrates whichever is newer. Refreshing the tab you were working in returns you to that project; a new tab still opens the project list. If the browser refuses the write you get an explicit **Refresh recovery is OFF** warning. | 편집할 때마다 씬 전체 스냅샷이 브라우저에 저장되고, 탭을 닫거나 숨길 때 확정 기록됩니다. 다시 열면 드래프트 시각과 서버 버전을 비교해서 더 최신인 쪽을 불러옵니다. 작업하던 탭을 새로고침하면 그 프로젝트로 돌아오고, 새 탭은 여전히 프로젝트 목록으로 엽니다. 브라우저가 저장을 거부하면 **새로고침 복구가 꺼져 있습니다** 라고 명시적으로 알립니다. |
| `RESTORE DELETES NOTHING` | Every save inserts an immutable version row; the project only moves a pointer. Restoring an older version first checkpoints your unsaved edits as their own version, applies the old snapshot, then saves it again as a brand-new latest version annotated *Restored from &lt;date&gt;*. The state you rolled back from is still in history if the client changes their mind again. | 저장할 때마다 변경 불가능한 버전 행이 하나 생기고, 프로젝트는 가리키는 위치만 옮깁니다. 예전 버전을 복원하면 먼저 저장 안 된 편집분을 별도 버전으로 남기고, 예전 스냅샷을 적용한 뒤, 그것을 다시 새 최신 버전으로 저장하면서 *&lt;날짜&gt; 시점에서 복원됨* 이라고 적어 둡니다. 되돌리기 전 상태가 그대로 이력에 남아 있어서, 고객이 마음을 또 바꿔도 됩니다. |
| `LOOK, BUT DON'T CLOBBER` | When a project cannot be fully revived — a broken snapshot shape, a contract validation failure, missing model assets, or someone else's shared project — the app loads what it can, disables both manual save and autosave, and shows a banner naming the reason. A partially-loaded project can never overwrite your last known-good cloud snapshot. | 프로젝트를 온전히 되살릴 수 없을 때 — 스냅샷 형태가 깨졌거나, 계약 검증에 실패했거나, 모델 파일이 없거나, 남이 공유해 준 프로젝트일 때 — 앱은 되는 데까지만 불러오고 수동 저장과 자동 저장을 모두 끈 뒤, 이유를 적은 배너를 띄웁니다. 반쯤 불러온 프로젝트가 마지막 정상 스냅샷을 덮어쓰는 일은 생기지 않습니다. |
| `OFFLINE FILE, WHEN THE CLOUD IS NOT AN OPTION` | Export the whole project to a single `.flx.json` and re-open it from disk. Photo assets that were offloaded to cloud storage are re-inlined as data URLs on export, so the file is genuinely self-contained. This answers the archive and handoff case — it is **not** an offline mode; the app still needs the network to sign in. | 프로젝트 전체를 `.flx.json` 파일 하나로 내보내고 디스크에서 다시 열 수 있습니다. 클라우드 스토리지로 옮겨 뒀던 사진은 내보낼 때 데이터 URL로 다시 파일 안에 넣기 때문에 이 파일 하나로 완결됩니다. 보관과 인수인계용이라는 뜻이지, **오프라인 모드가 아닙니다.** 로그인에는 여전히 네트워크가 필요합니다. |

**`figcaption`:** `Coming soon: Project Home, the storage meter and the two sample-scene tiles.` / `준비 중 — 프로젝트 홈, 저장 용량 표시, 샘플 씬 타일 두 개가 보이는 화면입니다.`

---

### S7 — `#numbers` · The scale facts

`.section--pad-sm`, `.site-shell`. `.micro-label` `(00)` `SCALE` / `규모`. `.section-title`: `THE NUMBERS THAT BOUND THE TOOL.`

A `.stat-row` of six `.stat` blocks. **Only values from the §1.2(d) pool.** `.stat-value` in `--font-num`, `--fs-stat`, tabular; `.stat-unit` inline at `--fs-h4`; `.stat-label` above; `.stat-note` below in `--fs-body-sm` `--ink-400`, bilingual.

| `.stat-label` | `.stat-value` + `.stat-unit` | `.stat-note` EN / KO |
|---|---|---|
| `CATALOGUE` | `87` `projectors` | 113 lenses across Epson, Panasonic, Christie and Barco. Rebuilt 2026-05-12. / Epson·Panasonic·Christie·Barco의 렌즈 113종. 2026-05-12 갱신. |
| `CROSS-CHECKED` | `642` `combinations` | Against Panasonic TDC and Epson PTDS only — 47 of 87 heads. Pulled 2026-06-11. / Panasonic TDC와 Epson PTDS만 대상입니다. 87종 중 47종. 2026-06-11 기준. |
| `MATERIALS` | `21` `presets` | Reflectance, gain, half-angle, transmittance, scatter, shadow opacity. / 반사율, 게인, 반각, 투과율, 산란, 그림자 불투명도. |
| `HEADS PER SCENE` | `64` `max` | Hard GPU cap. The runtime detector can set it lower on your machine. / GPU 상한값입니다. 실행 시 감지 결과에 따라 더 낮아질 수 있습니다. |
| `PROBE GRID` | `13` `points` | 9 ANSI + 4 quarter-points, plus 16 outer-edge probes. Surface sampling is 16 × 16. / ANSI 9점 + 사분점 4개, 외곽 프로브 16개 별도. 표면 샘플링은 16 × 16입니다. |
| `WHILE YOU WORK` | `0` `requests` | Moving, rotating and editing values issue no network requests at all. A measured one-hour session is ≈ 55 requests total. / 이동·회전·값 변경은 네트워크 요청을 전혀 만들지 않습니다. 실제로 한 시간 작업했을 때 서버 요청은 전부 합쳐 약 55건이었습니다. |

---

### S8 — `#limits` · What we assume, what we do not model, what we do not claim

This is the section the hero CTA points at. It is the credibility argument, and it leads with the worst number.

`.section--pad-md`, `.site-shell--narrow`. `.micro-label` `(00)` `LIMITS` / `한계`.

**`.section-title`:**
```
EVERY RUN CARRIES
ITS OWN ERROR BUDGET.
```

**`.section-lead` (bilingual):**

> **EN** — These constants are frozen in one module, each with the industry source it came from and the error it carries. Changing one changes analysis output and breaks a contract test on purpose. We publish them because a field engineer should be able to read a number and know exactly what was assumed to produce it.
>
> **KO** — 아래 상수들은 모듈 하나에 고정돼 있고, 각각 어느 업계 표준에서 왔는지와 얼마나 벗어날 수 있는지를 함께 들고 있습니다. 하나라도 바꾸면 계산 결과가 달라지고, 그걸 잡으라고 만들어 둔 테스트가 일부러 깨집니다. 현장 엔지니어가 숫자 하나를 보고 어떤 전제로 나온 값인지 정확히 알 수 있어야 한다고 봐서 공개합니다.

**`.limits` table — assumptions, from `src/core/analysis/assumptions.js` verbatim:**

| `.limits-key` | Value | Source | Error budget |
|---|---|---|---|
| `SURFACE REFLECTANCE` | 0.60 | ISO 9241-303 reference matte white | ±0.10 absolute (paint variance) |
| `PROJECTOR UNIFORMITY` | ANSI 9-point — centre 1.00 / edge 0.90 / corner 0.85, average 0.92 | ANSI/INFOCOMM 2M-2010 | ±5 % per point in spec, ±15 % out of spec |
| `SURFACE SAMPLING` | 16 × 16 = 256 points | — | ±5 % on Reliable Surface Lux; ±1 % at 32 × 32 |
| `THROW GEOMETRY` | raycast from the optical frame to the target | — | ±2 % on flat targets, ±15 % on imported models |
| `NON-PLANAR FALLBACK` | bounding-box centroid plane projection | — | **±15–30 %** |
| `ROOM BOUNCE` | single-bounce form factor | heuristic | **±50 % — for planning, not measurement** |

**Lead line above the table (bilingual):**

> **EN** — Start with the worst one: indirect room bounce carries a self-declared ±50 % budget and an in-code disclaimer that it is for planning, not measurement. Everything else in this table is tighter, and now you know how much.
>
> **KO** — 가장 나쁜 것부터 봅니다. 실내 반사광은 우리가 스스로 밝힌 오차 예산이 ±50 %이고, 코드 안에도 "계획용이지 측정용이 아니다"라고 적어 뒀습니다. 이 표의 나머지는 이보다 낫고, 이제 얼마나 나은지도 아시게 됩니다.

**`.limits` table — what is not modelled at all:**

| `.limits-key` | EN | KO |
|---|---|---|
| `NOT MODELLED` | Atmospheric haze, lens distortion, chromatic aberration, lamp aging, specular BRDF, ambient interaction with the surface, content-dependent brightness. Surfaces are Lambertian only. There is no radiosity, no global illumination and no ray tracing anywhere in this product. | 대기 헤이즈, 렌즈 왜곡, 색수차, 램프 노화, 정반사 BRDF, 주변광과 표면의 상호작용, 콘텐츠에 따른 밝기 변화는 계산하지 않습니다. 표면은 램버시안으로만 다룹니다. 이 제품 어디에도 래디오시티나 광역 조명, 레이 트레이싱은 없습니다. |
| `NO MEASURED VALIDATION` | Nothing in this product has been compared against lux-meter field data. The error budgets above are **self-declared model uncertainty**, not a validated accuracy figure. We say "simulation preview" and "physics estimate" because that is what it is, and on-site validation is recommended. | 이 제품의 결과를 조도계 실측 데이터와 대조한 적이 없습니다. 위 오차 예산은 **우리가 스스로 밝힌 모델 불확실성**이지, 검증된 정확도가 아닙니다. "시뮬레이션 미리보기", "물리 기반 추정"이라고 쓰는 이유가 그것이고, 현장 확인은 여전히 권장합니다. |
| `WHICH LUX, ALWAYS LABELLED` | Four lux figures with different meanings exist in the engine. **Reliable Surface Lux is a full-target 20th percentile** — not a peak, not an average. Every lux number on this site says which one it is, in the same sentence. | 의미가 다른 조도 값이 엔진 안에 네 종류 있습니다. **Reliable Surface Lux는 전체 대상 면 기준 20퍼센타일**이며, 최댓값도 평균도 아닙니다. 이 사이트의 모든 조도 수치는 같은 문장 안에서 어느 값인지 밝힙니다. |
| `FIXTURE LIGHT IS A SEPARATE LANE` | Stage and architectural fixture illuminance is stamped "estimate" in code and on screen — direct light only, no interreflection. That module is blocked from importing the projector photometry code at all, and a test checks its import list stays clean every run. A context estimate can never mix into the projector lux figure. | 무대·건축 조명의 조도는 코드와 화면 양쪽에서 "estimate"로 표기됩니다. 직접광만 계산하고 상호반사는 없습니다. 이 모듈은 프로젝터 광학 계산 코드를 아예 불러오지 못하게 막혀 있고, 임포트 목록이 깨끗한지 테스트가 매번 확인합니다. 참고용 추정치가 프로젝터 조도 값에 섞여 들어갈 수 없습니다. |
| `DIALUX-STYLE, NOT DIALUX-GRADE` | The working-plane isolux calculation is described as DIALux-*style*. It is not a certified calculation. | 작업면 등조도 계산은 "DIALux 스타일"이라고만 표현합니다. 공인 인증을 받은 계산이 아닙니다. |
| `IES CAVEAT` | Asymmetric IES files are averaged into an axially symmetric approximation, and the app says so on screen. | 비대칭 IES 파일은 축대칭 형태로 평균 내어 사용하며, 화면에도 그렇게 표시됩니다. |
| `NEVER UNDER LOAD` | This platform has never been load tested. The highest traffic we have observed is 30 requests per second. We publish the measured per-session request cost and nothing else — no uptime figure, no concurrency guarantee. | 이 시스템은 부하 테스트를 해본 적이 없습니다. 지금까지 관측된 최대 트래픽은 초당 30건입니다. 세션당 실측 요청 비용만 공개하고 그 외에는 아무것도 약속하지 않습니다. 가동률 수치도, 동시 접속 보장도 없습니다. |
| `WHAT'S IN BETA` | GDTF and MVR fixture import is code-complete but not yet checked against real vendor files. The Report Builder client-proposal PDF sits behind a beta gate and is off in deployed builds. Both are labelled that way inside the app too. | GDTF·MVR 픽스처 임포트는 코드는 완성됐지만 실제 벤더 파일로 확인하지 않았습니다. 고객 제안서용 Report Builder PDF는 베타 게이트 뒤에 있고 배포 빌드에서는 꺼져 있습니다. 둘 다 앱 안에도 같은 문구로 표시돼 있습니다. |
| `WHAT ISN'T HERE` | Drawing import and sketch-to-model are disabled in production. Realtime video output to other applications is desktop-only and its entry points are removed from the web build entirely. There is no export to a media-server-specific file format. There is no live multi-user editing, no comments and no presence — sharing is owner-authored links plus read-only account access. | 도면 임포트와 스케치 기반 모델링은 배포 빌드에서 꺼져 있습니다. 다른 프로그램으로 나가는 실시간 영상 출력은 데스크톱 전용이고, 웹 빌드에서는 진입점 자체가 제거돼 있습니다. 특정 미디어 서버 전용 파일로 내보내는 기능은 없습니다. 여러 명이 동시에 편집하는 기능, 코멘트, 접속 표시도 없습니다. 공유는 소유자가 만든 링크와 읽기 전용 계정 접근뿐입니다. |
| `SECURITY, STATED NARROWLY` | What exists: row-level security scoped to the project owner, share payloads readable only through a server-side resolver, bcrypt-hashed share passwords, IP-hashed rate limiting on share resolution, per-user storage path isolation, admin-gated operations, a 7-day grace period on account deletion, and an explicit consent record at signup. That list is the whole claim. | 있는 것만 적습니다. 프로젝트 소유자 기준 행 수준 접근 제어, 서버 함수를 통해서만 읽히는 공유 데이터, bcrypt로 해시된 공유 비밀번호, IP를 해시해서 거는 공유 조회 속도 제한, 사용자별 저장 경로 격리, 관리자 전용 운영 기능, 계정 삭제 7일 유예, 가입 시 남기는 동의 기록. 주장은 여기까지가 전부입니다. |

---

### S9 — `#videos-cta` · Three preview slots → `/videos`

`.section--pad-sm`, `.site-shell`. `.micro-label` `(00)` `FEATURE VIDEOS` / `기능 영상`.

**`.section-title`:** `WATCH THE NUMBER MOVE.`

**Body (bilingual):**

> **EN** — Short screen recordings of the shipped app, one per part, 15 to 60 seconds each. No narration, no speed-up — you watch the lux figure change when the projector moves. Two are up now; the rest go live as they are recorded.
>
> **KO** — 실제 앱 화면을 짧게 녹화한 영상입니다. 파트마다 하나씩, 각 15–60초. 내레이션도 배속도 없습니다. 프로젝터를 옮길 때 조도 값이 어떻게 바뀌는지 그대로 보시면 됩니다. 지금 2편이 올라와 있고, 나머지는 촬영되는 순서대로 열립니다.

**Three preview slots** — a `.split-3` of `.media-slot`s. Two are populated day one; the third is a designed empty state, and the copy above already says so.

| Slot | State | `data-label` | `data-caption` |
|---|---|---|---|
| 1 | `.has-media` — `viewport-walkthrough` poster | `THE SCENE` | — |
| 2 | `.has-media` — `hover-probe` poster | `THE MEASUREMENT` | — |
| 3 | empty | `THE COVERAGE` | `RECORDING · 촬영 예정` |

**CTA:** `OPEN FEATURE VIDEOS ↗` (`.btn--text`, `href="/videos"`).

---

### S10 — `#beta` · Open beta

`.section--pad-md`, `.site-shell--narrow`. `.micro-label` `(00)` `STATUS` / `현재 상태`.

**`.section-title`:** `FREE, 2 GB, AND NEVER LOAD TESTED.`

**Body (bilingual):**

> **EN** — FieldLux is in open beta and costs nothing to use. There is no pricing page because there are no paid plans yet.
>
> **KO** — FieldLux는 오픈 베타이고 사용료가 없습니다. 유료 플랜이 아직 없어서 가격 페이지도 없습니다.

**`.speclist`, three items:**

| `.speclist-index` | EN | KO |
|---|---|---|
| `(01)` `STORAGE` | 2 GB of imported-model storage per account for the beta, enforced by the database itself — the meter on screen shows the same number the storage policies enforce. 1 GiB reusable media library. 200 MB per model file, checked in the browser, in the bucket's own size limit, and again before download when a saved project is reloaded from the cloud. | 베타 기간 계정당 임포트 모델 저장 용량 2 GB이며, 데이터베이스에서 직접 막습니다. 화면에 보이는 사용량과 서버가 실제로 막는 기준이 같은 값입니다. 재사용 가능한 미디어 라이브러리는 1 GiB. 모델 파일 1개당 200 MB이고, 브라우저에서 한 번, 버킷 자체 크기 제한에서 한 번, 저장된 프로젝트를 클라우드에서 다시 불러올 때 다운로드 전에 또 한 번 확인합니다. |
| `(02)` `FOUNDING MEMBERS` | Early testers on the original invite list verify with a code and keep their standing — and 12 months' access once paid plans begin. | 초기 초대 명단에 있던 테스터는 인증 코드로 본인 확인을 하면 파운딩 멤버 자격이 그대로 이어지고, 유료 플랜이 시작되면 12개월 이용 권한을 유지합니다. |
| `(03)` `WHAT RUNS ON THE SERVER` | Moving objects, rotating projectors and changing values issue no network requests at all — no polling, no realtime subscriptions. The server is touched at four moments: cold load, sign-in, listing projects, and opening, importing or saving. A measured one-hour session is about 55 requests. | 오브젝트 이동, 프로젝터 회전, 값 변경은 네트워크 요청을 전혀 만들지 않습니다. 폴링도, 실시간 구독도 없습니다. 서버를 건드리는 지점은 네 곳입니다 — 첫 로딩, 로그인, 프로젝트 목록, 그리고 열기·임포트·저장. 실제로 한 시간 작업했을 때 요청은 약 55건이었습니다. |

---

### S11 — `#community` · Discord

`.section--pad-sm`, centred inside `.site-shell--narrow`, hairline divider above.

**`.micro-label`:** `JOIN THE DISCORD COMMUNITY` / `디스코드 커뮤니티` — use `.micro-label` without an ordinal (`.micro-label-ord` reads `(00)`).

**`.section-title`:** `SEND US THE PROJECTOR WE'RE MISSING.`

**Body (bilingual):**

> **EN** — 40 of the 87 heads in the catalogue have no manufacturer calculator to check against — all 19 Christie, all 19 Barco, and two Panasonic models the calculator does not carry. Four brands is not the whole market either. Post a spec sheet in `#catalogue` and it goes into the next catalogue build with your name on the source field. Bug reports and spec-sheet corrections go the same way.
>
> **KO** — 카탈로그에 있는 87종 가운데 40종은 대조할 제조사 계산기가 없습니다. Christie 19종 전부, Barco 19종 전부, 그리고 계산기에 없는 Panasonic 2종입니다. 브랜드 4개가 시장 전부도 아닙니다. `#catalogue` 채널에 스펙시트를 올려 주시면 다음 카탈로그에 들어가고, 출처 항목에 제보자 이름이 남습니다. 버그 제보와 스펙 정정도 같은 경로로 받습니다.

**Button:** `JOIN DISCORD ↗` — `.btn--outline`, `data-discord-link`, `target="_blank"`, `rel="noopener noreferrer"`.

**Two cleanups while rebuilding:** drop the dead `hasInvite = discordUrl !== '#'` branch (a real default exists now, so it can never be false), and remove **either** the `title` attribute **or** the CSS `::after` tooltip — both currently fire and produce a doubled tooltip on the nav link. Keep the CSS tooltip, drop the `title`.

---

### S12 — `#start` · Final CTA

`.section--pad-md`, `.site-shell--narrow`.

**`.section-title`:** `TWO FINISHED SCENES, ALREADY YOURS.`

**Body (bilingual):**

> **EN** — Sign in and open your own copy of the FieldLux Test Scene or the Play Dock Demo. Both are complete projection studies. Move a projector 300 mm and watch which numbers move with it.
>
> **KO** — 로그인하면 FieldLux Test Scene과 Play Dock Demo를 각자 사본으로 열 수 있습니다. 둘 다 완성된 프로젝션 검토 씬입니다. 프로젝터를 300 mm만 옮겨 보고 어떤 값이 같이 움직이는지 보십시오.

**Buttons:** `START FREE` (`.btn--solid`, `data-app-link`) · `WATCH FEATURE VIDEOS ↗` (`.btn--text`, `/videos`).

---

### S13 — Footer

`.site-footer`, `--paper` ground, `1px solid var(--line)` top rule, `--pad-sm`, left-aligned.

```
FieldLux                            ← .brand-lockup-img (logo-ink.png)

WE'RE BUILDING THIS WITH THE        ← .footer-lead, --fs-display-3
PEOPLE WHO RIG IT.
현장에서 실제로 매다는 사람들과 같이 만듭니다.

hello    jay@field-lux.com
links    Privacy · Feature videos · Discord
meta     © 2026 FieldLux · Open beta          [Reduce motion]
```

| Link | href | Note |
|---|---|---|
| Privacy | `/privacy` | **not** `/privacy.html` — the current link eats a 308 via `cleanUrls` |
| Feature videos | `/videos` | |
| Discord | `data-discord-link` | allowlisted hostnames only |
| Email | `mailto:jay@field-lux.com` | |

`.motion-toggle` lives in `.footer-meta` (§5.9). It is present on **all three pages**.

---

## 7. `/videos` — the feature-video page

### 7.1 Routing — no `vercel.json` rule needed

| Item | Value |
|---|---|
| Source file | `/Users/jaylee/Documents/fieldlux-site-0814/videos.html` (repo root, sibling of `index.html`) |
| Public URL | `https://field-lux.com/videos` |
| Canonical | `https://field-lux.com/videos` |
| Nav label | `Videos`, `aria-label="Feature videos"`, `aria-current="page"` on this page |

`outputDirectory: "."` makes the repo root the deploy root, so a root-level `videos.html` is served with no rewrite. `cleanUrls: true` then serves it at `/videos` and 308-redirects `/videos.html`; `trailingSlash: false` 308s `/videos/`. All three spellings resolve to one canonical URL. **Link it as `/videos`.**

**Blocking prerequisite:** change `tailwind.config.js` `content` to `['./*.html', './src/**/*.{html,js}']` **before** writing any markup for this page. The current globs name `index.html` and `privacy.html` explicitly and would purge every utility class here, shipping the page unstyled.

The header on `videos.html` is a byte-identical copy of the redesigned `index.html` header, except `aria-current="page"` on the Videos link and anchor links that point back at `/#product`, `/#measure`, `/#limits`.

### 7.2 Page structure

| # | Section | Content |
|---|---|---|
| V1 | `.video-hero` | Compact masthead, ~52vh, no monitor, no hero video |
| V2 | `.filter-rail` | Sticky below the header: chapter chips + an `Available now` toggle |
| V3 | `.video-chapter` × 10 | One block per chapter, sticky chapter head, card grid |
| V4 | `#start` | Final CTA: `START FREE` + `BACK TO THE PRODUCT ↗` |
| V5 | footer | The shared footer, `.motion-toggle` included |

**V1 copy:**

- `.micro-label`: `(00)` `FEATURE VIDEOS` / `기능 영상`
- `.video-hero-title`: `SEE EVERY TOOL DO ITS ACTUAL JOB.`
- KO sub: 기능마다 짧은 영상 하나씩, 실제 앱 화면 그대로.
- Body EN: Every part of the product gets a short screen recording of the shipped app. Chapters fill in as the footage is recorded — the empty slots are honest, not decorative.
- Body KO: 제품의 각 파트마다 실제 앱 화면을 짧게 녹화해 올립니다. 촬영이 끝나는 순서대로 채워지고, 비어 있는 칸은 장식이 아니라 아직 안 찍었다는 뜻입니다.
- `.pub-progress`: `2 of 43 published` / `43개 중 2개 공개`, with `.pub-progress-bar` filled to the ratio in `--brand-500`.

**Progress counters are computed from the DOM at boot, not discovered by lazy image loads.** An earlier draft derived liveness from poster `load` events; below-the-fold posters have not loaded yet, so the counts would be wrong until the reader scrolled the whole page and wrong forever with JS off. Liveness is **authored in markup** via `.has-media` (§7.5); the script counts `.video-card:not(.video-card--pending)` at boot and writes the totals.

**V2 — the filter rail.** Ten chapter chips plus `All 43` plus an `Available now` toggle. All are `<button type="button" aria-pressed>` — **not** `role="tab"`. Clicking a chapter chip sets `data-active-chapter` on the grid container (CSS attribute selectors hide non-matching `.video-chapter`s) and writes `?c=ch-blend` with `history.replaceState` so a chapter is linkable. On load `?c=` is read and applied. `Available now` is independent and combinable; it is `disabled` when zero cards are live. A visually-hidden `.filter-result-sr` with `aria-live="polite"` announces the result count.

The rail scrolls horizontally on mobile with `scroll-snap-type: x proximity` and no visible scrollbar.

**V3 — chapter block.** `.video-chapter-head` is `position: sticky` while its cards scroll past:

```
──────────────────────────────────────────────────────
(03)  THE COVERAGE                    5 videos · 0 published
      커버리지
      Many heads, one continuous image.
──────────────────────────────────────────────────────
```

Chapter blocks with zero live cards **still render in full**, showing `0 / 5 published`. Hiding them would silently amputate a chapter of the product story. Only the `Available now` toggle collapses them.

**Grid — corrected math:**

```css
.video-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(min(420px,100%), 1fr));
  gap:clamp(32px,4vw,56px) var(--gap);
}
@media (max-width:860px){ .video-grid{ grid-template-columns:1fr; } }
```

An earlier draft used `minmax(340px, 1fr)` with `gap: 40px 24px` and claimed 3-up; inside `--w-page: 1440px` that yields **four** columns (4 × 340 + 3 × 24 = 1432). It also hard-coded a 760 px collapse against the site's fixed 860 px breakpoint. Both are fixed above.

`.video-card-media` uses `--media-ratio: 1918 / 942` by default (the app-window capture ratio), overridden per card where the source differs. It is **not** 16:9 — forcing the 2.036:1 captures into a 16:9 frame letterboxes or crops the UI.

### 7.3 The video slot table — 43 slots, 2 published at launch

**Naming rule — the whole upload workflow depends on it:** the file basename **is** the slug, exactly. Lowercase ASCII, hyphens only. No spaces, no underscores, no Korean, no `v2` / `final` / `_new`. Files live flat in `assets/media/features/`. Every row means **two** files: `<slug>.mp4` and `<slug>.jpg`.

`P` = shooting priority. `▣` = flagged demo-worthy in the verified feature inventory. `▢` = editorial addition (shipped, strong on video, not flagged).

#### `ch-scene` — (01) THE SCENE · 4 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| **LIVE** | ▢ | `viewport-walkthrough` | Placing projectors in a scene / 씬에 프로젝터 배치하기 | A walk through the viewport: placing heads, picking a lens, watching the beam land. | 뷰포트를 한 바퀴 돌아봅니다. 프로젝터를 놓고, 렌즈를 고르고, 빔이 어디에 닿는지 봅니다. | 51s |
| P1 | ▣ | `walk-mode` | Interior walk mode / 실내 워크 모드 | Press G and walk the venue in first person. Speed re-samples the scene bounds, so a 10 m studio and a kilometre-wide site both feel right. | G 키로 1인칭 워크 모드에 들어갑니다. 씬 크기를 다시 재서 속도를 맞추기 때문에 10 m 스튜디오와 km 단위 부지가 둘 다 자연스럽습니다. | 45s |
| P2 | ▢ | `model-import-units` | Import a venue, units and axis solved / 모델 임포트 — 단위·축 자동 판별 | Six formats. Units read from the file's own metadata, up-axis detected, with a manual override as the deterministic fallback. | 여섯 가지 포맷을 읽습니다. 단위는 파일 메타데이터에서 가져오고 업축을 판별하며, 안 되면 수동 전환으로 확정합니다. | 60s |
| P3 | ▢ | `scene-layers-isolate` | Scene Layers and isolate / 씬 레이어와 아이솔레이트 | The DCC-authored hierarchy arrives intact — per-node hide, lock, material override, sub-layer isolate on a 2,020-mesh model. | DCC에서 짠 계층이 그대로 들어옵니다. 메시 2,020개짜리 모델에서 노드별 숨김·잠금·재질 오버라이드·하위 레이어 아이솔레이트를 합니다. | 40s |

#### `ch-optics` — (02) THE OPTICS · 4 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P1 | ▣ | `throw-and-shift` | Live throw ratio and lens shift / 투사비와 렌즈 시프트 실시간 | Drag the throw slider inside the lens's real range and watch beam size, axial distance, Center Surface Lux and mm/px move together. | 렌즈의 실제 범위 안에서 투사비 슬라이더를 움직이면 빔 크기, 축 방향 거리, 중앙 표면 조도, mm/px가 함께 갱신됩니다. | 45s |
| P1 | ▢ | `catalog-official-check` | Catalogue and official cross-check / 카탈로그와 공식 계산기 대조 | 87 projectors and 113 lenses across four brands — and 642 combinations that compute from Panasonic TDC and Epson PTDS formulas. Christie and Barco carry no cross-check, and the app says so. | 네 개 브랜드의 프로젝터 87종, 렌즈 113종. 그중 642개 조합은 Panasonic TDC·Epson PTDS 공식으로 계산합니다. Christie와 Barco는 교차검증이 없고, 앱이 그렇게 표시합니다. | 60s |
| P2 | ▢ | `out-of-spec` | The out-of-spec refusal / 사양 밖이면 거부합니다 | Place a head outside its throw envelope and the readouts reskin to a struck-through diagnostic block stating the values are not achievable. | 투사 거리 범위를 벗어난 곳에 놓으면, 수치에 취소선이 그어진 진단 블록으로 바뀌면서 그 값은 낼 수 없다고 적습니다. | 30s |
| P2 | ▣ | `projector-arrays` | Linear, circular and mirrored arrays / 선형·원형·대칭 어레이 | Generate a 12-head ring on a radius with a shared aim target, then edit radius or count and watch every member re-solve. | 반경과 공통 조준점으로 12대 링을 만든 뒤, 반경이나 개수를 바꾸면 전체가 다시 풀립니다. | 50s |

#### `ch-blend` — (03) THE COVERAGE · 5 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P1 | ▣ | `auto-edge-blend` | Auto edge blend detection / 자동 엣지 블렌드 검출 | Measures every head's real footprint against the target and writes the per-edge overlap widths and the blend curve itself — in one undo step. | 프로젝터마다 실제로 빛이 닿는 영역을 재서, 엣지별 겹침 폭과 블렌드 커브를 직접 써 넣습니다. 되돌리기 한 번이면 전부 취소됩니다. | 45s |
| P1 | ▣ | `quick-wrap` | Quick Wrap — regions from where the light lands / 퀵 랩 — 빛이 닿는 곳에서 영역 찾기 | Aim the heads and regions appear from the beams themselves. Pick a video, Apply. Hover an output to isolate its beam in 3D. | 프로젝터를 조준하면 빔이 닿는 자리에서 영역이 나타납니다. 영상을 고르고 적용합니다. 출력에 마우스를 올리면 그 빔만 분리됩니다. | 60s |
| P1 | ▣ | `canvas-sets` | Canvas Sets — one video across many surfaces / 캔버스 세트 — 하나의 영상을 여러 면에 | Walls, floor and ceiling take crops of one master canvas. A blend group is one flat plane by design; continuity across faces is a set. | 벽, 바닥, 천장이 마스터 캔버스 하나를 나눠 갖습니다. 블렌드 그룹은 설계상 평면 하나여서, 면을 넘는 연속성은 세트로 만듭니다. | 60s |
| P3 | ▣ | `dome-blend` | Dome and curved blend measurement / 돔·곡면 블렌드 실측 | An image-UV grid is raycast onto the real mesh and feather widths come from measured penetration depth. Planar maths saturates on a hemisphere. | 이미지 UV 격자를 실제 메시에 레이캐스트하고, 실측한 침투 깊이에서 페더 폭을 뽑습니다. 반구에서는 평면 계산이 자기 제한값에 걸립니다. | 45s |
| P3 | ▣ | `plane-picker` | Three clicks define a canvas plane / 3클릭 평면 지정 | Click three points on the geometry instead of typing eight Euler and dimension values into narrow fields. | 좁은 입력란에 오일러각과 치수 여덟 개를 치는 대신, 형상 위 세 점을 클릭합니다. | 30s |

#### `ch-warp` — (04) THE CORRECTION · 4 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P2 | ▣ | `corner-pin` | Corner-pin keystone, live in the 3D beam / 코너핀 키스톤, 3D 빔에 실시간 | The homography goes in as shader uniforms, so the corrected image renders in the actual beam — not only in a 2D panel. | 호모그래피가 셰이더 유니폼으로 들어가서, 보정된 화면이 2D 패널이 아니라 실제 빔에 렌더링됩니다. | 40s |
| P2 | ▣ | `mesh-warp-masks` | Mesh warp and feathered masks / 메시 워프와 페더 마스크 | Subdividable grids with a Spherize control for domes, plus click-drawn masks that cut the real beam. Up to 16 heads. | 세분화 가능한 그리드에 돔용 Spherize, 그리고 클릭으로 그리는 마스크가 실제 빔을 잘라냅니다. 최대 16대. | 50s |
| P3 | ▣ | `soft-edge-authoring` | Per-edge soft edge, live feedback / 엣지별 소프트엣지 실시간 | Drag a blend width and the seam softens in the viewport as you drag. Auto derives all widths from measured overlaps. | 블렌드 폭을 끄는 동안 뷰포트의 이음매가 같이 부드러워집니다. Auto는 실측한 겹침에서 전체 폭을 뽑습니다. | 40s |
| P2 | ▣ | `calibration-patterns` | Live calibration patterns per output / 출력별 캘리브레이션 패턴 | Throw a grid from one head in the real beam, set the blend and mask, drop back to content — with zero undo entries. | 한 대에서 실제 빔으로 그리드를 쏘고, 블렌드와 마스크를 잡고, 콘텐츠로 복귀합니다. 되돌리기 기록이 남지 않습니다. | 35s |

#### `ch-content` — (05) THE CONTENT · 3 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P2 | ▣ | `mapping-stage` | Mapping Stage — 2D canvas, 3D beams / 매핑 스테이지 — 2D 캔버스, 3D 빔 | Drag the canvas quad in 2D and the beams follow in 3D. Regions outside the canvas render as hatched no-content zones. | 2D에서 캔버스를 끌면 3D 빔이 따라옵니다. 캔버스 밖 영역은 빗금 친 '콘텐츠 없음' 구역으로 그려집니다. | 55s |
| P2 | ▣ | `media-drop` | Drag media onto a surface / 미디어를 면에 끌어다 놓기 | Drop a media chip into the viewport; the cursor ray resolves against the scene's canonical faces and commits in one batch. | 미디어 칩을 뷰포트로 끌어다 놓으면, 커서 광선이 씬의 기준 면을 찾아 한 번에 적용합니다. | 35s |
| P3 | ▢ | `content-slot-budget` | The loud refusal / 명시적인 거부 | Four distinct content sources is the GPU budget. A drop that would exceed it is refused explicitly, before any write. | GPU 예산은 서로 다른 콘텐츠 소스 4개입니다. 예산을 넘기는 드롭은 아무것도 쓰기 전에 명시적으로 거부됩니다. | 25s |

#### `ch-measure` — (06) THE MEASUREMENT · 5 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| **LIVE** | ▣ | `hover-probe` | Lux and mm/px under the cursor / 커서 지점의 조도와 mm/px | The whole surface becomes a light meter — illuminance, luminance and pixel density at the exact point, every contributing head summed. | 표면 전체가 조도계가 됩니다. 그 지점의 조도, 휘도, 픽셀 밀도를 기여하는 프로젝터 전부 합산해 보여 줍니다. | 16s |
| P1 | ▣ | `heatmap-modes` | Three map modes, three scales / 세 가지 맵 모드, 세 가지 스케일 | Surface lux, pixel density and luminance — each in absolute, normalized-to-reference and deviation-from-reference. | 표면 조도, 픽셀 밀도, 휘도를 절대값·기준값 정규화·기준값 편차 세 가지 스케일로 봅니다. | 50s |
| P1 | ▣ | `distribution-13pt` | 13-point distribution, live / 13포인트 분포 실시간 | Nine ANSI points plus four quarter-points drawn on the surface in world space, recomputing as the projector is dragged. | ANSI 9점에 사분점 4개를 더해 표면 위 월드 좌표로 그립니다. 프로젝터를 끄는 동안 다시 계산됩니다. | 50s |
| P3 | ▣ | `lens-view` | Lens View camera snap / 렌즈 뷰 카메라 정렬 | One click frames the camera along a head's optical axis, fitted to the probe bounds. Uniformity reads differently head-on. | 클릭 한 번으로 카메라가 그 프로젝터의 광축에 정렬되고 프로브 범위에 맞춰집니다. 정면에서 보면 균일도가 달리 읽힙니다. | 25s |
| P3 | ▣ | `measure-snap` | Measure tool with multi-source snapping / 다중 스냅 측정 툴 | Snaps to vertices, bounding boxes, model centres, projector bodies and beam-origin points — the last one is the real throw distance. | 정점, 바운딩 박스, 모델 중심, 프로젝터 본체, 그리고 빔 출사점에 스냅합니다. 마지막이 실제 투사 거리입니다. | 40s |

#### `ch-render` — (07) THE LIGHT · 3 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P1 | ▣ | `additive-light` | Light behaves like light / 빛이 빛처럼 동작합니다 | Projector light composites additively onto the surface's own shading — a white beam brightens a dark wall, a black frame adds nothing. | 프로젝터 빛이 그 면의 음영 위에 가산 합성됩니다. 흰 빔은 어두운 벽을 밝히고, 검은 프레임은 아무것도 더하지 않습니다. | 40s |
| P2 | ▣ | `depth-occlusion` | Occlusion and projector shadows / 오클루전과 프로젝터 그림자 | Each head renders its own depth map, so objects block the beam and cast real shadows — and the CPU sampling path mirrors it. | 프로젝터마다 뎁스맵을 렌더링해서 물체가 빔을 막고 실제 그림자를 만듭니다. CPU 샘플링 경로도 같은 결과를 씁니다. | 40s |
| P2 | ▣ | `ambient-contrast` | Ambient presets and contrast ratio / 주변광 프리셋과 명암비 | From 100,000 lx direct sun to full blackout, with a live chip rating the result Optimal through Not viable. | 직사광 100,000 lx부터 완전 암전까지. 결과를 Optimal부터 Not viable까지로 평가하는 칩이 함께 뜹니다. | 35s |

#### `ch-lighting` — (08) THE ROOM AROUND IT · 3 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P2 | ▣ | `isolux-working-plane` | DIALux-style isolux working plane / DIALux 스타일 등조도 작업면 | Eavg, Emin, Emax and uniformity drawn as a false-colour plane with contour lines in the same 3D scene. Labelled an estimate. | Eavg·Emin·Emax와 균일도를 등조도선이 있는 컬러 면으로 같은 3D 씬에 그립니다. 추정치로 표기됩니다. | 45s |
| P3 | ▢ | `ies-import` | IES photometric import / IES 광도 파일 임포트 | A manufacturer `.ies` file drives the beam cookie and the illuminance estimate from the same curve, so they cannot disagree. | 제조사 `.ies` 파일 하나가 빔 쿠키와 조도 추정값을 같은 곡선으로 몰기 때문에 둘이 어긋날 수 없습니다. | 35s |
| P3 | ▢ | `led-wall-spill` | LED wall spill and washout risk / LED 월 스필과 워시아웃 위험 | Model the wall's own emission from a real cabinet profile and get contrast before and after, contrast drop, and a washout risk rating. | 실제 캐비닛 프로파일로 LED 월의 발광을 모델링해서 적용 전후 명암비, 저하율, 워시아웃 위험도를 냅니다. | 40s |

#### `ch-deliver` — (09) THE DELIVERABLE · 7 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P1 | ▣ | `pdf-tech-rider` | One-click PDF Tech Rider / 원클릭 PDF 테크 라이더 | Viewport capture with its matching legend, project setup, then one page per projector — equipment, lens, position, optical distances, surface sampling. | 뷰포트 캡처와 범례, 프로젝트 설정, 그리고 프로젝터 1대당 1페이지 — 장비, 렌즈, 위치, 광학 거리, 표면 샘플링. | 45s |
| P2 | ▢ | `handoff-json` | Neutral handoff JSON / 벤더 중립 핸드오프 JSON | A versioned file declaring its coordinate system, then every projector's optics, every target's plane basis, blend groups and per-edge blends. | 좌표계를 선언하는 버전 관리된 파일. 이어서 프로젝터별 광학, 대상별 평면 기준, 블렌드 그룹과 엣지별 블렌드가 들어갑니다. | 30s |
| P1 | ▣ | `share-link` | A read-only link, no account needed / 계정 없이 열리는 읽기 전용 링크 | Publish the scene as a viewer URL with studio branding and a QR code. The TD, the producer and the rental house all see the same plan. | 스튜디오 브랜딩과 QR이 붙은 뷰어 주소로 씬을 게시합니다. 기술감독, 제작사, 렌탈사가 같은 계획을 봅니다. | 50s |
| P2 | ▣ | `share-capabilities` | Decide what the recipient can do / 링크별 수신자 권한 | Per link: measurements, layers, display panel, PDF download, walk mode, zoom. Hidden measurements are stripped from the payload, not the UI. | 링크마다 측정값, 레이어, 디스플레이 패널, PDF 다운로드, 워크 모드, 줌을 각각 정합니다. 숨긴 측정값은 화면이 아니라 전송 데이터에서 빠집니다. | 40s |
| P2 | ▣ | `share-receipt` | A dated receipt, not a live mirror / 날짜가 박힌 리시트 | The link is pinned to the version it was published from. Editing later cannot rewrite what the client was shown. | 링크는 게시 시점 버전에 고정됩니다. 이후에 고쳐도 고객이 본 내용은 바뀌지 않습니다. | 40s |
| P2 | ▣ | `share-whatif` | Bounded what-if inside the viewer / 뷰어 안의 제한된 What-if | The client drags a throw slider clamped to that lens's catalogue range; beam, heatmap and spec sheet recompute. Nothing is saved. | 고객이 그 렌즈의 카탈로그 범위로 제한된 투사비 슬라이더를 움직이면 빔, 히트맵, 사양표가 다시 계산됩니다. 저장되지 않습니다. | 40s |
| P3 | ▣ | `share-management` | Extend, revoke, destroy / 연장·해지·삭제 | Every link in one list with countdown chips. Revoke stops it resolving immediately. Files already downloaded stay downloaded — the bucket is public. | 모든 링크를 남은 기간 칩과 함께 한 목록에서 봅니다. 해지하면 즉시 열람이 끊깁니다. 이미 받아 간 파일은 그대로 남습니다. 버킷이 공개이기 때문입니다. | 35s |

#### `ch-project` — (10) THE PROJECT · 3 slots

| P | | Slug | Title EN / KO | Desc EN | Desc KO | Len |
|---|---|---|---|---|---|---|
| P2 | ▣ | `project-home` | Project Home and sample scenes / 프로젝트 홈과 샘플 씬 | Land on your saved projects, not an empty editor — with two sample scenes seeded as your own private copy on first click. | 빈 에디터가 아니라 저장된 프로젝트로 들어갑니다. 샘플 씬 두 개는 첫 클릭 때 개인 사본으로 만들어집니다. | 35s |
| P3 | ▣ | `version-restore` | Non-destructive roll-forward restore / 비파괴 롤포워드 복원 | Restoring an old version checkpoints your current edits first, then saves the old state as a new latest version. Nothing is deleted. | 예전 버전을 복원하면 현재 편집분을 먼저 별도 버전으로 남기고, 예전 상태를 새 최신 버전으로 저장합니다. 지워지는 건 없습니다. | 40s |
| P3 | ▣ | `crash-recovery` | Crash draft and same-tab resume / 크래시 드래프트와 동일 탭 복귀 | Every edit debounces a local draft, flushed on tab close. Refresh the tab you were working in and you land back in the project. | 편집할 때마다 로컬 드래프트가 쌓이고 탭을 닫을 때 확정됩니다. 작업하던 탭을 새로고침하면 그 프로젝트로 돌아옵니다. | 35s |

**Total: 43 slots — 6 + 4 + 5 + 4 + 3 + 5 + 3 + 3 + 7 + 3. `viewport-walkthrough` and `hover-probe` are live at launch; 39 are pending.**

#### Deliberately excluded — do not create slots for these

Not shootable as shipped-product footage: **the verdict / stress / prescription / per-wall / seam-risk / audience-coverage / manual-calibration lane** (§1.2a — no mount point), **Report Builder** (beta-gated off in production), **DXF as a named format** (the app hides it from every advertised surface, so a clip that names it would advertise what the picker refuses to offer), **realtime output to other applications** (desktop-only, entry points removed from the web build), **automatic keystone correction** (readout only, no shader consumer), **transmission and shadow heatmap modes** (hidden from both selectors), **fog** (NO LONGER a placeholder: volumetric beams are prod-ON since 2026-09-05 and a Fog Machine is creatable from the app menu, so this IS shootable. The Haze Machine row was removed on 2026-09-05; write "Fog Machine" only). **GDTF/MVR** is mentioned in Ch 08 copy as beta but gets no video slot until it is validated. If the owner records any of these, the card must not ship.

### 7.4 The empty state

**Governing idea: this page is a feature index first and a video library second.** The description copy is the payload. A card with no video is a fully-formed index entry, so the page is complete-looking at zero uploads and simply gains motion as clips land. That is what makes the empty state read as intentional rather than broken.

A pending card carries everything a live card carries — chapter tag, EN title, KO title, both descriptions, planned duration. Only the media block differs: `.media-slot` **without** `.has-media`, which renders the dashed `--surface-100` state with `data-label` (the video title, uppercased) and `data-caption="RECORDING · 촬영 예정"`.

**One caption string, site-wide: `RECORDING · 촬영 예정`.** Earlier drafts used three different strings; this is the only one.

Rules that exist to stop the card promising something it cannot do:

- **No play triangle, no spinner, no broken-image glyph, no grey rectangle.** A play affordance on a card that cannot play is what reads as broken.
- Duration is prefixed `≈` (`.video-card-duration--planned`, 60 % opacity). It is a plan, not a fact.
- The `.video-card-link` is a `<span aria-disabled="true">` with `cursor: default`, no hover lift, no border change. The descriptive copy sits **outside** the link in `.video-card-body`, so it stays in the reading order and in the accessibility tree.
- Copy is at **full opacity**. Dimming says "degraded"; full-strength text says "documented, footage pending".
- Pending cards never create a `<video>` element.

**How the page degrades:**

| Condition | Behaviour |
|---|---|
| 0 videos published | The page renders as a complete bilingual feature index. The masthead reads `43 features documented · footage in production` instead of a ratio. `Available now` is `disabled`. |
| Some published | `2 of 43 published / 43개 중 2개 공개` plus a thin `--brand-500` rule filled to the ratio. Absence becomes visible progress. |
| Within a chapter | Live cards sort ahead of pending cards **inside their chapter only**. Chapter order never changes, so the top-to-bottom product explanation stays intact. |
| Chapter with 0 live | Renders in full, header shows `0 / 5 published`. Never hidden. |
| `Available now` ON | Chapters with no live cards collapse out, giving a fully-populated page in one click. |
| Filter yields 0 | Cannot happen — chapter chips only exist for chapters that have slots, and `Available now` is disabled at zero. |
| Poster present, mp4 404s | The `<video>` `error` event reverts the card to pending in place and logs once. The user sees a card that never claimed to be playable. |
| JS disabled | The index renders correctly and completely. Liveness is authored in markup, not discovered. |

### 7.5 Owner upload workflow

**The whole workflow:**

1. Record the clip.
2. Run the encode command.
3. Run the poster command.
4. Drop both files in `assets/media/features/`.
5. Add `.has-media` to that card's `.video-card-media` and remove `.video-card--pending` from the `<article>` — **two class edits, no new markup.**
6. Commit, push.

Step 5 is a deliberate two-word edit rather than a runtime probe. Authoring liveness in markup is what makes the publication counters correct with JS off and correct before any image loads (§7.2).

**Naming rules — the only thing that can go wrong:**

- Basename **must** equal the slug in §7.3, exactly.
- Lowercase ASCII, hyphens. No spaces, underscores, Korean, or version suffixes.
- Both files required. To replace a clip, **overwrite the same two filenames** — never add `v2`.

**Encode:**

```bash
# Video — screen capture, no audio, web-optimised
ffmpeg -i RAW.mov \
  -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -crf 21 -preset slow \
  -g 60 -keyint_min 60 -sc_threshold 0 \
  -maxrate 6M -bufsize 12M \
  -vf "fps=30" \
  -an -movflags +faststart \
  assets/media/features/<slug>.mp4
```

| Setting | Value | Why |
|---|---|---|
| Container / codec | MP4 / H.264 High @ L4.1, `yuv420p` | Universal. HEVC and AV1 both have desktop-browser holes. |
| **Faststart** | `-movflags +faststart` — **mandatory** | Moves `moov` ahead of `mdat` so playback starts before the file finishes. Without it hover previews stall. The app itself warns users about non-faststart mp4; the site must not ship the mistake it diagnoses. |
| **No rescale** | omit any `scale=` filter | The source is already 1918 or 1912 wide. Rescaling only softens UI text. `-vf "fps=30"` alone. |
| Frame rate | 30 fps — **60 fps for drag-response clips** | Use 60 for `throw-and-shift`, `mapping-stage`, `soft-edge-authoring`, `distribution-13pt`. The point of those clips is latency, and 30 fps flattens it. Bump `-crf` to 23 at 60. |
| Quality | CRF 21, `-preset slow`, cap 6 Mbps | Flat UI regions compress hard; typical result 2–4 Mbps. |
| Keyframes | `-g 60` (2 s) | Responsive seeking in the lightbox. |
| **Audio** | **stripped (`-an`)** | Every preview is muted; audio inflates the file and creates an autoplay-policy hazard. |
| Duration | per the `Len` column, hard cap 90 s | |
| Size | target ≤ 12 MB, **hard cap 25 MB** | |
| Capture | 1920 × 1080 window; **hide the OS cursor unless the clip is about pointing** (`hover-probe`, `media-drop`, `plane-picker`, `measure-snap`, `mapping-stage` keep it). Clean scene, no client project names in the outliner. | |

**Poster:**

```bash
ffmpeg -ss 00:00:01.5 -i assets/media/features/<slug>.mp4 \
  -frames:v 1 -q:v 4 assets/media/features/<slug>.jpg

# batch: a poster for every mp4 that lacks one
for f in assets/media/features/*.mp4; do
  [ -f "${f%.mp4}.jpg" ] || ffmpeg -y -ss 1.5 -i "$f" -frames:v 1 -q:v 4 "${f%.mp4}.jpg"
done
```

JPEG at the source resolution (1918 × 942 or 1912 × 942), q ≈ 4, ≤ 200 KB. Take it at ~1.5 s, never frame 0 — frame 0 is usually mid-transition or black.

**Optional `assets/media/features/manifest.json`** — not required for a video to appear, only for extras the filesystem cannot express. Fetched once; a missing file is caught and ignored.

```json
{ "auto-edge-blend": { "duration": 44, "badge": "new" } }
```

### 7.6 Player behaviour

**Click → lightbox.** One `#video-lightbox` in the DOM, `role="dialog" aria-modal="true"`, `hidden` by default, using the shared overlay system in §5.8.

- Click injects `<video controls playsinline>` with the slug's source into `.video-lightbox__player`, sets `aria-labelledby` to `.video-lightbox__title`, opens, and moves focus to `.video-lightbox__close`.
- `preload` is chosen at inject time: `'none'` when `navigator.connection?.saveData` or `effectiveType` includes `2g`, otherwise `'metadata'`.
- `autoplay` is applied **only** when motion is allowed (§5.9). Under reduced motion the user presses play. Playback is user-initiated so this is a courtesy, not a requirement — but a modal that starts moving under `prefers-reduced-motion` is still wrong.
- Close via the button, backdrop click, or Escape. On close: `pause()`, `removeAttribute('src')`, `load()` to release the decoder, empty the panel, **return focus to the `.video-card-link` that opened it**.
- The panel shows the EN title, KO title, both descriptions and the chapter tag beneath the player, so the modal is readable content, not a black box.
- `←` / `→` step to the previous/next **live** card within the current filter without closing. Pending cards are skipped.

**Hover preview.** Muted inline preview, gated on **all** of:

```js
const canPreview =
     matchMedia('(hover: hover) and (pointer: fine)').matches
  && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && document.documentElement.dataset.motion !== 'off'
  && navigator.connection?.saveData !== true;
```

- **180 ms intent delay** before the `<video class="video-card-preview">` is created, so a pointer sweeping the grid does not fire eight decoders.
- Attributes: `muted playsinline loop preload="none"`, no controls. Set `muted` as a **property before `play()`**, not only as an attribute, or Safari refuses.
- **Exactly one preview alive at a time** — a module-level `currentPreview`; starting a new one tears the old one down (`pause()`, `removeAttribute('src')`, `load()`, remove node).
- On `mouseleave` / `blur`: teardown, poster returns. Previews always restart at t=0, so the loop is a consistent impression rather than a random midpoint.
- `error` → revert the card to pending. This is the guard for poster-present / mp4-missing.
- `:focus-visible` on a live `.video-card-link` starts the same preview with the same delay and the same gates.

**Captions — decided.** An earlier draft mandated `<track kind="captions">` in KO **and** EN on every player and said to ship the page with placeholders rather than uncaptioned video. That is wrong on the facts and would have blocked shipping the only two clips that exist: **these are silent screen recordings** — the encode strips audio with `-an`. WCAG 1.2.2 governs audio in synchronised media; there is no audio, so there is nothing to caption.

**The rule instead:** every card carries a `<figcaption>`-equivalent — the `.video-card-desc` / `.video-card-desc-ko` pair — stating in prose what the clip shows and what changes on screen, and the lightbox player takes its accessible name via `aria-labelledby` from `.video-lightbox__title`. Add real `<track>` elements only if a clip ever ships with narration. **Ship the two clips on day one.**

**Mobile.**

| Condition | Behaviour |
|---|---|
| `(pointer: coarse)` | **No hover previews at all.** Tap opens the lightbox. |
| ≤860 px | Grid one column; card media keeps its `--media-ratio`. |
| Lightbox on mobile | Full-width sheet, panel `max-block-size: 92svh`, native controls, `overscroll-behavior: contain`. |
| iOS | `playsinline` mandatory or Safari hijacks to fullscreen on play. |
| Any mobile | `preload="none"` regardless of manifest — nothing downloads until an explicit tap. |
| Posters | `sizes="(max-width:860px) 100vw, (max-width:1200px) 50vw, 33vw"` so phones do not pull a 1918 px JPEG. |

### 7.7 `/videos` head and meta

```html
<title>Feature videos — every FieldLux tool, in the shipped app | FieldLux</title>
<meta name="description" content="Short explainer videos for each FieldLux feature: projector optics, edge blending, warp and masks, lux heatmaps, 13-point diagnostics, and read-only client sharing.">
<link rel="canonical" href="https://field-lux.com/videos">
<meta name="robots" content="index, follow, max-image-preview:large, max-video-preview:-1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="FieldLux">
<meta property="og:title" content="FieldLux feature videos">
<meta property="og:description" content="One short clip per feature, recorded in the shipped app.">
<meta property="og:url" content="https://field-lux.com/videos">
<meta property="og:image" content="https://field-lux.com/assets/og-videos.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="FieldLux feature videos">
<meta name="twitter:image" content="https://field-lux.com/assets/og-videos.png">
```

`<html lang="en">` with `lang="ko"` on every Korean node. **No `hreflang`** — one URL carrying two languages inline; `hreflang` would be wrong here and would fragment the page's authority.

**Structured data — honesty constraint.** Emit `ItemList` → `VideoObject` **only for videos that actually exist**. A `VideoObject` whose `contentUrl` 404s is a Search Console error and, more to the point, a claim the site cannot back — the exact failure mode this product argues against.

Because liveness is authored in markup (§7.5), the JSON-LD is authored the same way: a static `<script type="application/ld+json">` block that the owner extends by five lines per upload, in the same commit as the two class edits. Each entry needs `name`, `description`, `thumbnailUrl`, `contentUrl`, `uploadDate`, `duration` (ISO-8601, e.g. `PT45S`). Pending slots emit nothing.

**Performance budget.** Preload the first three posters (`<link rel="preload" as="image">`); everything else `loading="lazy" decoding="async"`. **No video bytes on load** — the first video request happens on hover intent or tap. `aspect-ratio` on `.video-card-media` reserves the space, so poster loads cause zero CLS.

---

## 8. Assets

### 8.1 What exists today (verified on disk, 2026-08-14)

**Brand — `assets/`**

| File | Size | Dimensions | Verdict |
|---|---|---|---|
| `logo-ink.png` | 105,977 B | 770 × 224 | **USE THIS.** Cyan hex-F mark + **near-black wordmark** on transparent (decoded: wordmark pixels average luminance 11.1, sample `#0B0B0B`). This is the header, footer and OG lockup. |
| `logo.png` | 104,563 B | 770 × 224 | White wordmark variant (luminance 252.2). **Do not use on the white site.** Keep for dark contexts. |
| `logo-mark.png` | 46,230 B | 384 × 359 | Mark only, cyan gradient. Used as the `.monitor-logo` CSS mask and the favicon source. Byte-identical to the app's own `public/fieldlux-logo-mark.png`. |
| `logo-mark-t.png` | 52,176 B | 384 × 359 | Trimmed mark variant. Not referenced by this build; leave in place. |

Brand colours sampled from the mark match the brief: `#3FD3DF` light cyan, `#20D5DE` / `#00B1C4` mid, `#006E87` deep teal, `#020102` ink.

**Media — `assets/media/`** (total ≈ 97.8 MB — this is a ship-gate problem, see §8.3)

| File | Size | Dimensions | Duration | Fate |
|---|---|---|---|---|
| `media-01-hero.mp4` | 37.4 MB | 1918 × 942 | 37.7 s | **→ hero.** Currently orphaned. Caption-free. Re-encode + trim (§8.3). |
| `software-demo.mp4` | 55.2 MB | 1918 × 942 | 51.2 s | **→ home Ch 01 + `/videos` `viewport-walkthrough`.** Carries burned-in English captions (see §8.6). Re-encode. |
| `hover-probe-demo.mp4` | 4.1 MB | **1912 × 942** | 16.4 s | **→ home Ch 06 + `/videos` `hover-probe`.** Re-encode. |
| `hero-stitch-01.png` | 365,439 B | 1363 × 805 | — | **→ home Ch 07.** Composite of viewport + Lux Heatmap panel. |
| `analysis-13pt-diagnostics.png` | 382,484 B | 1917 × 944 | — | **→ home Ch 06.** Full app window, 13 labelled probe points. Highest-credibility still in the repo. |
| `analysis-heatmap-absolute.png` | 99,808 B | **440 × 667** | — | → Ch 06 pin panel 1. Re-crop (§8.4). |
| `analysis-heatmap-norm.png` | 105,406 B | **442 × 673** | — | → Ch 06 pin panel 2. The crop target. |
| `analysis-heatmap-deviation.png` | 109,288 B | **445 × 718** | — | → Ch 06 pin panel 3. Re-crop (§8.4). |

**Note:** all three videos are ~2.036:1 app-window captures, **not 16:9**, and they are **not all the same size** — two are 1918 wide, one is 1912. Earlier drafts said all three were 1918. Set `--media-ratio` per slot; do not normalise.

### 8.2 What the owner must supply (with exact filenames)

| # | Filename | Spec | Blocking? |
|---|---|---|---|
| A1 | `assets/og-card.png` | 1200 × 630, `logo-ink.png` mark + wordmark centred on `--paper`, one line of `--ink-400` sub-copy. Home + privacy OG image. Today `og:image` points at the 770 × 224 transparent wordmark, which social cards composite onto white and render as an almost-blank card. | **Yes** |
| A2 | `assets/og-videos.png` | 1200 × 630, same treatment, `FEATURE VIDEOS` label. Until it exists, `videos.html` may fall back to `og-card.png`. | No |
| A3 | `assets/logo-mark-180.png` | 180 × 180 square PNG of the mark on `--paper`, for `apple-touch-icon`. The current 384 × 359 non-square favicon distorts at 16 px. | No |
| A4 | `assets/favicon-32.png`, `assets/favicon-16.png` | Square mark crops. | No |
| A5 | `assets/fonts/geologica-var-latin.woff2` | Latin subset of Geologica variable, wght 300–700. | **Yes** |
| A6 | `assets/fonts/pretendard/` | Pretendard Variable dynamic subset (the published `.css` + its `.woff2` chunks). | **Yes** |
| A7 | `assets/media/hero-1600.mp4`, `hero-1600.webm`, `hero-poster.jpg` | Re-encoded hero, §8.3. | **Yes** |
| A8 | `assets/media/features/viewport-walkthrough.{mp4,jpg}` | Re-encoded `software-demo`, §7.5 settings. | **Yes** |
| A9 | `assets/media/features/hover-probe.{mp4,jpg}` | Re-encoded `hover-probe-demo`, §7.5 settings. | **Yes** |
| A10 | `assets/media/ch01-scene.{mp4,jpg}` etc. | Home-chapter loops — same files as A8/A9 may be reused; do not duplicate bytes. Reference `features/` paths directly. | No |
| A11 | `assets/media/features/<slug>.{mp4,jpg}` × 39 | The pending slots in §7.3, in `P1 → P2 → P3` order. | No |
| A12 | Re-cropped heatmap PNGs | §8.4. | **Yes** |

### 8.3 Media weight — a ship gate, not a nice-to-have

97.8 MB of video on a site arguing for measurement discipline has already lost the argument, and on venue Wi-Fi or LTE — which is where a technical director actually opens a vendor link, standing in the room — the hero is a white rectangle for eight seconds. That is the bounce, and no copy fix survives it.

**Hard budget: no single media file over 4 MB. No page over 6 MB on first paint.**

**Hero (`media-01-hero.mp4` → `hero-1600.*`):**

1. **Trim.** 37.7 s is a long hero loop. Cut a **12–18 s seamless segment** so the loop point is designed rather than discovered.
2. Scale to 1600 px wide, strip audio, H.264 High CRF 23, plus a VP9/AV1 WebM alternate. **Target ≤ 3.5 MB each.**
3. Export `hero-poster.jpg` from the **final cropped frame** at 1600 px, ≤ 90 KB.

```bash
ffmpeg -ss <START> -t <DURATION> -i assets/media/media-01-hero.mp4 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -preset slow \
  -vf "scale=1600:-2:flags=lanczos,fps=30" -an -movflags +faststart \
  assets/media/hero-1600.mp4
ffmpeg -ss <START> -t <DURATION> -i assets/media/media-01-hero.mp4 \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
  -vf "scale=1600:-2:flags=lanczos,fps=30" -an \
  assets/media/hero-1600.webm
```

**The poster is the hero.** `fetchpriority="high"`, preloaded. The video is an enhancement that arrives late, and under `saveData` / `prefers-reduced-data` it never arrives at all (§6.2).

**All three source files carry 2-channel AAC that is never audible** — every element is `muted`. Stripping audio is free weight.

**Retire the originals from the deploy.** `outputDirectory: "."` means `assets/media/media-01-hero.mp4` is publicly fetchable at 37 MB even when nothing links it. Once the re-encodes land, delete the three originals from the repo (they live in git history if needed).

### 8.4 Heatmap PNG re-crop

The three panel screenshots are three different sizes: `absolute` **440 × 667**, `norm` **442 × 673**, `deviation` **445 × 718**. No two match, which is why the old CSS carries an `object-position: center -7px` fudge at `input.css:615–617`.

**Decision: re-crop all three to 442 × 673** (the `norm` dimensions — the middle value, so two crops are small and one is a modest trim). Then **delete the `object-position` hack**; it must not survive into the new CSS.

### 8.5 Alt text and captions — written from the frame, never from the spec

Two strings in this document are deliberately `TK` and are **ship gates**: `.monitor-caption` (§6.2) and the Ch 07 `figcaption` projector count. Both must be written after looking at the final asset.

The general rule, applying to every image on the site: **product screenshots get alt text describing what the image reads, and that description is verified against the file.** Do not paste a plausible-sounding reading. A sampled frame of `media-01-hero.mp4` shows `PROJECTORS 1`; an earlier draft shipped "four projectors on a façade" as both the caption and the accessible description. A screen-reader user would have received a fabricated description of the page's main image, on a site about not fabricating things.

### 8.6 The two known content problems in the existing footage

**(a) `media-01-hero.mp4` shows `ANALYSIS [Coming Soon]` in the app's status bar** for the entire loop. A site that deletes its roadmap and claims to describe only shipped work cannot open with a Coming Soon badge inside the product.

*Decision:* crop it out deterministically — the monitor aperture is `1918 / 890` with `object-position: 50% 0%`, cutting the bottom 52 px (§6.2). This needs no re-encode beyond the one already required. **Re-recording from a build without that chip is the preferred long-term fix** and is open question Q3.

**(b) `software-demo.mp4` carries burned-in English marketing captions** ("Place projectors directly in the scene."). That is post-production text on a page that would otherwise claim unedited footage — and a Korean visitor cannot get a Korean version of a pixel-baked caption.

*Decision:* the `/videos` page claim is **"recorded in the shipped app"**, not "unedited". Under that claim the file ships on day one, because two real videos beats an empty page and the footage genuinely is the shipped app. A caption-free re-export is a P1 asset task (A8), not a blocker.

---

## 9. Deletions — exactly what comes out

### 9.1 The roadmap, in full

**Nothing replaces it.** Not in the nav, not on the page, not in the footer, not in a modal. The nav slot it occupied goes to `Videos`. There is no "What's next", no "Coming soon", no "Changelog". Status honesty on this site is expressed only through the `BETA` chip in the header, the `#beta` section (S10), and the beta labels inside `#limits` (S8) on GDTF/MVR and the Report Builder. **Nothing on the site describes unshipped work.**

**`index.html` — remove:**

| Lines | What |
|---|---|
| 29 | `<a href="#roadmap" data-roadmap-open>Roadmap</a>` |
| 236–279 | the entire `<section id="roadmap">` (44 lines) |
| 307–354 | the entire `<div id="roadmap-modal">` — backdrop, panel, header, close button, duplicated three-cell grid (48 lines) |
| 440–447 | `const roadmapModal` + `openRoadmap()` |
| 448–452 | `closeRoadmap()` |
| 454–459 | the `[data-roadmap-open]` click listeners |
| 460–462 | the `[data-roadmap-close]` click listeners |
| 463–467 | the `keydown` / Escape handler |

(`index.html` is being rewritten wholesale, so these are removals-by-omission — but the list is here so nothing is carried across by accident.)

**`src/input.css` — delete whole blocks:**
`894–902` · `904–908` · `910–914` · `916–918` · `920–924` · `926–932` · `934–942` · `1049–1051` · `1053–1061` · `1063–1068` · `1070–1080` · `1082–1093` · `1095–1101` · `1103–1112` · `1114–1119` · `1121–1124` · `1363–1366` · `1378–1380` · `1382–1385` · `1387–1389` · `1469–1471` · `1528–1530`

**`src/input.css` — strip single lines from shared selector lists** (do not delete the surrounding block): `356` · `670` · `681` · `1264–1265` · `1320`

**`src/input.css` — orphaned by the deletion, remove too:**
- `body.modal-open` (32–34) — its only consumer was the roadmap modal. Replaced by `body.overlay-open` (§5.8).
- `.narrow-heading` (868–870, plus its name in the shared `h2` selectors at 403 and 1283) — used only by `index.html:238`.

**`README.md`** — delete line 17 (`- Roadmap is status-based: now, next, later.`).

**Total: ~102 lines of HTML, ~140 lines of CSS, 28 lines of JS.**

**Two artefacts are carried forward as mechanics only, with no roadmap content attached:** the modal shell (1053–1124) is re-skinned white and becomes the donor for **both** the mobile nav overlay and the `/videos` lightbox; and the `data-*-open` / `data-*-close` / Escape wiring is reused verbatim in §5.8's shared overlay system.

### 9.2 Dead CSS from previously-removed sections

Defined in `src/input.css`, referenced by neither HTML file. All go:

| Class | Lines |
|---|---|
| `.share-grid` | 849–856, 1188, 1368 |
| `.share-step` (+ `h3`, `p`, `span`) | 353, 667, 680, 858–862, 1319, 1358 |
| `.share-media-row` | 690, 864–866, 1262 |
| `.workflow-rail` (+ `div`, `span`, `strong`) | 354, 668, 872–885, 1189, 1359, 1369 |
| `.case-grid` | 887–892, 1263 |
| `.probe-layout` (+ `h2`) | 404, 689, 818–821, 1183, 1284 |
| `.media-tall` | 640–642, 1339, 1436 |
| `.media-portrait` | 644–646, 1340, 1437 |
| `.section-copy` | 414, 1292 |

Also `.mobile-hide-cta` (`index.html:40`) — styled *only* inside the 860 px query as `display:inline-flex`, i.e. it does nothing anywhere and its name lies about its behaviour.

### 9.3 Dead tokens and hacks

- `--stage-2`, `--muted`, `--brand-2`, `--amber`, `--blue`, `--red`, `--green` — declared, never used via `var()`.
- `--stage`, `--soft`, `--ink` (old warm off-white), and the alpha `--line` / `--line-strong` — superseded by §2.1.
- `.kicker` — replaced by `.micro-label`.
- `object-position: center -7px` at 615–617 — delete after the re-crop in §8.4.
- `color-scheme: dark` on `html, body` — becomes `light`.
- `overflow-x: hidden` on `html, body` — becomes `clip` (§3.7).

### 9.4 Components deleted by decision, not by disuse

Named here so nobody re-adds them: `.meter-strip` and its children, `.metric-grid` and its children (§2.1 — the screenshots carry the real legend); `.trust-quote*` and `.trust-logo*` (§4.11 — no testimonials exist, and brand logos imply endorsement); `.monitor-glare` and `.monitor-sheen` (§4.4 — never blend over a measurement image); `.micro-label::before` cyan dash (§4.6).

### 9.5 `README.md` cleanup

`outputDirectory: "."` makes the repo root the web root, so `README.md` is publicly served at `https://field-lux.com/README.md`. It currently contains an internal review preview URL (`projection-mapping-git-public-signup-project-h-46a32f-field-lux.vercel.app`) at line 39. **Remove that URL** and rewrite the README to describe the current direction (the existing text describes the 0517 dark direction and is stale). Keep the `flowAppUrl` review-workflow documentation — that mechanism survives — but state the new host allowlist (§10.4).

---

## 10. Build and deploy

### 10.1 Branch and repo hygiene

Work on `0814-site-redesign` (current HEAD `e1bbd12`, clean tree). Do **not** merge to `master`.

`node_modules/` is installed. Run `npm install` if a fresh clone is used.

`assets/tailwind.css` is a **tracked build artifact** and `.gitignore` does not exclude it. Vercel regenerates it on every deploy so production is always fresh, but a local edit to `src/input.css` without running `npm run build` produces a stale-CSS commit and confusing local previews. **Always run the build before committing CSS changes.**

### 10.2 Tailwind

```bash
npm run build     # tailwindcss -i ./src/input.css -o ./assets/tailwind.css --minify
npm run watch     # the --watch variant
```

Tailwind 3.4.17, autoprefixer 10.4.20, postcss 8.5.3, all devDependencies. No runtime deps.

**`tailwind.config.js` — final content:**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        surface: { 100:'#F4F6F7', 200:'#EBEEEF', tint:'#ECFBFC' },
        ink:   { 300:'#8A959B', 400:'#626E74', 500:'#566268', 700:'#2A3338',
                 900:'#0B0F11', 950:'#020102' },
        brand: { 100:'#ECFBFC', 200:'#C9F4F7', 300:'#7FE4EA', 400:'#3FD3DF',
                 500:'#20D5DE', 600:'#00B1C4', 700:'#008DA6', 800:'#006E87',
                 900:'#00566B', 950:'#003F4E' },
        mass:  { 800:'#0B4A5C', 900:'#073644', 950:'#04252D' },
        line:  { DEFAULT:'#E4E8EA', strong:'#C9D0D3', control:'#626E74' },
      },
      fontFamily: {
        display: ['Geologica','Pretendard Variable','Pretendard','Apple SD Gothic Neo','sans-serif'],
        sans:    ['Pretendard Variable','Pretendard','-apple-system','Apple SD Gothic Neo','sans-serif'],
      },
    },
  },
  plugins: [],
};
```

Deleted from the old config: `stage`, `surface.base/elevated/raised`, `ink.50/200`, `brand.DEFAULT/hot/dim/muted/ring`, `success/warning/danger`, and the misnamed `fontFamily.mono` (it mapped to Manrope/Geist/Inter, nothing monospace).

**The `content` glob change is blocking.** `videos.html` must not be authored before it lands.

### 10.3 `vercel.json` — the final file

One file, reconciling all three proposed changes. Two rules; the six existing headers are preserved verbatim, `HSTS preload` included.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" }
      ]
    },
    {
      "source": "/assets/media/features/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }
      ]
    }
  ]
}
```

Notes the builder must not undo:

- **The CSP is only possible because fonts are self-hosted.** If anyone re-adds a Google Fonts link, the CSP breaks and the page ships unstyled text. `'unsafe-inline'` on `script-src` and `style-src` is load-bearing while the per-page IIFE and the pre-paint motion script stay inline; drop it only if those move to files.
- **The media cache header is deliberately not `immutable`.** Filenames are stable and the owner re-uploads improved cuts under the same name; `immutable` would pin a bad take in client caches for a year.
- **Do not add `autoplay=()` to `Permissions-Policy`.** It currently does not restrict autoplay; adding it would silently kill every hover preview and the hero video.
- `X-Frame-Options: DENY` and `COOP: same-origin` govern *this page being framed*, not this page playing a self-hosted `<video>`. They are harmless here.
- `HSTS preload` commits the apex domain. Do not weaken it.

### 10.4 The three JS contracts

All three pages carry one inline IIFE with the same three blocks. `videos.html` and `privacy.html` must run **all** of them, not a subset.

**(a) `data-app-link` CTA rewriting — with `siteReturnUrl` on every page.** Currently `index.html` appends `siteReturnUrl=<current href>` via `getAppLinkUrl()` while `privacy.html` assigns the bare `appUrl`. **Unify: all three pages use `getAppLinkUrl()`.** The app side reads `siteReturnUrl`. Keep the modifier-key / middle-click passthrough so cmd-click still opens a new tab.

Default app URL: `https://app.field-lux.com`.

**(b) `flowAppUrl` review override — host allowlist, decided.** `?flowAppUrl=<encoded>` or `localStorage['fieldlux_flow_app_url']`. The current validation accepts **any HTTPS host** and persists it, which makes `https://field-lux.com/?flowAppUrl=https://evil.example` turn every CTA on the site into an attacker-chosen sign-in destination, permanently, for that visitor.

**Decision — implement this allowlist:**

```js
function isAllowedAppHost(u) {
  try {
    const p = new URL(u);
    const h = p.hostname;
    if (p.protocol === 'http:' && (h === 'localhost' || h === '127.0.0.1')) return true;
    if (p.protocol !== 'https:') return false;
    return h === 'field-lux.com' || h.endsWith('.field-lux.com')
        || h.endsWith('.vercel.app')
        || h === 'localhost' || h === '127.0.0.1';
  } catch { return false; }
}
```

Anything outside the allowlist falls back to `https://app.field-lux.com` **and clears the stored key** so a bad value cannot persist. Document the allowlist in `README.md` so the review workflow still works. A site whose thesis is trustworthiness cannot carry an open-redirect-shaped surface on its primary CTA.

**(c) `discordUrl` allowlist — keep exactly as-is.** `?discordUrl=` or `localStorage['fieldlux_discord_url']`, validated to `https:` **and** hostname in `{discord.gg, discord.com, *.discord.com}`. This is already the correct pattern. The handler sets `target="_blank"`, `rel="noopener noreferrer"` and `aria-disabled`. Two cleanups per §6 S11: drop the dead `hasInvite` branch, and drop the `title` attribute so the CSS `::after` tooltip does not double.

Live invite: `https://discord.gg/JpeQ7Hgsnd`.

### 10.5 `privacy.html` — bring it up to parity

The privacy page is currently monolingual, has no canonical, no OG tags, and one dead class. All four are fixed in this pass:

1. **Add Korean.** Every clause gets a `lang="ko"` counterpart using the `.bilingual` pattern. The rest of the site is bilingual on every block; a monolingual privacy page is where a Korean user is most likely to need their own language.
2. **Add `<link rel="canonical" href="https://field-lux.com/privacy">`** and the full OG set (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` → `og-card.png`, `twitter:card`).
3. **Fix `text-ink-300` at line 29** — `ink.300` was undefined in the old config, the class emitted nothing, and that prose silently inherited `text-ink-50` from `<body>`. `ink.300` now exists (§10.2), but it is **non-text only** (3.06:1). Change the class to `text-ink-500`.
4. **Repaint for white** using the tokens in §2.1, add the shared header, footer and `.motion-toggle`, and run the three JS contracts from §10.4.

### 10.6 Additional files to create

| File | Contents |
|---|---|
| `sitemap.xml` | `/`, `/videos`, `/pricing`, `/privacy` — with `<lastmod>`. |
| `robots.txt` | `User-agent: *` / `Allow: /` / `Sitemap: https://field-lux.com/sitemap.xml` |
| `404.html` | Minimal: header, `PAGE NOT FOUND`, links to `/`, `/videos`, `/pricing`, `/privacy`. |

Favicon set in `<head>` on all three pages:

```html
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32">
<link rel="icon" href="/assets/favicon-16.png" sizes="16x16">
<link rel="apple-touch-icon" href="/assets/logo-mark-180.png">
```

### 10.7 Ship gates — run all of these before the deploy

| # | Check | Command / method |
|---|---|---|
| G1 | No banned vocabulary | `grep -inE 'SOC 2\|GDPR\|enterprise-ready\|load tested\|MadMapper\|MPCDI\|anamorphic\|radiosity\|ray tracing\|roadmap\|resilience score\|Spout\|Syphon\|NDI\|DWG\|DXF' index.html videos.html privacy.html src/input.css` → empty |
| G2 | Cyan never carries text on white | `grep -nE 'color:\s*var\(--brand-[456]00\)' src/input.css` → only inside `.section--mass`, `.monitor-*`, `.media-slot--mass` |
| G3 | No `overflow-x: hidden` | `grep -n 'overflow-x:\s*hidden' src/input.css` → empty |
| G4 | Tailwind glob covers all pages | `tailwind.config.js` `content` is `['./*.html', './src/**/*.{html,js}']` |
| G5 | No `.html` in internal links | `grep -nE 'href="/(privacy\|videos)\.html"' *.html` → empty |
| G6 | No media file over 4 MB | `find assets/media -size +4M` → empty |
| G7 | First-paint weight ≤ 6 MB | DevTools, throttled, cold cache |
| G8 | No `autoplay` attribute in any markup | `grep -n 'autoplay' *.html` → empty (JS-gated only) |
| G9 | Both TK strings written | `grep -n 'TK —' *.html` → empty |
| G10 | Contrast ledger | Every foreground/background pair on the page appears in §2.2 |
| G11 | Keyboard pass | Tab through both pages: skip link works, both overlays trap and return focus, no focus lost, no `outline:none` |
| G12 | Reduced motion pass | With `prefers-reduced-motion: reduce`: nothing moves, the hero shows its poster, the play affordance appears, the motion toggle can turn motion back **on** |
| G13 | `og:image` renders | Paste both URLs into a card validator; the card must not be blank |
| G14 | `flowAppUrl` allowlist | `?flowAppUrl=https://evil.example` falls back to `app.field-lux.com` and clears the stored key |
| G15 | `README.md` clean | No internal preview URL at `https://field-lux.com/README.md` |
| G16 | Publication counters | `/videos` shows `2 of 43 published` with JS disabled |
| G17 | Every lux number is labelled | Manual read: no bare "lux" figure without its qualifier in the same sentence |

---

## 11. Open questions for the owner

Five, all genuine — each one has a decision the builder cannot make.

**Q1 — Do you have, or can you get, one predicted-vs-measured comparison?**
The single biggest hole in this site is that every credibility proof is a statement about the codebase ("unit-tested", "contract test", "enforced by the database") and none is a statement about the world. A skeptical buyer reads that and concludes FieldLux has never been checked against a light meter. One real case — venue, surface, projector and lens, throw distance, the FieldLux prediction, the meter reading, the meter model and date, and the delta including where it was worst — would be worth more than the whole `#limits` section. **If a delta of 18 % is what you measured, publish 18 %.** A published bad number beats forty good disclaimers.

If you have one, this spec gains a `#validation` section between S8 and S9, and the hero CTA changes from `SEE THE LIMITS ↗` to `SEE THE MEASURED CHECK ↗`. If you do not, the site ships as specified and the ceiling is "interesting" rather than "trusted". *(Related and worth knowing: manual site calibration is the app feature that would produce this, and it currently has no reachable entry point in the deployed web build — see Q2.)*

**Q2 — Is the verdict / analysis lane coming back, and when?**
`AnalysisPanel.jsx` and `FieldLuxAnalysisPanel.jsx` have zero mount points; `runStressCheckFromStores` has zero callers; manual calibration exists only inside the unmounted panel. This spec therefore removes the entire verdict, stress, prescription, per-wall, seam-risk, audience-coverage and calibration story from the site — roughly a third of what earlier drafts planned, including six video slots. That is the correct call for a site that ships next week. **If the lane is being revived within the next month, say so now** and we hold a `ch-analysis` chapter and its slots in the spec rather than deleting and re-adding them.

**Q3 — Can you re-record the hero clip from a build without the `ANALYSIS [Coming Soon]` status chip?**
The spec crops it out via the monitor aperture (bottom 52 px), which works and needs no new footage. But a clean recording is better, and it also lets you choose a 12–18 second segment with a designed loop point rather than trimming what exists. **If yes, one 15-second capture unblocks the strongest asset on the site.**

**Q4 — What is the largest scene you have actually built and analysed?**
`#limits` should state the working envelope — projector count, throw distance, imported model size in MB and triangles — so a rigger with an 80 m stadium throw or a 40-head dome knows in five seconds whether the tool fits. Right now the site says nothing, and both the person with too big a job and the person with too small a job bounce. **Fill in N projectors / X metres / Y MB / Z k triangles from a real scene you have opened. Do not estimate** — this is a "we have run this" claim, not a limit.

**Q5 — Which two chapters do you want shot first?**
Thirty-nine of forty-one video slots are pending. The spec's P1 set is `walk-mode`, `throw-and-shift`, `catalog-official-check`, `auto-edge-blend`, `quick-wrap`, `canvas-sets`, `heatmap-modes`, `distribution-13pt`, `additive-light`, `pdf-tech-rider`, `share-link` — eleven clips, ordered by what a buyer asks about first. **If your sales conversations start somewhere else, reorder it**; the page structure does not change, only the shooting order.

---

## Appendix — conflicts this document resolved

Recorded so no one re-opens them.

| Conflict | Decision |
|---|---|
| Chapter taxonomy (5 vs 9 vs 11 vs a 6-item marquee) | **Ten chapters**, §S5, used identically by home, marquee, `/videos` and every counter |
| Analysis / verdict lane | **Deleted from the site.** Zero mount points verified |
| Dark wordmark asset | **`logo-ink.png` exists** and is used. Live-text wordmark rejected |
| Hero monitor: keep or kill | **Keep** (owner requirement R5), but delete `.monitor-glare` and `.monitor-sheen` — never blend over a measurement image |
| `--surface-50` alternating bands | **Deleted.** Rhythm from measure, mass and the ordinal spine (§3.6) |
| `.micro-label` cyan dash | **Deleted.** Ordinal + hairline spine instead; cyan rationed to five uses (§2.3) |
| `--ramp-*` meter strip | **Deleted.** The three screenshots carry the app's own legend |
| Focus ring colour | **`--focus #006E87`** (5.87:1). `#00B1C4` computes to 2.60:1 and fails |
| Video card / lightbox class names | **`.video-card*` / `.video-lightbox*` / `body.overlay-open`.** `.fv-card__*` and `body.modal-open` rejected |
| Empty-state caption string | **`RECORDING · 촬영 예정`**, one string site-wide |
| Empty-state mechanism | **`.media-slot` + `.has-media` authored in markup.** Poster-`error` is a downgrade path only |
| Pending card element | **`<article>`** with an inner link, not a `<button>` |
| Filter chips | **`<button aria-pressed>`**, not `role="tab"` |
| Video card aspect | **`--media-ratio` per slot** — 1918/942 default, 1912/942 for `hover-probe`. Not 16:9 |
| `/videos` grid math | `minmax(min(420px,100%),1fr)`, `gap: clamp(32px,4vw,56px) var(--gap)`, 1-up ≤860 px |
| Captions on silent clips | **`<figcaption>` prose, no `<track>`.** The clips have no audio |
| Slug scheme vs existing files | **Filename = slug.** Copy to `features/viewport-walkthrough.mp4` and `features/hover-probe.mp4` |
| Pin block size | **3 panels at 62vh, `min-block-size: auto`.** Not 5 at 76vh under a 300vh floor |
| `--sy` / `--syn` | **Deleted.** `--mon-tilt` on `.hero-monitor` only, guarded for pages with no hero |
| `.bleed-full` with `scrollbar-gutter` | **`100cqw`**, not `100vw` |
| Motion toggle | **Tri-state** (`on` / `off` / OS), so a reduced-motion user can opt back in |
| `.section--mass` in the footer | **Struck.** The footer is `--paper` |
| `vercel.json` | **One final file** (§10.3): six existing headers + CSP + media cache rule |
| `flowAppUrl` | **Allowlist decided** (§10.4b), not flagged |
| Heatmap PNG re-crop target | **442 × 673** for all three (no two currently match) |
| Media weight figures | **97.8 MB actual**; the autoplaying file is 55.2 MB, not 58 |
| Video dimensions | **Two are 1918 × 942, one is 1912 × 942** |
| `software-demo.mp4` burned-in captions | `/videos` claims **"recorded in the shipped app"**, not "unedited". Ships day one; clean re-export is a P1 asset task |
| Nav item list | **Five links + two CTAs**, all anchors verified to exist |
