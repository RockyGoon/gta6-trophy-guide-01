# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/RockyGoon/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/RockyGoon/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**v2 — audit 19 Nov 2026.** The best GTA VI trophy guide: all 55 trophies with
official names, descriptions and grades, 234 numbered cited steps, a 55×9 source
matrix, 8 logged disputes, a 15-counter 100% ledger, a 6-stage roadmap to the
platinum, and a tracker that saves progress in the browser. Offline, static files.

Entry for the make.fun bounty
[Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01)
($250, closes 21 Nov 2026 18:00 WIB, result 6 Dec 2026).

## What is in here

- **Checklist** — every trophy as a card: grade, PSN value, stage and order,
  kind, missable/watch flag, target count, numbered steps each citing a source
  by number, an audit strip, and a save note. Filters by kind, grade, stage,
  text search, spoiler hiding (17 story trophies) and unearned-only. Export and
  import progress as JSON.
- **Roadmap** — 6 stages: S1 Story spine (20 trophies, 375 PSN, 60–80 h),
  S2 Character strands (7, 120, ~10 h), S3 Activities & skill (10, 180, ~25 h),
  S4 Collectibles & exploration (7, 135, ~30 h), S5 Crime & money (9, 150,
  ~25 h), S6 Platinum cleanup (2, 390, 10–20 h). Total 1,350 PSN, about 200
  hours. Each stage carries its chapter-save advice.
- **Source matrix** — 55 trophies × 9 sources. Every cell carries L (the source
  publishes the name, description and grade); G marks a walkthrough; C marks
  that at least one numbered step for the trophy cites that source. Steps per
  source: PowerPyx 84, KeenGamer 63, Push Square 19, GTABase 29, OutputLag 17,
  GTA Scoop 22. Exophase, PSNProfiles and Insider Gaming are list trackers —
  they verify the list and carry 0 step citations.
- **Disputes** — D1 time 200 vs 300 hours; D2 one missable vs a watch on
  Strangers & Freaks; D3 Personal Best; D4 Let's Go Bowling; D5 Ten Pin (open);
  D6 gang operations 1-per-gang vs 39; D7 meditation 18 vs 15; D8 challenges
  50 vs 70 of 80. Each ends in a verdict.
- **100% ledger** — the 100% Completion Checklist as 15 counters (200/277
  vehicles, 100/255 animals, 50/66 weapons, 250/397 stunts, 70/80 challenges,
  15/18 card sets, 5/8 vaults, 22 bank jobs, 7 payday jobs, 39 gang ops,
  100 optional tasks, 100 WAiNK, 33 underwater, 100 flamingos, 42 shooting
  golds).
- **Missable watch** — exactly 1 missable (id 28 Positive Mental Attitude: the
  Chapter 1 balcony meditation), 1 possible (id 25), 7 watch, 46 safe.

## Facts the guide stands on

- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. PSN values 300/90/30/15,
  total 1,350. Difficulty 4/10, about 200 hours (PowerPyx, KeenGamer, GTABase).
- No online trophies, one playthrough, no mission replay, no New Game+,
  free roam after the story. Cheats disable trophies and saving.
- 15 manual save slots + 1 autosave: 10 for chapter start/end, 1 untouched
  slot before the final mission, 4 rotating cleanup slots.
- **Hidden count, logged not guessed:** this guide's data list marks 25 hidden
  trophies; public lists (GTABase, OutputLag, Insider Gaming) report 28. The
  gap of 3 is not split and not guessed — the audit strip on each story trophy
  says which count it follows, and spoiler hiding covers the 17 story trophies
  every source agrees are hidden or spoiler-bearing.
- **Unconfirmed, logged not invented:** 6 trophies carry an unconfirmed flag
  (28, 46, 47, 49, 50, 51). Five have a resolved safe play; Ten Pin (51)
  stays open — no published method, nothing invented.

## Changelog

- **v1 (19 Nov 2026)** — first guide: all 55 trophies, own-words guides,
  per-trophy citations, roadmap, tracker.
- **v2 (20 Nov 2026)** — audit pass: every trophy re-checked against the 9
  sources; 234 numbered cited steps (was 0); source matrix 55×9; 8 disputes
  with verdicts; 15-counter 100% ledger; 6-stage roadmap with PSN subtotals
  and chapter-save plan; hidden-count discrepancy logged, not guessed.

## Sources (read 20 Nov 2026)

1. PowerPyx — https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
2. KeenGamer — https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
3. Push Square — https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
4. GTABase — https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series
5. Exophase — cited by name; no direct URL was captured on 20 Nov 2026, none is guessed
6. PSNProfiles — cited by name; no direct URL was captured on 20 Nov 2026, none is guessed
7. OutputLag — https://outputlag.com/guides/gta-6-trophy-list/
8. Insider Gaming — https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/
9. GTA Scoop — https://gtascoop.com/guides/gta-6-trophies-achievements/

Official trophy names and descriptions are shown as PlayStation publishes them.
Every guide step is written in our own words and cites its source by number.

## Run it

```sh
node serve.ts            # http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # hand-in: copies app/ + screenshots/, writes dossier.json
```

Try it: `/?view=roadmap`, `/?view=matrix`, `/?view=disputes`, `/?view=ledger`,
`/?kind=story&spoiler=on`, `/?seed=13&open=17`.

---

Built for make.fun. If you sign up through my referral link
https://make.fun/r/qh87q9q5 (code `qh87q9q5`), it supports this entry at no
cost to you.
