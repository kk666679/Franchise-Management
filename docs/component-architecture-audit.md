# Phase 0 — Component Architecture Audit

**Project**: Franchise Management System (`next-app@0.0.1`)  
**Audit date**: 2026-11-21  
**Scope**: `components/`, `app/`, `lib/`, design system, tooling, dependencies, and component-platform readiness for the enterprise FMS prompt.

## 1. Repository & Runtime Snapshot

| Area            | Observed                                                          | Notes                                                                           |
| --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Package manager | `npm` (`package-lock.json` present)                               | No pnpm/yarn/bun lockfile.                                                      |
| Framework       | `next@16.4.6`                                                     | App Router; `next.config.ts` minimal.                                           |
| React           | `react@19.3.1`, `react-dom@19.3.1`                                | React 19.3 line installed.                                                      |
| TypeScript      | `typescript@7.0.2` (dev `^7`)                                     | `strict: true`, `noEmit`, `moduleResolution: bundler`, `@/*` alias.             |
| Tailwind        | `tailwindcss@4.3.5`, `@tailwindcss/postcss@^4`                    | Tailwind v4 CSS-first config in `app/globals.css`.                              |
| UI primitives   | `shadcn@4.23.0`, `radix-ui@1.8.1`, `lucide-react@1.77.0`          | `components.json` style `radix-luma`, RSC enabled, aliases to `@/components/*`. |
| Table           | `@tanstack/react-table@9.3.1`                                     | Installed; current reusable table is custom/simple, not TanStack-powered.       |
| Forms           | `react-hook-form@7.92.0`, `@hookform/resolvers@7.0.8`             | Present.                                                                        |
| Validation      | `zod@4.6.7` in `node_modules`, **not declared in `package.json`** | Must be added explicitly; do not rely on transitive install.                    |
| Charts          | `recharts@3.11.0`                                                 | Installed; existing chart components are lightweight custom SVG/div charts.     |
| AI SDK          | `ai@7.0.179`                                                      | Installed; `components/ai-elements/*` already present.                          |
| Theming         | `next-themes@0.4.6`                                               | Dark-first theme provider exists; `D` hotkey toggles theme.                     |
| Animation       | `framer-motion@14.14.0`                                           | Used by theme toggle; respect reduced motion.                                   |
| Testing         | **Missing**: Vitest, RTL, Playwright, axe-core                    | No test scripts/configs; no component tests/stories found.                      |
| Storybook       | **Missing**                                                       | No `.storybook/`, no stories.                                                   |
| Lint/format     | ESLint 10 + `eslint-config-next@16.4.6`, Prettier 3               | Scripts: `lint`, `format`, `typecheck`.                                         |

## 2. Existing Structure (Relevant)

```text
app/
  layout.tsx                # Root layout, ThemeProvider, fonts
  page.tsx                  # Marketing/home glass page
  dashboard/page.tsx        # Server-rendered executive overview, auth redirect
  login/                    # Login page + actions
  globals.css               # Tailwind v4 + tokens + glass utilities
components/
  ai-elements/              # 40+ AI UI components (existing, client-heavy)
  auth/                     # login-form, password-field
  charts/                   # bar-chart, chart-container, index
  dashboard/                # dashboard-header/nav/metric-card/recent-applications/revenue-chart
  data-table/               # simple client data-table, index
  feedback/                 # empty/error/loading, index
  layout/                   # app-shell/header/page-container/page-header, index
  permissions/              # guard/matrix/role badge/selector/scope/user-role-manager, index
  shared/                   # currency/date/section-header/status-indicator, index
  ui/                       # shadcn/radix-luma primitives
  theme-provider.tsx
  theme-toggle.tsx
lib/
  rbac.ts                   # RoleCode catalog + MembershipRole mapping + permission catalog
  prisma.ts                 # Prisma client
  server/auth/*             # authorization/session/password
  server/dashboard.ts       # Dashboard aggregate query
  server/errors.ts
prisma/schema.prisma        # MembershipRole enum (5 roles) + business models
```

## 3. Existing Reusable Components / Assets

### Reuse as baseline

- `components/ui/*` — shadcn/radix-luma primitives; already styled and used. Extend carefully, avoid breaking existing imports.
- `components/layout/AppShell`, `AppHeader`, `PageContainer`, `PageHeader` — basic shell; needs enterprise nav/search/command/context selectors/permission-aware rendering.
- `components/data-table/DataTable` — functional simple table; **not** TanStack Table v9, no server-state contract, no URL sync, no column pinning/ordering/resizing/saved views/virtualization/export contract. Needs replacement by a typed generic TanStack system while preserving migration path.
- `components/feedback/*` — usable primitives; need access-denied/not-found/skeleton/confirmation/unsaved-change/progress patterns.
- `components/charts/*` — basic; prompt allows Recharts or established accessible chart lib. Recharts is installed; current charts are custom and limited.
- `components/permissions/*` — good starting point; align with backend authorization and typed contracts.
- `components/shared/*` — small display utilities; need locale/timezone/currency-aware hardening.
- `components/ai-elements/*` — large existing set; audit for client boundaries, security, source/citation/confidence/human-approval contracts before reuse.
- `lib/rbac.ts` — strong permission catalog; source of truth candidate for UI permission contracts, but must remain compatible with persisted `MembershipRole`.

### Gaps / Risks in existing components

- `AppHeader` search pushes to `/dashboard?search=...` without real search system; notifications button nonfunctional.
- `DashboardHeader` has "New application" button with no action.
- `DashboardNav` is hardcoded and not permission-aware.
- `RecentApplications` uses hardcoded locale/status formatting and `—`/text inconsistencies.
- `RevenueChart`/`BarChart` are custom, not Recharts; accessibility/legends/tooltips/theme semantics limited.
- `DataTable` is client-only, client-sorted/paginated over passed data, `min-w-[42rem]` mobile strategy only horizontal scroll.
- UI primitives import `cn` from `"cn"` package directly; `lib/utils.ts` exports from `"cn"`. Inconsistent style; standardize on `@/lib/utils` in new code.
- Some files contain mojibake/encoding artifacts in rendered strings/em dash in source? Audit during edits.
- `ThemeProvider` forces `defaultTheme="dark"` and has global `D` hotkey; keep behavior unless product requires change, but document.

## 4. Missing Dependencies / Tooling

| Need                      | Status                                             | Action                                                                     |
| ------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| `zod` explicit dependency | Missing from package.json, present in node_modules | Add explicit dependency compatible with installed v4/resolvers.            |
| Unit tests                | Missing                                            | Add Vitest + React Testing Library + jsdom/happy-dom + test setup.         |
| E2E                       | Missing                                            | Add Playwright config and critical flows.                                  |
| Accessibility automation  | Missing                                            | Add axe-core integration (vitest-axe or playwright axe).                   |
| Storybook                 | Missing                                            | Optional per prompt; add only if time/budget allows without destabilizing. |
| Visual/state docs         | Missing                                            | Add component docs/checklist regardless of Storybook.                      |

## 5. Incompatible / High-Risk Areas

- **Directory convention mismatch**: prompt requests `src/components/`; project uses root `components/` with aliases. **Decision:** keep existing root `components/` convention, map requested `src/components/*` groups into `components/*` to avoid breaking aliases/imports/config.
- **Tailwind v4 token system**: globals already define custom OKLCH tokens and glass utilities. Do not replace with incompatible shadcn defaults; extend semantic tokens.
- **TanStack Table v9**: installed major is v9; API may differ from v8 mental model. Verify docs before implementing.
- **Next 16 / React 19.3**: follow current docs; avoid legacy patterns.
- **AI SDK v7 / ai-elements**: large prebuilt surface; avoid destructive rewrites. Wrap/adapt for enterprise trust/governance requirements.
- **Auth/RBAC model split**: Prisma `MembershipRole` (5) vs `RoleCode` catalog (13). UI must present accurate effective permissions; do not fake DB roles.
- **No test harness**: quality gates cannot be fully satisfied until test tooling is added.
- **Large uncommitted worktree**: many modified/added files and `.autoclaw/*` changes. Do not revert unrelated changes; avoid touching `.autoclaw`.

## 6. Proposed Component Structure (Project-Adapted)

Target root: `components/` (project convention), preserving existing files where useful.

```text
components/
  ui/                     # primitives (existing, extend)
  layout/                 # shell/nav/header/breadcrumb/footer/command/search
  dashboard/              # dashboard engine, widgets, templates, filters, edit mode
  data-table/             # TanStack v9 generic table system
  forms/                  # RHF+Zod fields, form shell, wizard, upload, validation
  feedback/               # loading/empty/error/confirm/progress/status/access-denied
  ai/                     # enterprise AI workspace wrappers/contracts (reuse ai-elements)
  charts/                 # Recharts-based accessible chart primitives
  widgets/                # reusable widget registry/cards/wrappers
  franchise/
  organization/
  branch/
  finance/
  sales/
  inventory/
  procurement/
  human-resources/
  operations/
  compliance/
  documents/
  notifications/
  permissions/
  shared/
  workflows/
  approvals/
  reports/
  search/
  audit/
  integrations/
  realtime/
  providers/              # client providers where needed
  hooks/                  # reusable client hooks (or hooks/ at root; prefer existing hooks/)
  types/                  # shared component contracts
  utils/                  # presentation-only utilities
```

**Compatibility rule**: keep existing `components/ai-elements/` and `components/auth/`; add `components/ai/` as enterprise contract layer rather than destructive rename.

## 7. Design Token Strategy

- **Source of truth**: `app/globals.css` CSS variables + Tailwind v4 `@theme inline` mappings.
- **Keep**: existing OKLCH dark-first palette, glass utilities, radius scale, chart/sidebar tokens.
- **Add semantic tokens**: success/warning/info, elevated/muted surfaces, focus ring, z-index/elevation scale, spacing/layout tokens, typography semantic classes/utilities, data-visualization categorical/semantic colors.
- **Rules**: no arbitrary hex in components; use Tailwind semantic classes/CSS vars; ensure contrast in dark/light; chart colors theme-aware.
- **Motion**: use existing transitions/animations, add reduced-motion-safe utilities; avoid decorative motion.
- **Density/readability**: enterprise compact defaults, 12-column dashboard grid, mobile-first responsive behavior.

## 8. Implementation Plan (Phased)

| Phase | Goal                                | Exit Criteria                                                                                                    |
| ----- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 0     | Audit, plan, checklist, conventions | Audit doc + checklist created; risks identified.                                                                 |
| 1     | Design system & UI primitives       | Tokens extended; core primitives/forms/feedback/table shells consistent; typecheck/lint pass.                    |
| 2     | App shell/navigation                | Responsive shell, sidebar/header/breadcrumb/command/search/context selectors, permission-aware nav presentation. |
| 3     | Forms & feedback                    | RHF+Zod field system, form states, uploads, confirm/unsaved changes, accessible errors.                          |
| 4     | Data tables & charts                | Generic TanStack Table v9, server-state contracts, Recharts wrappers, accessible states.                         |
| 5     | Dashboard & widgets                 | Modular widget registry, layout persistence contract, role templates, filters, edit mode, skeletons.             |
| 6     | Business domains                    | Domain component groups with typed DTO contracts, no data/auth/business logic leakage.                           |
| 7     | AI interfaces                       | AI workspace, streaming/tool/source/citation/approval UI; no credentials/direct auth in components.              |
| 8     | Permissions & governance            | Guards, role/access UI, audit presentation, sensitive confirmations.                                             |
| 9     | Enterprise capabilities             | Workflows, approvals, reports, search, integrations, realtime status.                                            |
| 10    | Verification/cleanup                | Tests, a11y, responsive, perf review, docs, checklist, final report.                                             |

## 9. Quality Gate Baseline (Current)

| Check                    | Status                     | Evidence                                |
| ------------------------ | -------------------------- | --------------------------------------- |
| `npm run typecheck`      | Not run in this audit pass | To run after each implementation phase. |
| `npm run lint`           | Not run in this audit pass | To run after each implementation phase. |
| Unit tests               | Blocked                    | No test runner installed/configured.    |
| E2E tests                | Blocked                    | No Playwright installed/configured.     |
| Accessibility automation | Blocked                    | No axe tooling installed/configured.    |
| Storybook                | Blocked                    | Not configured.                         |

## 10. Immediate Next Actions (Phase 1 start)

1. Add missing explicit deps for validation/testing where justified (`zod` explicit; test stack in controlled step).
2. Extend semantic design tokens in `app/globals.css` without breaking existing theme.
3. Create component contract/types foundation (`components/types`, `components/utils`, `components/hooks` or root `hooks` alignment).
4. Establish standard component documentation/checklist files.
5. Implement/normalize core primitives and feedback states needed by all later phases.
6. Run typecheck/lint after every coherent batch.

## 11. Constraints / Non-Negotiables

- Do not touch `.autoclaw/` artifacts; they are unrelated dirty worktree files.
- Do not claim tests passed unless executed.
- Do not put Prisma/DB/auth secrets/provider credentials in components.
- Do not use hidden UI as authorization.
- Do not generate decorative nonfunctional controls.
- Keep root `components/` convention; do not create parallel `src/components` without migration plan.
