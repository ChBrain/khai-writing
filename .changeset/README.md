# Changesets

This folder holds [changesets](https://github.com/changesets/changesets): one
markdown file per pending change describing the version bump it warrants. The
`release` workflow consumes them on `main` to open a Version PR and, once merged,
to publish `@chbrain/khai-writing`. A tooling or docs change with no package
effect uses an empty changeset (`npx changeset add --empty`).
