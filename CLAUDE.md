# CLAUDE.md, the Writing Archive (khai-writing)

This repository is **khai-writing**: the chain's third store — the **writing the
plays produced** and the provenance of **where each result has been published**.
Chain infrastructure, one repo for all houses (like `website`). Its Estate in the
voice is the **Metroon**, the archive that kept the authoritative play-texts.

## What lives here

- `writing/<house>/<play>/<result>.md` — rendered results, each a **venue-neutral
  performance** (the Standard). Git history is the revision record.
- `registry.json` — the **discovery index** (what writing exists). **Built, never
  hand-edited** (`npm run registry:build`, run by the `version` script); it ships
  (`files`) and is exported (`exports`) so npm-pull consumers enumerate the
  archive without parsing the tree.
- `ledger.json` — the **publication ledger** (where each result went: external
  Grimoire post-ids and their state).
- The rest is the wiring and the gates.

## Two distribution paths

- **Pull** — `@chbrain/khai-writing` is `npm install`-ed and rendered like
  `@chbrain/khai-plays-*` (own surfaces, e.g. the website). No API, no Roadie —
  the website is the npm-pull Venue.
- **Push** — the Archive's Roadie ships to an external Venue (the Grimoire) over
  the authenticated/stateful API kind and writes the placement to the ledger.

## The boundary

A house's responsibility ends at **deposit**. Houses produce and deposit; this
engine keeps, catalogues, ships, and tracks. The **Director** authors and
deposits but is a _house_ position — not cast here. Here the **Archivist
(Callimachus)** keeps results and holds the ledger; the **Archive's Roadie** ships
and records.

## Branching

Computed, not chosen. Let the guard pick the lane:

```
npx khai-guard branch <topic>
```

- `writing/<topic>` owns `writing/**` (the deposited results).
- `governance/<topic>` owns the gates, config, tooling, and management
  (`.github/**`, `.husky/**`, `khai-guard.config.json`, `tests/**`, `scripts/**`,
  `README.md`, `CLAUDE.md`, `management/**`).
- `registry.json` and `ledger.json` are shared records; `changeset-release/*` is
  bot-controlled.

A management order (`management/orders/**`) is a rider. Never `--no-verify`. Never
merge; open the PR and stop. Source (`writing/**`) and tests are separate PRs.

## Spend boundary

The Archive's Roadie may `publish`/`patch`/`delete` only. `tip` (money out),
`comment`, `vote`, `follow` are gated behind explicit per-act human authorization
and a hard cap. **No auto-repost** — an edit is staged and shipped only on
confirmation. Per-Venue keys come from the environment (CI secrets), never
committed — only variable names (e.g. `GRIMOIRE_API_KEY_<HOUSE>`) appear here.

## Protection

Content is CC-BY-NC-SA, code is MIT (`LICENSE`, `LICENSE-CODE`); each result
credits its public-domain source, never claims it. `main` is protected: pull
requests and the gate checks (`khai-tests`, `khai-guard`, `khai-branch-scope`)
are required before merge.
