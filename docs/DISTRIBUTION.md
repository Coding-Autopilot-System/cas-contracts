# Schema Distribution

Released CAS schemas are distributed from the schema registry, served as a
sub-path of the documentation site on a single GitHub Pages origin:

```text
https://coding-autopilot-system.github.io/cas-contracts/registry/
```

Schema `$id` values use the reserved canonical namespace
`https://schemas.coding-autopilot.dev/`. That namespace is the stable identity
of each schema even though the current live distribution is served from GitHub
Pages. Consumers should treat `$id` as identity and use the Pages registry URLs
below as the fetch location until the canonical domain is activated.

## URL Contract

Use a stable major/minor URL when a consumer should automatically receive compatible patch releases:

```text
https://coding-autopilot-system.github.io/cas-contracts/registry/v0.1/prompt-envelope.schema.json
```

Use an immutable release URL when builds or evidence must remain reproducible:

```text
https://coding-autopilot-system.github.io/cas-contracts/registry/releases/v0.1.0/prompt-envelope.schema.json
```

Discovery and integrity metadata are available from:

- `/registry/index.json`: available releases and the current release for each major/minor line.
- `/registry/v0.1/manifest.json`: schemas and SHA-256 digests for the current compatible release.
- `/registry/releases/v0.1.0/manifest.json`: schemas and SHA-256 digests for one immutable release.

## Local Build

```powershell
npm run build:registry -- --version 0.1.0
npm run validate:registry -- --registry registry
```

The command writes `registry/`, validates the version, preserves relative schema references, and produces deterministic manifests.

## Publication

The documentation site and the schema registry are published together by a
single workflow, `.github/workflows/pages.yml`, which is the sole owner of the
GitHub Pages deployment. It runs on pushes to the default branch **and** on
semantic version tags such as `v0.1.1`. On each run it builds the mkdocs site,
rebuilds every tagged release into `site/registry/`, preserves immutable release
paths, advances stable major/minor paths, validates the repository, and deploys
a single artifact. Because both artifacts share one deployment, a docs push and
a schema tag can no longer clobber each other on the single Pages origin.

Repository administrators must configure GitHub Pages to use **GitHub Actions** as its source. Publication uses GitHub's OIDC token and does not require stored deployment credentials.

## Custom domain (optional future work)

When `schemas.coding-autopilot.dev` is activated, it must serve the same
versioned registry content without changing any schema `$id` values. The live
GitHub Pages registry remains the current distribution URL and should stay
stable for consumers that fetch schemas directly today.
