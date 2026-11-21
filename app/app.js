// Leonida Platinum v6 — vanilla JS, ES module, no dependencies, offline only.
const KEY = 'leonida-platinum-v6';
const COUNTS_KEY = 'leonida-platinum-v6-counts';
const SPOILER_IDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27];
const SOURCE_NAMES = { 1: 'PowerPyx', 2: 'KeenGamer', 3: 'Push Square', 4: 'GTABase', 5: 'Exophase', 6: 'PSNProfiles', 7: 'OutputLag', 8: 'Insider Gaming', 9: 'GTA Scoop', 10: 'GameMapa', 11: 'eGamers', 12: 'GTA Vice City Hub', 13: 'CryptoGames', 14: 'Mobalytics', 15: 'GamesFuze' };
const VS_CHECKLIST = [
  ['Stunts', '250', '300', '[11]', 'The trophy pops at 250; the checklist needs 300.'],
  ['Races (unique wins)', '20', '30', '[11]', 'The trophy pops at 20; the checklist needs 30.'],
  ['Challenges', '50', '70 of 80', '[11]', 'The trophy pops at 50; the checklist needs 70.'],
  ['Card sets', '3', '15 of 18', '[11]', 'The trophy pops at 3; the checklist needs 15.'],
  ['Meditation spots', '18', '15', '[11][12]', 'The trophy needs 18; the checklist counts 15.'],
  ['Bank vaults', '5', '8', '[11]', 'The trophy pops at 5; the checklist needs 8.'],
  ['WAiNK locations', '100', '100', '[13]', 'Trophy and checklist agree: 100.'],
  ['Shooting range golds', 'all (42)', '42', '[13]', 'The trophy needs gold in all of them; the checklist counts 42.'],
  ['Stunt pool', '250 of 397', '300 of 397', '[13]', '397 stunts exist in Leonida; the trophy needs 250, the checklist 300.'],
];
const WINDOWS = [
  ['Positive Mental Attitude (id 28)', 'Chapter 1 balcony meditation with Lucia at Jason\u2019s house, after \u201cDown to Earth\u201d — gone after Chapter 1.', 'Do it before leaving Chapter 1.'],
  ['Stranger chains (ids 22, 23, 24, 26, 27, 29)', 'Five hidden trophies\u2019 chains have windows tied to story progress [13].', 'Start each chain as soon as it unlocks; do not leave strands for post-story.'],
  ['Optional missions', 'Several become unavailable during certain story sections [2].', 'Take them when they appear (there are more than the 100 optional tasks the checklist needs, so missing a few does not block A Long Road).'],
  ['Irredeemable profile', 'Permanent; do not trigger it on the trophy run [13].', 'Read the Criminal Profile guide before going on a rampage.'],
  ['Maximum Withdrawal (id 40)', 'Needs the optional Chapter 4 mission \u201cThat\u2019s Where The Money Is\u2026\u201d [11].', 'Take it when it appears.'],
];
const STAGE_WINDOWS = {
  S1a: 'Window: the Chapter 1 balcony meditation (id 28) is gone after Chapter 1 — do it before leaving the chapter.',
  S1b: 'Window: keep 1 untouched slot from just before the final mission. The Irredeemable profile is permanent — do not trigger it on the trophy run.',
  S2: 'Window: stranger chains have windows tied to story progress — start each chain as soon as it unlocks.',
  S4: 'Window: keep the Chapter 1 save until Positive Mental Attitude pops.',
  S5: 'Window: Maximum Withdrawal (id 40) needs the optional Chapter 4 mission \u201cThat\u2019s Where The Money Is\u2026\u201d — take it when it appears.',
};

const params = new URLSearchParams(location.search);
const viewEl = document.getElementById('view');
let DATA = null, MATRIX = null;
let earned = new Set();
let counts = {};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function loadState() {
  try { earned = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { earned = new Set(); }
  try { counts = JSON.parse(localStorage.getItem(COUNTS_KEY) || '{}'); } catch { counts = {}; }
}
function saveState() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
  updateProgress();
}
function trophyById(id) { return DATA.trophies.find((t) => t.id === id); }
function gradeLabel(g) { return g.charAt(0).toUpperCase() + g.slice(1); }
function watchTag(t) {
  if (t.watch === 'missable') return '<span class="tag red">MISSABLE</span>';
  if (t.watch === 'possible') return '<span class="tag blue">POSSIBLE MISSABLE</span>';
  if (t.watch === 'watch') return '<span class="tag blue">WATCH</span>';
  return '<span class="tag">Safe</span>';
}
function cite(n) { return `[${n} ${SOURCE_NAMES[n] || n}]`; }
function stepsHtml(t) {
  return '<ol class="steps">' + t.steps.map((s, i) =>
    `<li>${esc(s.t)} <span class="cite">${cite(s.c)}${s.c2 ? ' ' + cite(s.c2) : ''}</span></li>`).join('') + '</ol>';
}
function disputesFor(id) {
  return DATA.meta.disputes.filter((d) => d.trophies.includes(id));
}
function cardHtml(t, open) {
  const d = disputesFor(t.id);
  const diff = d.map((x) =>
    `<div class="diff-panel"><strong>SOURCES DIFFER — ${esc(x.topic)}:</strong> Side A: ${esc(x.a)} Side B: ${esc(x.b)} <strong>Verdict:</strong> ${esc(x.verdict)}</div>`).join('');
  return `<article class="trophy-card${t.watch === 'missable' ? ' missable' : ''}${open ? ' open-card' : ''}" id="trophy-${t.id}">
    <label class="earned-box"><input type="checkbox" data-earn="${t.id}"${earned.has(t.id) ? ' checked' : ''}> Earned</label>
    <h3>#${t.id} ${esc(t.name)} — ${gradeLabel(t.grade)}</h3>
    <p class="official">${esc(t.official)}</p>
    <div class="tags"><span class="tag gold">${t.psn_value} PSN</span><span class="tag gold">Xbox ${t.gamerscore}G (GamesFuze)</span><span class="tag">Stage ${t.stage} · #${t.order}</span><span class="tag">${t.kind}</span>${watchTag(t)}${t.unconfirmed ? '<span class="tag red">UNCONFIRMED</span>' : ''}${t.target !== null ? `<span class="tag">target: ${t.target.toLocaleString('en-US')}</span>` : ''}</div>
    ${stepsHtml(t)}
    ${diff}
    <div class="audit-line"><strong>AUDIT:</strong> ${esc(t.audit)}</div>
    <p class="save-line"><strong>SAVE:</strong> ${esc(t.save)}</p>
  </article>`;
}
function updateProgress() {
  const total = DATA.trophies.length;
  const got = DATA.trophies.filter((t) => earned.has(t.id));
  const psn = got.reduce((a, t) => a + t.psn_value, 0);
  const g = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  got.forEach((t) => { g[t.grade] += 1; });
  document.getElementById('prog-count').textContent = `${got.length} / ${total}`;
  document.getElementById('prog-psn').textContent = `${psn.toLocaleString('en-US')} / 1,350 PSN`;
  document.getElementById('prog-grades').textContent = `P ${g.platinum}/1 · G ${g.gold}/2 · S ${g.silver}/6 · B ${g.bronze}/46`;
  document.getElementById('progress-fill').style.width = `${(got.length / total) * 100}%`;
  document.getElementById('your-count').textContent = `YOUR COUNT: ${got.length}/55 trophies · ${psn.toLocaleString('en-US')}/1,350 PSN`;
}
function renderAudit() {
  const steps = DATA.trophies.reduce((a, t) => a + t.steps.length, 0);
  const backed = DATA.trophies.reduce((a, t) => a + t.steps.filter((s) => 'c2' in s).length, 0);
  document.getElementById('audit-strip').innerHTML =
    `<b>AUDIT:</b> ${steps + 55} claims cited · ${backed} / ${steps} steps backed by 2+ sources · 15 sources · 13 disputes · 7 unconfirmed · 1 missable (+1 watch) · verified 21 Nov 2026`;
  document.getElementById('subtitle').textContent =
    `GTA VI trophy guide & tracker — all 55 trophies, ${steps} cited steps, 1,350 PSN points`;
}
function nextUp() {
  const un = DATA.trophies.filter((t) => !earned.has(t.id));
  const stageProg = {};
  for (const s of DATA.meta.stages) {
    const ids = s.trophy_ids;
    stageProg[s.id] = ids.filter((id) => earned.has(id)).length / ids.length;
  }
  const tier = (t) => (t.id === 28 ? 0 : t.id === 25 ? 1 : 2);
  un.sort((a, b) => tier(a) - tier(b) || stageProg[b.stage] - stageProg[a.stage] || a.steps.length - b.steps.length);
  const top = un.slice(0, 3);
  const reason = (t) => t.id === 28 ? 'Missable — do before Chapter 1 ends' : t.id === 25 ? 'Watch — stranger chains have story windows' : `Stage ${t.stage} — ${t.steps.length} steps left`;
  return `<section class="nextup"><h3>Next Up</h3><ol>${top.map((t) => `<li><strong>#${t.id} ${esc(t.name)}</strong> <span class="reason">— ${reason(t)}</span></li>`).join('')}</ol></section>`;
}
function renderChecklist() {
  const kind = params.get('kind') || 'all';
  const grade = params.get('grade') || 'all';
  const stage = params.get('stage') || 'all';
  const q = (params.get('q') || '').toLowerCase();
  const spoiler = params.get('spoiler') === 'on';
  const unearnedOnly = params.get('unearned') === 'on';
  const openId = Number(params.get('open') || 0);
  const stageOpts = DATA.meta.stages.map((s) => `<option value="${s.id}"${stage === s.id ? ' selected' : ''}>${s.id} ${esc(s.name)}</option>`).join('');
  let list = [...DATA.trophies].sort((a, b) => a.order - b.order);
  if (openId) list.sort((a, b) => (a.id === openId ? -1 : b.id === openId ? 1 : 0));
  const shown = list.filter((t) =>
    (kind === 'all' || t.kind === kind) && (grade === 'all' || t.grade === grade) &&
    (stage === 'all' || t.stage === stage) &&
    (!q || t.name.toLowerCase().includes(q) || t.official.toLowerCase().includes(q)) &&
    (!spoiler || !SPOILER_IDS.includes(t.id)) && (!unearnedOnly || !earned.has(t.id)));
  viewEl.innerHTML = `
    ${nextUp()}
    <div class="filters">
      <input type="search" id="f-q" placeholder="Search trophy name or word" value="${esc(params.get('q') || '')}">
      <select id="f-kind"><option value="all">All kinds</option>${['story', 'strand', 'activity', 'collectible', 'crime', 'cleanup'].map((k) => `<option${kind === k ? ' selected' : ''}>${k}</option>`).join('')}</select>
      <select id="f-grade"><option value="all">All grades</option>${['platinum', 'gold', 'silver', 'bronze'].map((k) => `<option${grade === k ? ' selected' : ''}>${k}</option>`).join('')}</select>
      <select id="f-stage"><option value="all">All stages</option>${stageOpts}</select>
      <label><input type="checkbox" id="f-spoiler"${spoiler ? ' checked' : ''}> Hide story spoilers (17)</label>
      <label><input type="checkbox" id="f-unearned"${unearnedOnly ? ' checked' : ''}> Unearned only</label>
      <button id="f-export">Export progress</button>
      <label class="btn">Import progress <input type="file" id="f-import" accept=".json" hidden></label>
    </div>
    <p class="showing">Showing ${shown.length} of 55 trophies.</p>
    ${shown.map((t) => cardHtml(t, t.id === openId)).join('')}`;
  const apply = () => {
    const p = new URLSearchParams();
    const qv = document.getElementById('f-q').value.trim();
    if (qv) p.set('q', qv);
    if (document.getElementById('f-kind').value !== 'all') p.set('kind', document.getElementById('f-kind').value);
    if (document.getElementById('f-grade').value !== 'all') p.set('grade', document.getElementById('f-grade').value);
    if (document.getElementById('f-stage').value !== 'all') p.set('stage', document.getElementById('f-stage').value);
    if (document.getElementById('f-spoiler').checked) p.set('spoiler', 'on');
    if (document.getElementById('f-unearned').checked) p.set('unearned', 'on');
    location.search = '?' + p.toString();
  };
  document.getElementById('f-q').addEventListener('change', apply);
  ['f-kind', 'f-grade', 'f-stage', 'f-spoiler', 'f-unearned'].forEach((id) => document.getElementById(id).addEventListener('change', apply));
  document.getElementById('f-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ key: KEY, earned: [...earned], counts }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'leonida-platinum-progress.json'; a.click();
  });
  document.getElementById('f-import').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const j = JSON.parse(r.result);
        if (Array.isArray(j.earned)) { earned = new Set(j.earned.filter((id) => trophyById(id))); }
        if (j.counts) counts = j.counts;
        saveState(); renderChecklist();
      } catch { alert('That file is not a Leonida Platinum progress file.'); }
    };
    r.readAsText(f);
  });
}
function renderCover() {
  document.body.classList.add('cover');
  const t = trophyById(28);
  document.getElementById('cover').innerHTML = cardHtml(t, true) +
    '<p class="cover-line">13 disputes · 15 sources · 7-stage roadmap · YOUR COUNT in the header</p>';
}

const STAGE_SUMMARY = {
  S1a: 'Chapter start+end saves. Window: Ch.1 balcony gone after Ch.1.',
  S1b: 'Ch.1 save until PMA pops; 1 untouched pre-final save.',
  S2: 'Do strands as they appear. Window: chains have story windows.',
  S3: 'No save needed — free roam after story.',
  S4: 'Keep Ch.1 save until PMA pops.',
  S5: 'No save needed. Window: Max Withdrawal needs the Ch.4 optional mission.',
  S6: '1 untouched pre-final save; rotate 4 cleanup saves.',
};
function renderRoadmap() {
  const summary = `<div class="table-wrap"><table class="summary-table"><thead><tr><th>Stage</th><th>Trophies</th><th>PSN</th><th>Hours</th><th>Save / window</th></tr></thead><tbody>
    ${DATA.meta.stages.map((s) => {
      const ts = s.trophy_ids.map(trophyById);
      const psn = ts.reduce((a, t) => a + t.psn_value, 0);
      return `<tr><td><strong>${s.id} — ${esc(s.name)}</strong></td><td>${ts.length}</td><td>${psn}</td><td>${esc(s.hours)}</td><td>${esc(STAGE_SUMMARY[s.id])}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  const blocks = DATA.meta.stages.map((s) => {
    const ts = s.trophy_ids.map(trophyById);
    const got = ts.filter((t) => earned.has(t.id)).length;
    const psn = ts.reduce((a, t) => a + t.psn_value, 0);
    const win = STAGE_WINDOWS[s.id] ? `<p class="window-note">${esc(STAGE_WINDOWS[s.id])}</p>` : '';
    return `<section class="stage-block"><h3>${s.id} — ${esc(s.name)} · ${got}/${ts.length} earned</h3>
      <p><strong>${psn} PSN · ${esc(s.hours)}</strong> — ${esc(s.note)}</p>
      <p><strong>Save:</strong> ${esc(s.save)}</p>${win}
      <ul>${ts.map((t) => `<li>${earned.has(t.id) ? '✓' : '○'} #${t.id} ${esc(t.name)} (${t.psn_value} PSN)</li>`).join('')}</ul></section>`;
  }).join('');
  viewEl.innerHTML = `<p class="note">Seven stages, 55 trophies, 1,350 PSN, about 200 hours. Save plan: 15 manual slots + 1 autosave; 10 chapter start/end, 1 untouched pre-final, 4 rotating cleanup.</p>${summary}${blocks}`;
}
function renderMatrix() {
  const sps = MATRIX.meta.steps_per_source;
  const spsLine = Object.keys(sps).sort((a, b) => a - b).map((n) => `[${n}] ${sps[n]}${[5, 6, 8].includes(Number(n)) ? ' (list tracker)' : ''}`).join(' · ');
  const SHORT = { 1: 'PPyx', 2: 'Keen', 3: 'Push', 4: 'GTA', 5: 'Exo', 6: 'PSNP', 7: 'Out', 8: 'Ins', 9: 'Scoop', 10: 'GM', 11: 'eGam', 12: 'Hub', 13: 'Crypto', 14: 'Mob', 15: 'GFuze' };
  const heads = MATRIX.meta.sources.map((s, i) => `<th>${SHORT[i + 1]}</th>`).join('');
  const rows = MATRIX.rows.map((r) => {
    const t = trophyById(r.id);
    return `<tr><td>${r.id}</td><td>${esc(t.name)}</td>${r.cells.map((c) => `<td class="${c.includes('C') ? 'c' : ''}">${c}</td>`).join('')}<td class="dispute">${r.dispute ? esc(r.dispute) : ''}</td></tr>`;
  }).join('');
  viewEl.innerHTML = `<p class="note">${esc(MATRIX.meta.agreement)}</p>
    <div class="table-wrap"><table class="matrix-table"><thead><tr><th>#</th><th>Trophy</th>${heads}<th>Dispute</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="legend"><strong>Legend:</strong> L = source publishes the trophy's name, description and grade. G = source also carries a walkthrough. C = at least one numbered step for this trophy cites that source. Every cell carries L: all 15 sources publish all 55 trophies.</p>
    <p class="legend"><strong>Steps per source:</strong> ${esc(spsLine)}</p>`;
}
function renderDisputes() {
  viewEl.innerHTML = `<p class="note">Thirteen places where the sources disagree or stay silent. Each one ends in a verdict — and where the verdict is 'not invented', the guide says so on the trophy itself.</p>` +
    DATA.meta.disputes.map((d) => `<section class="dispute-block"><h3>${d.id} — ${esc(d.topic)}</h3>
      <p><strong>Side A:</strong> ${esc(d.a)}</p><p><strong>Side B:</strong> ${esc(d.b)}</p>
      <p><strong>Verdict:</strong> ${esc(d.verdict)}</p>
      <p><strong>Trophies:</strong> ${d.trophies.map((id) => `#${id} ${esc(trophyById(id).name)}`).join(', ')}</p></section>`).join('');
}
function renderCounts() {
  const ledger = DATA.meta.ledger;
  let have = 0, need = 0;
  ledger.forEach((c, i) => {
    const v = Math.min(counts[i] || 0, c.of);
    have += Math.min(v, c.need); need += c.need;
  });
  const pct = need ? Math.round((have / need) * 100) : 0;
  const rows = ledger.map((c, i) => {
    const v = counts[i] || 0;
    const pctC = Math.min(100, Math.round((v / c.of) * 100));
    return `<div class="counter-row"><span class="label"><strong>${v} / ${c.of}</strong> — ${esc(c.label)}<br><span class="cnote">${esc(c.note)} [${c.sources.join(', ')}]</span></span>
      <span class="bar"><div style="width:${pctC}%"></div></span>
      <button data-count="${i}" data-d="-1" aria-label="decrease">−</button>
      <button data-count="${i}" data-d="1" aria-label="increase">+</button></div>`;
  }).join('');
  const vs = `<div class="table-wrap"><table class="compact-table"><thead><tr><th>Item</th><th>Trophy needs</th><th>100% checklist asks</th><th>Sources</th><th>Which number pops what</th></tr></thead><tbody>
    ${VS_CHECKLIST.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join('')}</tbody></table></div>`;
  viewEl.innerHTML = `<p class="note">15 counters for the 100% Completion Checklist (35 tasks [12]). Trophy: 50 challenges, 3 card sets. Checklist: 70 of 80 challenges, 15 of 18 sets. <strong>Overall: ${have.toLocaleString('en-US')} / ${need.toLocaleString('en-US')} (${pct}%)</strong></p>
    <h3>Trophy vs 100% checklist — both numbers</h3>${vs}
    ${rows}
    <p class="note"><strong>Xbox total 1,000G</strong> (all lists agree on the total; individual values differ between lists — see D12).</p>`;
}
function renderMissables() {
  const un = [28, 29, 46, 47, 49, 50, 51].map(trophyById);
  const unNote = (t) => t.id === 51 ? ' — still open, one reading (PowerPyx), not confirmed' : t.id === 29 ? ' — which animal still being confirmed — the strand names it' : '';
  viewEl.innerHTML = `
    <section class="tier"><h3>MISSABLE — exactly 1</h3><p><strong>#28 Positive Mental Attitude:</strong> do the Chapter 1 balcony meditation with Lucia before Chapter 1 ends, and keep a Chapter 1 save until it pops. There is no mission replay.</p></section>
    <section class="tier"><h3>WATCH — 1</h3><p><strong>#25 Strangers &amp; Freaks:</strong> stranger chains have windows tied to story progress (dispute D2, warning D13). Not a second missable — nothing calls a strand permanently missable — but start each chain as soon as it unlocks.</p></section>
    <section class="tier"><h3>UNCONFIRMED — 7</h3><ul>${un.map((t) => `<li><strong>#${t.id} ${esc(t.name)}</strong>${unNote(t)}</li>`).join('')}</ul></section>
    <section class="tier"><h3>SAFE — 46</h3><p>Every other trophy is safe: nothing in the cited sources makes it missable. The 7 watch trophies are #33 Hot Together, #34 Retail Therapy, #37 Catch Me If You Can, #38 Challenging Tank, #39 Sneakthief, #41 A Classic Blitz Play and #45 Capital Offense — each needs a specific setup, not a deadline.</p></section>`;
}
function renderWindows() {
  viewEl.innerHTML = `<p class="note">Every story-progress window in one table. The Missables view links here; the roadmap repeats each stage's note.</p>
    <div class="table-wrap"><table><thead><tr><th>Window</th><th>When it closes</th><th>Safe play</th></tr></thead><tbody>
    ${WINDOWS.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table></div>`;
}
function renderSources() {
  const coverage = {};
  for (let n = 1; n <= 15; n += 1) {
    coverage[n] = DATA.trophies.filter((t) => t.steps.some((s) => s.c === n || s.c2 === n)).length;
  }
  viewEl.innerHTML = `<p class="note">15 sources, read 21 Nov 2026.</p>` + DATA.meta.sources.map((s) => {
    const cov = coverage[s.n];
    const covLine = [5, 6, 8].includes(s.n)
      ? `${cov} step citations — list tracker: verifies all 55 names, descriptions and grades.`
      : `${cov} of 55 trophies have at least one step citing this source.`;
    return `<section class="source-block"><h3>[${s.n}] ${esc(s.name)}</h3>
      <p>${s.url ? `<a href="${esc(s.url)}">${esc(s.url)}</a>` : 'Cited by name only — no direct URL was captured on 21 Nov 2026, none is guessed.'}</p>
      <p>${esc(s.covers)}</p><p><strong>Read:</strong> ${esc(s.read)} · <strong>Coverage:</strong> ${covLine}</p></section>`;
  }).join('') +
  `<p class="note">Official trophy names and descriptions are shown as PlayStation publishes them. Every guide step is written in our own words and cites its source by number.</p>`;
}
function setTab(view) {
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
}
function render() {
  const view = params.get('view') || 'checklist';
  const map = { checklist: renderChecklist, roadmap: renderRoadmap, matrix: renderMatrix, disputes: renderDisputes, disagreements: renderDisputes, counts: renderCounts, ledger: renderCounts, missables: renderMissables, windows: renderWindows, sources: renderSources };
  setTab(map[view] ? (view === 'ledger' ? 'counts' : view === 'disagreements' ? 'disputes' : view) : 'checklist');
  (map[view] || renderChecklist)();
  updateProgress();
}
async function init() {
  loadState();
  const [t, m] = await Promise.all([fetch('data/trophies.json').then((r) => r.json()), fetch('data/matrix.json').then((r) => r.json())]);
  DATA = t; MATRIX = m;
  const seed = Number(params.get('seed') || 0);
  if (seed > 0 && !localStorage.getItem(KEY)) {
    earned = new Set([...DATA.trophies].sort((a, b) => a.order - b.order).slice(0, seed).map((x) => x.id));
    saveState();
  }
  renderAudit();
  if (params.get('cover') === '1') { renderCover(); updateProgress(); return; }
  render();
  document.getElementById('tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-view]');
    if (!b) return;
    const p = new URLSearchParams(location.search);
    p.set('view', b.dataset.view);
    history.pushState(null, '', '?' + p.toString());
    const np = new URLSearchParams(location.search);
    params.set('view', np.get('view'));
    render();
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.matches('[data-earn]')) {
      const id = Number(el.dataset.earn);
      if (el.checked) earned.add(id); else earned.delete(id);
      saveState();
      if (params.get('view') === 'roadmap') render();
    }
    if (el.matches('[data-count]')) return;
  });
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-count]');
    if (!el) return;
    const i = Number(el.dataset.count);
    const d = Number(el.dataset.d);
    counts[i] = Math.max(0, (counts[i] || 0) + d);
    saveState(); renderCounts();
  });
}
init();
