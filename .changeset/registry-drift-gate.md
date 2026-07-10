---
---

Close the registry build-drift gap in the writing archive. Extract a pure `computeWritingRegistry` from `build-writing-registry.mjs` (the write path now calls it behind a cross-platform main-guard) and add a drift test asserting the committed `registry.json` equals a fresh build — so a hand-edited or stale index is caught at the content PR, not at release. Tooling + tests only; ships nothing: an empty changeset.
