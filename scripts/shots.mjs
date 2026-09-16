// Screenshot helper for the FieldLux site redesign.
// usage: node <this file> <port> <outDir> <path|name|full?>...   e.g.
//   node shots.mjs 4331 C:/tmp/shots "|home|full" "product|product|" "videos#ch-05|ch05|"
// Runs real Chrome (GPU) at 1920x1080, 1440x900 and 390x844, reveals .v3-reveal, eager-loads lazy images,
// writes <outDir>/<name>-<desk|lap|phone>.png and prints console errors.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('C:/fieldlux/0506/.claude/worktrees/relaxed-boyd-8600f2/package.json');
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [port, outDir, ...targets] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const sizes = [[1920, 1080, 'desk'], [1440, 900, 'lap'], [390, 844, 'phone']];
for (const [w, h, tag] of sizes) {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--use-gl=angle', '--use-angle=d3d11', '--ignore-gpu-blocklist', '--no-sandbox', '--hide-scrollbars', '--mute-audio'], defaultViewport: { width: w, height: h, deviceScaleFactor: 1 } });
  try {
    for (const t of targets) {
      const [path, name, full] = t.split('|');
      const page = await browser.newPage();
      const errors = []; page.on('pageerror', e => errors.push('PAGEERROR ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(`http://localhost:${port}/${path}`, { waitUntil: 'networkidle2', timeout: 90000 });
      await page.evaluate(() => { document.documentElement.dataset.motion = 'reduced'; document.querySelectorAll('.v3-reveal,.reveal').forEach(e => e.classList.add('is-in', 'is-visible')); document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); });
      if (path.includes('#')) await page.evaluate((h) => document.querySelector(h)?.scrollIntoView(), '#' + path.split('#')[1]);
      await sleep(900);
      await page.evaluate(async () => { for (const i of document.querySelectorAll('img')) { if (!i.complete) await new Promise(r => { i.onload = r; i.onerror = r; }); } });
      const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      await page.screenshot({ path: `${outDir}/${name}-${tag}.png`, fullPage: full === 'full' });
      console.log(`${name}-${tag}: ${errors.length ? 'ERRORS ' + errors.slice(0, 3).join(' | ') : 'no console errors'}${hasHScroll ? ' | HORIZONTAL OVERFLOW' : ''}`);
      await page.close();
    }
  } finally { await browser.close(); }
}
