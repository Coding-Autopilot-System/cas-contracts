# Schema Distribution

Released CAS schemas are distributed from the schema registry, served as a
sub-path of the documentation site on a single GitHub Pages origin:

```text
https://coding-autopilot-system.github.io/cas-contracts/registry/
```

Schema `$id` values use the reserved canonical namespace `https://schemas.coding-autopilot.dev/`. This namespace is the stable *identity* of each schema and is independent of where the schema is hosted. Until DNS is configured for that domain, consumers must resolve schemas from the live GitHub Pages distribution URL above.

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

## Custom domain (manual follow-up)

Serving the registry under the canonical `schemas.coding-autopilot.dev` `$id`
namespace requires infrastructure that cannot be provisioned from this
repository:

1. Configure DNS for `schemas.coding-autopilot.dev` (a `CNAME` to
   `coding-autopilot-system.github.io`, or the four GitHub Pages `A`/`AAAA`
   apex records) with the domain registrar.
2. Because the single Pages origin now hosts the documentation at its root and
   the registry under `/registry/`, a custom domain would remap the **entire**
   origin — it cannot point only at the `/registry/` sub-path. Activating
   `schemas.coding-autopilot.dev` therefore requires a dedicated hosting origin
   for the registry (for example, a separate Pages project or a CDN) rather than
   the shared docs site. Until such an origin exists, resolve schemas from the
   GitHub Pages URL above.
