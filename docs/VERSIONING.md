# Versioning and Compatibility

CAS Contracts follows Semantic Versioning.

## Version Locations

- Repository releases use `vMAJOR.MINOR.PATCH`.
- Every record contains `schemaVersion`.
- Published schemas live under `schemas/vMAJOR.MINOR/`.
- Schema `$id` values include the major and minor version.

## Compatibility Rules

Patch releases may clarify documentation, fix tests, or tighten implementation tooling without changing accepted or emitted payloads.

Minor releases may add optional properties, new schemas, new enum-independent extension points, or non-breaking examples. Existing valid payloads must remain valid.

Major releases may remove or rename properties, add required properties, narrow accepted values, or otherwise invalidate payloads accepted by the previous major version.

## Consumer Expectations

- Producers must emit an explicit supported `schemaVersion`.
- Consumers should reject unsupported major versions.
- Consumers should ignore unknown optional properties only when their validator policy permits them.
- Consumers must not infer compatibility solely from file paths; validate against the declared schema.

## Change Procedure

Every contract change must include updated examples, tests, changelog entry, compatibility classification, and migration notes for breaking changes.
