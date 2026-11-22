# Phase 11 Audit and Boundary

## Current repository evidence

The application is a Next.js App Router application using Prisma with PostgreSQL. The current route surface includes the landing page, login, dashboard, franchisees, applications, and AI workspace. There is no implemented finance, sales, or POS route.

The existing Prisma schema contains finance-adjacent models:

- `Organization` with currency and tenant ownership.
- `Franchisee`, `FranchiseAgreement`, and `FranchiseLocation`.
- `FeeSchedule`.
- `Invoice` and `InvoiceLine`.
- `Payment`.
- `AuditLog`.

The schema now contains the accounting-foundation models `FinancialAccount`, `FinancialPeriod`, `JournalEntry`, `JournalLine`, `PaymentAllocation`, `BankAccount`, and `BankTransaction`, plus persisted sales/POS models for customers, products, quotations, orders, sales invoices, promotions, sales, split payments, terminals, cashier shifts, returns, refunds, and cash movements.

## Phase 11 implementation boundary

This increment uses the existing `Invoice`, `InvoiceLine`, `Payment`, `FeeSchedule`, `Organization`, and `Franchisee` contracts. It adds accounting-foundation persistence and service operations for chart-of-accounts management, period-scoped double-entry journal posting, trial-balance aggregation, and idempotent payment allocation. It also adds sales/POS service operations for product search, decimal-safe sale calculation, atomic sale persistence, split-payment validation, optional journal posting, and idempotent refunds. Services enforce organization isolation, open-period checks, active-account checks, open-shift checks, and the existing finance permissions at the server boundary.

Customer/product CRUD screens, quotation/order/invoice workflows, tax configuration screens, financial reports beyond trial balance, bank import/matching, and cash-drawer UI remain outstanding. They must not be represented by mock records or inferred from invoice totals.

The dashboard now includes persisted sales-today KPIs and recent sales, and the POS screen at `/dashboard/pos` provides product search, cart calculation, split payments, sale submission, and printable receipt output through the persisted APIs. `/dashboard/preview` embeds the implemented dashboard/POS routes through `components/ai-elements/web-preview.tsx`.

## Parallel-phase dependencies

- Phase 7: dashboard/widget layout remains an external dependency. `lib/use-widget-layout.ts` is not modified.
- Phase 8: existing session, membership role, permission, and organization identifiers are reused. No new tenancy or authorization system is introduced.
- Phase 9: Prisma/database migration conventions are not yet represented by a migration directory in this checkout. `prisma migrate dev --create-only` was attempted for the accounting foundation but could not connect to the configured PostgreSQL server at `localhost:5432` (`P1001`), so no fabricated or partial migration was committed.
- Phase 10: existing organization, brand, franchisee, and location models are treated as frozen inputs.

## Security and integrity assumptions

- Every finance query is scoped by `organizationId` from the verified session.
- Finance pages require the existing `finance:read` permission.
- Money is stored by Prisma as decimal database values; display conversion occurs only at the presentation boundary.
- Journal posting and payment allocation use Prisma transactions and idempotency keys. Journal entries are posted rather than edited, with reversal status available for subsequent reversal workflows.
- The existing audit-log integration and reversal workflow still require completion before the financial foundation can be considered production-complete.
