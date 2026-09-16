# Redesign 0916, designer A: self check against section F of the brief

Screenshots: `docs/redesign-0916/shots-A/<page>-<desk|lap|phone>.png` (1920 / 1440 / 390), pages
home, product, measurement, pricing, videos, plus `ch05-*` and `ch12-*` (videos.html scrolled to
chapters 05 and 12). Every run of `scripts/shots.mjs` printed "no console errors" and no
"HORIZONTAL OVERFLOW" for all 21 captures. The numbers quoted below were read from the DOM with a
puppeteer probe (getBoundingClientRect / getComputedStyle) at 390, 768, 1024, 1280, 1440 and 1920.

## Truth

| Item | Result | Evidence |
|---|---|---|
| No claim absent from APP_UI_INVENTORY.txt; no new numbers, names, testimonials, logos, "trusted by" | PASS | Every sentence is the existing copy deck, cut or re-ordered only. The home Handoff trio (D1 row 5) is deleted, as the brief allows. Six kicker labels were added on the videos page ("Part A · Start and venue" etc.) built from the existing chapter kickers. No other words were added. |
| Feature names match Appendix 2; "Lux Heatmap" only in the locked hero | PASS | `grep -n "Lux Heatmap" *.html` returns index.html hero readout and hero caption only. |
| Zero em dashes, typographic quotes, arrow glyphs; non-ASCII scan returns only what the copy carried | PASS | Scan of the seven files: U+00B7 (kicker separators), U+00A9 (footer), U+00B2 (cd/m² in the existing videos copy). `grep -n "&#8599;"` returns nothing; arrows are inline SVG in `.v3-text-link`. |

## Hierarchy and spacing

| Item | Result | Evidence |
|---|---|---|
| One type scale (C2) and one spacing scale (C3) | PASS | Computed at 1920 / 1440 / 390: display 88 / 75.8 / 44, h2 56 / 50.9 / 32, h3 26 / 25.4 / 20, lead 22 / 22 / 18, body 17 / 16.7 / 16, caption 14, kicker 12, readout 44 / 42.2 / 28, price 76 (tabular). Section padding 128 / 128 / 64, head to content 48, cell padding 32 (24 phone), editorial column gap 96 / 96 / 32, lead margin 24. All spacing is written as `--sp-*` tokens from the 8pt scale; the only non-scale numbers are control insets (3px inside the 40px segmented control, 5px hamburger bar gap). |
| Headings sentence case except kickers and the locked hero H1 | PASS | Product and measurement H1/H2 rewritten in sentence case with the same words; privacy and 404 titles keep their authored body copy (D6: body content stays). |
| Section padding, head-to-content and row gaps match C3 at 1920, 1440, 390 | PASS | See computed values above; tour rows 96 at 1024 and up, 64 stacked; chapters 96 apart. |

## Alignment

| Item | Result | Evidence |
|---|---|---|
| Editorial rows: copy first line = shot top, copy last element = shot bottom (2px) | PASS | Probe at 1024 / 1280 / 1440 / 1920 for all 8 home rows and the product lighting row: top delta 0, bottom delta 0. `shots-A/home-desk.png`, `home-lap.png`. The frame stretches to the copy when the copy is taller, so the pin holds at every desktop width. |
| Every cell grid row has one bottom edge; price lines share a baseline; "Planned after beta" share a y | PASS | Cell grids use `gap:1px` with stretched cells; price cards are CSS subgrid rows: at 1280 / 1440 / 1920 price-line bottoms 1086 / 1072 / 1077 identical across the three cards, status tops identical, feature-list tops identical. `shots-A/pricing-desk.png`. |
| Container 1680 at 1920, 1360 at 1440, 16px gutters at 390 | PASS | Probe: 1680@120, 1360@40, 358@16. |

## Image handling

| Item | Result | Evidence |
|---|---|---|
| No object-fit or aspect-ratio on any img; intrinsic ratio at full column width; width/height and loading="lazy" kept | PASS | `grep -n "aspect-ratio\|object-fit" src/input.css` hits only `.hero-frame` (iframe host) and `.v3-video-frame--empty` (placeholder div). Every `<img>` keeps width/height; the two above-the-fold page-hero shots are eager, all others lazy. |
| Screenshots sit in a `.v3-shot` frame with C5 ground and border; no dark image touches white | PASS | `.v3-shot-frame`: --stage-2 ground, 1px --line, 8px radius, --shadow-shot on paper; on stage --stage-line and no shadow. Product workflow cells carry the shot flush at the top with a hairline under it. |
| Three Heatmap PNGs top-aligned in equal-height frames, uncropped | PASS | `.v3-panel-row` subgrid rows: frame heights 570 / 570 / 570 at 1920 (image heights 540 / 540 / 570 inside), 457 / 457 / 457 at 1440; --panel ground shows below the two shorter PNGs. `shots-A/measurement-desk.png`. |

## Responsive

| Item | Result | Evidence |
|---|---|---|
| No horizontal overflow at 390, 768, 1024, 1280, 1440, 1920 | PASS | Probe on all seven pages at the six widths: scrollWidth == clientWidth everywhere; shots.mjs printed no "HORIZONTAL OVERFLOW". |
| Phone: single column, 16px gutters, hamburger, hero elements present, readouts stack, slot keeps 16:9 | PASS | `shots-A/home-phone.png`, `pricing-phone.png`, `ch05-phone.png`; slot 358 x 201 at 390, 924 x 520 (1.778) at 1920. The hero H1 sets on three lines at 390 (44px display token); every hero element is present. |

## Performance and hygiene

| Item | Result | Evidence |
|---|---|---|
| assets/tailwind.css under 150 KB | PASS | 47.8 KB after `npm run build` (was 91.7 KB). |
| No console errors at the three widths | PASS | 21 captures, all "no console errors"; probe at six widths, none. |
| No new web fonts, external requests, JS files | PASS | Same two self-hosted families; no new `<script>` files (privacy and 404 now load the existing `site-experience.js` for the shared header, menu and motion toggle); all icons inline SVG. |
| Reduced motion via the footer toggle: nothing animates except the embed | PASS | With `html[data-motion="reduced"]`: `.v3-reveal` static, ticker `animation: none`, caret `animation: none; opacity: 1`, light-field static via the script, all transitions 0s. Verified with the probe (caret and ticker animation names read "none"). |

## Hero and contracts

| Item | Result | Evidence |
|---|---|---|
| section.hero keeps every element and class / data attribute | PASS | Probe: `.hero-frame[data-embed-state] iframe.hero-frame-embed[src="/embed?scene=hero"]`, two `.hero-ticker-group`, `h1.hero-title#hero-title .hero-title-line`, `.type-slot > .type-word + .type-caret`, `.type-sr`, `.hero-copy .hero-lead` and `.hero-actions`, three `.hero-readout-item`, `p.hero-caption` a later sibling of `.hero-frame` in `.hero-inner`; live caption state `display: inline`. |
| Embed loads and responds to drag; ticker scrolls; caret blinks | PASS | Checked in a real Chrome tab at 421, 1280 and 1920 wide (the headless capture paints the embed black, as it did for the before shots). Ticker and caret animation names present under `data-motion="full"`. |
| Pricing tabs switch prices; mobile menu opens and closes; app links carry siteReturnUrl; reveals appear | PASS | Probe: weekly $9 / $12 / "No weekly pass" (the Enterprise card gets `.is-unavailable`, price at h3 size), yearly $32 / $40 / $82 with billing strings; menu `aria-expanded` and `hidden` toggle with `body.v3-menu-open`; `href` = `https://app.field-lux.com/?siteReturnUrl=...`; `.is-in` added by the script. |
| Videos: 19 slots with their data-video-slot ids; chapter text unchanged | PASS | 19 ids from ch-01-start to ch-19-settings-shortcuts; kicker, h2, Where, steps, You will see, slot label and note text-diffed against HEAD: identical for all 19. |
| Pricing: tier names, prices, billing strings, feature rows, FAQ text byte-identical | PASS | Card text, all `data-*-price/unit/billing` attributes and the FAQ text diffed against HEAD: identical. |
| embed/, demo-scenes/, vercel.json, scripts/dev-server.mjs, scripts/light-field.js untouched | PASS | `git diff --stat` lists none of them. `scripts/site-experience.js` has the one permitted edit (adds "No weekly pass" to the `.is-unavailable` check). |

## Conscious deviations from the brief

1. Hero composition: the frame sits at full container width and the H1 block is set below it (allowed by D1), with the lead and buttons beside the H1 in a 7/12 + 5/12 editorial row rather than under it. The readout strip and caption follow full width.
2. Readout strips are open hairline tables (hairline above, vertical hairlines between cells) rather than bordered cell grids; the brief lists both a cell grid and a "hairline above the strip", and the open strip is the quieter reading.
3. The home Handoff trio is dropped (D1 row 5 offers it as optional).
4. CTA bands use the --brand-100 tint (the one tint band per page); the product "Read what lands" band uses --paper-2.
5. The `.key` chip component is defined but not used: the only shortcut mentions sit inside parentheses in the chapter text, and wrapping them would have changed the punctuation of copy the brief locks.
