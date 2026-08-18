/* Local preview server for the static site.
 *
 *   npm run serve            # http://localhost:4321
 *   npm run serve -- 5000    # different port
 *
 * This mirrors PRODUCTION, not merely "serves files". Three Vercel behaviours
 * are reproduced, and each one exists because getting it wrong hides a real
 * bug until deploy:
 *
 *   cleanUrls        /videos -> videos.html
 *   trailingSlash    /videos/ -> 308 -> /videos
 *   directory index  /embed -> embed/index.html, which is how the bundled 3D
 *                    hero is served. The app decides it is the embed by
 *                    comparing location.pathname to '/embed' exactly, so the
 *                    bundle MUST answer on that path and not on
 *                    /embed/index.html — at any other path the full editor
 *                    boots and rewrites the URL.
 *
 *   HEADERS          vercel.json's headers are replayed here, including the
 *                    CSP and the frame rules. This is the important one. The
 *                    site sends `X-Frame-Options: DENY` and
 *                    `frame-ancestors 'none'` on every path EXCEPT /embed;
 *                    a plain file server sends neither, so the hero would
 *                    frame perfectly in local development and be refused by
 *                    the browser in production. Keep these in step with
 *                    vercel.json or local stops predicting production.
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PORT = Number(process.argv[2] || process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.glb': 'model/gltf-binary',
  '.obj': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

/* ── the two header sets from vercel.json ──────────────────────────────────
   Split exactly where vercel.json splits them: the global entry excludes
   /embed at the source level, because Vercel applies every matching entry
   cumulatively and has no way to UNSET a header — so /embed has to miss the
   global rule entirely or it would keep X-Frame-Options: DENY and stay
   unframable no matter what its own entry says. */
const COMMON = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()',
};

const GLOBAL_HEADERS = {
  ...COMMON,
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; " +
    "script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; " +
    "base-uri 'self'; form-action 'self'",
};

const EMBED_HEADERS = {
  ...COMMON,
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; " +
    "script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; " +
    "child-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
};

const isEmbedDocument = (pathname) => pathname === '/embed' || pathname === '/embed/';

/* Cache-Control, also from vercel.json. The hero is ~14 MB the first time and
   must be ~0 bytes every time after that, on a site whose only scaling limit is
   bytes served — so the numbers matter enough to keep them honest locally.
   Everything NOT listed stays no-store, deliberately: those are the files being
   authored, and a cached tailwind.css during a design pass is its own bug. */
const cacheControl = (pathname) => {
  // Content-hashed by the bundler: a change is a new filename, so it can never
  // be served stale and never needs revalidating.
  if (pathname.startsWith('/embed/assets/')) return 'public, max-age=31536000, immutable';
  // The document that NAMES those hashes must not be cached, or a rebuild ships
  // an index pointing at chunks the browser will not re-fetch.
  if (isEmbedDocument(pathname)) return 'public, max-age=0, must-revalidate';
  // Stable names with changing contents. stale-while-revalidate is what keeps a
  // traffic spike off the origin: the CDN answers instantly from cache and
  // refreshes behind the request rather than making visitors wait for it.
  if (pathname.startsWith('/demo-scenes/')) return 'public, max-age=86400, stale-while-revalidate=2592000';
  if (pathname.startsWith('/test-patterns/')) return 'public, max-age=604800, stale-while-revalidate=2592000';
  return 'no-store';
};

const fileOrNull = (p) => {
  try {
    const s = statSync(p);
    return s.isFile() ? s : null;
  } catch {
    return null;
  }
};

const isDir = (p) => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
};

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);

  // trailingSlash: false — /videos/ is not a distinct URL.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(308, { Location: pathname.replace(/\/+$/, '') + url.search });
    return res.end();
  }

  // Keep every resolved path inside ROOT — normalize first so ../ cannot escape.
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let target = join(ROOT, safe);
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  let stat = fileOrNull(target);

  if (!stat && pathname === '/') {
    target = join(ROOT, 'index.html');
    stat = fileOrNull(target);
  }

  // cleanUrls: /videos -> videos.html
  if (!stat && !extname(target)) {
    const candidate = `${target}.html`;
    const candidateStat = fileOrNull(candidate);
    if (candidateStat) {
      target = candidate;
      stat = candidateStat;
    }
  }

  // directory index: /embed -> embed/index.html
  if (!stat && isDir(target)) {
    const candidate = join(target, 'index.html');
    const candidateStat = fileOrNull(candidate);
    if (candidateStat) {
      target = candidate;
      stat = candidateStat;
    }
  }

  if (!stat) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', ...GLOBAL_HEADERS });
    return res.end('<h1>404</h1><p>Not found on the static site.</p>');
  }

  const type = TYPES[extname(target).toLowerCase()] || 'application/octet-stream';
  const headers = {
    'Content-Type': type,
    'Cache-Control': cacheControl(pathname),
    ...(isEmbedDocument(pathname) ? EMBED_HEADERS : GLOBAL_HEADERS),
  };

  // Range support so the browser can scrub the hero video instead of
  // re-downloading 10 MB on every seek.
  const range = req.headers.range;
  if (range && /^bytes=/.test(range)) {
    const [startRaw, endRaw] = range.replace('bytes=', '').split('-');
    const start = Number(startRaw) || 0;
    const end = endRaw ? Math.min(Number(endRaw), stat.size - 1) : stat.size - 1;
    if (start >= stat.size) {
      res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
      return res.end();
    }
    res.writeHead(206, {
      ...headers,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    });
    return createReadStream(target, { start, end }).pipe(res);
  }

  res.writeHead(200, { ...headers, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
  createReadStream(target).pipe(res);
}).listen(PORT, () => {
  console.log(`FieldLux site  ->  http://localhost:${PORT}`);
});
