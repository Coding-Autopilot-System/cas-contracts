# Changelog

All notable changes follow Semantic Versioning and Keep a Changelog conventions.

## [Unreleased]

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
