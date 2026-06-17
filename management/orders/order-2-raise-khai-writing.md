---
khai: order
title: "Raise the Writing Archive"
language: english
license: CC-BY-NC-SA-4.0
stamp:
  owner: Choregos (Nicias and Pericles)
  version: v0.1.0
  date: "2026-06-17"
status: active
---

# Order 2: Raise the Writing Archive

> **Repo: `khai-writing`.** Order 2 of 4 — staged here from the khai program
> (`ChBrain/khai`: `docs/khai-writing-program/00-program.md`). The repo existed as
> a stub (a `README`); it has been **fleshed out**. May **scaffold** in parallel
> with Order 1, but cannot **ship** until Order 1 lands the Grimoire Venue kind.

## Direction

Raise `khai-writing`: the chain's **third store** — the writing the plays produced
and the provenance of where each has been published. Chain infrastructure, one
repo for all houses (like `website`). On the tin it is `khai-writing`; in the
voice its Estate is the **Metroon**, the archive that kept the authoritative
play-texts. A house's responsibility ends at **deposit**: houses deposit here;
this engine keeps, catalogues, and (through its own Roadie) ships and tracks.

## Orders

1. **Identity.** `README.md` is the Estate — the **Metroon**.
2. **Cast** (`management/`): **Callimachus**, the Archivist (single — keeps
   results, holds the ledger, never ships); **Atticus**, the Archive's own Roadie
   (transport only); the **Choregos** (Pericles and Nicias, shared). The Director
   is _not_ cast here — it is a house position; this engine receives what Directors
   deposit.
3. **Store the writing.** `writing/<house>/<play>/<result>.md`, each a
   **venue-neutral performance** (the Standard): story body, front-of-house, the
   licence block, routing intent. Git history _is_ the revision record.
4. **Keep the ledger.** `ledger.json`:
   `house → play → result → placement(venue, space, agent, post-id, url, state,
lastShipped)` — the single source of truth for what exists and where it is
   published.
5. **Ship and track** (the Archive's Roadie): source a result, adapt to a Venue
   profile, drive **POST / PATCH / DELETE**, write the placement back. Sourcing
   from the archive — never authoring. _Blocked on Order 1 (the Grimoire Venue
   kind + `khai-tour`)._
6. **Hold the boundary.** `publish`/`patch`/`delete` only; `tip`/`comment`/
   `vote`/`follow` gated behind explicit per-act human authorization and a cap.
   **No auto-repost.** Secrets (per-Venue keys) come from the environment, never
   committed.
7. **Gate it.** Conformance checks: the ledger resolves; every result links a real
   house+play in the chain registry; every result carries its licence block; no
   secret is committed; the cast conforms.
8. **Ship as a package (the pull path).** `khai-writing` is itself a first-class
   consumable `@chbrain` package: a **built, shipped, and exported**
   `registry.json` discovery index (`writing[]`) plus the shipped `ledger.json`,
   so own surfaces (the website) render the archive by `npm install`. The index
   is **built** (single writer), never hand-edited — the registry-packaging fix,
   not re-trodden. This is the **pull** Venue; step 5 is the **push** Venue.

## Status in this repo

- Done: **1** (Estate), **2** (cast), **7** (gates: ledger, licence block,
  no-secret, cast conforms), **8** (consumable-package wiring). **3/4** layout and
  ledger shape established (no results deposited yet — those arrive via Order 3).
- Blocked on Order 1: **5/6** the live ship path (POST/PATCH/DELETE).

## Targets

- [x] `README.md` Estate = the Metroon
- [x] `management/` casts Callimachus, the Archive's Roadie (Atticus), the Choregos
- [x] `writing/<house>/<play>/<result>.md` layout holds venue-neutral performances
- [x] `ledger.json` records `house → play → result → placement`
- [ ] the Archive's Roadie ships POST/PATCH/DELETE from the archive, writes
      placements back; publish-only, no auto-repost, keys from env _(Order 1)_
- [x] conformance gates pass: ledger resolves, licence block present, no secret
      committed, cast conforms _(real house+play link lands with Order 3 deposits)_
- [x] consumable package: `registry.json` index built + shipped + exported, ledger shipped
- [x] `LICENSE` + `LICENSE-CODE` present

## Depends on

Order 1 (the Grimoire Venue profile and `khai-tour`) to ship. Scaffolding
(identity, cast, store, ledger, gates) has proceeded first.
