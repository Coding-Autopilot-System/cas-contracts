# CAS Contracts Wiki

## Role in the CAS portfolio

`cas-contracts` is part of the **Governance plane** of the Coding-Autopilot-System
three-plane model (Control / Execution / Governance). It publishes the public, versioned,
implementation-neutral JSON schemas (`PromptEnvelope` → `PolicyDecision` → `WorkRequest` →
`RunEvent[]` → `ArtifactManifest` → `VerificationResult` → `EvaluationResult`) that every
other CAS component validates against at its trust boundaries.

| Plane | This repo's responsibility |
|---|---|
| Control | *(consumed by)* `gsd-orchestrator` |
| Execution | *(consumed by)* `autogen` |
| Governance | Schema authority, versioning policy, registry publishing |

## Quickstart

- [README.md](../../README.md) — Quickstart, repository layout, adoption
- [Architecture](./Architecture.md) — schema versioning + Pages registry publishing pipeline
- [Operations](./Operations.md) — verified test/validate/build-registry commands
- [Decisions](./Decisions.md) — phase history, ADR convention, and open PRs (including the
  registry `$id` migration, PR #18)

## Ecosystem links

Part of the [Coding-Autopilot-System](https://github.com/Coding-Autopilot-System) org:
[gsd-orchestrator](https://github.com/Coding-Autopilot-System/gsd-orchestrator) (control plane) ·
[autogen](https://github.com/Coding-Autopilot-System/autogen) (execution plane) ·
[Promptimprover](https://github.com/Coding-Autopilot-System/Promptimprover) (prompt governance) ·
[cas-evals](https://github.com/Coding-Autopilot-System/cas-evals) (evidence gate)

<!-- docs-verified: 991c3606b148ab42134e505f4cf110afb8cb8e6b 2026-07-08 -->
