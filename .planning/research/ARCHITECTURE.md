# Architecture Research

## Components

- `schemas/v0.1/`: authoritative lifecycle and shared JSON Schemas.
- `examples/v0.1/`: executable valid lifecycle fixtures.
- `scripts/`: repository validation tooling.
- `tests/`: schema compilation, example validation, lifecycle, and negative tests.
- `docs/`: compatibility and versioning policies.

## Data Flow

`PromptEnvelope -> PolicyDecision -> WorkRequest -> RunEvent[] -> ArtifactManifest -> VerificationResult -> EvaluationResult`

All records share lifecycle metadata so consumers can correlate records and distributed traces.

## Build Order

1. Shared metadata and identifiers.
2. Lifecycle record schemas.
3. Examples and validation.
4. CI and governance.
5. Generated SDKs and publication.
