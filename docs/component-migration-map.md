# Component Migration Map

| Old path                          | Canonical path                           | Status      | Compatibility                                      | Notes                                                |
| --------------------------------- | ---------------------------------------- | ----------- | -------------------------------------------------- | ---------------------------------------------------- |
| `components/theme-provider.tsx`   | `components/providers/ThemeProvider.tsx` | migrated    | root file re-exports canonical provider            | Mounted via `AppProviders` in `app/layout.tsx`.      |
| `components/theme-toggle.tsx`     | `components/shell/ThemeToggle.tsx`       | migrated    | root file re-exports shell toggle                  | Keep until consumers updated.                        |
| `components/charts/*`             | `components/chart/*`                     | in-progress | `components/chart/index.ts` re-exports `../charts` | Full file move deferred; fix exports/contracts next. |
| `components/layout/app-shell.tsx` | `components/shell/AppShell.tsx`          | planned     | shell barrel currently re-exports layout           | Move implementation after shell API stabilizes.      |
| `components/shared/*`             | `components/common/*`                    | in-progress | bidirectional re-exports for key helpers           | Consolidate helpers and remove duplication.          |
| `components/ui/data-table.tsx`    | `components/data/DataTable.tsx`          | deprecated  | keep file, mark deprecated in inventory            | Migrate consumers to canonical data table contract.  |
| `components/ui/widget-grid.tsx`   | `components/widgets/WidgetGrid.tsx`      | planned     | `components/widgets/index.ts` re-exports           | Move with widget platform normalization.             |
| `lib/widget-metadata.ts`          | `lib/widgets/registry.ts`                | planned     | `lib/widgets/registry.ts` re-exports metadata      | Replace with typed registry in T14.                  |
