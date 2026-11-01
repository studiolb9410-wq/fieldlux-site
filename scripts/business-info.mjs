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

const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort();
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
