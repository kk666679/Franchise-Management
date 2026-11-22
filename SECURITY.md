# Security Policy

## Supported versions

This project is under active development. Security fixes are currently applied to the latest state of the default development branch. Older commits and unreleased snapshots are not maintained security branches.

## Reporting a vulnerability

Do not disclose suspected vulnerabilities in a public issue, discussion, pull request, or chat.

Use the repository host's private vulnerability-reporting feature when available. Otherwise, contact the project maintainers privately through the account or organization that owns this repository and include the impact, affected commit or route, reproducible steps, prerequisites, and suggested mitigation if known.

Do not include real credentials, production data, API keys, or personal information. If a secret was exposed, revoke or rotate it immediately and report the exposure without reproducing the secret.

## Local development

- Never commit `.env`, `.env.local`, or credentials.
- Use a dedicated development database and non-production storage bucket.
- Set a long, random `AUTH_SECRET`; values shorter than 16 characters are rejected.
- Keep database, SMTP, storage, and AI-provider credentials server-side.
- UI visibility is not an authorization control; review server-side permission checks.
