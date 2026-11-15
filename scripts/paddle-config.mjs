// Writes the Paddle client-side token into checkout.html at build time, and
// refuses a build that would ship a checkout pointed at the wrong Paddle.
//
// /checkout (checkout.html) is the page every Paddle checkout link opens
// (field-lux.com/checkout?_ptxn=txn_...; owner decision 2026-11-11). It needs
// a Paddle client-side token: live_... for the live account, test_... for the
// sandbox. Client-side tokens are public by design (Paddle docs: "safe to
// expose in frontend code"), so nothing secret is written, but the repository
// is public and the token belongs to the deployment, not the source - so it
// comes from the environment, like the business details (business-info.mjs).
//
//   FLX_PADDLE_CLIENT_TOKEN   live_... (Production) or test_... (Preview)
//   FLX_PADDLE_ENV            optional; production | sandbox. When set it must
//                             agree with the token's prefix, which decides.
//
// On Vercel the two <meta> tags of checkout.html are filled; anywhere else
// this only reports (it never edits the working tree).
//
// Fails the build (exit 1) when:
//   - the token is set but is not live_... / test_... letters and digits;
//   - FLX_PADDLE_ENV is set to anything else, or disagrees with the prefix;
//   - a production build (VERCEL_ENV=production, field-lux.com) has a test_ token.
// A missing token is allowed everywhere: /checkout then says checkout is not
// available (and Paddle sends nobody there until the default payment link
// points at it). Only the token's prefix and length are ever printed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;
const onVercel = env.VERCEL === '1';
const production = env.VERCEL_ENV === 'production';
const page = path.join(root, 'checkout.html');

const token = String(env.FLX_PADDLE_CLIENT_TOKEN ?? '').trim();
const envText = String(env.FLX_PADDLE_ENV ?? '').trim().toLowerCase();
const fromToken = token.startsWith('live_') ? 'production' : token.startsWith('test_') ? 'sandbox' : null;
const fromEnv = envText === 'production' || envText === 'live' ? 'production' : envText === 'sandbox' ? 'sandbox' : null;
const shown = token ? `${token.slice(0, 5)}... (${token.length} characters)` : 'none';

const problems = [];
if (token && !/^(live|test)_[A-Za-z0-9]+$/.test(token)) problems.push(`FLX_PADDLE_CLIENT_TOKEN is not a Paddle client-side token (live_... or test_...): ${shown}`);
if (envText && !fromEnv) problems.push(`FLX_PADDLE_ENV must be production or sandbox (it is ${envText.length} characters long)`);
if (fromEnv && fromToken && fromEnv !== fromToken) problems.push(`FLX_PADDLE_CLIENT_TOKEN is a ${fromToken} token but FLX_PADDLE_ENV says ${fromEnv}`);
if (production && fromToken === 'sandbox') problems.push('a sandbox token (test_...) on a production build: field-lux.com would open sandbox checkouts');

if (problems.length) {
  console.error(`paddle-config: refusing the build:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

const html = fs.readFileSync(page, 'utf8');
const TOKEN_TAG = /<meta name="flx-paddle-token" content="[^"]*">/;
const ENV_TAG = /<meta name="flx-paddle-env" content="[^"]*">/;
if (!TOKEN_TAG.test(html) || !ENV_TAG.test(html)) {
  console.error('paddle-config: checkout.html lost its <meta name="flx-paddle-token"> or <meta name="flx-paddle-env"> tag');
  process.exit(1);
}

const where = onVercel ? `Vercel ${env.VERCEL_ENV || '?'} build` : 'local check (files not modified)';
if (!token) {
  console.warn(`paddle-config: ${where}, no FLX_PADDLE_CLIENT_TOKEN - /checkout will say checkout is not available`);
} else {
  console.log(`paddle-config: ${where}, ${fromToken} token ${shown} ${onVercel ? 'written to' : 'available for'} checkout.html`);
}

if (onVercel && token) {
  const after = html
    .replace(TOKEN_TAG, `<meta name="flx-paddle-token" content="${token}">`)
    .replace(ENV_TAG, `<meta name="flx-paddle-env" content="${fromToken}">`);
  fs.writeFileSync(page, after);
}
