# CAS Contracts Documentation

Welcome to the **CAS Contracts** developer documentation! 

## Overview
**CAS Contracts** provides public, authoritative, and versioned schemas for the Coding Autopilot System (CAS). By defining explicit schemas, we ensure that prompts, policy decisions, execution events, evidence, and evaluations remain interoperable and safe to evolve across all CAS components.

## The CAS Lifecycle
CAS Contracts gives every component one implementation-neutral lifecycle:

1. **PromptEnvelope**
2. **PolicyDecision**
3. **WorkRequest**
4. **RunEvent[]**
5. **ArtifactManifest**
6. **VerificationResult**
7. **EvaluationResult**

## Key Features
- **Strict Validation:** Every lifecycle record includes correlation IDs, repository metadata, explicit schema versions, and distributed tracing context (W3C `traceparent`).
- **Bounded Execution:** The v1 `WorkRequest` enforces explicit objectives, measurable criteria, runtime limits, and bounded execution rules to prevent runaway AI loops.
- **Versioning:** Strong backward-compatibility guarantees. Consumers validate at trust boundaries and safely reject unsupported major versions.

## Getting Started
- [**Architecture Guide**](architecture.md): Deep dive into the data flow, tracing, and design of CAS Contracts.
- [**Versioning Policy**](VERSIONING.md): Learn how schemas evolve and the rules for backward compatibility.
- [**Schema Distribution**](DISTRIBUTION.md): Find out how to discover and load released schemas dynamically.

## Quickstart

```powershell
npm ci
npm test
npm run validate
```
This test suite compiles all schemas (Draft 2020-12), validates examples, and proves that malformed metadata is strictly rejected.
