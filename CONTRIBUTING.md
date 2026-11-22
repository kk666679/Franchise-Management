# Contributing

Thanks for helping improve Franchise Management. Small, focused changes with clear context are especially valuable while the project is being built out.

## Before you start

1. Read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) and [SECURITY.md](./SECURITY.md).
2. Check existing issues and pull requests.
3. Use the private security process for vulnerabilities; do not open a public issue.

## Development setup

Install Node.js `>=22.23.4`, npm, and PostgreSQL:

```bash
npm ci
copy .env.example .env.local
npm run prisma:validate
npm run dev
```

Fill in `DATABASE_URL` and a strong local `AUTH_SECRET`. Do not commit local environment files or credentials. The seed command currently creates no default application data.

## Making changes

- Keep changes focused and explain the behavior they affect.
- Follow the existing TypeScript style, `@/*` import alias, server/client boundaries, and component organization.
- Treat authorization as a server-side concern; hiding UI is not protection.
- For schema changes, update `prisma/schema.prisma`, create a migration with `npm run prisma:migrate`, and describe its impact.
- Use the existing server-side environment contract for environment variables.
- Update documentation when commands, configuration, behavior, or security expectations change.

## Checks

```bash
npm run prisma:validate
npm run typecheck
npm run format:check
npm run build
```

The repository does not currently define an `npm test` script. If your change introduces tests, document the runner and invocation in the pull request and update the scripts when the workflow becomes standard.

## Pull requests

Include the problem and solution, database/environment/migration/security implications, UI evidence for meaningful visual changes, validation performed, and any checks that could not run. Avoid unrelated formatting or generated-file churn.
