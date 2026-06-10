# Security Policy

## Supported Versions

The latest released minor version is supported. Security fixes may be backported when consumers cannot migrate safely.

## Reporting

Report vulnerabilities through GitHub private vulnerability reporting for this repository. Do not open public issues for suspected vulnerabilities.

Include the affected schema or tooling path, impact, reproduction details, and suggested mitigation when available.

## Contract Security Principles

- Contracts never transport credentials or raw secrets.
- Examples use synthetic identities and content.
- Actors are descriptive identities, not proof of authentication.
- Consumers must independently authenticate, authorize, validate, and audit records.
- Trace context must not contain sensitive data.
