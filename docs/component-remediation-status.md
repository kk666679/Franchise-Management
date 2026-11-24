# P0 Remediation Pass (in progress)

This pass started implementing the remediation plan on 2026-11-23.

## Completed in this pass

- Added governance artifacts: `components/README.md`, `docs/component-inventory.md`, `docs/component-migration-map.md`.
- Added inventory audit: `scripts/inventory-audit.ts`, `package.json` scripts `inventory:audit` and `check`.
- Strengthened ESLint: custom `fms/no-lib-server-in-client` rule, root components barrel import ban, UI/chart import boundary restrictions.
- Added canonical scaffolding/compat paths: `components/providers/*`, `components/shell/*` (ThemeToggle/SkipToContent/barrel), `components/widgets/index.ts`, `components/chart/index.ts`, `lib/widgets/registry.ts`.
- Root layout now mounts `components/providers/AppProviders.tsx`; legacy `components/theme-provider.tsx` and `components/theme-toggle.tsx` re-export canonical implementations.
- Replaced stubby `components/auth/PermissionGate.tsx` render-key behavior with a typed, non-enforcing compatibility stub (security note included) and added `components/auth/index.ts`.
- Removed test export from `components/charts/index.ts`.

## Remaining (next passes)

- Run/repair `pnpm inventory:audit`, `pnpm lint`, `pnpm typecheck`, `pnpm test`; update CI workflow to include inventory audit.
- Complete structural moves with compatibility shims (chart/charts, shell/layout, shared/common, ui widget/data-table legacy).
- Implement missing UI/layout/shell/feedback/form/data/chart/widget contracts per plan.
- Implement real server-enforced auth (`RequirePermission`, canonical permission context) and reconcile RBAC permission codes.
- Domain maturity: add tests/a11y/contracts per domain; wire schema-blocked domains only after Phase 9 schema readiness.
- Remove temporary exemptions/baselines and bring CI to green.

## Dashboard domain integration audit (2026-11-25)

### Corrections made

- Finance overview and invoice routes now share the domain `InvoiceTable` view model, preserve `PARTIALLY_PAID`, use the organization currency, and show amounts paid. Invoice detail now uses `InvoiceDetail`.
- Locations now uses the domain `BranchTable`, retaining location code, brand, franchisee, and active status.
- Agreements now uses `ContractTable`; persisted agreement statuses are explicitly mapped to lifecycle badge statuses, including `EXPIRED`.
- Removed references to the undefined `PageAccessNotice` component from finance and agreement routes.
- The notifications, workflows, and reporting pages no longer claim that their domain components are integrated when their rendered branch was unreachable and no corresponding Prisma models exist.
- No operational seed records were added. `prisma/seed.ts` only seeds an organization when real organization values are explicitly configured.

### Still blocked / not claimed as integrated

- Inventory has a persisted product catalog, but stock levels, stock movements, and purchase orders have no Prisma models or populated source records.
- HR, compliance, notifications, approvals/workflows, and saved/scheduled reports have no persistence models in the current schema. Their view-model components alone cannot provide functional data flows.
- AI-assisted approval recommendations are not wired. The selected behavior is recommendation preparation followed by explicit reviewer confirmation; implementing it requires persisted approval/evidence records and a server-side AI path grounded in those records.
- No source records were supplied for seeding these domains. Keep seed behavior empty rather than create synthetic business data.
- Existing organization lookup and authorization-context placeholders remain a separate cross-cutting blocker; do not treat empty/mock actor contexts as production authorization.
