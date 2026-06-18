# @chbrain/khai-writing

## 0.1.1

### Patch Changes

- 12b899a: Reframe the Writing Standard for the rebuilt Director: a result is a captured
  production (one run of a play made flesh by the Director's control loop over the
  board), not one frozen telling. A play may hold one or more captured runs, each a
  distinct reading (variation is native to directing); the <result> slug names the
  reading. Adds an optional `reading` frontmatter field (the directorial reading
  captured). Schema and gate otherwise unchanged; the deposit/Adaption/discovery
  model holds.
- de96491: Attribute a captured run to the cast as its producer.

  The Standard now states that a result is the cast's performance (the play's
  figures embodied), run, selected, and captured by the Director, and never
  authored by the Director: that separation is what makes a result trustworthy as
  the cast's work. Adds a required `cast` frontmatter field (the producer) and
  redraws `director` as the hand that ran and selected the run. The discovery
  index surfaces `director` and `cast`, and the conformance gate requires and
  syncs them.

- ae73614: Pin the writing organization (the Standard) before any publishing. The result
  layout and frontmatter schema are documented in CLAUDE.md (one canonical telling
  per play; `language` the author's choice) and enforced by the conformance gate:
  required fields, path-to-frontmatter `house`/`play` agreement, the licence block,
  and a deep play-resolution against the house's shipped `registry.json` (runs in
  CI where the house package is present). The discovery index now surfaces each
  result's front-of-house (`title`, `blurb`, `language`, `created`,
  `contentWarnings`, `routing`).
