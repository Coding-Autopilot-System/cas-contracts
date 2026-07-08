# Operations

## Setup and test

```powershell
npm ci
npm test
npm run validate
```

`npm test` compiles every Draft 2020-12 schema, validates all examples, verifies lifecycle
correlation, and proves malformed metadata is rejected.

## Local registry build

```powershell
npm run build:registry -- --version 0.1.0
npm run validate:registry -- --registry registry
```

Writes `registry/`, validates the version, preserves relative schema references, and produces
deterministic manifests.

## CI (`.github/workflows/ci.yml`, `.github/workflows/compatibility.yml`, `.github/workflows/codeql.yml`)

- `ci.yml` — install, `npm test`, `npm run validate` on pushes and PRs.
- `compatibility.yml` — cross-version compatibility checks for released schema lines.
- `codeql.yml` — CodeQL analysis (badge in the root `README.md`).

## Publishing (`.github/workflows/pages.yml`)

Runs automatically on push to `main`/`master` and on `v[0-9]+.[0-9]+.[0-9]+` tags. Builds the
mkdocs documentation site and rebuilds every tagged schema release into `site/registry/` in
one artifact, then deploys via `actions/deploy-pages` using GitHub's OIDC token (no stored
deployment credentials). See [Architecture](./Architecture.md) for the full pipeline and
`docs/DISTRIBUTION.md` for the release-ordering caveat (create a post-release metadata commit
so the Pages deployment runs from a fresh SHA that picks up the new tag).

<!-- docs-verified: 991c3606b148ab42134e505f4cf110afb8cb8e6b 2026-07-08 -->
