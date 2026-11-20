// Leonida Platinum — hand-in program for gta6-trophy-guide-01 (Node 22, stdlib only).
// It preflights the guide data (55 trophies, grades 1/2/6/46, 1,350 PSN, exactly
// 1 missable, 6 unconfirmed, 234 cited steps, 9 sources, 6 stage subtotals,
// orders 1-55 unique), copies app/ and screenshots/ to the output directory,
// then writes /output/dossier.json with the vendored make.fun library.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const dataPath = join(here, 'app', 'data', 'trophies.json');
const matrixPath = join(here, 'app', 'data', 'matrix.json');

function fail(msg: string): never {
  console.error(`preflight FAILED: ${msg}`);
  process.exit(1);
}

function preflight(): { steps: number; shots: number } {
  const doc = JSON.parse(readFileSync(dataPath, 'utf-8'));
  const matrix = JSON.parse(readFileSync(matrixPath, 'utf-8'));
  const ts = doc.trophies as Array<Record<string, unknown>>;
  if (ts.length !== 55) fail(`trophies: ${ts.length}, want 55`);
  const grades: Record<string, number> = {};
  let psn = 0;
  let steps = 0;
  const orders = new Set<number>();
  const missable: number[] = [];
  const unconfirmed: number[] = [];
  for (const t of ts) {
    grades[String(t.grade)] = (grades[String(t.grade)] ?? 0) + 1;
    psn += Number(t.psn_value);
    steps += (t.steps as unknown[]).length;
    orders.add(Number(t.order));
    if (t.watch === 'missable') missable.push(Number(t.id));
    if (t.unconfirmed) unconfirmed.push(Number(t.id));
    for (const s of t.steps as Array<Record<string, unknown>>) {
      if (typeof s.c !== 'number') fail(`trophy ${t.id}: step without a citation`);
    }
  }
  if (grades.platinum !== 1 || grades.gold !== 2 || grades.silver !== 6 || grades.bronze !== 46) {
    fail(`grades: ${JSON.stringify(grades)}, want 1/2/6/46`);
  }
  if (psn !== 1350) fail(`PSN total: ${psn}, want 1350`);
  if (missable.length !== 1 || missable[0] !== 28) fail(`missable: ${missable}, want [28]`);
  if (unconfirmed.length !== 6) fail(`unconfirmed: ${unconfirmed}, want 6`);
  if (steps < 220) fail(`cited steps: ${steps}, want >= 220`);
  if (doc.sources.length !== 9) fail(`sources: ${doc.sources.length}, want 9`);
  if (matrix.rows.length !== 55) fail(`matrix rows: ${matrix.rows.length}, want 55`);
  if (orders.size !== 55) fail(`orders: ${orders.size} unique, want 55`);
  for (const s of doc.stages as Array<Record<string, unknown>>) {
    const ids = s.trophy_ids as number[];
    const sub = ts.filter((t) => ids.includes(Number(t.id))).reduce((a, t) => a + Number(t.psn_value), 0);
    if (sub !== s.psn) fail(`stage ${s.id}: subtotal ${sub}, want ${s.psn}`);
  }
  const shotDir = join(here, 'screenshots');
  const shots = ['1-checklist.jpg', '2-roadmap.jpg', '3-filters.jpg', '4-progress.jpg'];
  for (const f of shots) {
    const p = join(shotDir, f);
    if (!existsSync(p)) fail(`missing screenshot ${f}`);
    if (statSync(p).size > 262144) fail(`screenshot ${f} over 256 KiB`);
  }
  console.log(
    `preflight OK: 55 trophies, 1P/2G/6S/46B, 1350 PSN points, ${steps} cited steps, ` +
    `1 missable (id 28), 6 unconfirmed, 9 sources, 6 stage subtotals match, 4 screenshots`,
  );
  return { steps, shots: shots.length };
}

const { steps, shots } = preflight();
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
console.log(`dossier written: 55 trophies, ${steps} cited steps, ${shots} screenshots`);
