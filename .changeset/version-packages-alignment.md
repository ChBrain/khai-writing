---
---

Governance: adopt the aligned Version-Packages flow. Add the `changeset-check` gate
(every PR carries a changeset; bot lanes exempt) and bump `@chbrain/khai-guard` to
`^0.1.16`. This archive is semver (not count-driven), so a result add carries a real
changeset and the deploy is steered through the Version Packages PR. Ships no package
content: an empty changeset.
