---
"@chbrain/khai-writing": patch
---

Pin the writing organization (the Standard) before any publishing. The result
layout and frontmatter schema are documented in CLAUDE.md (one canonical telling
per play; `language` the author's choice) and enforced by the conformance gate:
required fields, path-to-frontmatter `house`/`play` agreement, the licence block,
and a deep play-resolution against the house's shipped `registry.json` (runs in
CI where the house package is present). The discovery index now surfaces each
result's front-of-house (`title`, `blurb`, `language`, `created`,
`contentWarnings`, `routing`).
