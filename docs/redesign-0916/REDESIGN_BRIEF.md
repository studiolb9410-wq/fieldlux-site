# FieldLux marketing site: redesign brief (0916)

Two senior designers build from this document in parallel, in two separate worktrees
(`C:/fieldlux/site-redesign-A` and `C:/fieldlux/site-redesign-B`), without talking to each
other. The brief is the only shared context, so it names everything: tokens, components,
section order, the copy each section uses, the screenshot each section shows, and the rules
the reviewer scores against. Where this brief and your taste disagree, the brief wins; where
the brief is silent, choose the quieter option.

## 0. Scope and working method

- Site: static HTML, Tailwind CLI build. Pages: `index.html`, `product.html`,
  `measurement.html`, `pricing.html`, `videos.html`, `privacy.html`, `404.html`.
  CSS source `src/input.css`, compiled by `npm run build` into `assets/tailwind.css`.
  Scripts: `scripts/site-experience.js` (nav, reveal, motion toggle, pricing period, app
  links) and `scripts/light-field.js` (the scroll-driven canvas on the home page).
- Ground truth for what the app does: `docs/redesign-0916/APP_UI_INVENTORY.txt`. The prior
  audit that found overclaims: `docs/redesign-0916/AUDIT_CRITIC.json`. The copy on the
  current pages has already been corrected against both. Treat the current copy as the
  copy deck; the design is what changes.
- Do not edit `embed/`, `demo-scenes/`, `vercel.json`, `scripts/dev-server.mjs`.
  `scripts/light-field.js` stays as it is. `scripts/site-experience.js` may be touched only
  for the one nit in section D5 (the "No weekly pass" cell); nothing else.
- You may rewrite `src/input.css` from scratch. Delete dead CSS (there are two token systems
  in the file today; ship one). Keep every rule the hero needs (see Appendix 3).
- Deliverable: all seven pages built, `npm run build` run, no console errors, screenshots at
  1920 / 1440 / 390 produced with `node scripts/shots.mjs <port> <outDir> "|home|full"
  "product|product|full" "measurement|measurement|full" "pricing|pricing|full"
  "videos|videos|full"` and committed under `docs/redesign-0916/shots-<A|B>/`.
- Copy rules while you work: English only, no em dashes, no typographic quotes, no arrow
  glyphs in text (use an inline SVG if a link needs one). App feature names are spelled
  exactly as the app spells them (Appendix 2). This brief is written in plain ASCII, so where
  it quotes a kicker as "Part A . Start . Chapter 01" the source copy uses the middle dot
  separator; keep the source.

## 1. Hard constraints (verbatim; the reviewer checks each one)

- [ ] 1. Truth: every sentence on the site must be supported by the app inventory. Copy on the
  current pages has already been audited and corrected; designers may cut, reorder, shorten
  or re-hierarchise it, but may not add capability claims, numbers, customer names,
  testimonials, logos of other companies, or "trusted by" strips. Manufacturer names (Epson,
  Panasonic, Christie) are catalogue data, not partnerships. No em dashes in body copy.
  English only.
- [ ] 2. Hero (index.html section.hero): the iframe embed (/embed?scene=hero), the ticker,
  the H1 with the typewriter slot, the readouts and the hero caption must stay present and
  functional (they are CSS-driven; no JS edits needed). Designers may restyle the hero frame,
  spacing, typography and the surrounding layout, but must keep every element and its
  classes/data attributes.
- [ ] 3. Screenshots are never cropped: no object-fit:cover, no fixed aspect boxes on <img>;
  images render at their intrinsic ratio, full width of their column. All product
  screenshots are in assets/media (listed in Appendix 1 with what each shows).
- [ ] 4. Layout: desktop content width around 1600 to 1700px on a 1920 screen (the owner
  rejected the old 1180px column as "phone-like"); an 8pt spacing scale and one type scale
  used consistently; copy that sits beside an image is pinned to the image frame (top edge
  aligned, last element aligned to the image bottom); equal-height rows have aligned bottom
  edges. Phone (390px) must be clean and stacked with 16px side gutters.
- [ ] 5. Videos page: the 19 chapters (menu path, numbered steps, "You will see", one empty
  video slot per chapter) are the content; the owner will record clips later, so the empty
  slot must look intentional. Keep the chapter text.
- [ ] 6. Pricing page: tier names, prices, feature rows and FAQ text stay as they are (owner
  decisions); only the design changes.
- [ ] 7. Do not edit embed/, demo-scenes/, vercel.json, or scripts/dev-server.mjs.

## A. Positioning, audience, promise

1. FieldLux is a browser-based 3D planning workspace for projection and show lighting: venue
   in, real projectors and lenses placed, beams aimed and blended, light on the surface
   estimated, content previewed, plan handed off.
2. The buyer is technical: AV engineers, projection designers, event producers and rental
   houses who quote and plan before load-in and answer for the result on site.
3. It sits between "spreadsheet plus manufacturer calculators" and installed previz suites:
   no install, no licence, free and fully open during the open beta, planning estimates
   labelled as estimates.
4. Its proof is specificity: catalogue heads and lenses, Center Illuminance cross-checked
   against Epson and Panasonic calculators, a 13pt Diagnostic, a PDF Tech Rider, a share link
   with a QR code. The site should feel like the tool: exact, quiet, numerate.
5. Its limits are stated in the same breath: not a lux meter, Report Builder temporarily
   disabled, 2 GB model storage in beta, prices planned not live.

The promise, one sentence: **See how much light a real rig puts on a real venue, in the
browser and before the truck leaves, and hand the crew a plan they can check.**

## B. Design direction

What "premium, professional, stylish" means for a 2026 B2B tool site aimed at people who
read spec sheets for a living:

- Product first, chrome last. Like Linear and Vercel, the screenshot is the hero of every
  feature section and the copy is short and beside it. No illustrations, no 3D blobs, no
  stock photography, no icons-as-decoration.
- Type carries the hierarchy. One display face at three sizes does the work that colour
  and boxes do on weaker sites. Large, tight, sentence-case headings; a lead in a lighter
  weight; body at a comfortable measure. Kickers are the only uppercase text outside the
  locked hero.
- Hairlines, not shadows. Grids of bordered cells (the Vercel and Linear "bento" pattern:
  shared 1px dividers, one outer border, small radius) replace floating cards with big gaps.
  One shadow token exists and only screenshot frames on light ground may use it.
- Numbers as proof. Readouts (53 heads, 13 points, 0 to 875 lx, $39 / month) are set in
  tabular figures, large, with a hairline above and a small label, the way Vercel and
  Runway set metrics. They are the site's version of a testimonial strip, and they are true.
- Restraint with colour. Near-black ink on off-white paper; the FieldLux cyan appears as a
  fill (primary hero button, caret, focus ring, the beta pill dot) and as a deep text-safe
  teal for kickers and links. Heatmap colours belong to the screenshots and never leak into
  the UI. No gradients on text, no glow.
- Motion is Figma-quiet, not Raycast-loud: a 240 ms fade-and-rise on reveal, 150 ms hover
  transitions, nothing that moves on its own except the two locked pieces (hero ticker,
  light-field bridge). No parallax, no scroll-jacking, no marquee elsewhere.

Light or dark: **light paper page, dark stage for the product.** The app UI is dark-only,
so a dark screenshot dropped straight onto white reads as a black slab. Every screenshot
therefore sits in a `shot` frame whose ground is the app chrome colour, and at most two
sections per page become full-bleed dark "stage" bands (the ground the app itself lives on).
Long reading (videos chapters, pricing, FAQ, measurement explanations) stays on paper.
Rules: a dark band never follows another dark band; the header is always light; the footer
is always light.

Density: engineering density. Tighter cards, more information per viewport than a consumer
site, generous space between sections rather than inside components.

## C. Design system spec

Ship one token set on `:root`. Class prefix stays `v3-` (the scripts depend on a few of
those names; Appendix 3). Values below are the spec; if you must deviate, deviate by one
step on the scale, never by an ad hoc number.

### C1. Colour tokens (role in brackets)

Light ground
- `--paper` #FFFFFF (page ground)
- `--paper-2` #F4F6F7 (alternate band, empty-slot fill, footer)
- `--line` #E4E8EA (hairlines, cell dividers)
- `--line-strong` #C9D0D3 (input and secondary-button borders, dashed slot border)
- `--ink-950` #020102 (display headings, primary button fill)
- `--ink-900` #0B0F11 (h2, h3, link text)
- `--ink-700` #2A3338 (body)
- `--ink-500` #566268 (lead, secondary copy)
- `--ink-400` #626E74 (captions, labels; the smallest text colour allowed on paper)
- `--ink-300` #8A959B (decorative marks and disabled glyphs only, never words)

Dark stage
- `--stage` #0B0F11 (band ground; matches the app chrome)
- `--stage-2` #12181A (cells on stage, shot frame ground)
- `--stage-line` rgba(255,255,255,.12) (hairlines on stage)
- `--stage-text` #F4F7F8 (headings and body on stage)
- `--stage-muted` #A9B4B9 (lead, captions on stage)
- `--panel` #141414 (frame ground for the three Heatmap panel PNGs, sampled from the files)

Accent (FieldLux cyan family; the logo's own colours)
- `--brand-500` #20D5DE (FILL ONLY: hero primary button, caret, focus ring, beta pill dot)
- `--brand-700` #008DA6 (borders, rules, large text 24px and up)
- `--brand-800` #006E87 (text-safe accent: kickers, text links, step numbers)
- `--brand-900` #00566B (link hover, pressed)
- `--brand-300` #7FE4EA (kickers and text links on the dark stage only)
- `--brand-200` #C9F4F7 (::selection)
- `--brand-100` #ECFBFC (one optional tint band per page, for a CTA or note)

Shadow and focus
- `--shadow-shot` 0 32px 64px -32px rgba(11,15,17,.35) (screenshot frames on paper only)
- Focus: 2px solid `--brand-700`, offset 2px, on every interactive element.

### C2. Type

Families (already self-hosted; add no others): `Geologica` variable 300 to 700 for display,
headings, numbers and kickers; `Pretendard Variable` for body, lead, captions, UI text.
Numbers use `font-variant-numeric: tabular-nums`.

Scale (fluid between 390 and 1920 wide; px at 390 / 1920):

| Token | Size | Weight | Line | Tracking | Family / colour |
|---|---|---|---|---|---|
| display | clamp(2.75rem, 1.5rem + 3.6vw, 5.5rem) 44 / 88 | 560 | 0.96 | -0.03em | Geologica, --ink-950 |
| h2 | clamp(2rem, 1.2rem + 2.2vw, 3.5rem) 32 / 56 | 560 | 1.02 | -0.025em | Geologica, --ink-950 |
| h3 | clamp(1.25rem, 1.05rem + .6vw, 1.625rem) 20 / 26 | 600 | 1.2 | -0.015em | Geologica, --ink-900 |
| lead | clamp(1.125rem, 1rem + .5vw, 1.375rem) 18 / 22 | 400 | 1.5 | 0 | Pretendard, --ink-500; strong = 600 --ink-900 |
| body | 1rem / 1.0625rem 16 / 17 | 400 | 1.6 | 0 | Pretendard, --ink-700 |
| caption | 0.875rem 14 | 400 | 1.5 | 0 | Pretendard, --ink-400 |
| kicker | 0.75rem 12 | 650 | 1 | 0.12em, uppercase | Geologica, --brand-800 (stage: --brand-300) |
| readout | clamp(1.75rem, 1.2rem + 1.6vw, 2.75rem) 28 / 44 | 500 | 1 | -0.03em | Geologica tabular, --ink-950 |
| price | clamp(3rem, 2rem + 2.4vw, 4.75rem) 48 / 76 | 500 | 1 | -0.06em | Geologica tabular |

Measures: display max 14ch; h2 max 22ch; lead max 60ch; body max 68ch. Headings are
sentence case everywhere except the locked hero H1 and kickers (the current ALL-CAPS H1/H2
on product and measurement become sentence case; the words do not change).

Code-like readout treatment (menu paths, keys, file types):
- `.ui-path` for "File > Import 3D Model..." style paths: Pretendard 0.9375rem, weight 600,
  --ink-900, the ">" separators in --ink-400.
- `.key` for shortcut chips (Ctrl+I, W, F1): Geologica tabular 0.8125rem, weight 500,
  1px --line-strong border, 4px radius, padding 1px 6px, --paper-2 fill.
- `.unit` for units beside a readout (lx, mm/px, heads): caption size, --ink-400, 0.15em gap,
  aligned to the readout baseline.

### C3. Spacing, containers, breakpoints

8pt scale, the only spacing values allowed: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128,
160. Section padding top and bottom: 128 at 1280 and up, 96 at 768 to 1279, 64 below 768.
Section head to content: 48. Component internal padding: 32 (24 on phone). Cell grid gap: 0
with 1px dividers. Editorial column gap: 64 (96 at 1440 and up). Body paragraph gap: 16.

Container: `min(1680px, 100% - 80px)` at 1280 and up (1680 on a 1920 screen, 1360 at 1440);
`100% - 48px` at 768 to 1279; `100% - 32px` below 768 (16px gutters). One container width
for every section including pricing. Prose blocks cap at their measure inside it.

Breakpoints: 390 (phone reference), 768 (tablet: grids go 2-col, editorial stacks),
1024 (editorial 2-col returns), 1280 (full grid), 1440 and 1920 (reference desktops).

### C4. Surfaces

- Radii: 0 for bands; 6px for cells, cards, buttons, inputs; 8px for shot frames and the
  video slot; 999px for pills.
- Borders: 1px only. `--line` on paper, `--stage-line` on stage.
- Shadows: `--shadow-shot` on shot frames on paper. Nothing else casts a shadow.

### C5. Components (visual spec; naming and behaviour in section E)

- Buttons: height 48 (small 40), padding 0 20, radius 6, Pretendard 0.9375rem weight 600,
  sentence case, 150 ms background transition, no transform on hover.
  Primary: --ink-950 fill, --paper text; hover --ink-700. On stage: --paper fill, --ink-950
  text. Secondary: transparent, 1px --line-strong, --ink-900 text; hover border --ink-900.
  Text: no box, --ink-900, 1px underline offset 4px; hover --brand-900. The locked hero keeps
  its cyan `.btn--brand` (the one cyan button on the site) and `.btn--text`.
- Cell grid (replaces floating cards): `display:grid`, gap 0, outer 1px border, 6px outer
  radius, cells separated by 1px `--line` (use `gap:1px; background:var(--line)` with cell
  backgrounds painted, so dividers stay 1px at every width). Cell padding 32. Cells stretch
  to row height; a cell's last element pins to the bottom with `margin-top:auto`.
- Kicker: as C2, 12px margin below, optional index ("01") in tabular figures before a
  middle dot separator.
- Links in copy: --ink-900, 1px underline, offset 3px; hover --brand-900. Text-link
  component (section E) adds a 12px inline SVG arrow, currentColor.
- Figure and caption (`shot`): frame ground --stage-2 (or --panel for the Heatmap PNGs),
  1px border (`--line` on paper, `--stage-line` on stage), 8px radius, overflow hidden,
  `img{display:block;width:100%;height:auto}`. Caption below the frame, caption size,
  --ink-400 (stage: --stage-muted), 12px top padding, max 68ch, left aligned.
- Readout strip: `dl` in a cell grid; each cell: kicker label, readout value with `.unit`,
  optional caption line. Hairline above the strip; bottoms align because the grid stretches.
- Note (`note`): body-size, --ink-500, 2px left rule in --brand-700, 16px left padding,
  max 60ch. Used for the "measured lux stays pre-blend" style qualifiers.
- Empty video slot: 16:9 box (this is a placeholder div, not an <img>, so an aspect ratio is
  allowed and required so the published <video> drops in at the same size), --paper-2 fill,
  1px dashed --line-strong border, 8px radius. Centred stack: a 40px outline play glyph in
  --ink-300 (inline SVG), the chapter number as kicker, "Video in production" in caption
  size --ink-500. No hatch pattern, no fake player chrome, no fake progress bar.
- Chapter step list: `ol` with rows separated by 1px --line, 16px vertical padding; the
  number "01" in kicker style --brand-800 in a 40px column; step text body size --ink-700.
  App labels inside steps stay plain text (no bold, no quotes); menu paths use `.ui-path`.
- Beta pill: 999px radius, 1px --line-strong, kicker text --ink-700, 8px --brand-500 dot.

## D. Page by page IA

Global on every page: header (light, sticky, 64px tall, hairline appears with `.is-scrolled`)
with logo, nav Product / Measurement / Videos / Pricing, Sign in (text), Start free (primary
small); mobile hamburger drives `[data-menu-panel]`. Footer (light, --paper-2, hairline top):
logo and "Projection planning in the browser.", Explore column, Connect column (Discord,
Privacy, motion toggle button), meta line "(c) 2026 FieldLux. Open beta." Keep the
`data-app-link` attribute on every app CTA; the script rewrites those hrefs.

### D1. index.html (home)

Job: introduce every feature briefly, each with its screenshot and a link to its videos
chapter. Cut what repeats.

| # | Section | Job | Copy anchor (keep) | Screenshot | Layout | CTA |
|---|---|---|---|---|---|---|
| 1 | Hero (locked) | Show the live scene and the question | H1 "HOW MANY LUX / ON THAT FACADE", lead "Eight projectors, one building, every overlap in view...", three readouts, caption | iframe embed | Frame at full container width; H1 block, lead, buttons, then the three readouts as a readout strip, then the caption. You may overlap the H1 block on the frame or set it below; keep the ticker inside the frame | START FREE (cyan, locked), SEE THE PRODUCT |
| 2 | Light-field bridge | Signature moment; the owner iterated it in three commits, so it stays | kicker "Geometry . Optics . Surface", h2 "Plan the system.", transition "Plan . Measure . Deliver / See coverage. Measure lux." | canvas (script-drawn) | Keep the markup; restyle the overlay type with the display token; cap the stage at 140svh desktop, 120svh phone (today 178/170) | none |
| 3 | Statement band (dark stage) | State the principle in one breath, no images | kicker "One continuous plan", h2 "From a venue model to a plan the crew can trust.", lead "Geometry, optics and light readings stay in one scene. Move a projector and every number moves with it.", the three step titles and one-liners (01 Build the venue / 02 Place the system / 03 Read the surface) as a text-only 3-cell row | none (the three screenshots this section used are repeated in the tour below; drop them here) | Head left 5/12, steps right 7/12 as cells | none |
| 4 | Tour: eight features | The product, one feature per row | kicker "What is in the box", h2 "Projection, lighting and content, in one scene.", lead "Eight things the app does today..."; rows 01 Venue "Bring the venue in." / 02 Projector Library "Real heads, real lenses." / 03 Placement Tool "Arrays that stay live." / 04 Edge blending "Seams found for you." / 05 Heatmap "Know the lux before the truck leaves." / 06 Play Dock "Put the content on the wall." / 07 Lighting and fog "The rest of the rig, in the same scene." / 08 Share and handoff "One link for the client, one PDF for the crew." with their paragraphs, notes and "How to do it" links | 01 feature-venue, 02 feature-library, 03 feature-placement, 04 feature-edge-blend, 05 editor-heatmap-values, 06 feature-play-dock, 07 feature-lighting-fog, 08 feature-share | Editorial row, 5/12 copy + 7/12 shot, alternating sides; copy top-aligned to the frame, the text link pinned to the frame bottom; 96px between rows | per row: text link to /videos#ch-NN |
| 5 | Handoff trio | Cut. Its three cards (PDF Tech Rider / Project file / Read-only share) repeat row 08 and product card 06. If you want the trio, set it as a 3-cell strip directly under row 08 with no section head; otherwise drop it | h2 "One plan. Clear handoffs." is deleted with the section | none | optional 3-cell strip | none |
| 6 | Open beta CTA | Close | kicker "Open beta", h2 "Everything we ship is free today.", p "FieldLux is free during open beta. No card required. Planned prices are shown for transparency. Checkout is not available yet. Imported model storage is limited to 2 GB per account during the beta." | none | Centred, max 40ch, on --brand-100 tint or --paper-2 | Start planning (primary), View planned pricing (secondary) |

### D2. product.html

Job: go one level deeper than the home page: what each stage of the workflow contains, the
library facts, the lighting lane, and the beta limits.

| # | Section | Copy anchor (keep) | Screenshot | Layout | CTA |
|---|---|---|---|---|---|
| 1 | Page hero | kicker "Product", H1 "The whole rig, planned in a browser.", lead "Import the venue, pick real projectors and lenses...", figcaption "Four projectors on one facade. Beam W and H, throw distance and Center Illuminance in the Optics section update as you move a head.", proof Design/Venue, Simulate/Rig, Deliver/Handoff | editor-beams | H1 + lead in 7/12; full-container shot below with caption; the proof as a 3-cell readout strip under the shot | Start free, See measurement (text) |
| 2 | Workflow (dark stage) | kicker "The workflow", h2 "Build the venue. Place the system. Share the plan.", lead "Two workspaces, one scene...", cards 01 Design / 02 Projector Library / 03 Placement Tool / 04 Heatmap / 05 Play Dock / 06 Share and handoff | 01 feature-venue, 02 feature-library, 03 feature-placement, 04 editor-heatmap-values, 05 feature-play-dock, 06 feature-share (each at the top of its cell, full cell width) | 3 x 2 cell grid on stage; cell = shot, kicker, h3, p; equal rows, bottoms aligned | none |
| 3 | Projector Library | kicker "Projector Library", h2 "Three manufacturers in the library today.", lead "...Manufacturer names identify catalogue data, not a partnership.", readouts Epson 53 heads / 32 lenses, cross-checked against Epson PTDS; Panasonic 39 heads / 71 lenses, cross-checked against Panasonic TDC; Christie 5 heads / 37 lenses, computed by the FieldLux Christie calculator; the note paragraph "Counts checked against the live catalogue on 2026-09-16..." | none (feature-library already appears in section 2) | Head left 5/12; readout strip right 7/12; note full width below in caption size | none |
| 4 | Lighting and atmosphere | kicker "Lighting and atmosphere", h2 "Put the fixtures and the fog in the same scene.", lead, cards Fixtures / Working Plane / Fog | feature-lighting-fog | Editorial row: shot 7/12 left, head 5/12 right pinned; the three cards as a 3-cell strip below | none |
| 5 | Read what lands | kicker "Read what lands", h2 "Surface Lux, Pixel Density and Luminance, on the model.", lead "Compare Absolute, Norm and Deviation maps..." | none | Compact band on --paper-2: head and button only, max 60ch | Explore measurement (secondary) |
| 6 | Open beta | kicker "Open beta", h2 "Everything we ship is free today.", lead "Build a real project... Report Builder proposal PDF, are marked temporarily disabled inside the app, and imported model storage is limited to 2 GB per account." | none | Centred CTA band | Start free, See planned pricing |

### D3. measurement.html

Job: explain the maps. This is the page an engineer reads twice.

| # | Section | Copy anchor (keep) | Screenshot | Layout | CTA |
|---|---|---|---|---|---|
| 1 | Page hero | kicker "Measurement", H1 "Read the light before load-in.", lead "FieldLux estimates surface lux, pixel density and luminance...", figcaption "Turn on the Heatmap overlay, press Values, and read the 13pt Diagnostic on the target." | editor-heatmap-values | As D2 row 1 (no proof strip) | Start free, Explore the product |
| 2 | What you can read | kicker "What you can read", h2 "Three values. Three different questions.", lead, cards Surface Lux "How much light lands here?" / Pixel Density "How large is each pixel?" / Luminance "How bright does the surface appear?" | none | 3-cell grid | none |
| 3 | Heatmap scales (dark stage) | kicker "Heatmap", h2 "Three scales for the same lux map.", lead, captions Absolute / Norm / Deviation with their sentences | heatmap-panel-absolute, heatmap-panel-norm, heatmap-panel-deviation | 3 shot frames in one equal-height row, frame ground --panel; each PNG sits at the top of its frame at intrinsic ratio (Deviation is 60px taller, so the other two frames show 60px of --panel below the image; nothing is cropped or stretched); caption block (kicker + sentence) under each frame, top-aligned | none |
| 4 | 13pt Diagnostic | kicker "13pt Diagnostic", h2 "Read the distribution, not just the center.", lead "Press Values in the Heatmap panel...", readouts ANSI points 9 / Quarter-points 4 / Total 13 | none | Head left 7/12, readout strip right 5/12 | none |
| 5 | What the numbers mean | kicker "What the numbers mean", h2 "See what the estimate uses.", lead "...It is an optics-based planning estimate, not a lux-meter reading.", cards Inputs / Basis / Field check | none | 3-cell grid on --brand-100 tint or paper; buttons below | Open a scene, Back to product |

### D4. pricing.html

Job: say "free now" first, show the planned tiers exactly, answer four questions. Tier
names, prices, feature rows, billing labels and FAQ text are owner decisions and do not
change; the H2 "Choose a billing period." may be demoted to a label beside the tabs.

| # | Section | Copy anchor (keep) | Layout | CTA |
|---|---|---|---|---|
| 1 | Page hero | kicker "Pricing", H1 "Free during open beta.", lead "Everything we ship is free during open beta. No card, tier or checkout...", beta pill "Open beta . no paywall" | Compact: H1 left 7/12, pill under the lead; no figure | none |
| 2 | Plans | toolbar kicker "Planned pricing", "Choose a billing period." + tabs Weekly / Monthly / Yearly + `[data-period-note]`; three `[data-plan]` cards Projection (Core) / Pro (Full toolset) / Enterprise (Business) with their h3, "for" line, price line, billing line, four feature rows, "Planned after beta"; the three facts paragraphs | Toolbar: label left, tabs right (tabs are a segmented control, 40px, selected = --ink-950 fill). Cards: 3-cell grid, equal heights, price lines on one baseline, feature lists starting at one y, "Planned after beta" pinned to the bottom. Pro is the featured cell: --stage ground, --stage-text, kicker --brand-300. Facts: 3-col caption strip with hairline above | none |
| 3 | FAQ | kicker "Short answers", h2 "Pricing FAQ.", four `details` | 2-col: head 4/12, list 8/12; each `details` a hairline row with a plus/minus glyph (inline SVG) at the right; summary in h3 size | none |
| 4 | CTA | kicker "Use it now", h2 "Start free in open beta.", p "Use the current toolset on a real project while beta is free. No card required." | Centred | Start free |

Contract: keep `data-period`, `role="tab"`, `aria-selected`, `[data-period-note]`,
`[data-plan]`, `data-*-price/unit/billing`, `[data-plan-price]`, `[data-plan-unit]`,
`[data-plan-billing]`. Nit: the script only adds `.is-unavailable` for the strings
"Monthly only" and "Not available"; the Enterprise weekly cell says "No weekly pass". Either
add that string to the check in `site-experience.js` (the one permitted script edit) or
style `[data-plan-price]` so a text value reads at h3 size on its own.

### D5. videos.html

Job: the chapters are the content; the slot is a promise, not a hole.

| # | Section | Copy anchor (keep) | Layout | CTA |
|---|---|---|---|---|
| 1 | Page hero | kicker "Videos", H1 "Every step, shown in the app.", lead "Short walkthroughs organised by workflow... Clips are being recorded now; the steps are already written out below." | Compact, as pricing | none |
| 2 | Chapter index | kicker "Chapters", h2 "Nineteen chapters, six parts.", the 19 anchors | Group the 19 links under six part labels (A Start and venue 01-04, B Projectors 05-08, C Measurement 09-11, D Content 12-13, E Lighting 14-15, F Deliver 16-19) as a 3 x 2 cell grid of lists; hairline rows inside | none |
| 3 | 19 chapters | per chapter: kicker "Part X . Y . Chapter NN", h2, "Where:" line, the slot, the numbered steps, "You will see:" | At 1024 and up: 7/12 left = video slot (16:9); 5/12 right = Where row (label + `.ui-path`) then the step list, top-aligned with the slot; "You will see" as a full-width note under both. Below 1024: slot, Where, steps, note, stacked. A slim part divider (kicker only, hairline) opens each of the six parts. 96px between chapters | none |
| 4 | CTA | kicker "Try it now", h2 "Follow along in the app.", p "Every chapter above works in the open beta today..." | Centred | Start free, Explore product |

Contract: every slot keeps `class="v3-video-frame v3-video-frame--empty"`,
`data-video-slot="ch-NN-slug"`, `role="img"`, its `aria-label`, and the two inner spans
`.v3-slot-label` / `.v3-slot-note`, so the owner's publish instruction in the file's comment
still works. Keep the HTML comment.

### D6. privacy.html and 404.html

Harmonise header and footer only: replace the legacy `site-header` / `site-footer` markup
with the same header and footer as the other pages (same classes, same links, same motion
toggle). Body content and its classes stay; make sure its type still reads on the new
tokens. No other changes.

## E. Component inventory (both designers use these names)

| Name | Class | Spec |
|---|---|---|
| Header | `.v3-header`, `.v3-header-inner`, `.v3-brand`, `.v3-nav`, `.v3-header-actions`, `.v3-menu-toggle`, `.v3-mobile-nav` | Light, sticky, 64px; hairline on `.is-scrolled`; mobile panel toggled by the script |
| Skip link | `.v3-skip` | Visible on focus, primary button style |
| Button | `.v3-button`, `--primary`, `--secondary`, `--text`, `--small` | C5. Hero keeps `.btn.btn--brand` and `.btn.btn--text` |
| Kicker | `.v3-kicker` | C2 kicker; optional index |
| Section | `.v3-section`, `--stage`, `--tint` | Padding C3; stage = dark band; tint = --brand-100 or --paper-2 |
| Section head | `.v3-section-head` (kicker, h2 `.v3-h2`, lead `.v3-lead`) | Left aligned by default; `--center` only for CTA bands |
| Display | `.v3-display` | Page H1 only |
| Editorial row | `.v3-editorial`, `.v3-editorial--flip`, `.v3-editorial-copy` | 5/12 + 7/12 grid at 1024 and up, gap C3; copy `display:flex; flex-direction:column`, last child `margin-top:auto`; stacks below 1024 with the shot first |
| Shot | `.v3-shot` (figure), `.v3-shot img`, `.v3-shot figcaption`, `--panel` | C5 figure; on stage the border is --stage-line and the shadow is off |
| Cell grid | `.v3-cells`, `.v3-cell`, `--2`, `--3` | C5; 3 columns at 1280 and up, 2 at 768, 1 below |
| Readout strip | `.v3-readouts` (dl), `.v3-readout-label`, `.v3-readout-value`, `.unit`, `.v3-readout-sub` | C5 |
| Note | `.v3-note` | C5 |
| Text link | `.v3-text-link` | Kicker-size uppercase, --ink-900, 1px underline, inline SVG arrow 12px; hover --brand-900 |
| Statement band | `.v3-statement` | Stage band with head + text cells, no images |
| CTA band | `.v3-cta` | Centred head, p max 45rem, buttons row |
| Beta pill | `.v3-beta-pill` | C5 |
| Period tabs | `.v3-period-tabs` (role=tablist), buttons `[data-period]` | Segmented control, keyboard behaviour from the script |
| Price card | `.v3-price-card`, `--featured`, `.v3-plan-label`, `.v3-plan-chip`, `.v3-plan-for`, `.v3-price-line`, `.v3-price-billing`, `.v3-feature-list`, `.v3-plan-status` | D4 |
| FAQ | `.v3-faq` (details), summary | D4 |
| Chapter index | `.v3-chapter-index`, `.v3-chapter-part` | D5 |
| Chapter | `.v3-chapter`, `.v3-chapter-head`, `.v3-howto-where`, `.v3-howto` (ol), `.v3-howto-sees` | D5 |
| Video slot | `.v3-video-frame.v3-video-frame--empty`, `.v3-slot-label`, `.v3-slot-note` | C5 |
| UI path / key / unit | `.ui-path`, `.key`, `.unit` | C2 |
| Footer | `.v3-footer`, `.v3-footer-grid`, `.v3-footer-brand`, `.v3-footer-meta` | Light; 4 columns at 1024 and up (brand spans 2), stacked on phone |
| Reveal | `.v3-reveal` + `.is-in` | 240 ms opacity and 8px translateY; the script adds `.is-in`; no motion when `html[data-motion="reduced"]` |

## F. Acceptance checklist (reviewer scores each line pass or fail)

Truth
- [ ] No sentence on any page makes a claim absent from `APP_UI_INVENTORY.txt`; no new
  numbers, names, testimonials, logos, or "trusted by" content; manufacturer names appear
  only as catalogue data.
- [ ] Feature names match the app (Appendix 2); "Lux Heatmap" appears only in the locked hero.
- [ ] Zero em dashes, typographic quotes or arrow glyphs in copy: a scan for non-ASCII
  characters in the seven HTML files returns only what the current copy already carries
  (the copyright sign in the footer and the middle dot used as a kicker separator);
  `grep -n "&#8599;"` returns nothing.

Hierarchy and spacing
- [ ] One type scale (C2) and one spacing scale (C3): no font-size or margin value outside
  them (spot-check ten elements in DevTools).
- [ ] Headings are sentence case except kickers and the locked hero H1.
- [ ] Section padding, head-to-content and row gaps match C3 at 1920, 1440 and 390.

Alignment
- [ ] In every editorial row the copy's first line and the shot's top edge share a y; the
  copy's last element and the shot's bottom edge share a y (measure in DevTools, 2px
  tolerance).
- [ ] Every cell grid row has one bottom edge; price-card price lines share a baseline;
  "Planned after beta" lines share a y.
- [ ] Container is 1680 wide at 1920 and 1360 at 1440; gutters 16px at 390.

Image handling
- [ ] No `object-fit`, no `aspect-ratio` on any `<img>`; every screenshot renders at its
  intrinsic ratio at the full width of its column; every `<img>` keeps `width`/`height`
  attributes and `loading="lazy"` below the fold.
- [ ] Screenshots sit in a `.v3-shot` frame with the C5 ground and border; no dark image
  touches white directly.
- [ ] The three Heatmap panel PNGs are top-aligned in equal-height frames, uncropped.

Responsive
- [ ] No horizontal overflow at 390, 768, 1024, 1280, 1440, 1920 (shots.mjs reports
  "HORIZONTAL OVERFLOW" if there is; it must not).
- [ ] Phone: single column, 16px gutters, header collapses to the hamburger, hero elements all
  present, tables and readouts stack, video slot keeps 16:9.

Performance and hygiene
- [ ] `assets/tailwind.css` under 150 KB after `npm run build`.
- [ ] No console errors on any page at any of the three widths.
- [ ] No new web fonts, no external requests added, no new JS files.
- [ ] Reduced motion: with the footer toggle set to reduce, nothing animates except the
  embed itself.

Hero and contracts
- [ ] `section.hero` contains, unchanged in class and data attributes: `.hero-frame
  [data-embed-state]` with `iframe.hero-frame-embed[src="/embed?scene=hero"]`, `.hero-ticker`
  with two `.hero-ticker-group` lists, `h1.hero-title#hero-title` with `.hero-title-line`,
  `.type-slot > .type-word + .type-caret`, `.type-sr`, `.hero-copy` with `.hero-lead` and
  `.hero-actions`, `ul.hero-readout` with three `.hero-readout-item`, and `p.hero-caption`
  as a later sibling of `.hero-frame` inside the same parent (the caption's live-state CSS
  uses the sibling combinator).
- [ ] The embed loads and responds to drag; the ticker scrolls; the caret blinks.
- [ ] Pricing period tabs switch prices; the mobile menu opens and closes; app links carry
  `siteReturnUrl`; `.v3-reveal` items appear.
- [ ] Videos: 19 slots present with their `data-video-slot` ids; chapter text unchanged.
- [ ] Pricing: tier names, prices, billing strings, feature rows and FAQ text byte-identical
  to the source copy.
- [ ] `embed/`, `demo-scenes/`, `vercel.json`, `scripts/dev-server.mjs`,
  `scripts/light-field.js` untouched (`git diff --stat` shows none of them).

## G. Scoring rubric (100 points)

| Area | Points | What earns them |
|---|---|---|
| Truth and copy discipline | 20 | Every F-Truth line passes (10); copy trimmed where the brief says trim, nothing invented, app names exact (10) |
| Typographic hierarchy | 15 | One scale, sentence case, measures respected, kickers restrained (8); the page reads top-down without effort at 1920 and 390 (7) |
| Layout and alignment | 15 | Editorial pinning and cell-grid bottoms exact (8); container widths and 8pt rhythm exact (7) |
| Screenshot handling | 10 | Uncropped, framed, on the right ground, Heatmap PNG row correct (10) |
| Responsive | 15 | No overflow at six widths (5); phone stacks cleanly with 16px gutters (5); 1440 laptop still feels wide, not phone-like (5) |
| Design quality and direction fit | 10 | Reads as a premium 2026 tool site in the B direction: product-first, hairlines, quiet motion, cyan used as signal only (10) |
| Videos and pricing rules | 10 | Slot looks intentional and the chapter layout carries 19 chapters without fatigue (5); pricing cards align and the JS contract holds (5) |
| Performance and hygiene | 5 | CSS under 150 KB, no console errors, no new requests, reduced motion honoured (5) |
| Total | 100 | A design below 70 is returned with the failed lines; ties break on Truth |

## Appendix 1. Screenshot inventory (assets/media)

All `.webp` files are 2560 x 1440 (16:9), captured from the current production web build
(site commit 4b4dcc6, "fresh app screenshots"), both side panels open, the
`building_04.dae` facade scene with four Epson heads (F1 to F4 in blend group SCREEN 1;
F1 is an EB-PQ2220B). Alt texts in the current HTML describe each file and stay with it.

| File | What it shows | Used on |
|---|---|---|
| editor-beams.webp | F1 selected; its beam frustum with W 12542 mm / H 7055 mm labels and the 216 lx / 3.27 mm/px label on the facade; Inspector shows Projector Controls, Equipment (Epson, [20,000lm] EB-PQ2220B, Short/1.15-1.57/ELPLW06, 16:9), Optics (Throw Ratio 1.150:1, Beam W/H, Axial throw 14637 mm, Center Illuminance 216 lx); Play Dock strip at the bottom | product hero |
| editor-heatmap-values.webp | Same scene with Heatmap Overlay on: Surface Lux, Absolute, 0 to 875 ramp, Max lux 875, the Heatmap panel with Physics Model chip and Lens View / Values buttons, 13 probe labels with lux values across the facade | home tour 05, product workflow 04, measurement hero |
| feature-venue.webp | The imported building model selected on the ground grid, projected FieldLux loop on the facade, Scene Layers left, Inspector right, Measurement target Auto | home tour 01, product workflow 01 |
| feature-library.webp | The Projector Library dialog (Epson tab: EB-L30000U, Pro L30000U, EB-L30000U, EB-L25000U, EB-L20000U cards with Lens dropdowns and Add) over the dimmed editor | home tour 02, product workflow 02 |
| feature-placement.webp | The Projector Placement Tool window in Circular mode, Count 8, Live ghost preview ticked, Coordinate Table F1 Ring 1 to 8 with World X/Y/Z, Start Live / Bake Layout / Cancel, over the facade scene | home tour 03, product workflow 03 |
| feature-edge-blend.webp | The Inspector Edge Blending section (Blend Group Screen 1, Enable on, Blend Curve S-Curve, Right and Top edges enabled at 58 and 22 percent) and the soft seam on the facade | home tour 04 |
| feature-play-dock.webp | The Play Dock console open along the bottom: screens rail (Beam Wrap 1), mapping editor with the cyan canvas quad, Set / Panel / Blend / Adjust / Source cards, transport bar | home tour 06, product workflow 05 |
| feature-lighting-fog.webp | Moving Head Spot 1 and Fog Machine 2 in Scene Layers, the fog machine selected with its gizmo, the Fog Machine section (Type, Output, Fluid rate, Fluid, Plume spread, Plume reach, Nozzle velocity, Power) in the Inspector | home tour 07, product lighting |
| feature-share.webp | The Share 3D View dialog: Cloud Share block with link label, retire-previous-link option, "Link expires in" 7 days, "Require a password", Blend video / Base projection, the "What viewers can do" toggles, Create Cloud Share; FieldLux Account Share below | home tour 08, product workflow 06 |
| heatmap-panel-absolute.png (544 x 516) | The Heatmap panel: Surface Lux, Absolute, ramp 0 / 219 / 438 / 875, Max lux 875 lx, Lens View and Values | measurement scales |
| heatmap-panel-norm.png (544 x 516) | Same panel, Norm: ramp 0.0x / 0.9x / 1.0x / 1.1x / 2.0x, Ref lux | measurement scales |
| heatmap-panel-deviation.png (544 x 576) | Same panel, Deviation: ramp -20% / 0% / +20%, Scale +/-10 / 20 / 30% | measurement scales |
| hover-probe-demo.mp4, media-01-hero.mp4, software-demo.mp4 | Older builds (retired UI). Do not use. The video slots stay empty | none |

## Appendix 2. Vocabulary: names to use exactly, and names to avoid

Use exactly: Heatmap and Heatmap Overlay (not "Lux Heatmap", except the locked hero);
Surface Lux, Pixel Density, Luminance; Absolute, Norm, Deviation; Values; Lens View; 13pt
Diagnostic; Measurement target; Center Illuminance (Epson and Panasonic pairs backed by the
manufacturer calculator) and Center Surface Lux (Christie and custom heads); Projector
Library; Custom Projector; Placement Tool with Linear, Circular and Symmetry (not
"mirrored"); blend group; Auto-Blend; Play Dock; Output Setup; Warp & Blend; Media Library;
Lighting menu; My Fixtures; Working Plane (Isolux); Fog Machine; Volumetric Beams; PDF Tech
Rider; .flx.json; Cloud Share, URL Share, FieldLux Account Share, Share Management; Version
history; Design and Simulate workspaces; Scene Layers; Inspector; Import Floor Plan; New
Sketch; Edit Linework; Flip Normals; Basic Room, Flat Surface, Curved Wall, Cylinder,
Dome / Sphere, Background Photo; LED Wall; Report Builder (temporarily disabled in the beta).

Never write: Analyze workspace, Analysis panel, Run Analysis, Mapping Stage, Venue import,
Haze Machine, Realtime Output / Spout / Syphon / NDI (desktop only, absent on the web),
"every feature", "full product", "official partner", "trusted by", a customer name, a
manufacturer count other than the three listed, a projector count other than the page's own.

Numbers that already exist on the pages and may be reused: 8 projectors, 1.15 : 1, 0 to
875 lx (hero, locked); 53 / 32, 39 / 71, 5 / 37 (library, checked 2026-09-16); 9 + 4 = 13
probes; 21 material presets; 2 GB model storage; 1 GB media uploads; 19 chapters, six
parts; the pricing figures; the model and drawing formats as listed. No other number.

## Appendix 3. Script and CSS contract (must survive the redesign)

- `site-experience.js` reads: `[data-app-link]`, `[data-menu-toggle]` (aria-expanded),
  `[data-menu-panel]` (hidden), body class `v3-menu-open`, `.v3-header` + `.is-scrolled`,
  `.v3-reveal` + `.is-in`, `[data-motion-toggle]`, `html[data-motion="reduced|full"]`,
  `[data-period]`, `[data-period-note]`, `[data-plan]` and its data attributes,
  `[data-plan-price|unit|billing]`, `.is-unavailable`, `html[data-pricing-period]`.
- `light-field.js` reads: `[data-light-stage]`, `canvas[data-light-field]`,
  `[data-light-replay]`, and writes `--light-progress` on the stage; the overlay copy
  (`.v3-light-bridge-copy`, `.v3-light-transition`, `.v3-scroll-cue`, `.v3-replay`) is
  positioned and faded by that variable in CSS. Keep those rules, restyle the type.
- Hero CSS to keep (from `src/input.css`): `.hero`, `.hero-inner`, `.hero-frame`,
  `.hero-frame-embed`, `.hero-ticker*` and `@keyframes hero-ticker`, `.hero-block`,
  `.hero-title*`, `.type-slot`, `.type-word`, `.type-caret` and `@keyframes caret`,
  `.type-sr`, `.hero-copy`, `.hero-lead`, `.hero-actions`, `.btn`, `.btn--brand`,
  `.btn--text`, `.hero-readout*`, `.u-tabular`, `.stat-unit`, `.hero-caption*` including
  the `[data-embed-state="mounted"] ~ .hero-caption` rules, and the `html[data-motion]`
  rules that stop the ticker. You may retune their values to the new tokens.
- `.v3-video-frame.v3-video-frame--empty[data-video-slot]` with `.v3-slot-label` and
  `.v3-slot-note` (owner's publish instruction in the videos.html comment).
- `vercel.json` sets clean URLs: internal links are `/product`, `/videos`, never `.html`.
