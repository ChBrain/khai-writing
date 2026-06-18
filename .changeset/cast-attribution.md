---
"@chbrain/khai-writing": patch
---

Attribute a captured run to the cast as its producer.

The Standard now states that a result is the cast's performance (the play's
figures embodied), run, selected, and captured by the Director, and never
authored by the Director: that separation is what makes a result trustworthy as
the cast's work. Adds a required `cast` frontmatter field (the producer) and
redraws `director` as the hand that ran and selected the run. The discovery
index surfaces `director` and `cast`, and the conformance gate requires and
syncs them.
