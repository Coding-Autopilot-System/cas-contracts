# Requirements: CAS Contracts

**Defined:** 2026-06-11  
**Core Value:** Every CAS component can exchange trustworthy lifecycle data without guessing structure, identity, traceability, or compatibility.

## v0.1 Requirements

### Contracts

- [x] **CONT-01**: Integrators can validate every lifecycle record against a versioned JSON Schema.
- [x] **CONT-02**: Integrators can use shared correlation and W3C trace-context metadata consistently across every lifecycle record.
- [x] **CONT-03**: Integrators can validate complete lifecycle examples from prompt intake through evaluation.

### Quality

- [x] **QUAL-01**: Contributors can run one command that compiles every schema and validates every example.
- [x] **QUAL-02**: Contributors receive failures when required metadata is missing or malformed.
- [x] **QUAL-03**: Pull requests validate contracts on Windows and Linux.

### Governance

- [x] **GOV-01**: Consumers can determine whether a proposed schema change is compatible.
- [x] **GOV-02**: Security researchers and contributors have documented reporting and contribution paths.
- [x] **GOV-03**: Maintainers can release contracts under an explicit license and semantic version.

## vNext Requirements

- **SDK-01**: Consumers can install generated typed SDKs for supported languages.
- **REG-01**: Consumers can resolve published schemas from a stable registry endpoint.
- [x] **COMP-01**: CI automatically compares proposed schemas against the latest release for compatibility.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Runtime orchestration | Owned by CAS execution repositories |
| Authentication implementation | Contracts describe actors but do not authenticate them |
| Service persistence schemas | Internal storage models are implementation-specific |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONT-01 | Phase 1 | Complete |
| CONT-02 | Phase 1 | Complete |
| CONT-03 | Phase 1 | Complete |
| QUAL-01 | Phase 1 | Complete |
| QUAL-02 | Phase 1 | Complete |
| QUAL-03 | Phase 1 | Complete |
| GOV-01 | Phase 1 | Complete |
| GOV-02 | Phase 1 | Complete |
| GOV-03 | Phase 1 | Complete |
| COMP-01 | Phase 2 | Complete |
| REG-01 | Phase 2 | Pending |

**Coverage:** 12 requirements, 12 mapped, 0 unmapped.

---
*Last updated: 2026-06-11 after Phase 1 verification*
