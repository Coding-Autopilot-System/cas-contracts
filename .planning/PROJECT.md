# CAS Contracts

## What This Is

CAS Contracts is the public, authoritative contract repository for the Coding Autopilot System. It defines portable, versioned JSON Schema contracts for the full AI-native engineering lifecycle, from prompt intake through policy, execution, verification, and evaluation.

## Core Value

Every CAS component can exchange trustworthy lifecycle data without guessing structure, identity, traceability, or compatibility.

## Requirements

### Validated

- v0.1 lifecycle schemas, examples, tests, CI, and governance - Phase 1
- Automated compatibility classification and stable versioned schema distribution - Phase 2

### Active

- [x] Publish the complete lifecycle as JSON Schema Draft 2020-12.
- [x] Require consistent correlation, repository, actor, timestamp, schema version, and W3C trace context metadata.
- [x] Provide valid examples and automated schema validation.
- [x] Define explicit semantic versioning and compatibility rules.
- [x] Provide enterprise-grade contribution, security, and CI foundations.

### Out of Scope

- Runtime orchestration - owned by execution repositories.
- Generated SDKs - deferred until the v0.1 contracts stabilize.
- Service-specific persistence models - implementations may adapt contracts internally.

## Context

CAS currently has multiple repositories that need a shared language for prompts, policy decisions, work requests, run events, artifacts, verification, and evaluations. This repository becomes the source of truth and prevents cross-repository integration from depending on prose conventions.

## Constraints

- **Format**: JSON Schema Draft 2020-12 - broadly interoperable and machine-verifiable.
- **Compatibility**: Semantic versioning with additive-only changes within a major version.
- **Traceability**: All lifecycle records carry stable correlation metadata and W3C trace context.
- **Security**: Schemas must never encourage embedding credentials or raw secrets.
- **Portability**: Validation must run on Windows and Linux.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use JSON Schema Draft 2020-12 | Mature ecosystem and cross-language validation | Pending |
| Use one common lifecycle metadata definition | Prevent traceability drift across contracts | Pending |
| Keep contracts implementation-neutral | Allow all CAS runtimes to adopt them | Pending |
| Publish examples as executable fixtures | Documentation and validation stay synchronized | Pending |
| Fail unknown schema semantics as review-required | Prevent false compatibility claims | Implemented in Phase 2 |
| Rebuild all release tags for registry publication | Preserve immutable release URLs while stable lines advance | Implemented in Phase 2 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

1. Move shipped and verified requirements to Validated.
2. Record new requirements and decisions when they emerge.
3. Reconfirm that contract interoperability remains the core value.

---
*Last updated: 2026-06-11 after Phase 2 verification*
