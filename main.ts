// Leonida Platinum — a gta6-trophy-guide-01 entry (Node 22, standard library only).
//
// The guide is this directory's app/ folder: plain static files a browser opens
// at app/index.html (one ES module, one stylesheet, one JSON data file, no build
// step), offline — it loads nothing over the network, and its trophy list and
// guides are app/data/trophies.json. This program hands it in: it first checks
// the entry is complete (55 trophies, every guide non-blank, 3–4 screenshots),
// then copies app/ and screenshots/ from beside this file to /output and writes
// /output/dossier.json, the summary the judge reads (your screenshots, the first
// load's files and bytes, and your source), with the vendored make.fun library.
// Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json
// to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Preflight: the entry is not handed in half-built. The trophy file must name
// all 55 official trophies with a real guide each, and screenshots/ must hold
// 3 or 4 images. Failing here, loudly, beats a silent invalid entry.
const trophyDoc = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const trophyList = trophyDoc.trophies ?? trophyDoc;
if (!Array.isArray(trophyList) || trophyList.length !== 55) {
  throw new Error(`expected 55 trophies in app/data/trophies.json, found ${Array.isArray(trophyList) ? trophyList.length : 'none'}`);
}
for (const trophy of trophyList) {
  if (typeof trophy.name !== 'string' || !trophy.name.trim()) throw new Error('a trophy is missing its official name');
  if (typeof trophy.guide !== 'string' || !trophy.guide.trim()) throw new Error(`trophy ${trophy.name} has no guide`);
  if (!Array.isArray(trophy.sources) || trophy.sources.length === 0) throw new Error(`trophy ${trophy.name} cites no source`);
}
const shotFiles = readdirSync(join(here, 'screenshots')).filter((f) => !f.startsWith('.'));
if (shotFiles.length < 3 || shotFiles.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shotFiles.length}`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
console.log(`Leonida Platinum: ${trophyList.length} trophies, ${shotFiles.length} screenshots -> ${out}`);
