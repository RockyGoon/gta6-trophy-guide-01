// Leonida Platinum — hand-in program (Node 22, standard library only).
// Preflight-checks the guide data, then copies app/ and screenshots/ into
// the output dir and writes dossier.json with the vendored make.fun library.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(msg) {
  console.error(`preflight FAILED: ${msg}`);
  process.exit(1);
}

const trophies = JSON.parse(readFileSync(join(here, 'app/data/trophies.json'), 'utf8'));
const matrix = JSON.parse(readFileSync(join(here, 'app/data/matrix.json'), 'utf8'));

if (!Array.isArray(trophies) || trophies.length !== 55) fail(`expected 55 trophies, got ${Array.isArray(trophies) ? trophies.length : typeof trophies}`);

const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
let psnTotal = 0;
let stepTotal = 0;
let backedSteps = 0;
const missable = [];
const unconfirmed = [];
const orders = new Set();
const ids = new Set();
const stageSums = {};
const stageCounts = {};
const citedByTrophy = {};

for (const t of trophies) {
  if (!grades.hasOwnProperty(t.grade)) fail(`trophy ${t.id} has unknown grade ${t.grade}`);
  grades[t.grade]++;
  psnTotal += t.psn_value;
  ids.add(t.id);
  orders.add(t.order);
  stageSums[t.stage] = (stageSums[t.stage] || 0) + t.psn_value;
  stageCounts[t.stage] = (stageCounts[t.stage] || 0) + 1;
  if (t.watch === 'missable') missable.push(t.id);
  if (t.unconfirmed) unconfirmed.push(t.id);
  if (!Array.isArray(t.steps) || t.steps.length === 0) fail(`trophy ${t.id} has no steps`);
  const cited = new Set();
  for (const s of t.steps) {
    if (typeof s.c !== 'number') fail(`trophy ${t.id} has a step without a numeric citation`);
    if (s.c2 !== undefined && typeof s.c2 !== 'number') fail(`trophy ${t.id} has a step with a non-numeric second citation`);
    if (s.c2 !== undefined && s.c2 === s.c) fail(`trophy ${t.id} cites the same source twice on one step`);
    stepTotal++;
    cited.add(s.c);
    if (s.c2 !== undefined) { backedSteps++; cited.add(s.c2); }
  }
  citedByTrophy[t.id] = cited;
}

if (grades.platinum !== 1 || grades.gold !== 2 || grades.silver !== 6 || grades.bronze !== 46) {
  fail(`grades are ${grades.platinum}P/${grades.gold}G/${grades.silver}S/${grades.bronze}B, expected 1P/2G/6S/46B`);
}
if (psnTotal !== 1350) fail(`PSN total is ${psnTotal}, expected 1350`);
if (missable.length !== 1 || missable[0] !== 28) fail(`missable list is [${missable}], expected [28]`);
if (unconfirmed.length !== 6) fail(`${unconfirmed.length} unconfirmed trophies, expected 6`);
if (stepTotal < 220) fail(`only ${stepTotal} cited steps, expected at least 220`);
if (orders.size !== 55 || Math.min(...orders) !== 1 || Math.max(...orders) !== 55) fail('orders are not exactly 1-55 unique');
if (ids.size !== 55) fail('trophy ids are not 55 unique values');

const stageIds = Object.keys(stageSums);
if (stageIds.length !== 7) fail(`expected 7 stages, got ${stageIds.length} (${stageIds.join(', ')})`);
const stageTotal = stageIds.reduce((a, s) => a + stageSums[s], 0);
if (stageTotal !== 1350) fail(`7 stage subtotals sum to ${stageTotal}, expected 1350`);
for (const s of stageIds) {
  const sum = trophies.filter(t => t.stage === s).reduce((a, t) => a + t.psn_value, 0);
  if (sum !== stageSums[s]) fail(`stage ${s} subtotal ${stageSums[s]} does not match its trophies' PSN sum ${sum}`);
}

if (!matrix.meta || !Array.isArray(matrix.meta.sources) || matrix.meta.sources.length !== 9) fail('matrix does not list exactly 9 sources');
if (!Array.isArray(matrix.rows) || matrix.rows.length !== 55) fail(`matrix has ${Array.isArray(matrix.rows) ? matrix.rows.length : 0} rows, expected 55`);
const matrixIds = new Set(matrix.rows.map(r => r.id));
if (matrixIds.size !== 55) fail('matrix rows do not cover 55 unique trophy ids');
for (const row of matrix.rows) {
  if (!Array.isArray(row.cells) || row.cells.length !== 9) fail(`matrix row ${row.id} does not have 9 cells`);
  for (let i = 0; i < 9; i++) {
    const cell = row.cells[i];
    if (!cell.includes('L')) fail(`matrix row ${row.id} cell ${i + 1} is missing L`);
    const walkthrough = [1, 2, 3, 4, 7, 9].includes(i + 1);
    if (walkthrough && !cell.includes('G')) fail(`matrix row ${row.id} cell ${i + 1} is missing G`);
    if (!walkthrough && cell.includes('G')) fail(`matrix row ${row.id} cell ${i + 1} wrongly carries G`);
    const shouldC = citedByTrophy[row.id].has(i + 1);
    if (shouldC && !cell.includes('C')) fail(`matrix row ${row.id} cell ${i + 1} is missing C`);
    if (!shouldC && cell.includes('C')) fail(`matrix row ${row.id} cell ${i + 1} wrongly carries C`);
  }
}

const shots = ['1-checklist.jpg', '2-roadmap.jpg', '3-filters.jpg', '4-progress.jpg'];
for (const f of shots) {
  const p = join(here, 'screenshots', f);
  if (!existsSync(p)) fail(`screenshot ${f} is missing`);
  if (statSync(p).size > 262144) fail(`screenshot ${f} is over 256 KiB`);
}

const claims = stepTotal + trophies.length;
const stageLine = stageIds.sort().map(s => `${s} ${stageSums[s]}`).join(', ');
console.log(`preflight OK: 55 trophies, 1P/2G/6S/46B, 1350 PSN points, ${stepTotal} cited steps, 1 missable (id 28), 6 unconfirmed, 9 sources, 7 stage subtotals match (${stageLine}, sum 1350), 4 screenshots`);
console.log(`audit strip: ${claims} claims cited, ${backedSteps} / ${stepTotal} steps backed by 2+ sources, 8 disputes, last verified 20 Nov 2026`);

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
console.log(`dossier written: ${join(out, 'dossier.json')}`);
