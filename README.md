# FieldLux Site

Static marketing/product site for `field-lux.com`.

## Current Direction

The page is now structured as a real product site rather than a beta waitlist:

- Full-screen simulation hero slot, intentionally empty until the final visual is supplied.
- FieldLux logo cyan is the main accent color.
- Current feature areas are present as blank upload slots.
- Case studies are marked as uploading soon.
- Roadmap is status-based: now, next, later.

The visual direction references projection/VJ software sites such as MadMapper and Resolume: dark stage, strong product name, large media surfaces, direct navigation, and minimal explanatory filler.

## Build

```bash
npm install
npm run build
```

The build regenerates `assets/tailwind.css` from `src/input.css`.

## Source Files

- `index.html` - main site
- `privacy.html` - privacy policy
- `src/input.css` - Tailwind input and custom site components
- `tailwind.config.js` - color tokens and content paths
- `assets/logo.png`, `assets/logo-mark.png` - brand assets
