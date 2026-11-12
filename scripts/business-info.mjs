// Fills the business details the footer and the legal pages must show, and
// refuses to ship a production build that still shows a placeholder.
//
// The repository is public, so the operator's address and phone number are
// not committed. Every page carries <span data-biz="key">[Placeholder]</span>;
// on Vercel this script writes the value from the matching environment
// variable into the built files (the output directory is the repo root, and a
// Vercel build runs on a fresh checkout, so nothing is written back to git).
// Run anywhere else it only reports: it never edits the working tree.
//
//   FLX_BIZ_NAME_KO / FLX_BIZ_NAME_EN        trade name, Korean and English
//   FLX_BIZ_REP_KO / FLX_BIZ_REP_EN          representative
//   FLX_BIZ_ADDRESS_KO / FLX_BIZ_ADDRESS_EN  business address
//   FLX_BIZ_PHONE                            phone
//   FLX_BIZ_REG_NO                           business registration number
//   FLX_BIZ_MAIL_ORDER_NO                    mail-order business report number,
//                                            or "exempt" when reporting is not required
//
// An _EN value falls back to its _KO value. Elements marked data-todo are
// facts still to be confirmed in the source itself; they are never filled
// from the environment.
//
// A production build (VERCEL_ENV=production) fails while any placeholder or
// data-todo remains, so field-lux.com keeps its current deployment instead of
// going live with "[Business name]". FLX_ALLOW_PLACEHOLDERS=1 overrides that.
// Dropping a data-todo attribute is not enough either: any other bracketed
// text with a letter in it, such as "[Effective date]", left in the visible
// text or a visible attribute counts as a placeholder too.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;
const onVercel = env.VERCEL === '1';
const production = env.VERCEL_ENV === 'production';

const pick = (...names) => names.map((n) => String(env[n] ?? '').trim()).find(Boolean) || '';
const mailOrder = pick('FLX_BIZ_MAIL_ORDER_NO');
const exempt = mailOrder.toLowerCase() === 'exempt';
const values = {
  name_ko: pick('FLX_BIZ_NAME_KO'),
  name_en: pick('FLX_BIZ_NAME_EN', 'FLX_BIZ_NAME_KO'),
  rep_ko: pick('FLX_BIZ_REP_KO'),
  rep_en: pick('FLX_BIZ_REP_EN', 'FLX_BIZ_REP_KO'),
  address_ko: pick('FLX_BIZ_ADDRESS_KO'),
  address_en: pick('FLX_BIZ_ADDRESS_EN', 'FLX_BIZ_ADDRESS_KO'),
  phone: pick('FLX_BIZ_PHONE'),
  reg_no: pick('FLX_BIZ_REG_NO'),
  mail_order_ko: exempt ? '해당 없음(신고 면제)' : mailOrder,
  mail_order_en: exempt ? 'not required (exempt)' : mailOrder,
};

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SPAN = /(<span\b[^>]*\bdata-biz="([a-z_]+)"[^>]*>)([^<]*)(<\/span>)/g;
const TODO = /<[^>]*\bdata-todo(?:="([^"]*)")?[^>]*>/g;
const TODO_ELEMENT = /<([a-z][a-z0-9]*)\b[^>]*\bdata-todo\b[^>]*>[^<]*<\/\1>/gi;
const VISIBLE_ATTR = /\s(?:content|title|alt|aria-label|data-tooltip|data-label|placeholder|value)="([^"]*)"/gi;
const BRACKET = /\[[^[\]<>\n]*[A-Za-z\u3131-\u318e\uac00-\ud7a3][^[\]<>\n]*\]/g;

// Bracketed text the two checks above do not already count: the data-biz
// spans and the data-todo elements are taken out first.
function strayBrackets(html) {
  const rest = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(SPAN, ' ')
    .replace(TODO_ELEMENT, ' ');
  const found = [];
  for (const m of rest.matchAll(VISIBLE_ATTR)) for (const b of m[1].matchAll(BRACKET)) found.push(b[0]);
  for (const b of rest.replace(/<[^>]*>/g, ' ').matchAll(BRACKET)) found.push(b[0]);
  return found;
}

// Every page the site serves: the root pages, plus the customer stories in
// customers/ (served at /customers/<slug>). A page in a folder that is not
// listed here would ship without its business details AND skip the checks
// below, so add the folder here when you add one. embed/ is not a page: it
// is the bundled 3D app, and it shows no footer.
const PAGE_DIRS = ['', 'customers'];
const pages = PAGE_DIRS.flatMap((dir) => {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((f) => (dir ? `${dir}/${f}` : f));
});
const unknownKeys = new Set();
const left = [];
let filled = 0;

for (const page of pages) {
  const file = path.join(root, page);
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(SPAN, (whole, open, key, text, close) => {
    if (!(key in values)) {
      unknownKeys.add(`${page}: ${key}`);
      return whole;
    }
    if (!values[key]) return whole;
    filled += 1;
    return `${open}${escapeHtml(values[key])}${close}`;
  });
  for (const m of after.matchAll(SPAN)) {
    if (/^\s*\[.*\]\s*$/.test(m[3])) left.push(`${page}: data-biz="${m[2]}" ${m[3].trim()}`);
  }
  for (const m of after.matchAll(TODO)) left.push(`${page}: data-todo ${m[1] || ''}`.trim());
  for (const b of strayBrackets(after)) left.push(`${page}: ${b}`);
  if (onVercel && after !== before) fs.writeFileSync(file, after);
}

if (unknownKeys.size) {
  console.error(`business-info: unknown data-biz keys:\n  ${[...unknownKeys].join('\n  ')}`);
  process.exit(1);
}

const where = onVercel ? `Vercel ${env.VERCEL_ENV || '?'} build` : 'local check (files not modified)';
console.log(`business-info: ${where}, ${filled} value(s) ${onVercel ? 'written' : 'available'} across ${pages.length} pages`);
if (left.length) {
  const list = `  ${left.join('\n  ')}`;
  if (production && env.FLX_ALLOW_PLACEHOLDERS !== '1') {
    console.error(`business-info: refusing a production build with ${left.length} placeholder(s) left:\n${list}\nSet the FLX_BIZ_* variables in Vercel, resolve each data-todo in the source, or set FLX_ALLOW_PLACEHOLDERS=1.`);
    process.exit(1);
  }
  console.warn(`business-info: ${left.length} placeholder(s) left (allowed outside production):\n${list}`);
}
