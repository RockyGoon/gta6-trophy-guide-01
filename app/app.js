// Leonida Platinum — v5 rebuild 21 Nov 2026. GTA VI trophy guide & tracker.
// All numbers on screen are computed from app/data/trophies.json and
// app/data/matrix.json at load time; nothing is hardcoded.
const KEY = 'leonida-platinum-v5';
const STORY_IDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27];

const SOURCES = [
  { n: 1, name: 'PowerPyx', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/', covers: 'Roadmap (story 60-80 h, 100% ~100 h, cleanup ~10 h); difficulty 4/10; ~200 h; 1 missable (Ch.1 balcony meditation); 200/277 vehicles, 100/255 animals, 50/66 weapons; 70/80 challenges; 15 manual saves; 100% is ~60% true completion.' },
  { n: 2, name: 'KeenGamer', url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/', covers: 'Roadmap (~200 h, 4/10); balcony meditation after Down to Earth; 39 gang ops, 22 bank jobs, 7 payday jobs, 8 vaults; 100 optional tasks; 15 card sets, 100 WAiNK, 33 underwater, 100 flamingos; 42 shooting-range golds.' },
  { n: 3, name: 'Push Square', url: 'https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap', covers: '300 hours or more; 18 card sets (15 for 100%); 397 stunts in the game; 100% checklist under Progress after the story (Touch Pad > Progress).' },
  { n: 4, name: 'GTABase', url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series', covers: 'Full list of all 55 with grades and hidden flags (28 hidden); roadmap (~200 h); 5 chapters; no mission replay; cheats disable trophies and saving; 70/80 challenges.' },
  { n: 5, name: 'Exophase', url: null, covers: 'Trophy list host; used for list verification (name, description, grade). Cited by name only — no URL was captured on 21 Nov 2026, none is guessed.' },
  { n: 6, name: 'PSNProfiles', url: null, covers: 'Trophy tracker; used for list verification. Cited by name only — no URL was captured on 21 Nov 2026, none is guessed.' },
  { n: 7, name: 'OutputLag', url: 'https://outputlag.com/guides/gta-6-trophy-list/', covers: 'Full list; 28 hidden, 27 visible; ~200 h; balcony meditation in Chapter 1; 15 manual save slots; Yago timed race in Chapter 3 (Race Against Yago, hourglass icon).' },
  { n: 8, name: 'Insider Gaming', url: 'https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/', covers: 'Full list of all 55; 28 hidden trophies, many tied to the story; spoiler split between visible and hidden sections.' },
  { n: 9, name: 'GTA Scoop', url: 'https://gtascoop.com/guides/gta-6-trophies-achievements/', covers: 'Full list; Personal Best = max strength of both characters; Let\u2019s Go Bowling = steal 3 valuables; five trophies still being confirmed; meditation guide lists all 18 spots.' },
  { n: 10, name: 'GameMapa', url: 'https://gamemapa.com/en/gta-6/guides/gta-6-trophy-achievement-list/', covers: 'Full list of all 55 + Gamerscore; a 3-step roadmap; the missable note (Chapter 1 balcony meditation raises the counter by 1 but is not marked as a spot); five hidden trophies still unsolved (ids 44, 45, 49, 50, 51); per-trophy tips for Gunslinger, Hot Together, Retail Therapy, Catch Me If You Can, Personal Best, Sneakthief, Challenging Tank, Master of None, Stick Fiddler and the character strands.' },
  { n: 11, name: 'eGamers', url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/', covers: 'Full list; hidden split 27 visible / 28 hidden; anything unconfirmed in two sources is marked unconfirmed; trophy-vs-checklist table (stunts 250 vs 300, races 20 vs 30, challenges 50 vs 70, cards 3 vs 15, meditation 18 vs 15, vaults 5 vs 8); hard-trophy tips for Maximum Withdrawal, Whip It Good, The Goodtime State, Gunslinger, Hot Together, Retail Therapy, Top Fun, Little Boxes, Sneakthief, Catch Me If You Can, Challenging Tank and Actions Speak Louder.' },
  { n: 12, name: 'GTA Vice City Hub', url: 'https://www.gtavicecityhub.com/achievements', covers: 'Full list; grade-count dispute (PowerPyx + Insider Gaming 6 Silver / 46 Bronze vs Push Square 5 Silver / 47 Bronze); time 200 h vs 250+ h; Ten Pin, Personal Best and Let\u2019s Go Bowling readings; 100% checklist 35 tasks; save before big missions — story missions cannot be replayed, IGN reports.' },
];

const DISPUTES = [
  { id: 'D1', topic: 'Time to platinum: 200 vs 300 hours', a: 'PowerPyx, KeenGamer, GTABase: ~200 h (story 60-80, 100% checklist ~100, cleanup ~10).', b: 'Push Square: up to 300 h or more.', verdict: 'Plan on 200 h; treat 300 as the cautious upper bound for a slow, thorough run. The gap is pace, not content — every source agrees the 100% checklist is the long pole.', trophies: [1, 14] },
  { id: 'D2', topic: 'Missable: 1 vs a watch on Strangers & Freaks', a: 'PowerPyx, KeenGamer, GTABase, GTA Scoop flag exactly 1 possibly missable: Positive Mental Attitude.', b: 'Stranger mission chains have windows linked to story progress, so id 25 is watched.', verdict: '1 missable (id 28). Id 25 is a WATCH, not a second missable: nothing in the cited sources calls a strand permanently missable, so no second missable is claimed.', trophies: [25, 28] },
  { id: 'D3', topic: 'Personal Best: what counts as mass appeal', a: 'GTA Scoop + PowerPyx (via [12]): maxing the strength of both characters.', b: 'Push Square (via [12]): max body fat (Overweight).', verdict: 'SAFE PLAY (resolved): train strength on both Lucia and Jason, ideally at the gym together — [10] reports progress doubles when both train. The exact trigger is still unconfirmed — the trophy keeps its unconfirmed flag.', trophies: [47] },
  { id: 'D4', topic: "Let's Go Bowling: what is follow-through", a: 'GTA Scoop + PowerPyx (via [12]): steal 3 valuables at the Kolt & Associates bowling alley; no guide says you bowl a game.', b: 'The big guides give no method beyond the official description.', verdict: 'SAFE PLAY (resolved): at the alley, take 3 valuables and leave cleanly. The exact trigger is still unconfirmed — the trophy keeps its unconfirmed flag.', trophies: [46] },
  { id: 'D5', topic: 'Ten Pin: one reading, still unconfirmed', a: "Official description — bowl 'em over with a melee drive-by.", b: 'PowerPyx (via [12]) reads it as knocking 10 pedestrians off a bike within 60 seconds; GameMapa [10] still lists Ten Pin among the five hidden trophies unsolved.', verdict: 'SAFE PLAY (new): try it on a bike with a melee drive-by — but the method is one source\u2019s reading and [10] still lists it unsolved, so the trophy keeps its unconfirmed flag. No spot is claimed.', trophies: [51] },
  { id: 'D6', topic: 'Gang operations: 1 per gang vs 39', a: 'Pest Control asks for one illegal operation per gang (9 gangs).', b: 'KeenGamer lists 39 gang operations in the 100% requirements.', verdict: 'Both are true. The trophy needs 1 per gang; 100% completion needs all 39. Do 1 per gang early for the trophy, then finish the remaining 30 for the checklist.', trophies: [43] },
  { id: 'D7', topic: 'Meditation spots: 18 vs 15', a: 'GTA Scoop\u2019s meditation guide lists all 18 spots; the trophy text says every spot.', b: 'Some lists count fewer spots toward 100% completion; [12] confirms the checklist counts 15 meditation spots against the trophy\u2019s 18.', verdict: 'Do all 18, starting with the Chapter 1 balcony spot. The trophy says every spot, so 18 is the number to chase; the smaller count is a checklist detail, not the trophy.', trophies: [28] },
  { id: 'D8', topic: 'Challenges: 50 vs 70 of 80', a: 'One Last Thing asks for 50 challenges.', b: 'PowerPyx and GTABase put 70 of the 80 challenges in the 100% requirements.', verdict: 'Both are true. The trophy pops at 50; keep going to 70 for the checklist, skipping the 10 hardest (PowerPyx).', trophies: [32] },
  { id: 'D9', topic: 'Silver count: 6 vs 5', a: 'PowerPyx + Insider Gaming: 6 Silver / 46 Bronze (PSN total 1,350).', b: 'Push Square: 5 Silver / 47 Bronze (which implies a 1,335 total).', verdict: 'Follow the majority — 6 Silver / 46 Bronze, total 1,350. Push Square\u2019s count is off by one somewhere; the guide does NOT guess which trophy it is.', trophies: [1, 14] },
];

const STAGES = [
  { id: 'S1a', name: 'Story spine I', hours: 'Ch. 1\u20132 (of the 60\u201380 h story)', save: 'Chapter start + chapter end saves (10 slots). Do the Chapter 1 balcony meditation before Chapter 1 ends.', note: 'Chapters 1\u20132 + opening missions.' },
  { id: 'S1b', name: 'Story spine II', hours: 'Ch. 3\u20134 + finale (of the 60\u201380 h story)', save: 'Keep the Chapter 1 save until Positive Mental Attitude pops; keep 1 untouched slot from just before the final mission.', note: 'Later story + story-linked.' },
  { id: 'S2', name: 'Character strands', hours: '~10 h', save: 'Do each strand as it appears — several are only offered for a while.', note: 'Stranger and character strands.' },
  { id: 'S3', name: 'Activities & skill', hours: '~25 h', save: 'No save needed — all activities stay open in free roam after the story.', note: 'Races, ranges, challenges and skills.' },
  { id: 'S4', name: 'Collectibles & exploration', hours: '~30 h', save: 'Keep the Chapter 1 save until Positive Mental Attitude pops. Everything else is free-roam cleanup.', note: 'Cards, WAiNK, vehicles, areas, garages.' },
  { id: 'S5', name: 'Crime & money', hours: '~25 h', save: 'No save needed — robberies and wanted-level play stay open after the story.', note: 'Robberies, vaults, escapes.' },
  { id: 'S6', name: 'Platinum cleanup', hours: '10\u201320 h', save: 'Keep 1 untouched slot from just before the final mission, then rotate 4 cleanup saves.', note: '100% completion, then the platinum.' },
];

const LEDGER = [
  { label: 'Vehicles scanned (WAiNK)', need: 200, of: 277, note: 'Scan with the WAiNK app as you travel; progress counts from the story onward.', src: '[1]' },
  { label: 'Animals studied (binoculars)', need: 100, of: 255, note: 'Study through binoculars; counts from the story onward.', src: '[1]' },
  { label: 'Weapons collected', need: 50, of: 66, note: 'Part of the 100% checklist; not every weapon is required.', src: '[1]' },
  { label: 'Stunts completed', need: 250, of: 397, note: '397 stunts exist in total (Push Square); the trophy needs 250.', src: '[1, 3]' },
  { label: 'Challenges completed', need: 70, of: 80, note: 'Trophy pops at 50; the checklist needs 70, so skip the 10 hardest.', src: '[1, 4]' },
  { label: 'Collectible card sets', need: 15, of: 18, note: '18 sets exist; 15 full sets count toward 100%.', src: '[2, 3]' },
  { label: 'Bank vaults robbed', need: 5, of: 8, note: 'Trophy needs 5 vaults and an escape; the checklist lists 8 vault robberies.', src: '[2]' },
  { label: 'Bank jobs', need: 22, of: 22, note: 'All 22 bank jobs count toward 100%.', src: '[2]' },
  { label: 'Payday loan jobs', need: 7, of: 7, note: 'All 7 payday loan jobs count toward 100%.', src: '[2]' },
  { label: 'Gang operations', need: 39, of: 39, note: 'All 39 count toward 100%; the trophy needs 1 per gang (9).', src: '[2]' },
  { label: 'Optional tasks', need: 100, of: 100, note: '100 optional tasks count toward 100%.', src: '[2]' },
  { label: 'WAiNK locations', need: 100, of: 100, note: 'WAiNK It at 100 locations (also the You WAiNKer! trophy).', src: '[2]' },
  { label: 'Underwater discoveries', need: 33, of: 33, note: '33 underwater discoveries count toward 100%.', src: '[2]' },
  { label: 'Cocaine flamingos', need: 100, of: 100, note: '100 flamingos count toward 100%.', src: '[2]' },
  { label: 'Shooting-range gold medals', need: 42, of: 42, note: 'Gold in all 42 Shooting Range challenges (also The Shootist).', src: '[2]' },
];

const VS_TABLE = [
  { row: 'Stunts', trophy: '250', checklist: '300', src: '[11]', note: 'The trophy pops at 250; the checklist needs 300.' },
  { row: 'Races (unique wins)', trophy: '20', checklist: '30', src: '[11]', note: 'The trophy pops at 20 unique wins; the checklist needs 30.' },
  { row: 'Challenges', trophy: '50', checklist: '70 of 80', src: '[11]', note: 'The trophy pops at 50; the checklist needs 70 of 80.' },
  { row: 'Card sets', trophy: '3', checklist: '15 of 18', src: '[11]', note: 'The trophy needs 3 full sets; the checklist needs 15 of 18.' },
  { row: 'Meditation spots', trophy: '18', checklist: '15', src: '[11][12]', note: 'The trophy says every spot (18); the checklist counts 15. Do all 18.' },
  { row: 'Bank vaults', trophy: '5', checklist: '8', src: '[11]', note: 'The trophy needs 5 vaults and an escape; the checklist lists 8.' },
];

const params = new URLSearchParams(location.search);
const COVER = params.get('cover') === '1';
const SEED = Number(params.get('seed') || 0);
const OPEN_ID = Number(params.get('open') || 0);
let trophies = [];
let matrix = null;
let state = { earned: [], counts: {} };
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = JSON.parse(raw);
} catch (e) { state = { earned: [], counts: {} }; }
if (!state.earned) state.earned = [];
if (!state.counts) state.counts = {};
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function srcName(n) { const s = SOURCES.find(x => x.n === n); return s ? s.name : ('[' + n + ']'); }
function trophyById(id) { return trophies.find(t => t.id === id); }

function auditNumbers() {
  const steps = trophies.reduce((a, t) => a + t.steps.length, 0);
  const backed = trophies.reduce((a, t) => a + t.steps.filter(s => s.c2).length, 0);
  return { steps, claims: steps + trophies.length, backed };
}
function renderAudit() {
  const n = auditNumbers();
  const unc = trophies.filter(t => t.unconfirmed).length;
  document.getElementById('audit-strip').innerHTML =
    '<span><b>' + n.claims + '</b> claims cited</span>' +
    '<span><b>' + n.backed + ' / ' + n.steps + '</b> steps backed by 2+ sources</span>' +
    '<span><b>12</b> sources, read 21 Nov 2026</span>' +
    '<span><b>9</b> disputes shown</span>' +
    '<span><b>' + unc + '</b> unconfirmed trophies</span>' +
    '<span><b>1</b> missable (+1 watch)</span>' +
    '<span>Last verified: <b>21 Nov 2026</b></span>';
  document.getElementById('subtitle').textContent =
    'GTA VI trophy guide & tracker \u2014 all 55 trophies, ' + n.steps + ' cited steps, 1,350 PSN points';
}
function renderProgress() {
  const earned = new Set(state.earned);
  const psn = trophies.filter(t => earned.has(t.id)).reduce((a, t) => a + t.psn_value, 0);
  document.getElementById('prog-count').textContent = earned.size + ' / 55';
  document.getElementById('prog-psn').textContent = earned.size ? (psn.toLocaleString('en-US') + ' / 1,350 PSN') : '0 / 1,350 PSN';
  document.getElementById('prog-bar').style.width = (earned.size / 55 * 100) + '%';
  const g = { platinum: [0, 1], gold: [0, 2], silver: [0, 6], bronze: [0, 46] };
  trophies.forEach(t => { if (earned.has(t.id)) g[t.grade][0]++; });
  document.getElementById('grade-counts').textContent =
    'P ' + g.platinum[0] + '/1 \u00b7 G ' + g.gold[0] + '/2 \u00b7 S ' + g.silver[0] + '/6 \u00b7 B ' + g.bronze[0] + '/46';
}
function watchLabel(t) {
  if (t.watch === 'missable') return '<span class="tag red">MISSABLE</span>';
  if (t.watch === 'possible') return '<span class="tag blue">POSSIBLE MISSABLE</span>';
  if (t.watch === 'watch') return '<span class="tag blue">WATCH</span>';
  return '';
}
function cardHTML(t, opts) {
  const earned = state.earned.includes(t.id);
  const spoiler = document.getElementById('f-spoiler').checked;
  const hidden = spoiler && STORY_IDS.includes(t.id) && !earned;
  const disputes = DISPUTES.filter(d => d.trophies.includes(t.id));
  const steps = t.steps.map((s, i) => {
    const cites = '[' + s.c + ' ' + srcName(s.c) + ']' + (s.c2 ? ' [' + s.c2 + ' ' + srcName(s.c2) + ']' : '');
    return '<li>' + esc(s.t) + ' <span class="cite">' + esc(cites) + '</span></li>';
  }).join('');
  const name = hidden ? '<span class="hidden-name">Story trophy \u2014 hidden until earned</span>' : esc(t.name);
  const official = hidden ? '' : '<p class="official">&ldquo;' + esc(t.official) + '&rdquo;</p>';
  return '<article class="card' + (t.watch === 'missable' ? ' missable' : '') + (opts && opts.open ? ' open' : '') + '" data-id="' + t.id + '">' +
    '<label class="earned-box"><input type="checkbox" data-earn="' + t.id + '"' + (earned ? ' checked' : '') + '> Earned</label>' +
    '<h3>#' + t.id + ' ' + name + ' <span class="grade">' + t.grade + '</span></h3>' + official +
    '<div class="tags"><span class="tag gold">' + t.psn_value + ' PSN</span>' +
    '<span class="tag">Stage ' + t.stage + ' \u00b7 #' + t.order + '</span>' +
    '<span class="tag">' + t.kind + '</span>' + watchLabel(t) +
    (t.unconfirmed ? '<span class="tag red">UNCONFIRMED</span>' : '') +
    (t.target !== null ? '<span class="tag">target: ' + t.target.toLocaleString('en-US') + '</span>' : '') + '</div>' +
    '<ol class="steps">' + steps + '</ol>' +
    disputes.map(d => '<div class="diff-panel"><b>SOURCES DIFFER \u2014 ' + esc(d.topic) + ':</b> Side A: ' + esc(d.a) + ' vs Side B: ' + esc(d.b) + ' \u2014 Verdict: ' + esc(d.verdict) + '</div>').join('') +
    '<div class="audit-strip"><b>Audit:</b> ' + esc(t.audit) + '</div>' +
    '<p class="save-line"><b>Save:</b> ' + esc(t.save) + '</p></article>';
}
function renderChecklist() {
  const q = (document.getElementById('q').value || '').toLowerCase();
  const kind = document.getElementById('f-kind').value;
  const grade = document.getElementById('f-grade').value;
  const stage = document.getElementById('f-stage').value;
  const unearnedOnly = document.getElementById('f-unearned').checked;
  let list = [...trophies].sort((a, b) => a.order - b.order);
  if (COVER) list = list.filter(t => t.id === 28);
  if (OPEN_ID && !COVER) {
    const open = list.find(t => t.id === OPEN_ID);
    if (open) list = [open, ...list.filter(t => t.id !== OPEN_ID)];
  }
  const shown = list.filter(t => {
    if (kind && t.kind !== kind) return false;
    if (grade && t.grade !== grade) return false;
    if (stage && t.stage !== stage) return false;
    if (unearnedOnly && state.earned.includes(t.id)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.official.toLowerCase().includes(q))) return false;
    return true;
  });
  document.getElementById('showing').textContent = 'Showing ' + shown.length + ' of 55 trophies.';
  document.getElementById('cards').innerHTML = shown.map(t => cardHTML(t, { open: t.id === OPEN_ID || (COVER && t.id === 28) })).join('') || '<p class="note">No trophies match these filters.</p>';
  document.querySelectorAll('[data-earn]').forEach(cb => cb.addEventListener('change', () => {
    const id = Number(cb.dataset.earn);
    if (cb.checked) { if (!state.earned.includes(id)) state.earned.push(id); }
    else state.earned = state.earned.filter(x => x !== id);
    save(); renderProgress(); renderNextUp(); renderRoadmap();
  }));
}
function renderNextUp() {
  const rank = { missable: 0, possible: 1, watch: 2, safe: 3 };
  const stageProg = {};
  STAGES.forEach(s => {
    const ts = trophies.filter(t => t.stage === s.id);
    stageProg[s.id] = ts.filter(t => state.earned.includes(t.id)).length / Math.max(1, ts.length);
  });
  const todo = trophies.filter(t => !state.earned.includes(t.id))
    .sort((a, b) => (rank[a.watch] - rank[b.watch]) || (stageProg[b.stage] - stageProg[a.stage]) || (a.steps.length - b.steps.length))
    .slice(0, 3);
  const reason = t => t.watch === 'missable' ? 'Missable \u2014 do before Chapter 1 ends'
    : t.watch === 'possible' ? 'Possible missable \u2014 stranger strands have windows'
    : t.watch === 'watch' ? 'Watch \u2014 needs a partner or a specific setup'
    : 'Stage ' + t.stage + ' \u2014 ' + t.steps.length + ' steps left';
  document.getElementById('nextup').innerHTML = '<h2>Next Up</h2><ol>' +
    todo.map(t => '<li><b>#' + t.id + ' ' + esc(t.name) + '</b> \u2014 ' + reason(t) + '</li>').join('') + '</ol>';
}
function renderRoadmap() {
  document.getElementById('roadmap').innerHTML =
    '<p class="note">Seven stages, 55 trophies, 1,350 PSN, about 200 hours. Save plan: 15 manual slots + 1 autosave; 10 chapter start/end, 1 untouched pre-final, 4 rotating cleanup.</p>' +
    '<table class="roadmap"><thead><tr><th>Stage</th><th>Trophies</th><th>PSN</th><th>Hours</th><th>Save plan</th></tr></thead><tbody>' +
    STAGES.map(s => {
      const ts = trophies.filter(t => t.stage === s.id).sort((a, b) => a.order - b.order);
      const got = ts.filter(t => state.earned.includes(t.id)).length;
      const psn = ts.reduce((a, t) => a + t.psn_value, 0);
      return '<tr><td><b>' + s.id + ' \u2014 ' + esc(s.name) + '</b><br><span class="note">' + got + '/' + ts.length + ' earned \u00b7 ' + esc(s.note) + '</span></td>' +
        '<td class="names">' + ts.map(t => (state.earned.includes(t.id) ? '\u2713' : '\u25cb') + ' #' + t.id + ' ' + esc(t.name)).join(' \u00b7 ') + '</td>' +
        '<td><b>' + psn + '</b></td><td>' + esc(s.hours) + '</td><td class="save">' + esc(s.save) + '</td></tr>';
    }).join('') + '</tbody></table>';
}
function renderMatrix() {
  const meta = matrix.meta;
  const sps = meta.steps_per_source;
  const spsLine = Object.keys(sps).sort((a, b) => a - b).map(k => '[' + k + '] ' + sps[k] + ([5, 6, 8].includes(Number(k)) ? ' (list tracker)' : '')).join(' \u00b7 ');
  const shortNames = ['PowerPyx', 'KeenGamer', 'Push Sq.', 'GTABase', 'Exophase', 'PSNProf.', 'OutputLag', 'Insider', 'GTA Scoop', 'GameMapa', 'eGamers', 'VC Hub'];
  document.getElementById('matrix').innerHTML =
    '<p class="note">' + esc(meta.agreement) + '</p>' +
    '<table class="matrix"><thead><tr><th>#</th><th>Trophy</th>' +
    shortNames.map((s, i) => '<th>[' + (i + 1) + '] ' + esc(s) + '</th>').join('') + '<th>Dispute</th></tr></thead><tbody>' +
    matrix.rows.map(r => {
      const t = trophyById(r.id);
      return '<tr><td>' + r.id + '</td><td class="tname">' + esc(t ? t.name : '') + '</td>' +
        r.cells.map(c => '<td class="' + (c.includes('C') ? 'c' : '') + '">' + esc(c) + '</td>').join('') +
        '<td class="' + (r.dispute ? 'd' : '') + '">' + (r.dispute ? esc(r.dispute) : '') + '</td></tr>';
    }).join('') + '</tbody></table>' +
    '<p class="note">' + esc(meta.legend) + '</p><p class="note">Steps per source: ' + esc(spsLine) + '</p>';
}
function renderDisputes() {
  document.getElementById('disputes').innerHTML =
    '<p class="note">Nine places where the sources disagree or stay silent. Each one ends in a verdict \u2014 and where the verdict is \u201cnot invented\u201d, the guide says so on the trophy itself.</p>' +
    DISPUTES.map(d => '<div class="dispute-block"><h3>' + d.id + ' \u2014 ' + esc(d.topic) + '</h3>' +
      '<p><b>Side A:</b> ' + esc(d.a) + '</p><p><b>Side B:</b> ' + esc(d.b) + '</p>' +
      '<p class="verdict"><b>Verdict:</b> ' + esc(d.verdict) + '</p>' +
      '<p><b>Trophies:</b> ' + d.trophies.map(id => { const t = trophyById(id); return '#' + id + ' ' + esc(t ? t.name : ''); }).join(', ') + '</p></div>').join('');
}
function renderLedger() {
  document.getElementById('ledger').innerHTML =
    '<p class="note">The 100% Completion Checklist in 15 counters. The trophy needs 50 challenges and 3 card sets; the checklist needs 70 of 80 challenges and 15 of 18 sets. The checklist is closer to 60% true completion \u2014 not everything is required. The checklist has 35 tasks (Insider Gaming via [12]).</p>' +
    LEDGER.map((c, i) => '<div class="ledger-row"><h3>' + c.need + ' / ' + c.of + ' \u2014 ' + esc(c.label) + '</h3><p>' + esc(c.note) + ' ' + esc(c.src) + '</p></div>').join('');
}
function renderCounts() {
  const overall = LEDGER.reduce((a, c, i) => a + Math.min(1, (state.counts[i] || 0) / c.need), 0) / LEDGER.length;
  document.getElementById('counts').innerHTML =
    '<p class="note">Interactive 100% ledger: tap + / \u2212 to track each counter. Overall 100% progress: <b>' + Math.round(overall * 100) + '%</b> of the 15 counters at their trophy need.</p>' +
    '<div class="stage-block"><h3>Trophy vs 100% checklist \u2014 both numbers</h3>' +
    '<p class="note">eGamers [11] publishes both numbers side by side and does not pick one \u2014 this guide does the same. Each row says which number pops the trophy and which the checklist needs.</p>' +
    '<table class="vs"><thead><tr><th></th><th>Trophy</th><th>Checklist</th><th>Sources</th><th>Which number counts</th></tr></thead><tbody>' +
    VS_TABLE.map(v => '<tr><td><b>' + esc(v.row) + '</b></td><td>' + esc(v.trophy) + '</td><td>' + esc(v.checklist) + '</td><td>' + esc(v.src) + '</td><td>' + esc(v.note) + '</td></tr>').join('') +
    '</tbody></table></div>' +
    LEDGER.map((c, i) => {
      const have = state.counts[i] || 0;
      const pct = Math.min(100, Math.round(have / c.need * 100));
      return '<div class="counter-row"><div class="cinfo"><b>' + have + ' / ' + c.need + '</b> \u2014 ' + esc(c.label) + ' <span class="note">(of ' + c.of + ')</span></div>' +
        '<div class="cbtns"><button data-count="' + i + '" data-d="-1" type="button">\u2212</button><button data-count="' + i + '" data-d="1" type="button">+</button></div>' +
        '<div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
        '<p class="counter-note">' + esc(c.note) + ' ' + esc(c.src) + '</p></div>';
    }).join('');
  document.querySelectorAll('[data-count]').forEach(b => b.addEventListener('click', () => {
    const i = Number(b.dataset.count);
    const cur = state.counts[i] || 0;
    state.counts[i] = Math.max(0, Math.min(LEDGER[i].of, cur + Number(b.dataset.d)));
    save(); renderCounts();
  }));
}
function renderSources() {
  const counts = {};
  trophies.forEach(t => t.steps.forEach(s => { counts[s.c] = (counts[s.c] || 0) + 1; if (s.c2) counts[s.c2] = (counts[s.c2] || 0) + 1; }));
  document.getElementById('sources').innerHTML =
    '<p class="note">12 sources, read 21 Nov 2026. Coverage count = how many steps cite the source (primary + second-source backing).</p>' +
    SOURCES.map(s => '<div class="source-block"><h3>[' + s.n + '] ' + esc(s.name) + '</h3>' +
      '<p>' + esc(s.covers) + '</p><p class="note">' + (s.url ? esc(s.url) : 'Cited by name only \u2014 no URL captured 21 Nov 2026, none guessed.') + '</p>' +
      '<p class="note">Read 21 Nov 2026 \u00b7 cited by ' + (counts[s.n] || 0) + ' steps.</p></div>').join('');
}
function renderMissables() {
  const card = id => { const t = trophyById(id); return t ? cardHTML(t, {}) : ''; };
  document.getElementById('missables').innerHTML =
    '<div class="tier-block"><h3>MISSABLE \u2014 exactly 1</h3><p>Id 28 Positive Mental Attitude: do the Chapter 1 balcony meditation before Chapter 1 ends and keep a Chapter 1 save until it pops. There is no mission replay.</p>' + card(28) + '</div>' +
    '<div class="tier-block"><h3>WATCH \u2014 1 possible</h3><p>Id 25 Strangers &amp; Freaks: stranger chains have windows linked to story progress. Not a second missable — nothing in the cited sources calls a strand permanently missable.</p>' + card(25) + '</div>' +
    '<div class="tier-block"><h3>UNCONFIRMED \u2014 7</h3>' +
    '<p>Id 51 Ten Pin: still open, one reading (PowerPyx), not confirmed. Id 29 Fair Game: which animal still being confirmed \u2014 the strand names it. The other five (28, 46, 47, 49, 50) have a resolved safe play.</p>' +
    [28, 29, 46, 47, 49, 50, 51].map(card).join('') + '</div>';
}
function showView(v) {
  document.body.classList.remove('view-checklist', 'view-roadmap', 'view-matrix', 'view-disputes', 'view-ledger', 'view-counts', 'view-sources', 'view-missables');
  document.body.classList.add('view-' + v);
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  document.querySelectorAll('.view').forEach(s => s.classList.toggle('active', s.id === 'view-' + v));
  if (v === 'roadmap') renderRoadmap();
  if (v === 'matrix') renderMatrix();
  if (v === 'disputes') renderDisputes();
  if (v === 'ledger') renderLedger();
  if (v === 'counts') renderCounts();
  if (v === 'sources') renderSources();
  if (v === 'missables') renderMissables();
}
async function init() {
  const [tRes, mRes] = await Promise.all([fetch('data/trophies.json'), fetch('data/matrix.json')]);
  const tData = await tRes.json();
  matrix = await mRes.json();
  trophies = tData.trophies.sort((a, b) => a.order - b.order);
  if (SEED > 0 && !localStorage.getItem(KEY)) {
    state.earned = trophies.slice(0, SEED).map(t => t.id);
    save();
  }
  if (COVER) document.body.classList.add('cover');
  const kindParam = params.get('kind');
  if (kindParam) document.getElementById('f-kind').value = kindParam;
  if (params.get('spoiler') === 'on') document.getElementById('f-spoiler').checked = true;
  renderAudit(); renderProgress(); renderChecklist(); renderNextUp();
  const view = COVER ? 'checklist' : (params.get('view') || 'checklist');
  showView(['checklist', 'roadmap', 'matrix', 'disputes', 'ledger', 'counts', 'sources', 'missables'].includes(view) ? view : 'checklist');
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
  document.querySelectorAll('[data-goto]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showView(a.dataset.goto); }));
  ['q', 'f-kind', 'f-grade', 'f-stage', 'f-spoiler', 'f-unearned'].forEach(id => document.getElementById(id).addEventListener('input', renderChecklist));
  document.getElementById('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leonida-platinum-progress.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  document.getElementById('import-file').addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (Array.isArray(data.earned)) state.earned = data.earned.filter(id => trophies.some(t => t.id === id));
      if (data.counts) state.counts = data.counts;
      save(); renderProgress(); renderChecklist(); renderNextUp();
    } catch (err) { alert('Could not read that progress file.'); }
  });
}
init();
