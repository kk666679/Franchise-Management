# Component Implementation Checklist

Status legend: `Not started` | `In progress` | `Implemented` | `Tested` | `Reviewed` | `Blocked`

## Phase 0 — Audit

| Component/Area           | Path                                         | Responsibility                | Server/Client | Public props | Dependencies    | A11y | Unit | Storybook | Docs | Status      |
| ------------------------ | -------------------------------------------- | ----------------------------- | ------------- | ------------ | --------------- | ---- | ---- | --------- | ---- | ----------- |
| Architecture audit       | `docs/component-architecture-audit.md`       | Repository audit, risks, plan | N/A           | N/A          | repo inspection | N/A  | N/A  | N/A       | Yes  | Implemented |
| Implementation checklist | `docs/component-implementation-checklist.md` | Track component delivery      | N/A           | N/A          | audit           | N/A  | N/A  | N/A       | Yes  | Implemented |

## Phase 1 — Design System / Primitives (planned)

| Component/Area      | Path                    | Responsibility                     | Server/Client | Public props  | Dependencies             | A11y          | Unit | Storybook | Docs    | Status                          |
| ------------------- | ----------------------- | ---------------------------------- | ------------- | ------------- | ------------------------ | ------------- | ---- | --------- | ------- | ------------------------------- |
| Semantic tokens     | `app/globals.css`       | Enterprise design tokens/themes    | N/A           | N/A           | Tailwind v4, next-themes | Review needed | N/A  | N/A       | Pending | Not started                     |
| UI primitives audit | `components/ui/*`       | Normalize shadcn primitives        | Mixed         | per component | radix/shadcn             | Review needed | No   | No        | Pending | Not started                     |
| Feedback primitives | `components/feedback/*` | Loading/empty/error/confirm states | Mixed         | typed props   | ui/shared                | Review needed | No   | No        | Pending | In progress (existing baseline) |
| Shared display      | `components/shared/*`   | Locale-aware display utilities     | Server/Client | typed props   | Intl                     | Review needed | No   | No        | Pending | In progress (existing baseline) |

## Phase 2 — App Shell / Navigation (planned)

| Component/Area                | Path                                         | Responsibility              | Server/Client | Public props            | Dependencies    | A11y          | Unit | Storybook | Docs    | Status                       |
| ----------------------------- | -------------------------------------------- | --------------------------- | ------------- | ----------------------- | --------------- | ------------- | ---- | --------- | ------- | ---------------------------- |
| App shell                     | `components/layout/*`                        | Enterprise shell/navigation | Mixed         | typed nav/context props | ui, permissions | Review needed | No   | No        | Pending | In progress (basic baseline) |
| Command palette/global search | `components/search/*`, `components/layout/*` | Command-first nav/search    | Client        | typed search contracts  | cmdk/ui         | Review needed | No   | No        | Pending | Not started                  |

## Phase 3+ (backlog)

| Group                                          | Path                                             | Status                                                  |
| ---------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| Forms system                                   | `components/forms/*`                             | Not started                                             |
| Data table system                              | `components/data-table/*`                        | In progress (simple baseline, not TanStack v9 contract) |
| Charts                                         | `components/charts/*`                            | In progress (basic baseline)                            |
| Dashboard/widgets                              | `components/dashboard/*`, `components/widgets/*` | In progress (basic baseline)                            |
| Domain components                              | `components/franchise/*` etc.                    | Not started                                             |
| AI enterprise layer                            | `components/ai/*`, `components/ai-elements/*`    | In progress (ai-elements baseline exists)               |
| Permissions/governance                         | `components/permissions/*`, `components/audit/*` | In progress (permissions baseline exists)               |
| Workflows/reports/search/integrations/realtime | corresponding dirs                               | Not started                                             |

## Quality Gates

| Gate          | Command             | Status  | Notes                     |
| ------------- | ------------------- | ------- | ------------------------- |
| Typecheck     | `npm run typecheck` | Not run | Run after Phase 1 batch.  |
| Lint          | `npm run lint`      | Not run | Run after Phase 1 batch.  |
| Unit tests    | TBD (Vitest)        | Blocked | Test stack not installed. |
| E2E           | TBD (Playwright)    | Blocked | Not installed.            |
| Accessibility | TBD (axe)           | Blocked | Not installed.            |
