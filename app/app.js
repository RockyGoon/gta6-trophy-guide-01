// Leonida Platinum — GTA VI trophy guide & tracker, v4.
// Vanilla JS, ES module, no dependencies, no network reads at runtime:
// it only fetches the two local JSON files beside it.

const KEY = 'leonida-platinum-v4';
const SOURCE_NAMES = ['PowerPyx', 'KeenGamer', 'Push Square', 'GTABase', 'Exophase', 'PSNProfiles', 'OutputLag', 'Insider Gaming', 'GTA Scoop'];

const SOURCES = [
  { n: 1, name: 'PowerPyx', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/', covers: 'Roadmap (story 60–80 h, 100% ~100 h, cleanup ~10 h); difficulty 4/10; about 200 h; 1 missable (Chapter 1 balcony meditation); 200/277 vehicles, 100/255 animals, 50/66 weapons; 70/80 challenges; 15 manual saves; 100% is about 60% true completion.' },
  { n: 2, name: 'KeenGamer', url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/', covers: 'Roadmap (about 200 h, 4/10); balcony meditation after Down to Earth; 39 gang ops, 22 bank jobs, 7 payday jobs, 8 vaults; 100 optional tasks; 15 card sets, 100 WAiNK, 33 underwater, 100 flamingos; 42 shooting-range golds.' },
  { n: 3, name: 'Push Square', url: 'https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap', covers: '300 hours or more; 18 card sets (15 for 100%); 397 stunts in the game; 100% checklist under Progress after the story (Touch Pad > Progress).' },
  { n: 4, name: 'GTABase', url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series', covers: 'Full list of all 55 with grades and hidden flags (28 hidden); roadmap (about 200 h); 5 chapters; no mission replay; cheats disable trophies and saving; 70/80 challenges.' },
  { n: 5, name: 'Exophase', url: null, covers: 'Trophy list host; used for list verification (name, description, grade).' },
  { n: 6, name: 'PSNProfiles', url: null, covers: 'Trophy tracker; used for list verification.' },
  { n: 7, name: 'OutputLag', url: 'https://outputlag.com/guides/gta-6-trophy-list/', covers: 'Full list; 28 hidden, 27 visible; about 200 h; balcony meditation in Chapter 1; 15 manual save slots; Yago timed race in Chapter 3 (Race Against Yago, hourglass icon).' },
  { n: 8, name: 'Insider Gaming', url: 'https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/', covers: 'Full list of all 55; 28 hidden trophies, many tied to the story; spoiler split between visible and hidden sections.' },
  { n: 9, name: 'GTA Scoop', url: 'https://gtascoop.com/guides/gta-6-trophies-achievements/', covers: 'Full list; Personal Best = max strength of both characters; Let\'s Go Bowling = steal 3 valuables; five trophies still being confirmed (see disputes D3, D4, D5); meditation guide lists all 18 spots.' },
];

const DISPUTES = [
  { id: 'D1', topic: 'Time to platinum: 200 vs 300 hours', a: 'PowerPyx, KeenGamer and GTABase say about 200 hours (story 60–80, 100% checklist about 100, cleanup about 10).', b: 'Push Square says up to 300 hours or more.', verdict: 'Plan on 200 hours; treat 300 as the cautious upper bound for a slow, thorough run. The gap is pace, not content — every source agrees the 100% checklist is the long pole.', trophies: [1, 14] },
  { id: 'D2', topic: 'Missable: 1 vs a watch on Strangers & Freaks', a: 'PowerPyx, KeenGamer, GTABase and GTA Scoop flag exactly 1 possibly missable trophy: Positive Mental Attitude.', b: 'Stranger mission chains have windows linked to story progress, so id 25 is watched.', verdict: '1 missable (id 28). Id 25 is a WATCH, not a second missable: nothing in the cited sources calls a strand permanently missable, so no second missable is claimed.', trophies: [25, 28] },
  { id: 'D3', topic: 'Personal Best: what counts as mass appeal', a: 'GTA Scoop — maxing the strength of both characters.', b: 'The big guides (PowerPyx, KeenGamer, GTABase) publish no method.', verdict: 'SAFE PLAY (resolved): train strength on both Lucia and Jason through normal play and gym-style activities. The exact trigger is still unconfirmed — the trophy keeps its unconfirmed flag.', trophies: [47] },
  { id: 'D4', topic: 'Let\'s Go Bowling: what is follow-through', a: 'GTA Scoop — steal 3 valuables at the Kolt & Associates bowling alley.', b: 'The big guides give no method beyond the official description.', verdict: 'SAFE PLAY (resolved): at the alley, take 3 valuables and leave cleanly. The exact trigger is still unconfirmed — the trophy keeps its unconfirmed flag.', trophies: [46] },
  { id: 'D5', topic: 'Ten Pin: no published method', a: 'Official description — bowl \'em over with a melee drive-by.', b: 'KeenGamer and GTA Scoop both note the precise method is still being confirmed; no cited source pins it down.', verdict: 'STILL UNCONFIRMED — NOT INVENTED. The steps say only what the description says and what to try in normal play. No spot, no vehicle, no count is claimed.', trophies: [51] },
  { id: 'D6', topic: 'Gang operations: 1 per gang vs 39', a: 'Pest Control asks for one illegal operation per gang (9 gangs).', b: 'KeenGamer lists 39 gang operations in the 100% requirements.', verdict: 'Both are true. The trophy needs 1 per gang; 100% completion needs all 39. Do 1 per gang early for the trophy, then finish the remaining 30 for the checklist.', trophies: [43] },
  { id: 'D7', topic: 'Meditation spots: 18 vs 15', a: 'GTA Scoop\'s meditation guide lists all 18 spots; the trophy text says every spot.', b: 'Some lists count fewer spots toward 100% completion.', verdict: 'Do all 18, starting with the Chapter 1 balcony spot. The trophy says every spot, so 18 is the number to chase; the smaller count is a checklist detail, not the trophy.', trophies: [28] },
  { id: 'D8', topic: 'Challenges: 50 vs 70 of 80', a: 'One Last Thing asks for 50 challenges.', b: 'PowerPyx and GTABase put 70 of the 80 challenges in the 100% requirements.', verdict: 'Both are true. The trophy pops at 50; keep going to 70 for the checklist, skipping the 10 hardest (PowerPyx).', trophies: [32] },
];

const STAGES = [
  { id: 'S1a', name: 'Story spine I', hours: '60–80 h (shared with S1b)', save: 'Keep a save at the start and end of every chapter; do the Chapter 1 balcony meditation before Chapter 1 ends.' },
  { id: 'S1b', name: 'Story spine II', hours: '60–80 h (shared with S1a)', save: 'No special save — these finish through normal story play; keep the Chapter 1 save until Positive Mental Attitude pops.' },
  { id: 'S2', name: 'Character strands', hours: '~10 h', save: 'Do each strand as it appears — several are only offered for a while.' },
  { id: 'S3', name: 'Activities & skill', hours: '~25 h', save: 'No save needed — all activities stay open in free roam after the story.' },
  { id: 'S4', name: 'Collectibles & exploration', hours: '~30 h', save: 'Keep the Chapter 1 save until Positive Mental Attitude pops. Everything else is free-roam cleanup.' },
  { id: 'S5', name: 'Crime & money', hours: '~25 h', save: 'No save needed — robberies and wanted-level play stay open after the story.' },
  { id: 'S6', name: 'Platinum cleanup', hours: '10–20 h', save: 'Keep 1 untouched slot from just before the final mission, then rotate 4 cleanup saves.' },
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

const STORY_IDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27];
const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = { story: 'Story', strand: 'Strand', activity: 'Activity', collectible: 'Collectible', crime: 'Crime', cleanup: 'Cleanup' };

const params = new URLSearchParams(location.search);

let trophies = [];
let matrix = null;

let state = { earned: [], counts: {} };
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = { earned: [], counts: {}, ...JSON.parse(raw) };
} catch (e) { /* fresh state on bad storage */ }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cite(n) {
  return `<span class="cite">[${n} ${esc(SOURCE_NAMES[n - 1])}]</span>`;
}

function disputesFor(id) {
  return DISPUTES.filter(d => d.trophies.includes(id));
}

function watchTag(t) {
  if (t.watch === 'missable') return '<span class="tag red">MISSABLE</span>';
  if (t.watch === 'possible') return '<span class="tag blue">POSSIBLE MISSABLE</span>';
  if (t.watch === 'watch') return '<span class="tag blue">WATCH</span>';
  return '<span class="tag">safe</span>';
}

function trophyCard(t, openFirst) {
  const earned = state.earned.includes(t.id);
  const steps = t.steps.map((s, i) => {
    const extra = s.c2 !== undefined ? ' ' + `<span class="cite2">[${s.c2} ${esc(SOURCE_NAMES[s.c2 - 1])}]</span>` : '';
    return `<li>${esc(s.t)} ${cite(s.c)}${extra}</li>`;
  }).join('');
  const diffs = disputesFor(t.id).map(d =>
    `<div class="diff-panel"><h4>SOURCES DIFFER — ${esc(d.topic)}</h4>` +
    `<p><b>Side A:</b> ${esc(d.a)}</p><p><b>Side B:</b> ${esc(d.b)}</p>` +
    `<p class="verdict"><b>Verdict:</b> ${esc(d.verdict)}</p></div>`).join('');
  const target = t.target !== null && t.target !== undefined
    ? `<span class="tag">target: ${t.target.toLocaleString('en-US')}</span>` : '';
  const unc = t.unconfirmed ? '<span class="tag red">UNCONFIRMED</span>' : '';
  return `<article class="trophy-card${t.watch === 'missable' ? ' missable' : ''}${openFirst ? ' open-target' : ''}" id="trophy-${t.id}">
    <label class="earned-box"><input type="checkbox" data-earn="${t.id}"${earned ? ' checked' : ''}> Earned</label>
    <h3>${esc(t.name)}<span class="grade-label">${GRADE_LABEL[t.grade]}</span></h3>
    <p class="official">${esc(t.official)}</p>
    <div class="tags">
      <span class="tag gold">${t.psn_value} PSN</span>
      <span class="tag">Stage ${t.stage} · #${t.order}</span>
      <span class="tag">${KIND_LABEL[t.kind]}</span>
      ${watchTag(t)}${unc}${target}
    </div>
    <ol class="steps">${steps}</ol>
    ${diffs}
    <div class="audit"><b>AUDIT</b> — ${esc(t.audit)}</div>
    <p class="save-line"><b>SAVE</b> — ${esc(t.save)}</p>
  </article>`;
}

function updateProgress() {
  const earnedSet = new Set(state.earned);
  const earned = trophies.filter(t => earnedSet.has(t.id));
  const psn = earned.reduce((a, t) => a + t.psn_value, 0);
  const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  earned.forEach(t => { grades[t.grade]++; });
  document.getElementById('progress-count').textContent = `${earned.length} / 55`;
  document.getElementById('progress-psn').textContent = `${psn.toLocaleString('en-US')} / 1,350 PSN`;
  document.getElementById('progress-grades').textContent =
    `P ${grades.platinum}/1 · G ${grades.gold}/2 · S ${grades.silver}/6 · B ${grades.bronze}/46`;
  document.getElementById('progress-fill').style.width = `${(earned.length / 55 * 100).toFixed(1)}%`;
}

function renderAuditStrip() {
  const totalSteps = trophies.reduce((a, t) => a + t.steps.length, 0);
  const backed = trophies.reduce((a, t) => a + t.steps.filter(s => s.c2 !== undefined).length, 0);
  const claims = totalSteps + trophies.length;
  const unc = trophies.filter(t => t.unconfirmed).length;
  const miss = trophies.filter(t => t.watch === 'missable').length;
  const watch = trophies.filter(t => t.watch === 'possible').length;
  document.getElementById('audit-strip').innerHTML =
    `<span><b>${claims}</b> claims cited</span>` +
    `<span><b>${backed} / ${totalSteps}</b> steps backed by 2+ sources</span>` +
    `<span><b>9</b> sources, read 20 Nov 2026</span>` +
    `<span><b>${DISPUTES.length}</b> disputes shown</span>` +
    `<span><b>${unc}</b> unconfirmed trophies</span>` +
    `<span><b>${miss}</b> missable (+${watch} watch)</span>` +
    `<span>Last verified: <b>20 Nov 2026</b></span>`;
}

function nextUp() {
  const earnedSet = new Set(state.earned);
  const left = trophies.filter(t => !earnedSet.has(t.id));
  const stageProgress = {};
  for (const s of STAGES) {
    const inStage = trophies.filter(t => t.stage === s.id);
    stageProgress[s.id] = inStage.filter(t => earnedSet.has(t.id)).length / Math.max(1, inStage.length);
  }
  const rank = t => {
    if (t.id === 28) return [0, 0, t.steps.length];
    if (t.id === 25) return [1, 0, t.steps.length];
    return [2, -stageProgress[t.stage], t.steps.length];
  };
  const picks = [...left].sort((a, b) => {
    const ra = rank(a), rb = rank(b);
    for (let i = 0; i < 3; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
    return a.order - b.order;
  }).slice(0, 3);
  const reason = t => {
    if (t.id === 28) return 'Missable — do before Chapter 1 ends';
    if (t.id === 25) return 'Watch — stranger strands close as the story moves on';
    const got = trophies.filter(x => x.stage === t.stage && earnedSet.has(x.id)).length;
    const total = trophies.filter(x => x.stage === t.stage).length;
    return `Stage ${t.stage} — ${got}/${total} earned, ${t.steps.length} steps left`;
  };
  const el = document.getElementById('next-up');
  if (!picks.length) { el.innerHTML = '<h2>NEXT UP</h2><p>All 55 trophies earned — the platinum is yours.</p>'; return; }
  el.innerHTML = '<h2>NEXT UP</h2><ol>' + picks.map(t =>
    `<li><b>${esc(t.name)}</b> (#${t.id}, Stage ${t.stage}) — <span class="reason">${esc(reason(t))}</span></li>`).join('') + '</ol>';
}

function renderChecklist() {
  const q = (document.getElementById('search').value || '').toLowerCase();
  const kind = document.getElementById('filter-kind').value;
  const grade = document.getElementById('filter-grade').value;
  const stage = document.getElementById('filter-stage').value;
  const hideSpoilers = document.getElementById('hide-spoilers').checked;
  const unearnedOnly = document.getElementById('unearned-only').checked;
  const openId = Number(params.get('open') || 0);
  let list = [...trophies].sort((a, b) => a.order - b.order);
  if (q) list = list.filter(t => t.name.toLowerCase().includes(q) || t.official.toLowerCase().includes(q));
  if (kind) list = list.filter(t => t.kind === kind);
  if (grade) list = list.filter(t => t.grade === grade);
  if (stage) list = list.filter(t => t.stage === stage);
  if (hideSpoilers) list = list.filter(t => !STORY_IDS.includes(t.id));
  if (unearnedOnly) list = list.filter(t => !state.earned.includes(t.id));
  if (openId) {
    const openT = list.find(t => t.id === openId);
    if (openT) list = [openT, ...list.filter(t => t.id !== openId)];
  }
  document.getElementById('showing').textContent = `Showing ${list.length} of 55 trophies.`;
  document.getElementById('trophy-list').innerHTML = list.map(t => trophyCard(t, t.id === openId)).join('') ||
    '<p class="note">No trophies match these filters.</p>';
}

function renderRoadmap() {
  document.getElementById('roadmap-list').innerHTML = STAGES.map(s => {
    const inStage = trophies.filter(t => t.stage === s.id).sort((a, b) => a.order - b.order);
    const got = inStage.filter(t => state.earned.includes(t.id)).length;
    const psn = inStage.reduce((a, t) => a + t.psn_value, 0);
    const rows = inStage.map(t =>
      `<li><span class="${state.earned.includes(t.id) ? 'done' : 'todo'}">${state.earned.includes(t.id) ? '✓' : '○'}</span> ${esc(t.name)}<span class="psn">${t.psn_value} PSN</span></li>`).join('');
    return `<div class="stage-block"><h3>${s.id} — ${esc(s.name)} · ${got}/${inStage.length} earned</h3>` +
      `<p class="stage-meta">${psn} PSN · ${esc(s.hours)} · ${esc(s.save)}</p><ul>${rows}</ul>` +
      `<p class="chapter-save"><b>CHAPTER SAVE</b> — ${esc(s.save)}</p></div>`;
  }).join('');
}

function renderMatrix() {
  document.getElementById('matrix-note').textContent = matrix.agreement;
  const heads = ['#', 'Trophy', '[1] PowerPyx', '[2] KeenGamer', '[3] Push Sq.', '[4] GTABase', '[5] Exophase', '[6] PSNProf.', '[7] OutputLag', '[8] Insider', '[9] GTA Scoop', 'Dispute'];
  let html = '<thead><tr>' + heads.map(h => `<th>${esc(h)}</th>`).join('') + '</tr></thead><tbody>';
  for (const row of matrix.rows) {
    const t = trophies.find(x => x.id === row.id);
    html += `<tr><td>${row.id}</td><td class="name">${esc(t ? t.name : '')}</td>` +
      row.cells.map(c => `<td class="${c.includes('C') ? 'cell-c' : ''}">${esc(c)}</td>`).join('') +
      `<td class="${row.dispute ? 'cell-dispute' : ''}">${row.dispute ? esc(row.dispute) : '—'}</td></tr>`;
  }
  document.getElementById('matrix-table').innerHTML = html + '</tbody>';
  const sps = matrix.meta.steps_per_source;
  document.getElementById('matrix-legend').textContent =
    `${matrix.legend} Steps per source: [1] ${sps['1']} · [2] ${sps['2']} · [3] ${sps['3']} · [4] ${sps['4']} · [5] ${sps['5']} (list tracker) · [6] ${sps['6']} (list tracker) · [7] ${sps['7']} · [8] ${sps['8']} (list tracker) · [9] ${sps['9']}.`;
}

function renderDisputes() {
  document.getElementById('dispute-list').innerHTML = DISPUTES.map(d => {
    const names = d.trophies.map(id => {
      const t = trophies.find(x => x.id === id);
      return t ? `#${id} ${esc(t.name)}` : `#${id}`;
    }).join(', ');
    return `<div class="dispute-block"><h3>${d.id} — ${esc(d.topic)}</h3>` +
      `<p><b>Side A:</b> ${esc(d.a)}</p><p><b>Side B:</b> ${esc(d.b)}</p>` +
      `<p class="verdict"><b>Verdict:</b> ${esc(d.verdict)}</p>` +
      `<p><b>Trophies:</b> ${names}</p></div>`;
  }).join('');
}

function renderCounts() {
  let done = 0, total = 0;
  const rows = LEDGER.map((c, i) => {
    const have = Math.min(c.of, Math.max(0, state.counts[i] || 0));
    done += Math.min(have, c.need); total += c.need;
    const pct = Math.min(100, have / c.of * 100).toFixed(1);
    return `<div class="counter-row"><div class="counter-main">
      <span class="counter-label">${esc(c.label)}</span> — <span class="counter-need">${have} / ${c.of}</span>
      <p class="counter-note">${esc(c.note)} [${c.sources.join(', ')}]</p>
      <div class="counter-bar"><div class="counter-fill" style="width:${pct}%"></div></div></div>
      <div class="counter-controls"><button type="button" data-count="${i}" data-delta="-1" aria-label="Decrease">−</button>
      <span class="counter-have">${have} / ${c.of}</span>
      <button type="button" data-count="${i}" data-delta="1" aria-label="Increase">+</button></div></div>`;
  }).join('');
  document.getElementById('counts-summary').textContent =
    `Overall 100% progress from these counters: ${done.toLocaleString('en-US')} / ${total.toLocaleString('en-US')} (${(done / total * 100).toFixed(1)}%).`;
  document.getElementById('counts-list').innerHTML = rows;
}

function renderMissables() {
  const byId = id => trophies.find(t => t.id === id);
  const miss = trophies.filter(t => t.watch === 'missable');
  const possible = trophies.filter(t => t.watch === 'possible');
  const unc = trophies.filter(t => t.unconfirmed);
  const item = t => `<li><b>#${t.id} ${esc(t.name)}</b> — ${esc(t.official)}${t.id === 51 ? ' — still open, no published method' : ''}</li>`;
  document.getElementById('missables-list').innerHTML =
    `<div class="tier-block red"><h3>MISSABLE — exactly 1</h3><p>Do the Chapter 1 balcony meditation with Lucia before Chapter 1 ends, and keep a Chapter 1 save until it pops. There is no mission replay.</p><ul>${miss.map(item).join('')}</ul></div>` +
    `<div class="tier-block blue"><h3>WATCH — 1 possible</h3><p>Not a second missable: stranger mission chains have windows linked to story progress, so take each strand as it appears (dispute D2).</p><ul>${possible.map(item).join('')}</ul></div>` +
    `<div class="tier-block"><h3>UNCONFIRMED — 6</h3><p>Five have a resolved safe play; Ten Pin (51) stays open — no published method, nothing invented.</p><ul>${unc.map(item).join('')}</ul></div>`;
}

function renderSources() {
  document.getElementById('sources-list').innerHTML = SOURCES.map(s => {
    const coverage = trophies.filter(t => t.steps.some(st => st.c === s.n || st.c2 === s.n)).length;
    const link = s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name);
    const urlLine = s.url ? esc(s.url) : 'Cited by name only — no URL captured 20 Nov 2026, none guessed.';
    return `<div class="source-block"><h3>[${s.n}] ${link}</h3>` +
      `<p class="source-meta">Read 20 Nov 2026 · covers ${coverage} of 55 guides</p>` +
      `<p>${esc(s.covers)}</p><p class="source-meta">${urlLine}</p></div>`;
  }).join('');
}

function showView(name) {
  const known = ['checklist', 'roadmap', 'matrix', 'disagreements', 'counts', 'missables', 'sources'];
  const view = known.includes(name) ? name : 'checklist';
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  if (view === 'roadmap') renderRoadmap();
  if (view === 'matrix') renderMatrix();
  if (view === 'disagreements') renderDisputes();
  if (view === 'counts') renderCounts();
  if (view === 'missables') renderMissables();
  if (view === 'sources') renderSources();
  if (view === 'checklist') { nextUp(); renderChecklist(); }
}

async function init() {
  const [tRes, mRes] = await Promise.all([fetch('data/trophies.json'), fetch('data/matrix.json')]);
  trophies = await tRes.json();
  matrix = await mRes.json();
  trophies.sort((a, b) => a.order - b.order);

  const stored = localStorage.getItem(KEY);
  if (!stored) {
    const seed = Number(params.get('seed') || 0);
    if (seed > 0) state.earned = trophies.slice(0, seed).map(t => t.id);
    save();
  }

  const kindParam = params.get('kind');
  if (kindParam) document.getElementById('filter-kind').value = kindParam;
  if (params.get('spoiler') === 'on') document.getElementById('hide-spoilers').checked = true;

  document.querySelectorAll('.tabs button').forEach(b =>
    b.addEventListener('click', () => showView(b.dataset.view)));
  document.querySelectorAll('[data-view-link]').forEach(a =>
    a.addEventListener('click', e => { e.preventDefault(); showView(a.dataset.viewLink); }));
  ['search', 'filter-kind', 'filter-grade', 'filter-stage', 'hide-spoilers', 'unearned-only'].forEach(id =>
    document.getElementById(id).addEventListener('input', renderChecklist));
  document.getElementById('trophy-list').addEventListener('change', e => {
    const box = e.target.closest('[data-earn]');
    if (!box) return;
    const id = Number(box.dataset.earn);
    if (box.checked && !state.earned.includes(id)) state.earned.push(id);
    if (!box.checked) state.earned = state.earned.filter(x => x !== id);
    save(); updateProgress(); nextUp();
    if (document.getElementById('unearned-only').checked) renderChecklist();
  });
  document.getElementById('counts-list').addEventListener('click', e => {
    const btn = e.target.closest('[data-count]');
    if (!btn) return;
    const i = Number(btn.dataset.count);
    const next = Math.max(0, Math.min(LEDGER[i].of, (state.counts[i] || 0) + Number(btn.dataset.delta)));
    state.counts[i] = next;
    save(); renderCounts();
  });
  document.getElementById('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leonida-platinum-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById('import-file').addEventListener('change', async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (Array.isArray(data.earned)) state.earned = data.earned.filter(id => trophies.some(t => t.id === id));
      if (data.counts && typeof data.counts === 'object') state.counts = data.counts;
      save(); updateProgress(); nextUp(); renderChecklist(); renderCounts();
    } catch (err) { alert('That file could not be read as progress.'); }
    e.target.value = '';
  });

  renderAuditStrip();
  updateProgress();
  const viewParam = params.get('view');
  const alias = { disputes: 'disagreements', ledger: 'counts' };
  showView(alias[viewParam] || viewParam || 'checklist');
}

init();
