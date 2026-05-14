# FieldLux Site

Static product site for `field-lux.com`.

## Current Positioning

This is no longer a closed-beta waitlist page. The site presents FieldLux as a public launch product:

- `Start free` and `Sign in` point to `https://app.field-lux.com`.
- Existing beta testers are described as Founding Members.
- The roadmap is state-based: `Available now`, `In active build`, `Later`.
- The hero uses a real app screenshot at `assets/product-workspace.png`.

## Build

```bash
npm ci
npm run build
```

The build writes the compiled Tailwind CSS to `assets/tailwind.css`.

## Source Files

- `index.html` - product site
- `privacy.html` - account/project privacy copy
- `src/input.css` - Tailwind entry and small component utilities
- `assets/logo.png`, `assets/logo-mark.png` - brand assets
- `assets/product-workspace.png` - app screenshot used in the hero
