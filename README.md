# CAS Contracts

[![CI](https://github.com/Coding-Autopilot-System/cas-contracts/actions/workflows/ci.yml/badge.svg)](https://github.com/Coding-Autopilot-System/cas-contracts/actions/workflows/ci.yml) [![CodeQL](https://github.com/Coding-Autopilot-System/cas-contracts/actions/workflows/codeql.yml/badge.svg)](https://github.com/Coding-Autopilot-System/cas-contracts/actions/workflows/codeql.yml)


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
| `schemas/v0.1/` | Foundation lifecycle schemas retained for existing consumers |
| `schemas/v1.0/` | Bounded goal and lifecycle schemas |
| `examples/v0.1/`, `examples/v1.0/` | Complete executable lifecycle fixtures |
| `tests/` | Positive, negative, and lifecycle contract tests |
| `docs/VERSIONING.md` | Compatibility and evolution policy |
| `docs/DISTRIBUTION.md` | Stable and immutable schema registry URLs |
| `.planning/` | GSD project context, requirements, roadmap, and research |

## Adoption

Producers should emit records that validate against the declared version. Consumers should validate at trust boundaries, reject unsupported major versions, and preserve trace context across service boundaries.

The schemas are public APIs. Review [versioning and compatibility](docs/VERSIONING.md), [contributing](CONTRIBUTING.md), and [security](SECURITY.md) before proposing changes.

Released schemas are discoverable from `https://coding-autopilot-system.github.io/cas-contracts/registry/index.json`. Use stable `registry/vMAJOR.MINOR` URLs for compatible updates or immutable `registry/releases/vMAJOR.MINOR.PATCH` URLs for reproducible builds. See [schema distribution](docs/DISTRIBUTION.md).
Authoritative schema identity remains under `https://schemas.coding-autopilot.dev/`; the GitHub Pages registry is the current live distribution endpoint.

The v1 `WorkRequest` rejects dispatch unless objective, repositories,
measurable criteria, constraints, risk, approval and verification policies,
capabilities, bounded execution limits, and stop policy are explicit. Its
documented defaults are fan-out 3, iterations 3, attempts 3, runtime 1800
seconds, model calls 20, and no-progress limit 2.

## Status

`v0.1.0` remains the supported foundation line. `v1.0.0` adds the bounded goal contract as an explicit major-version opt-in.

## License

MIT
