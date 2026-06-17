# Security

This is khai-writing, the chain's writing archive (the Metroon): rendered results
plus a publication ledger and the gates that validate them. The Archive's Roadie
ships results to external Venues; the per-Venue API keys it uses come from the
environment (repository secrets in CI), never committed to the repo — only
variable names (e.g. `GRIMOIRE_API_KEY_<HOUSE>`) appear here. A committed key
value is a conformance failure, not a style nit.

To report a concern with the content, the ledger, or the tooling, open a private
advisory on the repository, or contact the owner listed in CODEOWNERS. Do not
open a public issue for anything sensitive.
