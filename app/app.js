// Leonida Platinum — offline GTA VI trophy tracker.
// Loads app/data/trophies.json (a file of this app, never the network),
// renders the checklist, the roadmap and the missable page, and keeps
// progress in localStorage with export to a JSON file and import back.
// Query parameters (for deep links and screenshots): view, open (trophy id),
// kind, grade, spoiler=on, seed=<n earned, demo only>.

const STORAGE_KEY = 'leonida-platinum-progress-v1';
const SPOILER_KEY = 'leonida-platinum-spoiler-v1';

const listEl = document.getElementById('trophyList');
const detailCard = document.getElementById('detailCard');
const detailEmpty = document.getElementById('detailEmpty');
const listMeta = document.getElementById('listMeta');
const emptyNote = document.getElementById('emptyNote');
const searchInput = document.getElementById('search');
const kindSelect = document.getElementById('kind');
const gradeSelect = document.getElementById('grade');
const earnedOnlyBox = document.getElementById('earnedOnly');
const missableOnlyBox = document.getElementById('missableOnly');
const spoilerBox = document.getElementById('spoiler');

const params = new URLSearchParams(location.search);
let earned = loadEarned();
let spoilerOn = loadSpoiler();
let selectedId = null;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies.slice().sort((a, b) => a.id - b.id);
const byId = new Map(trophies.map((t) => [t.id, t]));

const ROADMAP_STAGES = [
  { title: 'Stage 1 — Chapter 1: do the missable first', ids: [28, 2, 3, 20, 21], text: 'Before anything else, do Lucia’s balcony meditation at Jason’s house after Down to Earth (Positive Mental Attitude) — the only missable trophy in the game. Then finish the opening mission Gone Fishing and Chapter 1. Sample fishing and an arcade game while you are here; both count toward the activity types.' },
  { title: 'Stage 2 — Chapters 2–4: the story, both characters playable', ids: [4, 5, 6, 8, 9, 10, 11, 12, 13, 33, 34], text: 'Play Chapters 2–4 and both Jason and Lucia become playable, which opens most of the free-roam list. The named-mission trophies pop as you finish each mission. With your partner beside you, work on the two partner trophies: lose a 4-star wanted level together, and rob 3 shops back-to-back without losing the heat.' },
  { title: 'Stage 3 — The final mission and the side strands', ids: [7, 22, 23, 24, 26, 27, 25, 29], text: 'Finish the final mission for the gold, then play the side-character strands to their finales — Andy, Kenton, Billy, Randy and Tyrone — plus Bret’s hunt. Eight finished stranger strands earn the silver. Keep a manual save from before the final mission. Everything here stays open after the credits.' },
  { title: 'Stage 4 — Activities: races, range, stunts and challenges', ids: [15, 16, 17, 18, 19, 32, 36, 37, 38, 39, 46, 51], text: 'Gold all 42 Shooting Range challenges, win a drone race at all 14 Top Fun locations, win 20 different races, land 250 stunts and clear 50 challenges. Try one of each of the 9 activity types for Master of None. Combat Focus, the VCIA departure and the Rhino encounter are all free-roam attempts — repeatable, so a failed try costs nothing.' },
  { title: 'Stage 5 — Collectibles, exploration and money', ids: [30, 31, 35, 40, 41, 42, 43, 52, 53, 54, 55], text: 'Complete 3 card sets, WAiNK It at 100 locations, discover 100 vehicles, explore all 52 areas of Leonida. Rob 5 bank vaults, an armored truck and one illegal operation per gang; launder $250,000 of Marked Bills through your contacts, spend $100,000 in shops, buy all 8 garages and register 10 vehicles in the Scooter Bros app.' },
  { title: 'Stage 6 — The last gold, then the platinum', ids: [14, 44, 45, 47, 48, 49, 50, 1], text: 'Check the in-game 100% checklist (Progress, Stats, 100% Completion) and close out whatever it still lists — that earns A Long Road, the gold for 100% completion. The vague story-moment trophies should have popped during the story; if one has not, check its guide for the confirmed trigger. When the last trophy pops, Vice Got a Price! — the platinum — follows at once.' },
];

// PSN points per grade (PlayStation's own values): platinum 300, gold 90,
// silver 30, bronze 15. All 55 trophies are worth 1,350 points in total;
// the platinum itself pops only after the other 54 are earned.
const POINTS = { platinum: 300, gold: 90, silver: 30, bronze: 15 };
const TOTAL_POINTS = 1350;
function pointsFor(t) { return POINTS[t.grade] ?? 0; }
function shortSourceNames(t) {
  return (t.sources ?? []).map((s) => s.name.split(' — ')[0]).join(' · ');
}

function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

function loadSpoiler() {
  if (params.get('spoiler') === 'on') return true;
  try { return localStorage.getItem(SPOILER_KEY) === '1'; } catch { return false; }
}

function saveEarned() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned])); } catch { /* storage full or blocked: progress stays in memory */ }
}

function saveSpoiler() {
  try { localStorage.setItem(SPOILER_KEY, spoilerOn ? '1' : '0'); } catch { /* ignore */ }
}

function isHidden(t) {
  return spoilerOn && t.kind === 'story' && !earned.has(t.name);
}

function displayName(t) {
  return isHidden(t) ? 'Hidden trophy — earn it to reveal' : t.name;
}

function displayDescription(t) {
  return isHidden(t) ? 'This story trophy is hidden while spoilers are on. Earn it in the game and it appears here.' : t.description;
}

function matchesFilters(t) {
  const q = searchInput.value.trim().toLowerCase();
  if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.roadmap ?? '').toLowerCase().includes(q))) return false;
  if (kindSelect.value !== 'all' && t.kind !== kindSelect.value) return false;
  if (gradeSelect.value !== 'all' && t.grade !== gradeSelect.value) return false;
  if (earnedOnlyBox.checked && !earned.has(t.name)) return false;
  if (missableOnlyBox.checked && !t.missable) return false;
  return true;
}

function gradePill(t) {
  const pill = document.createElement('span');
  pill.className = `grade-pill ${t.grade}`;
  pill.textContent = t.grade;
  return pill;
}

function renderList() {
  listEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matchesFilters(t)) continue;
    shown += 1;
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.name) ? ' earned' : '') + (t.missable ? ' is-missable' : '') + (selectedId === t.id ? ' selected' : '');
    li.dataset.id = String(t.id);

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      saveEarned();
      renderAll();
    });

    const body = document.createElement('button');
    body.type = 'button';
    body.className = 'trophy-body';
    body.addEventListener('click', () => { selectedId = t.id; renderAll(); });

    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = displayName(t);
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(t);
    const meta = document.createElement('span');
    meta.className = 'trophy-meta';
    meta.append(gradePill(t));
    if (t.missable) {
      const flag = document.createElement('span');
      flag.className = 'missable-flag';
      flag.textContent = '⚠ MISSABLE';
      meta.append(flag);
    }
    if (t.target) {
      const target = document.createElement('span');
      target.className = 'target';
      target.textContent = `Target: ${t.target.toLocaleString('en-US')}`;
      meta.append(target);
    }
    const kind = document.createElement('span');
    kind.className = 'kind';
    kind.textContent = t.kind;
    meta.append(kind);
    const points = document.createElement('span');
    points.className = 'points-tag';
    points.textContent = `${pointsFor(t)} pts`;
    meta.append(points);
    const cite = document.createElement('span');
    cite.className = 'cite-line';
    cite.textContent = `Cited: ${shortSourceNames(t)}`;
    body.append(name, desc, meta, cite);
    li.append(box, body);
    listEl.append(li);
  }
  listMeta.textContent = `Showing ${shown} of ${trophies.length} trophies`;
  emptyNote.hidden = shown !== 0;
}

function renderProgress() {
  const count = earned.size;
  document.getElementById('earnedCount').textContent = String(count);
  document.getElementById('progressLabel').textContent = `${count} of ${trophies.length} trophies earned`;
  const fill = document.getElementById('progressFill');
  fill.style.width = `${(count / trophies.length) * 100}%`;
  document.getElementById('progressBarWrap').setAttribute('aria-valuenow', String(count));
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  document.getElementById('gradeCounts').textContent = grades
    .map((g) => `${trophies.filter((t) => t.grade === g && earned.has(t.name)).length}/${trophies.filter((t) => t.grade === g).length} ${g}`)
    .join(' · ');
  const earnedPoints = trophies.filter((t) => earned.has(t.name)).reduce((sum, t) => sum + pointsFor(t), 0);
  document.getElementById('psnPoints').textContent = `PSN points: ${earnedPoints.toLocaleString('en-US')} / ${TOTAL_POINTS.toLocaleString('en-US')} · Platinum 300 · Gold 90 · Silver 30 · Bronze 15`;
  const towardPlatinum = trophies.filter((t) => t.grade !== 'platinum' && earned.has(t.name)).length;
  document.getElementById('platinumProgress').textContent = `Platinum progress: ${towardPlatinum} / 54 trophies toward Vice Got a Price!${towardPlatinum === 54 ? ' — platinum earned!' : ''}`;
}

function renderDetail() {
  const t = selectedId == null ? null : byId.get(selectedId);
  detailEmpty.hidden = t != null;
  detailCard.hidden = t == null;
  if (!t) return;
  detailCard.replaceChildren();
  const title = document.createElement('h2');
  title.textContent = displayName(t);
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = `Official: “${displayDescription(t)}”`;
  const pills = document.createElement('p');
  pills.className = 'detail-meta';
  pills.append(gradePill(t));
  if (t.missable) {
    const flag = document.createElement('span');
    flag.className = 'missable-flag';
    flag.textContent = '⚠ MISSABLE — see the Missable page';
    pills.append(flag);
  }
  if (t.roadmap) {
    const stage = document.createElement('span');
    stage.className = 'roadmap-tag';
    stage.textContent = t.roadmap;
    pills.append(stage);
  }
  const points = document.createElement('span');
  points.className = 'roadmap-tag';
  points.textContent = `${pointsFor(t)} PSN points (${t.grade})`;
  pills.append(points);
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = isHidden(t) ? 'Turn spoilers off, or earn this trophy, to read its guide.' : t.guide;
  detailCard.append(title, official, pills, guide);
  if (!isHidden(t) && Array.isArray(t.sources) && t.sources.length) {
    const srcTitle = document.createElement('p');
    srcTitle.className = 'sources-title';
    srcTitle.textContent = 'Sources — where each fact comes from:';
    const srcList = document.createElement('ul');
    srcList.className = 'sources';
    for (const s of t.sources) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = s.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = s.name;
      item.append(link);
      srcList.append(item);
    }
    detailCard.append(srcTitle, srcList);
  }
  const earnedBtn = document.createElement('button');
  earnedBtn.type = 'button';
  earnedBtn.className = earned.has(t.name) ? 'earned-btn earned' : 'earned-btn';
  earnedBtn.textContent = earned.has(t.name) ? '✓ Earned — click to unmark' : 'Mark as earned';
  earnedBtn.addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name); else earned.add(t.name);
    saveEarned();
    renderAll();
  });
  detailCard.append(earnedBtn);
}

function renderRoadmap() {
  const list = document.getElementById('roadmapList');
  list.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    li.className = 'stage';
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const earnedInStage = stage.ids.filter((id) => byId.has(id) && earned.has(byId.get(id).name)).length;
    const stagePoints = stage.ids.filter((id) => byId.has(id) && earned.has(byId.get(id).name)).reduce((sum, id) => sum + pointsFor(byId.get(id)), 0);
    const counter = document.createElement('span');
    counter.className = 'stage-count';
    counter.textContent = `${earnedInStage}/${stage.ids.length} earned · ${stagePoints} pts`;
    title.append(counter);
    const text = document.createElement('p');
    text.textContent = stage.text;
    const chips = document.createElement('p');
    chips.className = 'stage-trophies';
    for (const id of stage.ids) {
      const t = byId.get(id);
      if (!t) continue;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (earned.has(t.name) ? ' done' : '') + (t.missable ? ' missable-chip' : '');
      chip.textContent = `${t.missable ? '⚠ ' : ''}${t.name} (${t.grade})`;
      chip.addEventListener('click', () => { selectedId = t.id; showView('checklist'); });
      chips.append(chip);
    }
    li.append(title, text, chips);
    list.append(li);
  }
}

function showView(view) {
  for (const name of ['checklist', 'roadmap', 'missable']) {
    document.getElementById(`view${name[0].toUpperCase()}${name.slice(1)}`).hidden = name !== view;
    document.querySelector(`.tab[data-view="${name}"]`).classList.toggle('active', name === view);
  }
}

function renderStageStrip() {
  const strip = document.getElementById('stageStrip');
  strip.replaceChildren();
  ROADMAP_STAGES.forEach((stage, i) => {
    const earnedInStage = stage.ids.filter((id) => byId.has(id) && earned.has(byId.get(id).name)).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'stage-chip' + (earnedInStage === stage.ids.length ? ' done-stage' : '');
    chip.textContent = `Stage ${i + 1}: ${earnedInStage}/${stage.ids.length} `;
    const small = document.createElement('small');
    small.textContent = stage.title.split('—')[1]?.trim() ?? '';
    chip.append(small);
    chip.addEventListener('click', () => showView('roadmap'));
    strip.append(chip);
  });
  const total = document.createElement('span');
  total.className = 'stage-count';
  total.textContent = `${earned.size}/55 earned overall`;
  strip.append(total);
}

function renderWatch() {
  const missable = byId.get(28);
  const safe = missable && earned.has(missable.name);
  document.getElementById('watchStatus').textContent = safe
    ? 'Status: ✓ earned — the missable trophy is safe, the platinum can no longer be missed.'
    : 'Status: not yet earned — do it before you leave Chapter 1.';
  document.getElementById('watchStatusLine').textContent = safe
    ? 'MISSABLE WATCH: ✓ all clear — Positive Mental Attitude is earned, nothing in the game can be missed now.'
    : 'MISSABLE WATCH: 1 of 1 missable trophies still at risk — Positive Mental Attitude, Chapter 1 only.';
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
  renderStageStrip();
  renderWatch();
  renderRoadmap();
}

function download(filename, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

document.getElementById('export').addEventListener('click', () => {
  download('gta6-trophy-progress.json', JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort(), exportedAt: new Date().toISOString() }, null, 2));
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    saveEarned();
    renderAll();
  } catch {
    alert('That file is not a Leonida Platinum progress export.');
  }
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies in this tracker?')) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});

spoilerBox.checked = spoilerOn;
spoilerBox.addEventListener('change', () => { spoilerOn = spoilerBox.checked; saveSpoiler(); renderAll(); });
for (const [el, handler] of [[searchInput, 'input'], [kindSelect, 'change'], [gradeSelect, 'change'], [earnedOnlyBox, 'change'], [missableOnlyBox, 'change']]) {
  el.addEventListener(handler, renderList);
}
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => showView(tab.dataset.view));
}
document.getElementById('openMissable').addEventListener('click', () => {
  selectedId = 28;
  spoilerOn = false;
  spoilerBox.checked = false;
  saveSpoiler();
  showView('checklist');
  renderAll();
  document.getElementById('detailPane').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Deep links: ?view=roadmap|missable|checklist, ?open=<id>, ?kind=, ?grade=,
// ?seed=<n> marks the first n trophies earned (demo / screenshot use).
if (params.get('kind') && kindSelect.querySelector(`option[value="${params.get('kind')}"]`)) kindSelect.value = params.get('kind');
if (params.get('grade') && gradeSelect.querySelector(`option[value="${params.get('grade')}"]`)) gradeSelect.value = params.get('grade');
if (params.get('seed')) {
  const n = Math.max(0, Math.min(trophies.length, Number(params.get('seed')) || 0));
  earned = new Set(trophies.filter((t) => t.id !== 1).slice(0, n).map((t) => t.name));
  saveEarned();
}
if (params.get('open')) {
  const id = Number(params.get('open'));
  if (byId.has(id)) selectedId = id;
}
renderRoadmap();
renderAll();
showView(params.get('view') === 'roadmap' || params.get('view') === 'missable' ? params.get('view') : 'checklist');
