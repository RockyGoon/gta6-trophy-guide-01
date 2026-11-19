# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/RockyGoon/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/RockyGoon/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of **Grand Theft Auto VI** (1 platinum, 2 gold, 6 silver, 46 bronze) — built for the [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01) competition on [make.fun](https://make.fun).

## What it is

- **Every trophy, exactly as PlayStation publishes it** — official name, description and grade, checked against Exophase and PSNProfiles (18 Nov 2026).
- **A cited guide for each trophy, in our own words** — what to do, where and how, and when it can be missed. Every guide names its sources (PowerPyx, KeenGamer, Output Lag, GTABase, Exophase, PSNProfiles) with a link beside it. Where the exact trigger was still unconfirmed at launch, the guide says so instead of inventing one.
- **A roadmap to the platinum** — six stages in chapter order, from the Chapter 1 meditation to the 100% completion gold, with the single missable trophy flagged at every step.
- **One missable trophy, flagged everywhere** — *Positive Mental Attitude*: Lucia's balcony meditation at Jason's house, only in Chapter 1 after the mission Down to Earth. There is no mission replay, so the guide tells you to do it first and keep a Chapter 1 save.
- **A tracker that saves** — tick trophies off, progress is kept in localStorage, export it to a JSON file and import it back. Filters by kind (story, missable, collectibles, activities, 100% completion), grade, earned state and search. A spoiler setting hides story trophy names and descriptions until they are earned.
- **Offline by construction** — static files under `app/` with no build step. It loads nothing from the network and makes no network request at run time. No Rockstar logo, artwork or game screenshot is used.

## Facts the guide is built on

- ~200 hours to the platinum; no online trophies, no difficulty trophies, no mission medals.
- 28 trophies hidden on PlayStation; 1 missable; cheats disable trophies and saving.
- GTA VI launches 19 Nov 2026 on PS5 and Xbox Series X|S, starring Lucia Caminos and Jason Duval in Vice City, Leonida.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (writes `dossier.json` and copies `app/` + `screenshots/` to the output dir):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — the guide shell: header with progress, tabs, filters, checklist, roadmap and missable pages.
- `app/app.js` — boot, checklist rendering, filters, spoiler rule, detail pane, roadmap, localStorage save, export/import, deep links (`?view=`, `?open=`, `?kind=`, `?grade=`, `?spoiler=on`, `?seed=`).
- `app/style.css` — the sunset-over-Vice-City theme (system fonts only, nothing fetched).
- `app/data/trophies.json` — the 55 trophies with official names/descriptions/grades, kind tags, missable flags, targets, own-words guides and per-trophy citations.
- `main.ts` — Node 22 entrypoint: preflight-checks the entry, copies `app/` + `screenshots/` to `/output`, writes `dossier.json` with `vendor/makefun-frontend.ts`.
- `screenshots/` — 4 real renders of the app (see `shots.json` for which view each one shows).

## License

MIT — see [LICENSE](LICENSE).

---

Built for the [GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01) on make.fun. Enjoy the hunt — and if this guide helped you, use my referral: [make.fun/r/qh87q9q5](https://make.fun/r/qh87q9q5) (code `qh87q9q5`).
