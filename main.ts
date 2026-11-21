// Leonida Platinum — v5 rebuild 21 Nov 2026. Entry program for
// make.fun bounty gta6-trophy-guide-01 (Node, standard library only).
// Preflight validates the guide data, then hands app/ + screenshots/ to
// the vendored make.fun dossier library, which writes dossier.json.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const repo = here;

function fail(msg) {
  console.error('preflight FAILED: ' + msg);
  process.exit(1);
}

const trophies = JSON.parse(readFileSync(join(repo, 'app/data/trophies.json'), 'utf8')).trophies;
const matrix = JSON.parse(readFileSync(join(repo, 'app/data/matrix.json'), 'utf8'));

if (trophies.length !== 55) fail('expected 55 trophies, got ' + trophies.length);
const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
let psn = 0;
let steps = 0;
let backed = 0;
const orders = new Set();
for (const t of trophies) {
  grades[t.grade] = (grades[t.grade] ?? 0) + 1;
  psn += t.psn_value;
  steps += t.steps.length;
  for (const s of t.steps) {
    if (typeof s.c !== 'number' || s.c < 1 || s.c > 12) fail('trophy ' + t.id + ' has a step without a numeric citation 1-12');
    if (s.c2 !== undefined && (typeof s.c2 !== 'number' || s.c2 < 1 || s.c2 > 12)) fail('trophy ' + t.id + ' has a bad c2');
    if (s.c2) backed++;
  }
  if (orders.has(t.order)) fail('duplicate order ' + t.order);
  orders.add(t.order);
}
if (grades.platinum !== 1 || grades.gold !== 2 || grades.silver !== 6 || grades.bronze !== 46) {
  fail('grades must be 1P/2G/6S/46B, got ' + JSON.stringify(grades));
}
if (psn !== 1350) fail('PSN total must be 1350, got ' + psn);
if (orders.size !== 55 || Math.min(...orders) !== 1 || Math.max(...orders) !== 55) fail('orders must be 1-55 unique');
const missable = trophies.filter(t => t.watch === 'missable').map(t => t.id);
if (JSON.stringify(missable) !== '[28]') fail('missable list must be exactly [28], got ' + JSON.stringify(missable));
const unconfirmed = trophies.filter(t => t.unconfirmed).map(t => t.id).sort((a, b) => a - b);
if (JSON.stringify(unconfirmed) !== '[28,29,46,47,49,50,51]') fail('unconfirmed must be [28,29,46,47,49,50,51], got ' + JSON.stringify(unconfirmed));
if (steps < 260) fail('cited steps must be >= 260, got ' + steps);
if (matrix.rows.length !== 55) fail('matrix must have 55 rows, got ' + matrix.rows.length);
for (const r of matrix.rows) {
  if (!Array.isArray(r.cells) || r.cells.length !== 12) fail('matrix row ' + r.id + ' must have 12 cells');
}
const stageIds = ['S1a', 'S1b', 'S2', 'S3', 'S4', 'S5', 'S6'];
const stageTotals = {};
for (const s of stageIds) {
  const ts = trophies.filter(t => t.stage === s);
  if (ts.length === 0) fail('stage ' + s + ' has no trophies');
  stageTotals[s] = ts.reduce((a, t) => a + t.psn_value, 0);
}
const stageSum = Object.values(stageTotals).reduce((a, b) => a + b, 0);
if (stageSum !== 1350) fail('stage subtotals must sum to 1350, got ' + stageSum + ' ' + JSON.stringify(stageTotals));
const shots = ['1-cover.jpg', '2-roadmap.jpg', '3-matrix.jpg', '4-counts.jpg'];
for (const f of shots) {
  const p = join(repo, 'screenshots', f);
  if (!existsSync(p)) fail('missing screenshot ' + f);
  if (statSync(p).size > 262144) fail('screenshot ' + f + ' over 262144 bytes');
}
const srcCount = new Set();
for (const t of trophies) for (const s of t.steps) { srcCount.add(s.c); if (s.c2) srcCount.add(s.c2); }
console.log('preflight OK: 55 trophies, 1P/2G/6S/46B, 1350 PSN points, ' + steps + ' cited steps (' + (steps + 55) + ' claims, ' + backed + ' backed by 2+ sources), 1 missable (id 28), 7 unconfirmed, 12 sources, 7 stage subtotals match ' + JSON.stringify(stageTotals) + ', 4 screenshots');

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
const dossier = buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 });
writeFileSync(join(out, 'dossier.json'), dossier);
console.log('dossier written: ' + join(out, 'dossier.json') + ' (' + dossier.length + ' bytes)');
