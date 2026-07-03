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

## v1.0 Goal Contract Migration

The v1.0 line introduces required bounded-goal properties on `WorkRequest`.
This is intentionally a major-version boundary: v0.1 schemas and payloads remain
published and valid, while producers opt into v1.0 by emitting
`schemaVersion: 1.0.0` and supplying success criteria, constraints, policies,
capabilities, budget limits, and stop policy.

Registry builds publish both stable lines. Consumers must select the schema ID
matching the record's explicit version; they must not validate a v0.1 payload
against v1.0 or silently synthesize missing limits.

## Change Procedure

Every contract change must include updated examples, tests, changelog entry, compatibility classification, and migration notes for breaking changes.

## Automated Classification

Pull requests that affect schemas run the directional compatibility classifier against the latest semantic-version release:

```powershell
npm run compatibility -- --base path\to\baseline\schemas --head schemas --output compatibility-report.json
```

The classifier reports:

- `unchanged`: no schema behavior changed.
- `compatible`: known additive or relaxed changes only.
- `breaking`: known changes that invalidate previously accepted payloads.
- `review_required`: changed semantics that cannot be classified safely by the automated rules.

Both `breaking` and `review_required` exit nonzero. A `review_required` result must be resolved by simplifying the change, extending classifier coverage with tests, or obtaining explicit maintainer review. Automation never treats an unknown semantic change as compatible.
