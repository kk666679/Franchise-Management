# Frontend Expansion Plan — Pages & Components

> Brainstorm / planning artifact. Maps the Enterprise Franchise Management brief onto
> the ACTUAL repository state. Sequence is gated by data-model readiness (Prisma schema)
> and the permission catalog in `lib/rbac.ts`. Owner: cline (components/app/lib scope).

## 1. Current state (verified)

- Routes that exist: `/`, `/login`, `/dashboard`.
- Shell: `components/layout/app-shell.tsx` (now wired into `/dashboard`), `page-container`, `page-header`, `app-header`.
- Nav: `lib/navigation.ts` contract → `components/dashboard/dashboard-nav.tsx` (permission-filtered, `live` vs `planned`).
- Data model in `prisma/schema.prisma`: Organization, User, Membership, FranchiseBrand,
  Franchisee, FranchiseLocation, FranchiseApplication, FranchiseAgreement, FeeSchedule,
  Invoice, Payment, Document, SupportTicket, AuditLog.
- Permission catalog: `PERMISSIONS.*` (franchise, brand, branch, finance, sales, inventory,
  procurement, hr, operations, compliance, knowledge, document, user, rbac, audit, settings, ai).

**Key insight:** build pages for entities that ALREADY have schema + service support first.
Inventory / procurement / HR / compliance / sales-POS have permissions defined but NO schema
yet — those pages are blocked on Phase 9 (data platform) work owned by the data layer.

## 2. Proposed route tree (grouped, with readiness + permission)

Legend: ✅ = schema exists (buildable now) · ⛔ = needs schema/service first · perm = required PermissionCode

### Franchise network (Phase 10) — ✅ ready

- `/dashboard/franchises` — franchisee list/table — `franchise:read`
- `/dashboard/franchises/[id]` — profile, ownership, agreements, timeline — `franchise:read`
- `/dashboard/franchises/[id]/edit` — `franchise:write`
- `/dashboard/applications` — application queue/table — `franchise:application:review`
- `/dashboard/applications/[id]` — review + approve/reject workflow — `franchise:application:review`
- `/dashboard/agreements` — agreements list — `franchise:agreement:manage`
- `/dashboard/agreements/[id]` — renewal/termination — `franchise:agreement:manage`

### Organization & hierarchy (Phase 10) — ✅ partial (Brand exists; Region/Area need schema)

- `/dashboard/organization` — org profile — `org:read`
- `/dashboard/brands` + `/dashboard/brands/[id]` — `brand:read`
- `/dashboard/locations` + `/dashboard/locations/[id]` — branch profile, manager, hours, status — `branch:read`
- ⛔ `/dashboard/regions`, `/dashboard/areas` — need Region/Area models

### Finance (Phase 11) — ✅ ready

- `/dashboard/finance` — summary (receivables, collected, outstanding) — `finance:read`
- `/dashboard/finance/invoices` + `[id]` — `finance:read` / `finance:invoice:write`
- `/dashboard/finance/payments` — payment ledger — `finance:read` / `finance:payment:write`
- `/dashboard/finance/royalties` — royalty assessment (authoritative server calc) — `finance:royalty:calculate`
- `/dashboard/finance/fee-schedules` — FeeSchedule admin — `finance:read`

### Documents (Phase 14) — ✅ ready

- `/dashboard/documents` — list/cards, categories, search — `document:read`
- `/dashboard/documents/[id]` — preview, version history, signed download — `document:read`
- upload UI — `document:upload` (server-side storage + validation mandatory)

### Support & audit (Phase 15) — ✅ ready

- `/dashboard/support` + `/dashboard/support/[id]` — SupportTicket queue/detail (add `support:read`)
- `/dashboard/audit` — AuditLog timeline, entity/user activity — `audit:read`

### Settings & access (Phase 8) — ✅ partial

- `/dashboard/settings` — org settings — `settings:manage`
- `/dashboard/settings/users` — member admin — `user:manage`
- `/dashboard/settings/roles` — role & permission matrix (reuse `components/permissions/*`) — `rbac:role:manage`

### Deferred (need Phase 9 schema) — ⛔

- Sales/POS (`sales:*`), Inventory (`inventory:*`), Procurement (`procurement:*`),
  HR (`hr:*`), Operations/Compliance/Inspections (`operations:*`, `compliance:*`).

## 3. Component groups to build

### Shared platform (Phases 4–6) — unblocks every domain page

- **Command palette / global search** (`cmdk` + `components/ui/command.tsx` already installed):
  route + entity search, recent + pinned destinations, keyboard shortcut. Feeds from `lib/navigation.ts`.
- **Context selectors**: organization / brand / location pickers (only levels the schema supports).
  Persist selection via URL param (shareable) — not hidden client state.
- **Form field library** (Phase 5): text/email/number/currency/percentage/date/date-range/select/
  combobox/multiselect/checkbox/switch/address/phone/search; field arrays; multi-step; unsaved-change
  guard; server-action integration (react-hook-form + zod installed).
- **Data-table upgrades** (Phase 6): server-side pagination/sort/filter, column visibility/order,
  row selection + bulk actions, URL-synced filters, saved views, responsive card fallback.
- **Feedback states**: empty/loading/skeleton/error/success/access-denied (extend `components/feedback`).
- **Notification center** (Phase 14): bell, list, item states, preferences.

### Domain component groups (Phases 10–15)

- Franchise: profile header, status badge, application review panel, agreement timeline, ownership tree.
- Finance: invoice table, payment ledger, royalty summary, outstanding-balance card, reconciliation view.
- Documents: card/list, category filter, preview, version history, upload dropzone (validated server-side).
- Audit: timeline, change-diff summary, actor/entity filters.
- Approvals/workflow: queue, step tracker, approve/reject with confirmation + audit.

### Dashboard platform (Phase 7)

- Widget registry + typed metadata, 12-col grid, edit mode (add/remove/resize/reorder/save/reset),
  per-user persisted layouts, role templates, global filters with propagation, widget-level
  loading/error/stale states. Replace the current static metric cards.

### AI workspace (Phase 16)

- Server-side AI gateway + tool contracts (schema-validated, tenant-scoped, auditable),
  chat workspace using existing `components/ai-elements/*`, citations, human-approval checkpoints.
  No autonomous sensitive actions.

## 4. Sequencing (critical path)

1. Command palette + context selectors + form/table upgrades (shared platform).
2. Franchise + Applications pages (schema ready, highest business value).
3. Finance pages (invoices/payments/royalties).
4. Documents + Support + Audit.
5. Settings/Users/Roles admin.
6. Dashboard widget engine (replace static cards).
7. Deferred domains once Phase 9 schema lands.

## 5. Guardrails (every page)

- Server Components by default; `"use client"` only for interactivity. Pass server-rendered JSX
  through RSC-safe slots (never raw icon/function props across the server→client boundary).
- Permission-aware nav is presentation only; every route enforces `assertPermission` +
  `assertOrganizationAccess` at its server boundary.
- No dead links: unbuilt routes render disabled with a "Soon" marker (see `dashboard-nav.tsx`).
- Real data only: no fixtures disguised as persisted records; dev seed data clearly labeled.
- Money/date formatting must use a locale+currency contract (org has `currency`; a `locale`
  field is still needed — blocked on a Phase 1 decision).
- Each new page ships with a unit/integration test under `tests/` (Vitest + RTL now configured)
