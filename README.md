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
| `/pricing` | `pricing.html` | The published price plan. Nothing purchasable yet |
| `/privacy` | `privacy.html` | Privacy policy |
| - | `404.html` | Not-found page |
| - | `sitemap.xml`, `robots.txt` | `sitemap.xml` lists `/`, `/videos`, `/pricing`, `/privacy` |

`vercel.json` sets `cleanUrls: true` and `trailingSlash: false`, so internal links are
written `/privacy` and `/videos` - **never** with a `.html` suffix.

`outputDirectory` is `"."`, which makes the repo root the web root. Anything committed
here is publicly served, this file included. Do not put internal preview URLs, tokens or
customer names in the repo.

## Direction

- The page is white (`--paper`). Exactly three things on the site are dark, and each is
  dark because the content inside it is: the hero frame that hosts the live 3D embed, and
  the full-bleed product video letterboxes.
- The site is English only. The bilingual pass was reverted by the owner on 2026-08-15,
  so no Korean ships on any page.
- Copy is plain ASCII, everywhere, including comments. No em dashes, no accented
  spellings, no typographic quotes, no arrows, no math glyphs. Rewrite the sentence
  rather than reach for a character the self-hosted font subset may not carry: the
  Geologica latin subset has no U+2197, so an arrow in a CTA renders as tofu.
- A claim ships only if a visitor could reach the thing it describes in the deployed app
  today. Every headline figure comes from the verified stat pool in the spec, and every
  lux number carries its qualifier in the same sentence.
- Motion honours `prefers-reduced-motion` everywhere, and the footer carries a tri-state
  motion toggle (on / off / follow the OS) so a reduced-motion visitor can opt back in.
- Video never carries an `autoplay` attribute. Playback is JS-gated, so it stays off for
  reduced-motion and data-saver visitors and the poster frame carries the page alone.

## Build

```bash
npm install
npm run build     # tailwindcss -i ./src/input.css -o ./assets/tailwind.css --minify
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

## Review overrides

Three overrides exist for review builds. Each reads a query parameter, persists it in
`localStorage` for that browser, and changes nothing about the production default.

### App CTA target - `?flowAppUrl=`

Every CTA carrying `data-app-link` points at `https://app.field-lux.com` and appends
`siteReturnUrl=<the current page>` so the app can send the visitor back. All three pages
use the same rewriting. Modifier-click and middle-click pass through untouched, so
cmd-click still opens a new tab.

To retarget the CTAs at a review build:

```text
?flowAppUrl=https%3A%2F%2Fmy-preview-build.vercel.app%2F%3Fauth%3D1
```

The accepted value is stored under `localStorage['fieldlux_flow_app_url']` and applies
until it is overridden or cleared.

**Host allowlist.** Only these are accepted:

| Accepted | Example |
|---|---|
| `field-lux.com` and any subdomain, over HTTPS | `https://app.field-lux.com` |
| any `*.vercel.app` host, over HTTPS | `https://my-preview-build.vercel.app` |
| `localhost` / `127.0.0.1`, over HTTPS **or** plain HTTP | `http://localhost:5173` |

Anything else - any other host, any other protocol - is rejected. The CTAs fall back to
`https://app.field-lux.com` **and the stored key is cleared**, so a bad value cannot
persist for that visitor.

The allowlist is the point. Without it, `?flowAppUrl=https://somewhere-else.example`
would rewrite every CTA on the site to an attacker-chosen sign-in destination and keep it
that way for that browser. A site whose argument is that it does not overclaim cannot
carry an open-redirect-shaped surface on its primary CTA.

### Discord invite - `?discordUrl=`

Every link carrying `data-discord-link` points at the live invite. To retarget it:

```text
?discordUrl=https%3A%2F%2Fdiscord.gg%2Fyour-invite
```

Only HTTPS links on `discord.gg`, `discord.com` and `*.discord.com` are accepted. The
value is stored under `localStorage['fieldlux_discord_url']`. Accepted links are given
`target="_blank"` and `rel="noopener noreferrer"`.

### Hero embed - `?embedSrc=`

`index.html` only. The hero frame ships as a still with a hidden launch button; the demo
iframe is created on an explicit click and never before. Its URL is configuration, read
from `data-embed-src` on `.hero-frame`, which ships **empty** because the demo deployment
does not exist yet. With no usable URL the button stays `hidden`, so the no-JS state and
the JS state are identical - no dead button, no empty iframe.

To point a review build at a demo deployment:

```text
?embedSrc=https%3A%2F%2Fmy-preview-build.vercel.app%2Fembed%23share%3D<payload>
```

The accepted value is stored under `localStorage['fieldlux_embed_src']` and applies until
it is overridden or cleared.

**Host allowlist.** Identical to `?flowAppUrl=` - the same `isAllowedAppHost` function
validates both:

| Accepted | Example |
|---|---|
| `field-lux.com` and any subdomain, over HTTPS | `https://demo.field-lux.com` |
| any `*.vercel.app` host, over HTTPS | `https://my-preview-build.vercel.app` |
| `localhost` / `127.0.0.1`, over HTTPS **or** plain HTTP | `http://localhost:5173` |

Anything else is rejected, and the stored key is cleared, so a bad value cannot persist
for that visitor - the same contract as `flowAppUrl`. The frame then falls back to
whatever `data-embed-src` declares, which today is nothing, so it stays a still.

The demo is a **separate deployment** and must never point at the signed-in app. The
iframe is sandboxed `allow-scripts allow-same-origin`, with `allow-top-navigation` and
`allow-forms` deliberately absent, so an embed can never navigate this site away.

All three keys are documented for visitors in `privacy.html`.

## Publishing a feature video

`/videos` carries 43 slots across the ten chapters. A slot's published state is **authored
in the markup**, not probed at runtime - that is what keeps the publication counters
correct with JavaScript disabled and before any image has loaded.

The whole workflow:

1. Record the clip in a 1920 x 1080 window. Clean scene, no client project names in the
   outliner. Hide the OS cursor unless the clip is about pointing.
2. Encode it.
3. Grab a poster.
4. Drop both files in `assets/media/features/`.
5. In `videos.html`, on that card: add `has-media` to the `.video-card-media` span and
   remove `video-card--pending` from the `<article>`. **Two class edits, no new markup.**
6. Commit and push.

### Naming - the only thing that can go wrong

- The basename **must** equal the slug already written on the card, exactly.
- Lowercase ASCII and hyphens. No spaces, no underscores, no Korean, no version suffixes.
- Both the `.mp4` and the `.jpg` are required.
- To replace a clip, **overwrite the same two filenames**. Never add a `v2`.

### Encode

```bash
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
| Container / codec | MP4, H.264 High @ L4.1, `yuv420p` | Universal. HEVC and AV1 both have desktop-browser holes |
| `-movflags +faststart` | **mandatory** | Puts `moov` ahead of `mdat` so playback starts before the file finishes downloading. Without it, hover previews stall |
| No rescale | omit any `scale=` filter | The source is already 1918 or 1912 wide; rescaling only softens UI text |
| Frame rate | 30 fps, **60 fps for drag-response clips** | Those clips are about latency and 30 fps flattens it. Bump `-crf` to 23 at 60 |
| Quality | CRF 21, `-preset slow`, 6 Mbps cap | Flat UI regions compress hard; typical result is 2-4 Mbps |
| Keyframes | `-g 60` (2 s) | Responsive seeking in the lightbox |
| Audio | **stripped** (`-an`) | Every preview is muted; audio inflates the file and creates a playback-policy hazard |
| Size | target <= 12 MB, hard cap 25 MB | |

### Poster

```bash
ffmpeg -ss 00:00:01.5 -i assets/media/features/<slug>.mp4 \
  -frames:v 1 -q:v 4 assets/media/features/<slug>.jpg

# batch: a poster for every mp4 that lacks one
for f in assets/media/features/*.mp4; do
  [ -f "${f%.mp4}.jpg" ] || ffmpeg -y -ss 1.5 -i "$f" -frames:v 1 -q:v 4 "${f%.mp4}.jpg"
done
```

JPEG at the source resolution, q approx.  4, <= 200 KB. Take it at about 1.5 s, never frame 0 -
frame 0 is usually mid-transition or black.

### Optional manifest

`assets/media/features/manifest.json` is not required for a video to appear. It only
carries extras the filesystem cannot express, is fetched once, and a missing file is
caught and ignored.

```json
{ "auto-edge-blend": { "duration": 44, "badge": "new" } }
```

## Source files

- `index.html`, `videos.html`, `pricing.html`, `privacy.html`, `404.html` - the pages
- `src/input.css` - the design tokens and every site component class
- `tailwind.config.js` - the colour scale and the content glob
- `vercel.json` - clean URLs and the security headers, including the CSP
- `assets/fonts/` - self-hosted Geologica and Pretendard. **The CSP has no external
  origins; re-adding a hosted font link ships the page as unstyled text**
- `assets/media/`, `assets/media/features/` - product captures and feature clips
- `docs/REDESIGN_SPEC_0814.md` - the build specification
