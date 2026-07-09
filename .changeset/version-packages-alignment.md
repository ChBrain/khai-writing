---
---

Governance: make khai-writing count-driven. The writing **count** now drives the
minor — the registry builder reconciles `0.<count>.0` and is the single writer of
the version (`package.json` + `registry.json`) — with `changesetPolicy.countDrivenAdd`
for result files and the CLAUDE.md doctrine to match: a result add carries a `minor`
changeset, steered through the Version Packages PR. The empty archive (0 results)
reconciles to `0.0.x` (a fresh house). Ships no new content: an empty changeset.
