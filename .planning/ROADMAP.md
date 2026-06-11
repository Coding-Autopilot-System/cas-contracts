# Roadmap: CAS Contracts

## Phase 1: Useful v0.1 Foundation

**Goal:** Publish a complete, validated, governed lifecycle contract scaffold.

**Requirements:** CONT-01, CONT-02, CONT-03, QUAL-01, QUAL-02, QUAL-03, GOV-01, GOV-02, GOV-03

**Success criteria:**
1. Every lifecycle stage has a compiling Draft 2020-12 schema and valid example.
2. Tests reject missing lifecycle metadata and broken lifecycle correlation.
3. CI validates on Windows and Linux.
4. Public documentation defines adoption, compatibility, contribution, and security expectations.

## Phase 2: Compatibility Automation and Distribution

**Goal:** Make contracts safe and easy to consume across repositories.

**Requirements:** COMP-01, REG-01

**Plans:** 2 plans

**Wave 1**
- [ ] 02-01: Automated compatibility classification and PR enforcement

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 02-02: Deterministic versioned registry and release distribution

**Success criteria:**
1. Pull requests receive automated breaking-change classification.
2. Released schemas are resolvable from stable versioned URLs.

## Phase 3: Typed SDKs and Adoption

**Goal:** Accelerate adoption in CAS runtimes with generated typed clients.

**Requirements:** SDK-01

**Success criteria:**
1. At least two supported languages consume generated models.
2. At least three CAS repositories validate or emit the canonical lifecycle.

---
*Roadmap created: 2026-06-11*
