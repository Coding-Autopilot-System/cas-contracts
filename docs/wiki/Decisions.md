# Decisions

## ADR convention

`docs/adr/README.md` establishes the convention (sequential numbering, Context/Decision/
Consequences) but **no numbered ADR files exist in the repo yet**. Decisions to date live in
`.planning/phases/` plan/summary pairs and `docs/VERSIONING.md` / `docs/DISTRIBUTION.md`
instead.

## Phase history (`.planning/phases/`, this repo's own GSD project)

| Phase | Topic |
|---|---|
| 02 | Compatibility automation and distribution |

See `.planning/phases/02-compatibility-automation-and-distribution/02-01-SUMMARY.md` and
`02-02-SUMMARY.md` for the detailed record, and `.planning/research/SUMMARY.md` for the
research that preceded it.

## Open decisions tracked in this Phase 36 refresh

- **PR #18** (`fix/registry-resolvable-id`) — rewrites all 22 schema `$id` values from the
  unresolvable `schemas.coding-autopilot.dev` domain to the resolvable Pages registry URL;
  open, not yet merged. This is the highest-risk documentation item in this refresh — see
  [Architecture](./Architecture.md#schema-identity-vs-distribution--currently-in-transition).
- **PR #19** (`ci/sha-pin-and-least-privilege`) — pins third-party GitHub Actions to commit
  SHAs and adds least-privilege permissions; open, not yet merged.

<!-- docs-verified: 991c3606b148ab42134e505f4cf110afb8cb8e6b 2026-07-08 -->
