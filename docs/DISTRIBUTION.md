# Schema Distribution

Released CAS schemas are distributed from the schema registry, served as a
sub-path of the documentation site on a single GitHub Pages origin:

```text
https://coding-autopilot-system.github.io/cas-contracts/registry/
```

Schema `$id` values are now identical to the live fetch URL under the GitHub
Pages registry — there is no separate canonical namespace. `$id` is both the
identity and the resolvable fetch location for every schema.

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

### Release ordering

GitHub Pages identifies deployments by commit SHA. A release tag created on the
same commit as a just-finished default-branch deployment can therefore produce a
different artifact that Pages treats as the same deployment. After creating a
schema release tag, merge a post-release metadata commit (for example, advancing
the changelog) on the default branch. That deployment runs from a new SHA, sees
the new tag, and publishes the complete immutable release set. Verify both the
immutable manifest and the stable-line index before declaring the release done.

## Custom domain (optional future work)

If `schemas.coding-autopilot.dev` is ever activated as a custom domain, that
will require a new, explicit `$id` migration with its own consumer-compatibility
plan — it is not a transparent, zero-cost activation. `$id` currently equals
the live GitHub Pages fetch URL, so repointing `$id` to a future custom domain
would be a breaking change for any consumer that has adopted the current
`$id` value, and must be planned and announced accordingly.
