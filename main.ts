// main.ts — Leonida Platinum v3 hand-in program (Node 22+, stdlib only).
// Preflights the guide data, copies app/ and screenshots/ into the output
// directory (MAKEFUN_OUTPUT_DIR, default /output), then writes dossier.json
// with buildDossier from vendor/makefun-frontend.ts.
import { buildDossier } from './vendor/makefun-frontend.ts';
import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const OUT = process.env.MAKEFUN_OUTPUT_DIR ? resolve(process.env.MAKEFUN_OUTPUT_DIR) : '/output';

const EXPECTED_STAGE_PSN: Record<string, number> = { S1: 375, S2: 120, S3: 180, S4: 135, S5: 150, S6: 390 };
const SCREENSHOT_MAX_BYTES = 262144;

function fail(message: string): never {
  console.error(`preflight FAILED: ${message}`);
  process.exit(1);
}

function readJson(rel: string): any {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}

const data = readJson('app/data/trophies.json');
const trophies: any[] = Array.isArray(data) ? data : data.trophies;
if (!Array.isArray(trophies)) fail('app/data/trophies.json holds no trophies array');

const matrix = readJson('app/data/matrix.json');
const rows: any[] = Array.isArray(matrix) ? matrix : matrix.rows;
if (!Array.isArray(rows)) fail('app/data/matrix.json holds no rows array');

// 55 trophies.
if (trophies.length !== 55) fail(`expected 55 trophies, found ${trophies.length}`);

// Grades exactly 1 platinum / 2 gold / 6 silver / 46 bronze.
const gradeCount: Record<string, number> = {};
let psnTotal = 0;
for (const t of trophies) {
  gradeCount[t.grade] = (gradeCount[t.grade] ?? 0) + 1;
  psnTotal += t.psn_value;
}
if (gradeCount.platinum !== 1 || gradeCount.gold !== 2 || gradeCount.silver !== 6 || gradeCount.bronze !== 46) {
  fail(`grades are ${gradeCount.platinum ?? 0}P/${gradeCount.gold ?? 0}G/${gradeCount.silver ?? 0}S/${gradeCount.bronze ?? 0}B, expected 1P/2G/6S/46B`);
}

// PSN total exactly 1350.
if (psnTotal !== 1350) fail(`PSN total is ${psnTotal}, expected 1350`);

// Missable list exactly [28].
const missable = trophies.filter((t) => t.watch === 'missable').map((t) => t.id).sort((a: number, b: number) => a - b);
if (missable.length !== 1 || missable[0] !== 28) fail(`missable list is [${missable.join(', ')}], expected [28]`);

// Unconfirmed exactly 6: [28, 46, 47, 49, 50, 51].
const unconfirmed = trophies.filter((t) => t.unconfirmed === true).map((t) => t.id).sort((a: number, b: number) => a - b);
const expectedUnconfirmed = [28, 46, 47, 49, 50, 51];
if (unconfirmed.length !== 6 || unconfirmed.some((id: number, i: number) => id !== expectedUnconfirmed[i])) {
  fail(`unconfirmed list is [${unconfirmed.join(', ')}], expected [28, 46, 47, 49, 50, 51]`);
}

// Cited steps >= 220; every step has a numeric citation.
let stepTotal = 0;
for (const t of trophies) {
  if (!Array.isArray(t.steps)) fail(`trophy ${t.id} has no steps array`);
  for (const s of t.steps) {
    if (typeof s.c !== 'number') fail(`trophy ${t.id} has a step without a numeric citation`);
    stepTotal++;
  }
  if (typeof t.guide !== 'string' || t.guide.trim() === '') fail(`trophy ${t.id} has a blank guide`);
}
if (stepTotal < 220) fail(`only ${stepTotal} cited steps, expected at least 220`);

// Sources exactly 9: the guide's own sources list (trophies.json and
// matrix.json each name all 9). Per-trophy arrays need not cover all 9 —
// sources 5, 6 and 8 are list trackers that verify the list.
const guideSources = Array.isArray(data.sources) ? data.sources : [];
const matrixSources = Array.isArray(matrix.sources) ? matrix.sources : [];
if (guideSources.length !== 9) fail(`trophies.json names ${guideSources.length} sources, expected 9`);
if (matrixSources.length !== 9) fail(`matrix.json names ${matrixSources.length} sources, expected 9`);

// Matrix rows exactly 55.
if (rows.length !== 55) fail(`matrix has ${rows.length} rows, expected 55`);

// Orders 1-55 unique.
const orders = trophies.map((t) => t.order).sort((a: number, b: number) => a - b);
for (let i = 0; i < 55; i++) {
  if (orders[i] !== i + 1) fail(`orders are not 1-55 unique (position ${i} holds ${orders[i]})`);
}

// Every stage's PSN subtotal equals the sum of its trophy_ids' PSN values.
for (const [stage, expected] of Object.entries(EXPECTED_STAGE_PSN)) {
  const sum = trophies.filter((t) => t.stage === stage).reduce((acc: number, t: any) => acc + t.psn_value, 0);
  if (sum !== expected) fail(`stage ${stage} PSN subtotal is ${sum}, expected ${expected}`);
}

// All 4 screenshots exist and each is <= 262144 bytes.
const shots = ['1-checklist.jpg', '2-roadmap.jpg', '3-filters.jpg', '4-progress.jpg'];
for (const shot of shots) {
  const p = join(ROOT, 'screenshots', shot);
  if (!existsSync(p)) fail(`screenshot screenshots/${shot} is missing`);
  const size = statSync(p).size;
  if (size > SCREENSHOT_MAX_BYTES) fail(`screenshot screenshots/${shot} is ${size} bytes, over ${SCREENSHOT_MAX_BYTES}`);
}

console.log(`preflight OK: 55 trophies, 1P/2G/6S/46B, 1350 PSN points, ${stepTotal} cited steps, 1 missable (id 28), 6 unconfirmed, 9 sources, 6 stage subtotals match, 4 screenshots`);

// Copy app/ and screenshots/ into the output dir, then write the dossier.
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'app'), join(OUT, 'app'), { recursive: true });
cpSync(join(ROOT, 'screenshots'), join(OUT, 'screenshots'), { recursive: true });
const dossier = buildDossier(OUT, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(OUT, 'dossier.json'), dossier);
console.log(`dossier written: ${join(OUT, 'dossier.json')} (${dossier.length} bytes)`);
