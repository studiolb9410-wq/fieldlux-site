# FieldLux Site

Static marketing site for `field-lux.com`. Plain HTML plus a Tailwind CLI build -
no bundler, no framework, no runtime dependencies.

The authoritative document for this build is `docs/REDESIGN_SPEC_0814.md`. Where this
README and the spec disagree, the spec wins.

## Pages

| Route | File | Notes |
|---|---|---|
| `/` | `index.html` | The product, ten chapters, the numbers, the limits |
| `/videos` | `videos.html` | Feature videos - 43 slots across the same ten chapters |
| `/pricing` | `pricing.html` | Viewer, Projection and Pro, as a 7-day pass (one payment, no renewal), monthly or yearly. Buying starts in the app (the plan picker), never on this page |
| `/checkout` | `checkout.html` | Paddle's checkout for a payment link (`?_ptxn=`), opened by the app in a new tab; also Paddle's default payment link. noindex, not in the sitemap. See "Checkout page" below |
| `/terms` | `terms.html` | Terms of Service (English) |
| `/refund` | `refund.html` | Refund and cancellation policy (English). Must say the same rule as the app's `REFUND_RULE` |
| `/privacy` | `privacy.html` | Privacy policy (English) |
| - | `404.html` | Not-found page |
| - | `sitemap.xml`, `robots.txt` | `sitemap.xml` lists every page above except 404 and `/checkout` |

The app links `https://field-lux.com/terms`, `/refund`, `/privacy` and `/pricing` from its
sign-up and checkout screens, so these four routes must never 404.

`vercel.json` sets `cleanUrls: true` and `trailingSlash: false`, so internal links are
written `/privacy` and `/videos` - **never** with a `.html` suffix.

`outputDirectory` is `"."`, which makes the repo root the web root. Anything committed
here is publicly served unless `.vercelignore` lists it (`docs/`, this README and the
local tooling are listed). Do not put internal preview URLs, tokens or
customer names in the repo.

## Direction

- The page is white (`--paper`). Exactly three things on the site are dark, and each is
  dark because the content inside it is: the hero frame that hosts the live 3D embed, and
  the full-bleed product video letterboxes.
- The site is English only (the bilingual pass was reverted by the owner on 2026-08-15).
  The legal pages, `/terms`, `/refund` and `/privacy`, carried a Korean version from
  2026-10-31; the owner removed it on 2026-11-09 ("English only"), so all three are
  English only too. Do not add Korean text to any page.
- Copy is plain ASCII, everywhere, including comments. No em dashes, no accented
  spellings, no typographic quotes, no arrows, no math glyphs. Rewrite the sentence
  rather than reach for a character the self-hosted font subset may not carry: the
  Geologica latin subset has no U+2197, so an arrow in a CTA renders as tofu.
- A claim ships only if a visitor could reach the thing it describes in the deployed app
  today. Every headline figure comes from the verified stat pool in the spec, and every
  lux number carries its qualifier in the same sentence.
- Motion honours `prefers-reduced-motion` everywhere, and the footer carries a tri-state
  motion toggle (on / off / follow the OS) so a reduced-motion visitor can opt back in.
  Every page stores the choice in `localStorage['fieldlux_motion']` as `on` or `off`
  (spec 5.9). The v3 pages stored `full` and `reduced` until 2026-11; both scripts read
  those as the same choice and rewrite them.
- Video never carries an `autoplay` attribute. Playback is JS-gated, so it stays off for
  reduced-motion and data-saver visitors and the poster frame carries the page alone.

## Build

```bash
npm install
npm run build     # scripts/business-info.mjs, then tailwindcss -i ./src/input.css -o ./assets/tailwind.css --minify
npm run watch     # the --watch variant
npm run preview   # local server on :4173
```

`npm run preview` runs `scripts/preview-server.py`, which reproduces the three
things in `vercel.json` that decide whether a link works: `cleanUrls` (so
`/videos` serves `videos.html`), `trailingSlash:false` (so `/videos/` redirects),
and `404.html` for anything missing. **Do not preview this site with
`python3 -m http.server`**: it answers 404 to every nav link, because every
internal link on the site is written `/videos` and never `/videos.html`.

`assets/tailwind.css` is a **tracked build artifact** and is not gitignored. Vercel
regenerates it on every deploy, so production is always fresh - but editing `src/input.css`
or the markup without running `npm run build` produces a stale-CSS commit and a confusing
local preview. Always run the build before committing.

`tailwind.config.js` `content` is `['./*.html', './src/**/*.{html,js}']`. Every page at the
repo root is covered automatically. Narrowing this glob back to a file list silently purges
every utility on any page not named in it.

## Business details, placeholders and launch switches

Korean e-commerce law asks every page to show the operator's trade name, representative,
address, phone, business registration number, mail-order report number, email and
hosting provider. The repository is public, so the address and phone are **not committed**.
Every page carries placeholders instead:

```html
<span data-biz="name_en">[Business name]</span>
```

`scripts/business-info.mjs` runs first in `npm run build`. On Vercel it writes these
environment variables into the built pages (a Vercel build works on a fresh checkout, so
nothing goes back to git); anywhere else it only reports what is missing.

| Variable | Shown as | Keys |
|---|---|---|
| `FLX_BIZ_NAME_KO`, `FLX_BIZ_NAME_EN` | trade name | `name_ko`, `name_en` |
| `FLX_BIZ_REP_KO`, `FLX_BIZ_REP_EN` | representative, also the privacy officer | `rep_ko`, `rep_en` |
| `FLX_BIZ_ADDRESS_KO`, `FLX_BIZ_ADDRESS_EN` | business address | `address_ko`, `address_en` |
| `FLX_BIZ_PHONE` | phone | `phone` |
| `FLX_BIZ_REG_NO` | business registration number | `reg_no` |
| `FLX_BIZ_MAIL_ORDER_NO` | mail-order report number, or `exempt` | `mail_order_ko`, `mail_order_en` |

An `_EN` value falls back to its `_KO` value. Write the trade name exactly as it appears
on the Paddle account and the payout bank account.

Elements marked `data-todo` are facts still to confirm in the source itself (the
effective dates of the legal pages, the support mailbox provider). Edit them in the HTML
and drop the attribute.

**A production build fails while any placeholder or `data-todo` is left**, so
field-lux.com keeps its current deployment instead of going live with "[Business name]".
Any other bracketed text with a letter in it, left in the visible text or a visible
attribute, counts as a placeholder too: dropping a `data-todo` attribute without writing
the fact still fails the build. Preview builds show the placeholders.
`FLX_ALLOW_PLACEHOLDERS=1` overrides the check.

Copy that changes on the two launch days carries `data-launch`:

| Marker | When | Change |
|---|---|---|
| `data-launch="announce"` | the day the start date is posted | `/pricing` hero: "Paid plans start on {weekday, month day, year} at 09:00 KST (00:00 UTC). Until then, everything is free. If this date changes, we will update this page at least 14 days before the date shown." The "Checkout is not open yet" fact: "These prices apply from the start date above. Nothing is charged before then." The "When do paid plans start?" answer names the date. "Not on sale yet" on the cards: "On sale from the start date". |
| `data-launch="live"` | the day paid plans start | `/pricing` hero, pill and CTA: "Try every feature free for 21 days. No card required." Remove the open-beta FAQ and the "Checkout is not open yet" fact. Home, product, videos and 404: drop "free during open beta" and "Checkout is not available yet". The home and product open-beta blocks (kicker, headline, lead and the "planned pricing" button) and the home and pricing meta descriptions go with them. Document pages: drop the BETA badge and the Discord tooltip's "Beta access is free" sentence. Footer: "(c) 2026 FieldLux." without "Open beta." |

Find every switch with `grep -n 'data-launch=' *.html`.

The open-beta popup (`scripts/beta-notice.js`, loaded on every page, skipped on `/pricing`) is a launch switch too: on the day the start date is posted, change its copy to the exact date; on the day paid plans start, remove its `<script>` tag from every page.

## Checkout page - `/checkout`

Added 2026-11-11. Paddle approved field-lux.com for checkout; the app at
app.field-lux.com sits behind its sign-in and is not approved, and Paddle.js only
opens a checkout on an approved domain. So the app's billing server creates the
Paddle transaction and opens `https://field-lux.com/checkout?_ptxn=txn_...` in a new
tab, and this page is also the account's **default payment link** in Paddle: card
updates and invoices land here too.

- `checkout.html` + `scripts/checkout-page.js`. No `?_ptxn`: a plain "There is no
  payment to open here" message, and nothing is loaded from Paddle. With one: Paddle.js
  v2 from `cdn.paddle.com`, `Paddle.Initialize` with the build-time token; Paddle.js
  opens the checkout for `?_ptxn` by itself (overlay, `allowLogout: false`). On
  `checkout.completed`: "Payment received. You can close this tab and return to
  FieldLux." On close or `checkout.error`: "Nothing was charged", with the way back
  (and, after a close, a button to open the checkout again). Nothing is sent back to
  the app: the app's own tab sees the purchase through its server.
- **The client-side token is set in Vercel, not in git**: `FLX_PADDLE_CLIENT_TOKEN`
  (`live_...` for Production, `test_...` for Preview). `scripts/paddle-config.mjs`
  runs in `npm run build` and writes it into the page's
  `<meta name="flx-paddle-token">`; the environment is the token's prefix
  (`FLX_PADDLE_ENV`, if set, must agree). It fails the build on a malformed token, a
  disagreeing `FLX_PADDLE_ENV`, or a `test_` token on a production build. Without a
  token the page says checkout is not available - so the site deploys as before until
  the token is set.
- **Headers (`vercel.json`)**: `/checkout` has its own entry and the global entry
  skips it, as for `/embed` (Vercel applies every matching entry and cannot unset a
  header). Only that page allows Paddle: `script-src https://cdn.paddle.com` (and no
  `'unsafe-inline'` - the page has no inline script), the checkout frame
  `buy.paddle.com` / `sandbox-buy.paddle.com`, Paddle's stylesheet from
  `cdn.paddle.com` / `sandbox-cdn.paddle.com`, `connect-src` to `api.paddle.com` /
  `sandbox-api.paddle.com`, `Permissions-Policy payment=` for the checkout frame
  (Apple Pay), and `Cross-Origin-Opener-Policy: same-origin-allow-popups` so Paddle's
  Apple Pay popup (used on a domain not verified for Apple Pay) keeps its opener.
  Paddle documents no CSP list; these origins are the ones Paddle.js 2.11.0 itself
  uses. Paddle Retain's script (`public.profitwell.com`) is not allowed - add it if
  Retain is turned on. `X-Robots-Tag: noindex, nofollow`. `scripts/dev-server.mjs`
  replays the same set.
- Kept out of `sitemap.xml`, and `noindex` in the page head too.
- **Order on the day** (owner, with the app's runbook): set `FLX_PADDLE_CLIENT_TOKEN`
  in Vercel, merge to `main` (= deploy), check that `/checkout` shows "There is no
  payment to open here", then set Paddle's Default payment link to
  `https://field-lux.com/checkout`.
- The `/privacy` sentence "reading this site sends no request to a third party" does
  not hold for `/checkout` once it opens a payment. That is a legal-text decision
  for the owner (see the PR).

## Review overrides

Two overrides exist for review builds. Each reads a query parameter, persists it in
`localStorage` for that browser, and changes nothing about the production default.
The v3 pages run them from `scripts/site-experience.js`, the document pages (`/privacy`,
`/terms`, `/refund`, 404) from `scripts/document-page.js`; the allowlists are the same.

### App CTA target - `?flowAppUrl=`

Every CTA carrying `data-app-link` points at `https://app.field-lux.com` and appends
`siteReturnUrl=<the current page>` so the app can send the visitor back. All three pages
use the same rewriting. Modifier-click and middle-click pass through untouched, so
cmd-click still opens a new tab.

To retarget the CTAs at another FieldLux host:

```text
?flowAppUrl=https%3A%2F%2Fstaging.field-lux.com%2F
```

The accepted value is stored under `sessionStorage['fieldlux_flow_app_url']` (origin and
path only; a query or #hash is dropped) and applies only in that browser tab, so one
shared link cannot repoint a visitor's buttons for good. A value the older script left in
localStorage is removed on the next visit (changed 2026-11-09).

**Host allowlist.** Only HTTPS on `app.field-lux.com` or another `*.field-lux.com` host is
accepted, on the default port and without user info. `*.vercel.app` and `localhost` are
not: anyone can create a `vercel.app` host, and a `javascript://localhost/...` value once
passed the old localhost exception.

Anything else - any other host, port or protocol - is rejected. The CTAs fall back to
`https://app.field-lux.com` **and the stored key is cleared**, so a bad value cannot
persist for that visitor.

The allowlist is the point. Without it, `?flowAppUrl=https://somewhere-else.example`
would rewrite every CTA on the site to an attacker-chosen sign-in destination. A site whose argument is that it does not overclaim cannot
carry an open-redirect-shaped surface on its primary CTA.

### Discord invite - `?discordUrl=`

Document pages only. Every link carrying `data-discord-link` points at the live invite;
`?discordUrl=https%3A%2F%2Fdiscord.gg%2Fyour-invite` retargets it. Only HTTPS links on
`discord.gg`, `discord.com` and `*.discord.com`, on the default port, are accepted, and
the value is stored under `localStorage['fieldlux_discord_url']`. Anything else falls back
to the live invite and clears the stored key, as for the CTA.

### Not implemented

`?embedSrc=`, described in `docs/REDESIGN_SPEC_0814.md`, is not implemented: the hero
frame always loads `/embed` from this origin. `privacy.html` lists exactly the keys the
pages write.

## Phone hero

At 680px and below the home hero is the layout the owner picked on 2026-11-09: the scene
runs edge to edge in a 4:5 frame, the copy continues on its dark ground, and a fingertip on
the floor shows the swipe (the gesture coach). The scene loads by itself once the page has
loaded and the frame is on screen (with Save-Data on, one tap on the still starts it), shows
real progress, fades in only when it has drawn, and turns on the first sideways swipe. The
rules are the 1109 phone hero section at the end of `src/input.css`; the behaviour is the
hero block of `scripts/site-experience.js` and section (h) of `scripts/build-embed.mjs`.

The phone frame loads `/embed?scene=hero-portrait&intro=0`. `demo-scenes/hero-portrait.json`
is `hero.json` with an upright opening shot, generated by `node scripts/make-hero-portrait.mjs`
(`--check` verifies it); re-run it whenever `hero.json` changes, and capture a new
`assets/media/hero-poster-portrait*.webp` from that scene if the shot changes.

## Publishing a feature video

`/videos` has one slot per chapter, twenty in all. A slot's published state is **authored
in the markup**, not probed at runtime, so the page is right with JavaScript disabled and
before any image has loaded.

The whole workflow:

1. Record the clip at 1920 x 1080 following the chapter's numbered steps, in order - the
   chapter text is the shooting script. Clean scene, no client project names in the outliner.
2. Encode it (below). Each file must be **4 MB or less**.
3. Grab a poster: a frame that shows the result of the steps, 200 KB or less.
4. Put both files in `assets/media/features/`, named after the slot.
5. In `videos.html`, replace the slot's placeholder spans with the `<video>` element shown
   in the comment at the top of the page, drop `v3-video-frame--empty` and the slot's
   `role="img"` / placeholder `aria-label`.
6. Commit and push.

### Naming - the only thing that can go wrong

- The basename **must** equal the slot's `data-video-slot` value, exactly (`ch-03-floor-plans`).
- Lowercase ASCII and hyphens. No spaces, no underscores, no Korean, no version suffixes.
- Both the `.mp4` and the `.jpg` are required.
- To replace a clip, **overwrite the same two filenames**. Never add a `v2`.

### Encode

```bash
ffmpeg -i RAW.mov   -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p   -crf 21 -preset slow   -g 300 -keyint_min 60 -sc_threshold 0   -maxrate 6M -bufsize 12M   -vf "fps=30"   -an -movflags +faststart   assets/media/features/<slug>.mp4
```

| Setting | Value | Why |
|---|---|---|
| Container / codec | MP4, H.264 High @ L4.1, `yuv420p` | Universal. HEVC and AV1 both have desktop-browser holes |
| `-movflags +faststart` | **mandatory** | Puts `moov` ahead of `mdat` so playback starts before the file finishes downloading |
| No rescale | omit any `scale=` filter that changes size | Rescaling only softens UI text. A full-range source (JPEG frames) gets `scale=in_range=full:out_range=tv` and nothing else |
| Frame rate | 30 fps | Plenty for UI walkthroughs |
| Quality | CRF 21, `-preset slow`, 6 Mbps cap; raise CRF one step at a time only when the file would exceed 4 MB | The published clips sit at CRF 21-26. A clip that needs more than 26 is too long or has moving content behind it: pause the Play Dock and trim idle time rather than going softer |
| Keyframes | `-g 300` (10 s) | These clips are mostly static UI: a 2 s keyframe interval cost about 40 % more bytes for no visible gain, and the browser still seeks to any frame |
| Audio | **stripped** (`-an`) | Every clip is silent; audio inflates the file and creates a playback-policy hazard |
| Size | **4 MB or less per file** | The redesign spec's media budget |

### Poster

```bash
ffmpeg -ss <seconds> -i assets/media/features/<slug>.mp4   -frames:v 1 -q:v 4 assets/media/features/<slug>.jpg
```

JPEG at the source resolution, q approx. 4, 200 KB or less. Pick a moment that shows what the
chapter achieves (the walls raised, the fog lit), never frame 0 - frame 0 is usually
mid-transition or an empty scene.

The current `/videos` page reads no manifest; a clip's duration comes from the file itself.

## Source files

- `index.html`, `product.html`, `measurement.html`, `videos.html`, `pricing.html`,
  `terms.html`, `refund.html`, `privacy.html`, `404.html`, `checkout.html` - the pages
- `scripts/checkout-page.js` - `/checkout`: loads Paddle.js for a payment link and says what happened
- `scripts/paddle-config.mjs` - writes the Paddle client-side token into `/checkout` on Vercel and guards it
- `scripts/site-experience.js` - the v3 pages: CTA target, header, reveals, motion toggle, pricing period
- `scripts/document-page.js` - the document pages: CTA target, Discord link, motion, nav overlay, reveals
- `scripts/business-info.mjs` - fills the business details on Vercel and guards production
- `.vercelignore` - keeps `docs/`, this README and the local tooling off the website
- `src/input.css` - the design tokens and every site component class
- `tailwind.config.js` - the colour scale and the content glob
- `vercel.json` - clean URLs and the security headers, including the CSP
- `assets/fonts/` - self-hosted Geologica and Pretendard. **The CSP has no external
  origins (except Paddle's, on `/checkout` only); re-adding a hosted font link ships
  the page as unstyled text**
- `assets/media/`, `assets/media/features/` - product captures and feature clips
- `docs/REDESIGN_SPEC_0814.md` - the build specification
