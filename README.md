# FieldLux Site

Static marketing/product site for `field-lux.com`.

## Current Direction

The page is now structured as a real product site rather than a beta waitlist.
The 0517 branch focuses on the latest app capabilities from the FieldLux
workspace:

- Full-screen simulation hero slot, intentionally empty until the final visual is supplied.
- FieldLux heatmap modes: Absolute, Normalized, and Deviation.
- 13-point FieldLux distribution diagnostics with center, reference average, uniformity, edge, and hotspot metrics.
- Hover probe messaging for lux, pixel density, peak contribution, lens view, and lit receiver behavior.
- Cloud share messaging for URL share, Supabase-backed model uploads, read-only viewer, expiry, revoke, and account access.
- Case study and product media areas are blank upload slots so final images or videos can be attached later.
- Roadmap is status-based: now, next, later.

The visual direction references professional projection and VJ software sites:
dark stage, strong product name, large media surfaces, direct navigation,
measured product copy, and minimal explanatory filler.

## Build

```bash
npm install
npm run build
```

The build regenerates `assets/tailwind.css` from `src/input.css`.

## Full Flow Review

This branch supports a review-only app override without changing the production default.

Open the site with:

```text
?flowAppUrl=https%3A%2F%2Fprojection-mapping-git-public-signup-project-h-46a32f-field-lux.vercel.app%2F%3Fauth%3D1
```

All app CTAs with `data-app-link` will point to that URL for the current browser. Without the query string, CTAs keep using `https://app.field-lux.com`.

The Discord CTA is intentionally configurable because the public invite URL is not checked into the repo. For review, pass:

```text
?discordUrl=https%3A%2F%2Fdiscord.gg%2Fyour-invite
```

Only `discord.gg`, `discord.com`, and `*.discord.com` HTTPS links are accepted.

## Source Files

- `index.html` - main site
- `privacy.html` - privacy policy
- `src/input.css` - Tailwind input and custom site components
- `tailwind.config.js` - color tokens and content paths
- `assets/logo.png`, `assets/logo-mark.png` - brand assets
