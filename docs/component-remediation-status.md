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
