/* Derive the phone hero's upright scene from demo-scenes/hero.json.
 *
 *   node scripts/make-hero-portrait.mjs          # write
 *   node scripts/make-hero-portrait.mjs --check  # verify only, non-zero if stale
 *
 * WHY. The embed keeps the camera's vertical field of view and lets the width
 * follow the frame, so the landscape opening shot authored in hero.json crops
 * the building in an upright phone frame (measured at 393x491: the left wing
 * is cut off). The phone hero (a 4:5 frame, the full width of the screen)
 * asks for hero-portrait.json instead: the SAME scene with one change, the
 * opening shot. assets/media/hero-poster-portrait*.webp is a still of it;
 * capture a new one if the shot changes.
 *
 * THE SHOT. From the authored camera the view is turned 6 degrees toward the
 * projected facade, the target is lowered so the building stands in the upper
 * part of the frame (the lower part is dark floor, where the phone layouts put
 * type and controls), and the camera is pulled back along its own line of
 * sight. Numbers chosen from renders at 360x450 and 393x491.
 *
 * Everything else is copied, so re-run this whenever hero.json changes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'demo-scenes/hero.json');
const SHOTS = [
  { file: 'hero-portrait.json', pullBack: 1.3, dropM: 4, turnDeg: -6 },
];

const hero = JSON.parse(readFileSync(SRC, 'utf8'));
const cam = hero.cameraSnapshot;
if (!cam || !cam.position || !cam.target) {
  console.error('  FAILED: hero.json has no cameraSnapshot with position and target.');
  process.exit(1);
}
const round = (n) => Math.round(n * 100) / 100;
const check = process.argv.includes('--check');
let stale = 0;

for (const shot of SHOTS) {
  const a = (shot.turnDeg * Math.PI) / 180;
  const target = { x: cam.target.x, y: round(cam.target.y - shot.dropM), z: cam.target.z };
  const d = { x: cam.position.x - cam.target.x, y: cam.position.y - cam.target.y, z: cam.position.z - cam.target.z };
  const turned = { x: d.x * Math.cos(a) + d.z * Math.sin(a), y: d.y, z: -d.x * Math.sin(a) + d.z * Math.cos(a) };
  const position = {
    x: round(target.x + turned.x * shot.pullBack),
    y: round(target.y + turned.y * shot.pullBack),
    z: round(target.z + turned.z * shot.pullBack),
  };
  const next = JSON.stringify({ ...hero, cameraSnapshot: { ...cam, position, target } }) + '\n';
  const out = join(ROOT, 'demo-scenes', shot.file);
  let current = null;
  // A Windows checkout may hand the file back with CRLF; that is not a change.
  try { current = readFileSync(out, 'utf8').replace(/\r\n/g, '\n'); } catch (_) {}
  if (current === next) { console.log(`  demo-scenes/${shot.file} is in sync with hero.json.`); continue; }
  if (check) { console.error(`  STALE: demo-scenes/${shot.file}`); stale += 1; continue; }
  writeFileSync(out, next);
  console.log(`  demo-scenes/${shot.file} written (camera ${JSON.stringify(position)} -> ${JSON.stringify(target)}).`);
}
if (stale) {
  console.error('  FAILED: run node scripts/make-hero-portrait.mjs');
  process.exit(1);
}
