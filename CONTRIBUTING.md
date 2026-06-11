# Contributing

## Setup

Requirements: Git and Node.js 22 or later.

```powershell
npm ci
npm test
npm run validate
```

## Contract Changes

1. Open an issue describing the integration need.
2. Classify the change using `docs/VERSIONING.md`.
3. Update schemas, examples, tests, and `CHANGELOG.md` together.
4. Run the full validation suite.
5. Submit a focused pull request with compatibility impact and migration notes.

Run the automated compatibility classifier against the current release or target branch before submitting:

```powershell
npm run compatibility -- --base path\to\baseline\schemas --head schemas --output compatibility-report.json
```

Pull-request CI repeats this comparison. Breaking changes and changes requiring semantic review fail the compatibility job.

Breaking changes require a new major-version directory and explicit maintainer approval.

Do not include secrets, credentials, customer data, or personal data in schemas or examples.
