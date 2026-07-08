# CLAUDE.md, the Writing Archive (khai-writing)

This repository is **khai-writing**: the chain's third store — the **writing the
plays produced** and the provenance of **where each result has been published**.
Chain infrastructure, one repo for all houses (like `website`). Its Estate in the
voice is the **Metroon**, the archive that kept the authoritative play-texts.

## What lives here

- `writing/<house>/<play>/<result>.md` — captured runs, each a **venue-neutral
  production** (the Standard). Git history is the revision record.
- `registry.json` — the **discovery index** (what writing exists). **Built, never
  hand-edited** (`npm run registry:build`, run by the `version` script); it ships
  (`files`) and is exported (`exports`) so npm-pull consumers enumerate the
  archive without parsing the tree.
- `ledger.json` — the **publication ledger** (where each result went: external
  Grimoire post-ids and their state).
- The rest is the wiring and the gates.

## The writing (the Standard)

A **result** is a **captured production**: one run of a play, **performed by the
cast** and **run, selected, and captured by the Director**, deposited
venue-neutral. The **cast** (the play's figures embodied) is the **producer**: the
captured run is its performance. The **Director** is the **hand** that runs the
living production (a control loop over the board), steers, selects, and captures;
the Director does **not author** the run. That separation is what makes a result
trustworthy as the cast's work and not the Director's invention. The layout is the
contract:

```
writing/<house>/<play>/<result>.md
```

- `<house>` — the house slug, as in the chain registry.
- `<play>` — the play id, exactly as in that house's `registry.json`.
- `<result>` — the **reading's** slug. A play may hold **one or more captured
  runs**, each a distinct reading (variation is native to directing): name the
  canonical run for the play (`writing/grimm/aschenputtel/aschenputtel.md`); an
  alternate reading takes its own slug (`..._oberlin-as-cage.md`).

Each result is the **Standard** (venue-neutral). The Archive's Roadie composes the
per-Venue **Adaption** at ship time; Adaptions are computed, never stored. Git
history is the revision record (no version field): re-capturing the same reading
is a revision; a **different reading** is a new result file.

Frontmatter (all required unless marked optional):

| field             | meaning                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `khai: writing`   | the kind                                                                                                                                                               |
| `title`           | front-of-house title of the run                                                                                                                                        |
| `house`           | house slug; must equal the `<house>` path segment                                                                                                                      |
| `play`            | source play id; must equal `<play>`; resolves in the registry                                                                                                          |
| `source`          | provenance: `khai-plays-<house>/plays/<play>`                                                                                                                          |
| `director`        | the house Director persona who **ran, selected, and captured** the run (the hand; does not author it)                                                                  |
| `cast`            | the cast that performed the run (the **producer**): the play's figures embodied; note the configuration if it bears on the reading (e.g. a persistent or a fresh cast) |
| `language`        | the run's language; the **author's choice per result**                                                                                                                 |
| `reading`         | the directorial reading captured (what was moved); optional                                                                                                            |
| `license`         | `CC-BY-NC-SA-4.0`                                                                                                                                                      |
| `created`         | first-deposit date (git carries revisions after)                                                                                                                       |
| `blurb`           | front-of-house one-liner                                                                                                                                               |
| `contentWarnings` | list; optional                                                                                                                                                         |
| `routing`         | routing intent (the Director's taste); optional                                                                                                                        |

The body is the **captured run** in the chosen voice — the cast's performance as it
played, run and staged by the Director — mechanics spent not shown, ending with the
**licence block** that credits the public-domain source (the production is claimed
over a source in the public domain, never the source itself).

**Provenance gate.** Conformance checks structure — the path matches the
frontmatter `house`/`play`, the required fields are present, the licence block is
there. CI additionally resolves `play` against the house's shipped `registry.json`
(every house ships it), so a result naming a play that does not exist fails.

**Discovery.** `registry.json` (`writing[]`, built) surfaces each result's
`house, play, result, path, title, blurb, director, cast, language, created,
contentWarnings, routing`, so npm-pull consumers (the website) render the catalogue
(including who directed and the cast that performed) without reading every file.

## Two distribution paths

- **Pull** — `@chbrain/khai-writing` is `npm install`-ed and rendered like
  `@chbrain/khai-plays-*` (own surfaces, e.g. the website). No API, no Roadie —
  the website is the npm-pull Venue.
- **Push** — the Archive's Roadie ships to an external Venue (the Grimoire) over
  the authenticated/stateful API kind and writes the placement to the ledger.

## The boundary

A house's responsibility ends at **deposit**. Houses produce and deposit; this
engine keeps, catalogues, ships, and tracks. The **Director** runs the production
and deposits captured runs but is a _house_ position — not cast here. The **cast**
is the producer of each run, named in the result (`cast`) and **ephemeral per
production** — not a standing position here either. Here the **Archivist
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

Every PR carries a changeset (this archive is semver, not count-driven): a result
add or fix ships a `patch`/`minor` changeset, so the deploy is steered through the
**Version Packages** PR; a change that ships nothing (tooling, docs, the gates) ->
an **empty** changeset (`npx changeset add --empty`). The `changeset-check` gate
enforces it.

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
