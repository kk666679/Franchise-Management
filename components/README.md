# Components

Reusable UI building blocks for the Franchise Management System.

Every component **must** be registered in `docs/component-inventory.md` in the same PR that adds or changes it.

## Folder map

| Folder             | Purpose                                                    | May import from                                               |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------------------- |
| `ui/`              | Token-driven primitives (Button, Input, Dialog...)         | `lib/utils`, `hooks`, UI primitives only                      |
| `layout/`          | Structural primitives (Stack, Grid, Container, PageHeader) | `ui/`, `lib/utils`                                            |
| `shell/`           | App chrome (AppShell, Sidebar, TopBar, CommandPalette)     | `ui/`, `layout/`, `auth/`, `providers/`, `lib/navigation`     |
| `providers/`       | Client providers mounted in root layout                    | `lib/client`, `ui/`, framework providers                      |
| `feedback/`        | Loading/empty/error/confirm/async boundaries               | `ui/`, `layout/`                                              |
| `form/`            | RHF+Zod form composition                                   | `ui/`, `feedback/`, `lib/validation`                          |
| `data/`            | Tables, search, filters, pagination, URL state             | `ui/`, `form/`, `feedback/`                                   |
| `chart/`           | Chart wrappers and visualization primitives                | `ui/`, `feedback/`                                            |
| `widgets/`         | Dashboard widget frames and reusable widgets               | `ui/`, `data/`, `chart/`, `feedback/`                         |
| `auth/`            | Permission gates, role/scope badges                        | `ui/`, `lib/rbac`, `lib/server/auth` (server components only) |
| `permissions/`     | Permission management/admin UI                             | `ui/`, `auth/`, `lib/rbac`                                    |
| `common/`          | Cross-cutting display helpers                              | `ui/`, `lib/utils`                                            |
| `domain/<module>/` | Feature-composed domain components                         | all of the above; `lib/server/**` only in server components   |

Legacy/compatibility directories (`charts/`, `shared/`, parts of `layout/`, root theme files) remain until migrated; see `docs/component-migration-map.md`.

## File anatomy

Preferred shape:

```text
components/<category>/<ComponentName>/
├── index.ts                 # public export
├── <ComponentName>.tsx      # implementation
├── <ComponentName>.types.ts # props/types (when non-trivial)
└── <ComponentName>.test.tsx # unit + a11y
```

Small primitives may be single-file components with co-located tests.

## Naming rules

- PascalCase component names; file names follow repo convention (`kebab-case.tsx` for primitives, `PascalCase.tsx` for composed/domain components) but must be consistent within a folder.
- Types files end in `.types.ts`; do not use `any` in public props.
- Tests end in `.test.tsx` / `.test.ts`; stories end in `.stories.tsx`.
- Domain barrels are scoped to `components/domain/<module>/index.ts`.

## Server vs client

- Components are server-compatible by default.
- Add `'use client'` only when using state, effects, refs, browser APIs, or client-only libraries.
- **`'use client'` components must not import `lib/server/**`.**
- Data loading belongs in server components/routes/actions; client components receive props or call server actions/API routes.

## Import boundaries

| From                          | May import                                                     |
| ----------------------------- | -------------------------------------------------------------- |
| `ui/`                         | `lib/utils`, `hooks`, tokens/primitives                        |
| `layout/`, `feedback/`        | `ui/`, `lib/utils`                                             |
| `form/`                       | `ui/`, `feedback/`, `lib/validation`                           |
| `data/`, `chart/`, `widgets/` | above + each other where documented                            |
| `shell/`                      | `ui/`, `layout/`, `auth/`, `providers/`, navigation/config     |
| `auth/`                       | `ui/`, `lib/rbac`, `lib/server/auth` in server components only |
| `domain/*`                    | anything above; `lib/server/**` in server components only      |

Violations are enforced by ESLint and CI.

## Barrel policy

- Category folders may have scoped `index.ts` barrels.
- **No top-level `components/index.ts`.**
- Domain folders may export only their own public surface.
- Do not export tests from production barrels.

## Testing requirements

| Category                   | Required tests                             |
| -------------------------- | ------------------------------------------ |
| `ui/`                      | unit + a11y; visual/snapshot when stable   |
| `layout/`, `feedback/`     | unit + a11y                                |
| `form/`, `data/`, `chart/` | unit + a11y + integration where stateful   |
| `widgets/`                 | unit + a11y + permission/state tests       |
| `shell/`                   | unit + a11y + Playwright smoke             |
| `domain/*`                 | unit + integration + critical E2E per flow |

## Definition of stable

- [ ] Inventory entry exists and is current
- [ ] Public props typed (no `any`)
- [ ] Required tests passing
- [ ] A11y: keyboard-operable, ARIA correct, contrast >= 4.5:1
- [ ] At least one real consumer outside tests
- [ ] No forbidden boundary violations
