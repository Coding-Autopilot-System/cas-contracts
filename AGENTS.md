# Repository Agent Instructions

## Scope

This repository is the authoritative source for Coding Autopilot System lifecycle contracts.

## Required Workflow

1. Read `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, and `.planning/STATE.md`.
2. Treat published schemas as public APIs.
3. Add or update examples and tests with every schema change.
4. Run `npm test` before committing.
5. Apply `docs/VERSIONING.md`; do not introduce breaking changes in a minor or patch release.

## Contract Rules

- Use JSON Schema Draft 2020-12.
- Keep schemas implementation-neutral.
- Reuse shared definitions instead of duplicating lifecycle metadata.
- Never add secrets, credentials, or real personal data to examples.
- Require explicit `schemaVersion` values and W3C trace context.
