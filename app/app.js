// app.js — Leonida Platinum v3 tracker (vanilla JS, ES module, no dependencies).
// Fetches data/trophies.json and data/matrix.json, renders checklist, roadmap,
// source matrix, disputes and 100% ledger. Progress lives in localStorage
// under key leonida-platinum-v3.

const STORAGE_KEY = 'leonida-platinum-v3';
const STORY_IDS = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27]);
const SOURCE_NAMES = { 1: 'PowerPyx', 2: 'KeenGamer', 3: 'Push Square', 4: 'GTABase', 5: 'Exophase', 6: 'PSNProfiles', 7: 'OutputLag', 8: 'Insider Gaming', 9: 'GTA Scoop' };
const KIND_LABELS = { story: 'Story', strand: 'Strand', activity: 'Activity', collectible: 'Collectible', crime: 'Crime', cleanup: 'Cleanup' };
const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const GRADE_TOTALS = { platinum: 1, gold: 2, silver: 6, bronze: 46 };

const STAGES = [
  { id: 'S1', name: 'Story spine', hours: '60–80 h', save: 'Keep a save at the start and end of every chapter; do the Chapter 1 balcony meditation before Chapter 1 ends.', ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 44, 47, 48, 49, 50, 51, 52, 53] },
  { id: 'S2', name: 'Character strands', hours: '~10 h', save: 'No special save — do these as they appear.', ids: [22, 23, 24, 25, 26, 27, 29] },
  { id: 'S3', name: 'Activities & skill', hours: '~25 h', save: 'No special save — do these as they appear.', ids: [15, 16, 17, 18, 19, 20, 21, 32, 36, 46] },
  { id: 'S4', name: 'Collectibles & exploration', hours: '~30 h', save: 'Keep the Chapter 1 save until Positive Mental Attitude pops.', ids: [28, 30, 31, 35, 42, 54, 55] },
  { id: 'S5', name: 'Crime & money', hours: '~25 h', save: 'No special save — do these as they appear.', ids: [33, 34, 37, 38, 39, 40, 41, 43, 45] },
  { id: 'S6', name: 'Platinum cleanup', hours: '10–20 h', save: 'Keep 1 untouched slot from just before the final mission.', ids: [1, 14] },
];

const DISPUTES = [
  { id: 'D1', topic: 'Time to platinum: 200 vs 300 hours', a: 'PowerPyx, KeenGamer, GTABase ~200h (story 60-80, 100% checklist ~100, cleanup ~10).', b: 'Push Square up to 300h or more.', verdict: 'Plan on 200h; treat 300 as the cautious upper bound for a slow, thorough run. The gap is pace, not content — every source agrees the 100% checklist is the long pole.', trophies: [1, 14] },
  { id: 'D2', topic: 'Missable: 1 vs a watch on Strangers & Freaks', a: 'PowerPyx, KeenGamer, GTABase, GTA Scoop flag exactly 1 possibly missable: Positive Mental Attitude.', b: 'Stranger mission chains have windows linked to story progress, so id 25 is watched.', verdict: '1 missable (id 28). Id 25 is a WATCH, not a second missable: nothing in the cited sources calls a strand permanently missable, so no second missable is claimed.', trophies: [25, 28] },
  { id: 'D3', topic: 'Personal Best: what counts as mass appeal', a: 'GTA Scoop — maxing the strength of both characters.', b: 'The big guides (PowerPyx, KeenGamer, GTABase) publish no method.', verdict: 'SAFE PLAY (resolved): train strength on both Lucia and Jason through normal play and gym-style activities. The exact trigger is still unconfirmed — the trophy keeps its unconfirmed flag.', trophies: [47] },
  { id: 'D4', topic: "Let's Go Bowling: what is follow-through", a: 'GTA Scoop — steal 3 valuables at the Kolt & Associates bowling alley.', b: 'The big guides give no method beyond the official description.', verdict: 'SAFE PLAY (resolved): at the alley, take 3 valuables and leave cleanly. The exact trigger is still unconfirmed — the trophy keeps its unconfirmed flag.', trophies: [46] },
  { id: 'D5', topic: 'Ten Pin: no published method', a: "Official description — bowl 'em over with a melee drive-by.", b: 'KeenGamer and GTA Scoop both note the precise method is still being confirmed; no cited source pins it down.', verdict: "STILL UNCONFIRMED — NOT INVENTED. The steps say only what the description says and what to try in normal play. No spot, no vehicle, no count is claimed.", trophies: [51] },
  { id: 'D6', topic: 'Gang operations: 1 per gang vs 39', a: 'Pest Control asks for one illegal operation per gang (9 gangs).', b: 'KeenGamer lists 39 gang operations in the 100% requirements.', verdict: 'Both are true. The trophy needs 1 per gang; 100% completion needs all 39. Do 1 per gang early for the trophy, then finish the remaining 30 for the checklist.', trophies: [43] },
  { id: 'D7', topic: 'Meditation spots: 18 vs 15', a: "GTA Scoop's meditation guide lists all 18 spots; the trophy text says every spot.", b: 'Some lists count fewer spots toward 100% completion.', verdict: 'Do all 18, starting with the Chapter 1 balcony spot. The trophy says every spot, so 18 is the number to chase; the smaller count is a checklist detail, not the trophy.', trophies: [28] },
  { id: 'D8', topic: 'Challenges: 50 vs 70 of 80', a: 'One Last Thing asks for 50 challenges.', b: 'PowerPyx and GTABase put 70 of the 80 challenges in the 100% requirements.', verdict: 'Both are true. The trophy pops at 50; keep going to 70 for the checklist, skipping the 10 hardest (PowerPyx).', trophies: [32] },
];

const LEDGER = [
  { label: 'Vehicles scanned (WAiNK)', need: 200, of: 277, note: 'Scan with the WAiNK app as you travel; progress counts from the story onward.', sources: [1] },
  { label: 'Animals studied (binoculars)', need: 100, of: 255, note: 'Study through binoculars; counts from the story onward.', sources: [1] },
  { label: 'Weapons collected', need: 50, of: 66, note: 'Part of the 100% checklist; not every weapon is required.', sources: [1] },
  { label: 'Stunts completed', need: 250, of: 397, note: '397 stunts exist in total (Push Square); the trophy needs 250.', sources: [1, 3] },
  { label: 'Challenges completed', need: 70, of: 80, note: 'Trophy pops at 50; the checklist needs 70, so skip the 10 hardest.', sources: [1, 4] },
  { label: 'Collectible card sets', need: 15, of: 18, note: '18 sets exist; 15 full sets count toward 100%.', sources: [2, 3] },
  { label: 'Bank vaults robbed', need: 5, of: 8, note: 'Trophy needs 5 vaults and an escape; the checklist lists 8 vault robberies.', sources: [2] },
  { label: 'Bank jobs', need: 22, of: 22, note: 'All 22 bank jobs count toward 100%.', sources: [2] },
  { label: 'Payday loan jobs', need: 7, of: 7, note: 'All 7 payday loan jobs count toward 100%.', sources: [2] },
  { label: 'Gang operations', need: 39, of: 39, note: 'All 39 count toward 100%; the trophy needs 1 per gang (9).', sources: [2] },
  { label: 'Optional tasks', need: 100, of: 100, note: '100 optional tasks count toward 100%.', sources: [2] },
  { label: 'WAiNK locations', need: 100, of: 100, note: 'WAiNK It at 100 locations (also the You WAiNKer! trophy).', sources: [2] },
  { label: 'Underwater discoveries', need: 33, of: 33, note: '33 underwater discoveries count toward 100%.', sources: [2] },
  { label: 'Cocaine flamingos', need: 100, of: 100, note: '100 flamingos count toward 100%.', sources: [2] },
  { label: 'Shooting-range gold medals', need: 42, of: 42, note: 'Gold in all 42 Shooting Range challenges (also The Shootist).', sources: [2] },
];

const params = new URLSearchParams(location.search);
const seedCount = Number.parseInt(params.get('seed') ?? '', 10);
const openId = Number.parseInt(params.get('open') ?? '', 10);
const initialView = params.get('view') ?? 'checklist';
const initialKind = params.get('kind') ?? '';
const spoilerOn = params.get('spoiler') === 'on';

let trophies = [];
let matrix = null;
let earned = new Set();

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.earned)) return new Set(parsed.earned);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch { /* corrupted storage: start empty */ }
  return null;
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earned].sort((a, b) => a - b), version: 3 }));
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function watchLabel(t) {
  if (t.watch === 'missable') return '<span class="tag red">MISSABLE</span>';
  if (t.watch === 'possible') return '<span class="tag blue">POSSIBLE MISSABLE</span>';
  if (t.watch === 'watch') return '<span class="tag blue">WATCH</span>';
  return '<span class="tag">safe</span>';
}

function updateProgress() {
  const earnedList = trophies.filter((t) => earned.has(t.id));
  const psn = earnedList.reduce((sum, t) => sum + t.psn_value, 0);
  document.getElementById('earned-count').textContent = `${earnedList.length} / 55`;
  document.getElementById('earned-psn').textContent = `${psn.toLocaleString('en-US')} / 1,350 PSN`;
  document.getElementById('progress-fill').style.width = `${(earnedList.length / 55) * 100}%`;
  const parts = Object.keys(GRADE_TOTALS).map((g) => {
    const got = earnedList.filter((t) => t.grade === g).length;
    return `${g === 'platinum' ? 'P' : g === 'gold' ? 'G' : g === 'silver' ? 'S' : 'B'} ${got}/${GRADE_TOTALS[g]}`;
  });
  document.getElementById('grade-counts').textContent = parts.join(' · ');
}

function trophyCard(t) {
  const isEarned = earned.has(t.id);
  const spoilerHidden = document.getElementById('spoiler-toggle').checked && STORY_IDS.has(t.id) && !isEarned;
  const classes = ['trophy-card'];
  if (t.watch === 'missable') classes.push('missable');
  if (t.id === openId) classes.push('open-card');
  const gradeClass = `grade-${t.grade}`;
  let inner = `<label class="earned-box"><input type="checkbox" data-earned="${t.id}" ${isEarned ? 'checked' : ''}> Earned</label>`;
  if (spoilerHidden) {
    inner += `<h3>Hidden story trophy</h3><p class="hidden-note">Story spoiler hidden — earn this trophy to reveal its name, description and guide.</p>`;
    inner += `<div class="tags"><span class="tag ${gradeClass}">${GRADE_LABELS[t.grade]}</span><span class="tag">${t.psn_value} PSN</span><span class="tag">Stage ${t.stage} · #${t.order}</span><span class="tag">${KIND_LABELS[t.kind]}</span></div>`;
  } else {
    inner += `<h3>#${t.id} ${escapeHtml(t.name)}</h3>`;
    inner += `<p class="official">${escapeHtml(t.official)}</p>`;
    inner += `<div class="tags"><span class="tag ${gradeClass}">${GRADE_LABELS[t.grade]}</span><span class="tag">${t.psn_value} PSN</span><span class="tag">Stage ${t.stage} · #${t.order}</span><span class="tag">${KIND_LABELS[t.kind]}</span>${watchLabel(t)}${t.unconfirmed ? '<span class="tag red">UNCONFIRMED</span>' : ''}${t.target !== null ? `<span class="tag">target: ${t.target.toLocaleString('en-US')}</span>` : ''}</div>`;
    inner += `<ol class="steps">${t.steps.map((s) => `<li>${escapeHtml(s.t)} <span class="cite">[${s.c} ${SOURCE_NAMES[s.c]}]</span></li>`).join('')}</ol>`;
    inner += `<p class="audit"><strong>AUDIT:</strong> ${escapeHtml(t.audit)}</p>`;
    inner += `<p class="save-line"><strong>SAVE:</strong> ${escapeHtml(t.save)}</p>`;
  }
  return `<article class="${classes.join(' ')}" data-trophy="${t.id}">${inner}</article>`;
}

function renderChecklist() {
  const q = (document.getElementById('search').value ?? '').trim().toLowerCase();
  const kind = document.getElementById('kind-filter').value;
  const grade = document.getElementById('grade-filter').value;
  const stage = document.getElementById('stage-filter').value;
  const unearnedOnly = document.getElementById('unearned-toggle').checked;
  let list = [...trophies].sort((a, b) => a.order - b.order);
  if (Number.isInteger(openId)) {
    const open = list.find((t) => t.id === openId);
    if (open) list = [open, ...list.filter((t) => t.id !== openId)];
  }
  const shown = list.filter((t) => {
    if (kind && t.kind !== kind) return false;
    if (grade && t.grade !== grade) return false;
    if (stage && t.stage !== stage) return false;
    if (unearnedOnly && earned.has(t.id)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.official.toLowerCase().includes(q))) return false;
    return true;
  });
  document.getElementById('trophy-list').innerHTML = shown.map(trophyCard).join('');
  document.getElementById('showing').textContent = `Showing ${shown.length} of 55 trophies.`;
  document.querySelectorAll('[data-earned]').forEach((box) => {
    box.addEventListener('change', () => {
      const id = Number.parseInt(box.getAttribute('data-earned'), 10);
      if (box.checked) earned.add(id); else earned.delete(id);
      saveProgress();
      updateProgress();
      renderChecklist();
      renderRoadmap();
    });
  });
}

function renderRoadmap() {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  document.getElementById('roadmap-list').innerHTML = STAGES.map((stage) => {
    const stageTrophies = stage.ids.map((id) => byId.get(id)).filter(Boolean);
    const psn = stageTrophies.reduce((sum, t) => sum + t.psn_value, 0);
    const got = stageTrophies.filter((t) => earned.has(t.id)).length;
    const items = stageTrophies.map((t) => `<li>${earned.has(t.id) ? '✓' : '○'} #${t.id} ${escapeHtml(t.name)} — ${t.psn_value} PSN</li>`).join('');
    return `<div class="stage-block"><h3>${stage.id} — ${stage.name} · ${got}/${stageTrophies.length} earned</h3><p class="stage-meta">${psn} PSN · ${stage.hours} · save</p><ul>${items}</ul><p class="chapter-save"><strong>Chapter save:</strong> ${escapeHtml(stage.save)}</p></div>`;
  }).join('');
}

function renderMatrix() {
  if (!matrix) return;
  document.getElementById('matrix-note').textContent = matrix.agreement;
  document.getElementById('matrix-legend').textContent = `${matrix.legend} Steps per source: [1] 84 · [2] 63 · [3] 19 · [4] 29 · [5] 0 (list tracker) · [6] 0 (list tracker) · [7] 17 · [8] 0 (list tracker) · [9] 22.`;
  document.getElementById('matrix-body').innerHTML = matrix.rows.map((row) => {
    const cells = row.cells.map((c) => `<td class="${c.includes('C') ? 'cell-c' : ''}">${c}</td>`).join('');
    const dispute = row.dispute ? `<td class="cell-dispute">${row.dispute}</td>` : '<td>—</td>';
    return `<tr><td>${row.id}</td><td class="trophy-name">${escapeHtml(row.name)}</td>${cells}${dispute}</tr>`;
  }).join('');
}

function renderDisputes() {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  document.getElementById('dispute-list').innerHTML = DISPUTES.map((d) => {
    const names = d.trophies.map((id) => `#${id} ${escapeHtml(byId.get(id)?.name ?? '')}`).join(', ');
    return `<div class="dispute-block"><h3>${d.id} — ${escapeHtml(d.topic)}</h3><p><strong>Side A:</strong> ${escapeHtml(d.a)}</p><p><strong>Side B:</strong> ${escapeHtml(d.b)}</p><p class="verdict"><strong>Verdict:</strong> ${escapeHtml(d.verdict)}</p><p><strong>Trophies:</strong> ${names}</p></div>`;
  }).join('');
}

function renderLedger() {
  document.getElementById('ledger-list').innerHTML = LEDGER.map((row) => {
    const srcs = row.sources.map((n) => `[${n} ${SOURCE_NAMES[n]}]`).join(' ');
    return `<div class="ledger-row"><span class="need">${row.need} / ${row.of} — ${escapeHtml(row.label)}</span><span class="note">${escapeHtml(row.note)} ${srcs}</span></div>`;
  }).join('');
}

function showView(view) {
  const views = ['checklist', 'roadmap', 'matrix', 'disputes', 'ledger'];
  for (const v of views) {
    document.getElementById(`view-${v}`).hidden = v !== view;
    document.querySelector(`[data-view="${v}"]`).classList.toggle('active', v === view);
  }
  if (view === 'roadmap') renderRoadmap();
  if (view === 'matrix') renderMatrix();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ earned: [...earned].sort((a, b) => a - b), version: 3 }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-platinum-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const list = Array.isArray(parsed.earned) ? parsed.earned : parsed;
      if (!Array.isArray(list)) throw new Error('no earned list');
      earned = new Set(list.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55));
      saveProgress();
      updateProgress();
      renderChecklist();
      renderRoadmap();
    } catch { /* bad file: ignore */ }
  };
  reader.readAsText(file);
}

async function boot() {
  const [trophyData, matrixData] = await Promise.all([
    fetch('data/trophies.json').then((r) => r.json()),
    fetch('data/matrix.json').then((r) => r.json()),
  ]);
  trophies = (Array.isArray(trophyData) ? trophyData : trophyData.trophies).sort((a, b) => a.order - b.order);
  matrix = matrixData;
  const stored = loadProgress();
  if (stored) {
    earned = stored;
  } else if (Number.isInteger(seedCount) && seedCount > 0) {
    earned = new Set(trophies.slice(0, Math.min(seedCount, 55)).map((t) => t.id));
  }
  if (initialKind) document.getElementById('kind-filter').value = initialKind;
  if (spoilerOn) document.getElementById('spoiler-toggle').checked = true;
  for (const id of ['search', 'kind-filter', 'grade-filter', 'stage-filter', 'spoiler-toggle', 'unearned-toggle']) {
    document.getElementById(id).addEventListener('input', renderChecklist);
    document.getElementById(id).addEventListener('change', renderChecklist);
  }
  document.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.getAttribute('data-view')));
  });
  document.querySelectorAll('[data-view-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showView(link.getAttribute('data-view-link'));
    });
  });
  document.getElementById('export-btn').addEventListener('click', exportProgress);
  document.getElementById('import-file').addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) importProgress(file);
  });
  updateProgress();
  renderChecklist();
  renderRoadmap();
  renderMatrix();
  renderDisputes();
  renderLedger();
  showView(['checklist', 'roadmap', 'matrix', 'disputes', 'ledger'].includes(initialView) ? initialView : 'checklist');
}

boot();
