// Leonida Platinum — GTA VI trophy guide & tracker (v2 audit).
// Own code: fetches the guide data, renders five views (checklist, roadmap,
// source matrix, disputes, 100% ledger), saves progress in the browser.
const KEY = 'leonida-platinum-v2';
const STORY_IDS = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27]);
const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const matrix = await (await fetch('data/matrix.json')).json();
const trophies = [...doc.trophies].sort((a, b) => a.order - b.order);
const byId = new Map(trophies.map((t) => [t.id, t]));
const sourceName = new Map(doc.sources.map((s) => [s.n, s.name]));

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
const seed = Number(params.get('seed') ?? 0);
if (seed > 0 && earned.size === 0) {
  for (const t of trophies.slice(0, seed)) earned.add(t.id);
  save();
}

const $ = (id) => document.getElementById(id);
const gradeLabel = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const watchLabel = { missable: 'MISSABLE', possible: 'POSSIBLE MISSABLE', watch: 'WATCH', safe: 'safe' };

function save() { localStorage.setItem(KEY, JSON.stringify([...earned])); }

function progress() {
  const psn = trophies.filter((t) => earned.has(t.id)).reduce((s, t) => s + t.psn_value, 0);
  $('earnedCount').textContent = `${earned.size} / ${trophies.length}`;
  $('earnedBar').style.width = `${(earned.size / trophies.length) * 100}%`;
  $('psnCount').textContent = `${psn.toLocaleString()} / 1,350 PSN`;
  const g = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (earned.has(t.id)) g[t.grade]++;
  $('gradeCounts').textContent = `P ${g.platinum}/1 · G ${g.gold}/2 · S ${g.silver}/6 · B ${g.bronze}/46`;
}

function cite(n) { return `[${n} ${sourceName.get(n) ?? ''}]`; }

function card(t) {
  const el = document.createElement('article');
  el.className = 'lg-card' + (t.watch === 'missable' ? ' missable' : '');
  el.id = `t${t.id}`;
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Earned: ${t.name}`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id); else earned.delete(t.id);
    save(); progress(); applyFilters();
  });
  const done = document.createElement('label');
  done.className = 'lg-done';
  done.append(box, document.createTextNode(' Earned'));
  const h = document.createElement('h2');
  h.textContent = t.name;
  const grade = document.createElement('span');
  grade.className = 'lg-grade';
  grade.textContent = gradeLabel[t.grade];
  h.append(grade);
  const off = document.createElement('p');
  off.className = 'lg-off';
  off.textContent = t.official;
  const tags = document.createElement('div');
  tags.className = 'lg-tags';
  const tagList = [
    [`${t.psn_value} PSN`, ''],
    [`Stage ${t.stage} · #${t.order}`, ''],
    [t.kind, ''],
    [watchLabel[t.watch], t.watch === 'missable' ? 'red' : t.watch === 'watch' || t.watch === 'possible' ? 'blue' : ''],
  ];
  if (t.unconfirmed) tagList.push(['UNCONFIRMED', 'red']);
  if (t.target != null) tagList.push([`target: ${t.target.toLocaleString()}`, '']);
  for (const [text, cls] of tagList) {
    const s = document.createElement('span');
    s.className = 'lg-tag' + (cls ? ` ${cls}` : '');
    s.textContent = text;
    tags.append(s);
  }
  const steps = document.createElement('ol');
  steps.className = 'lg-steps';
  t.steps.forEach((s, i) => {
    const li = document.createElement('li');
    li.textContent = s.t + ' ';
    const c = document.createElement('span');
    c.className = 'lg-cite';
    c.textContent = cite(s.c);
    li.append(c);
    steps.append(li);
  });
  const audit = document.createElement('p');
  audit.className = 'lg-audit';
  audit.innerHTML = `<b>AUDIT</b> — ${t.audit}`;
  const sv = document.createElement('p');
  sv.className = 'lg-save';
  sv.innerHTML = `<b>SAVE</b> — ${t.save}`;
  el.append(done, h, off, tags, steps, audit, sv);
  return el;
}

function applyFilters() {
  const q = $('q').value.trim().toLowerCase();
  const kind = $('kind').value, grade = $('grade').value, stage = $('stage').value;
  const hideSpoilers = $('spoiler').checked, unearnedOnly = $('unearned').checked;
  const cards = $('cards');
  cards.replaceChildren();
  let shown = 0;
  const list = [];
  for (const t of trophies) {
    if (kind !== 'all' && t.kind !== kind) continue;
    if (grade !== 'all' && t.grade !== grade) continue;
    if (stage !== 'all' && t.stage !== stage) continue;
    if (hideSpoilers && STORY_IDS.has(t.id)) continue;
    if (unearnedOnly && earned.has(t.id)) continue;
    if (q && !(t.name.toLowerCase().includes(q) || t.official.toLowerCase().includes(q))) continue;
    list.push(t);
  }
  // A deep-linked trophy (?open=N) renders first so it sits at the top of the
  // page with no scrolling: headless screenshots do not paint scrolled content.
  const openId = Number(params.get('open') ?? 0);
  if (openId > 0) {
    const i = list.findIndex((t) => t.id === openId);
    if (i > 0) list.unshift(list.splice(i, 1)[0]);
  }
  for (const t of list) {
    const el = card(t);
    if (t.id === openId) el.style.outline = '2px solid #e8b64c';
    cards.append(el);
    shown++;
  }
  $('shownCount').textContent = `Showing ${shown} of 55 trophies.`;
}

function renderRoadmap() {
  const box = $('roadmap');
  box.replaceChildren();
  for (const s of doc.stages) {
    const got = s.trophy_ids.filter((id) => earned.has(id)).length;
    const el = document.createElement('div');
    el.className = 'lg-stage';
    const h = document.createElement('h2');
    h.textContent = `${s.id} — ${s.name} · ${got}/${s.trophy_ids.length} earned`;
    const meta = document.createElement('p');
    meta.className = 'lg-meta';
    meta.textContent = `${s.psn} PSN · ${s.hours} hours · ${s.save}`;
    el.append(h, meta);
    const list = document.createElement('p');
    list.textContent = s.trophy_ids.map((id) => {
      const t = byId.get(id);
      return `${earned.has(id) ? '✓' : '○'} ${t.name} (${t.psn_value})`;
    }).join(' · ');
    el.append(list);
    const check = document.createElement('p');
    check.innerHTML = `<b>Chapter save:</b> ${s.id === 'S1' ? 'keep a save at the start and end of every chapter; do the Chapter 1 balcony meditation before Chapter 1 ends.' : s.id === 'S4' ? 'keep the Chapter 1 save until Positive Mental Attitude pops.' : s.id === 'S6' ? 'keep 1 untouched slot from just before the final mission.' : 'no special save — do these as they appear.'}`;
    el.append(check);
    box.append(el);
  }
}

function renderMatrix() {
  $('matrixNote').textContent = matrix.meta.agreement;
  const body = $('matrixBody');
  body.replaceChildren();
  for (const row of matrix.rows) {
    const t = byId.get(row.id);
    const tr = document.createElement('tr');
    const id = document.createElement('td'); id.textContent = row.id;
    const name = document.createElement('td'); name.className = 'lg-name'; name.textContent = t.name;
    tr.append(id, name);
    for (const cell of row.cells) {
      const td = document.createElement('td');
      td.textContent = cell;
      if (cell.includes('C')) td.className = 'lg-c';
      tr.append(td);
    }
    const d = document.createElement('td');
    d.textContent = row.dispute ?? '—';
    if (row.dispute) d.className = 'lg-d';
    tr.append(d);
    body.append(tr);
  }
}

function renderDisputes() {
  const box = $('disputes');
  box.replaceChildren();
  for (const d of doc.disputes) {
    const el = document.createElement('div');
    el.className = 'lg-dispute';
    el.id = d.id;
    const h = document.createElement('h2');
    h.textContent = `${d.id} — ${d.topic}`;
    const a = document.createElement('p'); a.textContent = `Side A: ${d.a}`;
    const b = document.createElement('p'); b.textContent = `Side B: ${d.b}`;
    const v = document.createElement('p');
    v.className = 'lg-v';
    v.textContent = `Verdict: ${d.verdict}`;
    const ids = document.createElement('p');
    ids.textContent = `Trophies: ${d.trophies.map((id) => `#${id} ${byId.get(id).name}`).join(', ')}`;
    el.append(h, a, b, v, ids);
    box.append(el);
  }
}

function renderLedger() {
  const box = $('ledger');
  box.replaceChildren();
  for (const item of doc.ledger) {
    const row = document.createElement('div');
    row.className = 'lg-ledger-row';
    const left = document.createElement('div');
    left.innerHTML = `<b>${item.need.toLocaleString()} / ${item.of.toLocaleString()}</b> — ${item.label}`;
    const right = document.createElement('span');
    right.textContent = `${item.note} [${item.sources.join(', ')}]`;
    row.append(left, right);
    box.append(row);
  }
}

function show(view) {
  for (const b of document.querySelectorAll('#tabs button')) b.classList.toggle('on', b.dataset.view === view);
  for (const v of document.querySelectorAll('.lg-view')) v.classList.toggle('on', v.id === `view-${view}`);
}
for (const b of document.querySelectorAll('#tabs button')) {
  b.addEventListener('click', () => { show(b.dataset.view); });
}

$('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify([...earned])], { type: 'application/json' }));
  a.download = 'leonida-platinum-progress.json';
  a.click();
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  earned = new Set(JSON.parse(await file.text()));
  save(); progress(); applyFilters(); renderRoadmap();
});
for (const id of ['q', 'kind', 'grade', 'stage', 'spoiler', 'unearned']) {
  $(id).addEventListener('change', applyFilters);
  $(id).addEventListener('input', applyFilters);
}

if (params.get('kind')) $('kind').value = params.get('kind');
if (params.get('spoiler') === 'on') $('spoiler').checked = true;
progress();
applyFilters();
renderRoadmap();
renderMatrix();
renderDisputes();
renderLedger();
show(params.get('view') ?? 'checklist');
