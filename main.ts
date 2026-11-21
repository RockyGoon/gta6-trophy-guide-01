// Leonida Platinum v6 — preflight + dossier build (Node 22, stdlib only).
// Usage: MAKEFUN_OUTPUT_DIR=out node main.ts
// Preflight FAILS (exit 1) unless every check below holds; on success it
// copies app/ and screenshots/ into the output dir and writes dossier.json.
import { buildDossier } from './vendor/makefun-frontend.ts';
import { cp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const OUT = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function fail(msg) {
  console.error(`preflight FAILED: ${msg}`);
  process.exit(1);
}
function eq(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const trophiesDoc = JSON.parse(await readFile(join(ROOT, 'app/data/trophies.json'), 'utf8'));
const matrixDoc = JSON.parse(await readFile(join(ROOT, 'app/data/matrix.json'), 'utf8'));
const trophies = trophiesDoc.trophies;
const meta = trophiesDoc.meta;
const stages = meta.stages;
const disputes = meta.disputes;

// 55 trophies, grades, PSN total.
if (trophies.length !== 55) fail(`expected 55 trophies, got ${trophies.length}`);
const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
let psn = 0;
let gamerscoreSum = 0;
for (const t of trophies) {
  if (!(t.grade in grades)) fail(`trophy ${t.id} has unknown grade ${t.grade}`);
  grades[t.grade] += 1;
  psn += t.psn_value;
  if (typeof t.gamerscore !== 'number') fail(`trophy ${t.id} has no numeric gamerscore`);
  gamerscoreSum += t.gamerscore;
}
if (!eq(grades, { platinum: 1, gold: 2, silver: 6, bronze: 46 })) fail(`grades are ${JSON.stringify(grades)}, expected 1P/2G/6S/46B`);
if (psn !== 1350) fail(`PSN total is ${psn}, expected 1350`);

// Orders unique 1-55.
const orders = trophies.map((t) => t.order).sort((a, b) => a - b);
if (!eq(orders, Array.from({ length: 55 }, (_, i) => i + 1))) fail('orders are not unique 1-55');

// Missable / unconfirmed lists.
const missable = trophies.filter((t) => t.watch === 'missable').map((t) => t.id);
if (!eq(missable, [28])) fail(`missable list is ${JSON.stringify(missable)}, expected [28]`);
const unconfirmed = trophies.filter((t) => t.unconfirmed).map((t) => t.id).sort((a, b) => a - b);
if (!eq(unconfirmed, [28, 29, 46, 47, 49, 50, 51])) fail(`unconfirmed list is ${JSON.stringify(unconfirmed)}, expected [28,29,46,47,49,50,51]`);

// Cited steps, citations, second sources.
let steps = 0;
let backed2 = 0;
const stepsPerSource = {};
for (const t of trophies) {
  for (const s of t.steps) {
    steps += 1;
    if (typeof s.c !== 'number') fail(`trophy ${t.id} has a step without a numeric citation`);
    stepsPerSource[s.c] = (stepsPerSource[s.c] || 0) + 1;
    if ('c2' in s) {
      if (typeof s.c2 !== 'number' || s.c2 < 1 || s.c2 > 15) fail(`trophy ${t.id} has an invalid c2 ${s.c2}`);
      backed2 += 1;
    }
  }
}
if (steps < 320) fail(`cited steps are ${steps}, expected at least 320`);
const claims = steps + 55;

// Sources, disputes, ledger.
if (meta.sources.length !== 15) fail(`sources are ${meta.sources.length}, expected 15`);
if (disputes.length !== 13) fail(`disputes are ${disputes.length}, expected 13`);
if (meta.ledger.length !== 15) fail(`ledger counters are ${meta.ledger.length}, expected 15`);

// Matrix: 55 rows, 15 cells each, ids 1-55.
const rows = matrixDoc.rows;
if (rows.length !== 55) fail(`matrix rows are ${rows.length}, expected 55`);
const rowIds = rows.map((r) => r.id).sort((a, b) => a - b);
if (!eq(rowIds, Array.from({ length: 55 }, (_, i) => i + 1))) fail('matrix row ids are not 1-55');
for (const r of rows) {
  if (!Array.isArray(r.cells) || r.cells.length !== 15) fail(`matrix row ${r.id} does not have 15 cells`);
}
// steps_per_source in the matrix must match the written steps.
const matrixSps = matrixDoc.meta.steps_per_source;
for (let n = 1; n <= 15; n += 1) {
  if ((matrixSps[String(n)] || 0) !== (stepsPerSource[n] || 0)) {
    fail(`matrix steps_per_source[${n}] is ${matrixSps[String(n)]}, written steps say ${stepsPerSource[n] || 0}`);
  }
}

// Stage subtotals must equal the sums of their trophy PSN values and sum to 1350.
if (stages.length !== 7) fail(`stages are ${stages.length}, expected 7`);
let stageSum = 0;
for (const s of stages) {
  const sub = trophies.filter((t) => s.trophy_ids.includes(t.id)).reduce((a, t) => a + t.psn_value, 0);
  if (sub === 0 && s.trophy_ids.length > 0) fail(`stage ${s.id} matches no trophies`);
  stageSum += sub;
  const claimed = trophies.filter((t) => t.stage === s.id);
  if (claimed.length !== s.trophy_ids.length) fail(`stage ${s.id} lists ${s.trophy_ids.length} ids but ${claimed.length} trophies carry it`);
}
if (stageSum !== 1350) fail(`stage subtotals sum to ${stageSum}, expected 1350`);

// Screenshots: exactly the 4 in shots.json, each <= 262144 bytes.
const shots = JSON.parse(await readFile(join(ROOT, 'shots.json'), 'utf8'));
if (shots.length !== 4) fail(`shots.json lists ${shots.length} shots, expected 4`);
for (const sh of shots) {
  const st = await stat(join(ROOT, 'screenshots', sh.file)).catch(() => null);
  if (!st) fail(`screenshot ${sh.file} is missing`);
  if (st.size > 262144) fail(`screenshot ${sh.file} is ${st.size} bytes, over 262144`);
}

console.log(
  `preflight OK: 55 trophies, 1P/2G/6S/46B, 1350 PSN points, ${steps} cited steps, ${claims} claims cited, ${backed2} steps backed by 2+ sources, 1 missable (id 28), 7 unconfirmed, 15 sources, 13 disputes, 7 stage subtotals match, 4 screenshots, Gamerscore sum ${gamerscoreSum}`
);

// Copy app/ and screenshots/ into the output dir, then write the dossier.
await mkdir(OUT, { recursive: true });
await cp(join(ROOT, 'app'), join(OUT, 'app'), { recursive: true });
await cp(join(ROOT, 'screenshots'), join(OUT, 'screenshots'), { recursive: true });
const dossier = buildDossier(OUT, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
await writeFile(join(OUT, 'dossier.json'), dossier);
console.log(`dossier written: ${join(OUT, 'dossier.json')} (${Buffer.byteLength(dossier)} bytes)`);
