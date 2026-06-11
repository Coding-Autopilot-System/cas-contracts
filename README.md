# CAS Contracts

Public, authoritative, versioned contracts for the Coding Autopilot System.

CAS Contracts gives every CAS component one implementation-neutral lifecycle:

```text
PromptEnvelope
-> PolicyDecision
-> WorkRequest
-> RunEvent[]
-> ArtifactManifest
-> VerificationResult
-> EvaluationResult
```

## Why This Exists

AI-native engineering systems fail when prompts, policy decisions, execution events, evidence, and evaluations use incompatible shapes. This repository makes those boundaries explicit, executable, traceable, and safe to evolve.

Every lifecycle record includes:

- `correlationId`, `promptId`, and `runId`
- `repo` and structured `actor`
- RFC 3339 `timestamp`
- explicit `schemaVersion`
- W3C `traceparent` and optional `tracestate`

## Quickstart

Requirements: Node.js 22 or later.

```powershell
npm ci
npm test
npm run validate
```

`npm test` compiles every Draft 2020-12 schema, validates all examples, verifies lifecycle correlation, and proves malformed metadata is rejected.

## Repository Layout

| Path | Purpose |
|------|---------|
| `schemas/v0.1/` | Authoritative JSON Schemas |
| `examples/v0.1/` | Complete executable lifecycle fixtures |
| `tests/` | Positive, negative, and lifecycle contract tests |
| `docs/VERSIONING.md` | Compatibility and evolution policy |
| `docs/DISTRIBUTION.md` | Stable and immutable schema registry URLs |
| `.planning/` | GSD project context, requirements, roadmap, and research |

## Adoption

Producers should emit records that validate against the declared version. Consumers should validate at trust boundaries, reject unsupported major versions, and preserve trace context across service boundaries.

The schemas are public APIs. Review [versioning and compatibility](docs/VERSIONING.md), [contributing](CONTRIBUTING.md), and [security](SECURITY.md) before proposing changes.

Released schemas are discoverable from `https://coding-autopilot-system.github.io/cas-contracts/index.json`. Use stable `vMAJOR.MINOR` URLs for compatible updates or immutable `releases/vMAJOR.MINOR.PATCH` URLs for reproducible builds. See [schema distribution](docs/DISTRIBUTION.md).

## Status

`v0.1.0` is the useful foundation release. Compatibility automation and versioned registry distribution are available for subsequent releases.

## License

MIT
