# Changelog

All notable changes follow Semantic Versioning and Keep a Changelog conventions.

## [1.1.2](https://github.com/Coding-Autopilot-System/cas-contracts/compare/v1.1.1...v1.1.2) (2026-07-13)


### Bug Fixes

* **ci:** repin release-please reusable workflow to reachable SHA ([#23](https://github.com/Coding-Autopilot-System/cas-contracts/issues/23)) ([3029fbe](https://github.com/Coding-Autopilot-System/cas-contracts/commit/3029fbeb2f192a5e0fc552da22162519af10ca8d))
* **ci:** wire release-please PAT into reusable workflow caller ([#27](https://github.com/Coding-Autopilot-System/cas-contracts/issues/27)) ([d15cc54](https://github.com/Coding-Autopilot-System/cas-contracts/commit/d15cc54a790a3c0c1ad46353fc246110fbd7531f))
* **registry:** rewrite schema $id to the resolvable Pages registry URL ([#18](https://github.com/Coding-Autopilot-System/cas-contracts/issues/18)) ([b385f15](https://github.com/Coding-Autopilot-System/cas-contracts/commit/b385f1593820ae5a938ae7c1825758aa6eea21b2))

## [Unreleased]

### Changed

- **BREAKING:** Schema `$id` values now point at the live GitHub Pages registry (`https://coding-autopilot-system.github.io/cas-contracts/registry/...`) instead of the unresolvable `https://schemas.coding-autopilot.dev/` namespace introduced in v1.1.1. Consumers that hardcode the old `$id` string (e.g. offline schema validators) must update to the new value. See REQ-1.4.11.

### Added

- Conservative automated JSON Schema compatibility classification in pull-request CI.
- Deterministic schema registry packaging and release-triggered GitHub Pages distribution.
- Stable major/minor and immutable patch-version schema URL contracts with SHA-256 manifests.

## [1.1.1] - 2026-07-05

### Fixed

- Restored canonical schema `$id` values and example schema artifact URIs to `https://schemas.coding-autopilot.dev/` while keeping GitHub Pages `registry/` URLs as the live distribution endpoint.
- Added regression coverage to ensure schema identity remains canonical and independent from the hosting URL.

## [0.1.0] - 2026-06-11

### Added

- Authoritative schemas for the complete CAS lifecycle.
- Shared mandatory lifecycle metadata and W3C trace context.
- Executable examples, negative contract tests, and cross-platform CI.
- Versioning, compatibility, security, and contribution policies.
