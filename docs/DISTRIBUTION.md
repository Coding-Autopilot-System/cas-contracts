# Schema Distribution

Released CAS schemas are distributed as a static registry from `https://schemas.coding-autopilot.dev`.

## URL Contract

Use a stable major/minor URL when a consumer should automatically receive compatible patch releases:

```text
https://schemas.coding-autopilot.dev/v0.1/prompt-envelope.schema.json
```

Use an immutable release URL when builds or evidence must remain reproducible:

```text
https://schemas.coding-autopilot.dev/releases/v0.1.0/prompt-envelope.schema.json
```

Discovery and integrity metadata are available from:

- `/index.json`: available releases and the current release for each major/minor line.
- `/v0.1/manifest.json`: schemas and SHA-256 digests for the current compatible release.
- `/releases/v0.1.0/manifest.json`: schemas and SHA-256 digests for one immutable release.

## Local Build

```powershell
npm run build:registry -- --version 0.1.0
npm run validate:registry -- --registry registry
```

The command writes `registry/`, validates the version, preserves relative schema references, and produces deterministic manifests.

## Publication

Pushing a semantic version tag such as `v0.1.1` runs `.github/workflows/publish-registry.yml`. The workflow rebuilds every tagged release, preserves immutable release paths, advances stable major/minor paths, validates the repository, and deploys the result to GitHub Pages.

Repository administrators must configure GitHub Pages to use **GitHub Actions** as its source and configure DNS for the `schemas.coding-autopilot.dev` custom domain. Publication uses GitHub's OIDC token and does not require stored deployment credentials.
