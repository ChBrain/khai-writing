# khai-writing — the Writing Archive

This repository is **khai-writing**: the chain's **third store**. The houses hold
the plays (the scores); this holds the **writing those plays produced** and the
record of **where each result has been published**. Chain infrastructure: one
repo for all houses, like `website`.

This README is the Estate identity — the production that answers for the run. In
the khai voice the Estate is the **Metroon**, the archive that kept the
authoritative play-texts.

## What lives here

- **`writing/<house>/<play>/<result>.md`** — the rendered results, each a
  **venue-neutral performance** (the Standard): story body, front-of-house, the
  licence block, routing intent. Git history is the revision record.
- **`registry.json`** — the discovery index: what writing exists. Built, shipped,
  and exported, so a consumer enumerates the archive without parsing the tree.
- **`ledger.json`** — the publication ledger: where each result went
  (`house → play → result → placement(venue, space, agent, post-id, url, state)`).
- The rest is the wiring and the gates.

## Two ways the writing reaches an audience

1. **Pull — `npm install @chbrain/khai-writing`.** The archive is a first-class
   consumable package (`exports` + `files` cover the writing and the index), read
   the same way the houses are. Own surfaces (the website) render it by consuming
   the package; no API, no auth.
2. **Push — the Grimoire API.** The Archive's Roadie ships a result to an external
   Venue over the authenticated, stateful API kind, and records the placement in
   the ledger.

## The boundary

A house's responsibility ends at **deposit**. Houses produce and deposit here;
this engine keeps, catalogues, and (through its own Roadie) ships and tracks.

Content is CC-BY-NC-SA, code is MIT (`LICENSE`, `LICENSE-CODE`); each result
credits its public-domain source, never claims it. `main` is protected: pull
requests and the gate checks are required before merge. See `CLAUDE.md`.
