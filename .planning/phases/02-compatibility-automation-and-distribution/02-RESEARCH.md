# Phase 2 Research: Compatibility Automation and Distribution

## Findings

- JSON Schema compatibility is directional: a consumer-compatible change must continue accepting every instance accepted by the prior schema.
- A deterministic, conservative classifier is preferable to an incomplete "compatible" claim. Unknown changed keywords must be reported as `review_required`.
- Breaking patterns that can be classified reliably include removed schemas or properties, newly required properties, narrowed types or enums, tightened object extensibility, and tightened numeric/string/array bounds.
- Pull request automation should compare the proposed `schemas/` tree with the merge-base version and publish a machine-readable report plus a human-readable job summary.
- The authoritative `$id` namespace is already `https://schemas.coding-autopilot.dev/v0.1/`.
- Distribution should be reproducible locally, validate every generated schema, and deploy only immutable release-tag content to GitHub Pages.
- A registry manifest should provide release version, available schema IDs, relative paths, and SHA-256 digests so consumers can discover and verify artifacts.

## Strategy

1. Add a dependency-free compatibility classifier and fixtures that prove breaking, non-breaking, unchanged, and review-required outcomes.
2. Add CI that classifies pull-request schema changes against the merge base and uploads the JSON report.
3. Add a deterministic registry builder that packages schemas under both an immutable release path and the stable major/minor path.
4. Add release-triggered Pages deployment with explicit permissions, concurrency, and artifact validation.

## Risks And Mitigations

| Risk | Mitigation |
|------|------------|
| False compatibility claim | Classify unsupported changed keywords as `review_required`, never silently compatible |
| Mutable release artifacts | Build only from semantic-version tags and include SHA-256 digests |
| Broken relative `$ref` values | Preserve each version directory layout and compile generated schemas in tests |
| CI unable to compare shallow history | Checkout full history for compatibility job |
| Pages custom domain not configured | Document DNS/Pages prerequisite and keep generated artifact independently testable |
