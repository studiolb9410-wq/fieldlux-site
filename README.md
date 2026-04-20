# FieldLux — Landing Page

Marketing site for [FieldLux](https://github.com/studiolb9410-wq/projection-mapping), the projection preflight engine.

## Structure

```
fieldlux-site/
├── index.html            # landing page
├── src/input.css         # Tailwind source (edit this, not tailwind.css)
├── tailwind.config.js    # Tailwind theme (brand colors, fonts)
├── postcss.config.js
├── assets/
│   ├── tailwind.css      # built CSS — commit this, referenced by index.html
│   ├── logo.png
│   └── logo-mark.png
└── README.md
```

## Local development

```bash
npm install        # once
npm run watch      # rebuild assets/tailwind.css on every change
# then open index.html in a browser (or `npx serve .`)
```

## Production build

```bash
npm run build      # minified assets/tailwind.css
```

The built `assets/tailwind.css` is committed so the repo deploys directly to
any static host without a build step on the server.

> **Why not Tailwind Play CDN (`cdn.tailwindcss.com`)?**
> It runs a JIT compiler in the browser via JavaScript. On Safari/macOS,
> the script can load slowly or get blocked, causing white flashes,
> collapsed layouts, and scroll glitches (aspect-ratio placeholders
> lose their dimensions). Prebuilding the CSS eliminates all of that.

## Deploy

Any static host works. For Vercel:

```bash
npx vercel --prod
```

## Media slots

The page has labeled placeholders for screenshots + one hero video. Each slot
has a `data-label` and `data-caption` attribute describing what should go there.

When a screenshot is ready, replace the slot markup:

```html
<!-- BEFORE (placeholder) -->
<div class="media-slot aspect-[4/5]"
     data-label="📸 Screenshot 01"
     data-caption="Analysis panel with AT_RISK verdict ...">
</div>

<!-- AFTER (actual screenshot) -->
<div class="media-slot aspect-[4/5]">
    <img src="assets/01-analysis-panel.png" alt="Analysis panel" />
</div>
```

For the hero video slot, uncomment the video tag already present in the markup.

## Design tokens

- Background: `#0A0A0B` (surface-base)
- Accent: `#06B6D4` (brand) — matches the app
- Font: Inter (body) + Geist Mono (numbers / code)

## Sections

1. Hero + video
2. Stats strip
3. § 01 Judgment Engine
4. § 02 Stress Analysis
5. § 03 Prescription Engine
6. § 04 Pipeline Hub (Spout / Syphon / OSC)
7. § 05 Assumptions & Error Budget
8. § 06 Multi-target Analysis
9. § 07 Reliability
10. § 08 PDF Tech Rider
11. § 09 Deployment (Web vs Desktop)
12. CTA / Beta signup
13. Footer

## Beta signup wiring

The form currently calls `alert()` on submit. Wire it to the Supabase
`beta_requests` table when the backend is ready — see `src/features/cloud/`
in the main app repo for the existing Supabase client pattern.

## License

Proprietary — FieldLux beta. Do not redistribute.
