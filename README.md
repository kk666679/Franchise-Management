# Franchise Management

Franchise Management is a Next.js application for managing franchise organizations, brands, franchisees, locations, applications, agreements, invoicing, payments, documents, support tickets, and audit history.

The repository is currently an early-stage foundation. The implemented application surface includes a landing page, sign-in flow, and authenticated dashboard. The Prisma schema and authorization catalog define the broader product domain that is being built out.

## Technology

- Next.js 16 with React 19 and TypeScript 7
- Node.js `>=22.23.4`
- PostgreSQL with Prisma 7
- Tailwind CSS 4 and shadcn/ui-style components
- Stateless JWT sessions in an `httpOnly` cookie
- bcrypt password hashing and server-side permission checks

## Local setup

Prerequisites: Node.js `>=22.23.4`, npm, and PostgreSQL.

```bash
npm ci
```

Copy `.env.example` to `.env.local`, then set `DATABASE_URL` and a random `AUTH_SECRET` of at least 16 characters. Never commit credentials.

```bash
npm run prisma:validate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Open <http://localhost:3000>. The current seed script does not insert default users or business data.

Optional integrations are documented in [.env.example](./.env.example): Redis, S3-compatible object storage, SMTP, AI providers, and OpenTelemetry.

## Useful commands

| Command                         | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| `npm run dev`                   | Start the development server                         |
| `npm run build`                 | Create a production build                            |
| `npm run start`                 | Serve a production build                             |
| `npm run typecheck`             | Run TypeScript without emitting files                |
| `npm run format:check`          | Check Prettier formatting                            |
| `npm run prisma:validate`       | Validate the Prisma schema                           |
| `npm run prisma:migrate:deploy` | Apply existing migrations in deployment environments |
| `npm run prisma:studio`         | Open Prisma Studio                                   |

There is currently no `npm test` script in `package.json`; add and document one when the test suite is formally wired into the project.

## Repository layout

- `app/` — Next.js routes and server actions
- `components/` — reusable UI, layout, dashboard, auth, and permission components
- `lib/` — environment validation, Prisma access, navigation, RBAC, and server services
- `prisma/` — schema, migrations, and seed entry point
- `public/` — static assets

## Security and contribution

Read [SECURITY.md](./SECURITY.md) before reporting a vulnerability and [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a change. Community participation is governed by [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

This project is released under the MIT License. See [LICENSE](./LICENSE).
