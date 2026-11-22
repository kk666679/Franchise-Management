# Phase 6-9 Implementation Plan

## Phase 6: Data tables, search and charts

### 6.1 Data Table Component

- Server-side pagination, sorting, and filtering
- Column visibility management and persistence per user
- Row selection + bulk actions
- URL-synced filters (shareable state)
- Responsive card fallback view
- Empty/loading/skeleton/error states

**Files to create:**

- `components/ui/data-table.tsx` - main data table component with all features
- `components/ui/use-data-table.ts` - hook for table state management

### 6.2 Command Palette / Global Search

- `cmdk` (command menu) integration - already installed
- Route + entity search with recent + pinned destinations
- Keyboard shortcut support (Cmd+K / Ctrl+K)
- Feeds from `lib/navigation.ts`
- Persist recent searches in user preferences

**Files to create:**

- `components/ui/command.tsx` - command palette component
- `lib/use-command-palette.ts` - search logic

### 6.3 Context Selectors

- Organization picker - persists via URL param (shareable)
- Brand picker - only levels schema supports
- Location/picker - branch/outlet selection

**Files to create:**

- `components/ui/organization-selector.tsx`
- `components/ui/brand-selector.tsx`

### 6.4 Charts (extension)

- Bar chart - already exists at `components/charts/bar-chart.tsx`
- Line chart - new for trends
- Donut chart - for franchise revenue breakdown
- Responsive + accessible

**Files to enhance:**

- `components/charts/bar-chart.tsx` - add props types, responsive container
- `components/charts/line-chart.tsx` - new file
- `components/charts/donut-chart.tsx` - new file

## Phase 7: Modular dashboard and widget platform

### 7.1 Widget Registry

- Typed metadata for each widget kind
- 12-column grid layout
- Edit mode: add/remove/resize/reorder/save/reset
- Per-user persisted layouts
- Role templates (admin vs. viewer vs. manager)

### 7.2 Dashboard Page Framework

- `/dashboard` page using RSC pattern
- Widget grid with drag-and-drop
- Per-user layout persistence (using `localStorage` or `cookies`)
- Global filters propagation to all widgets
- Widget-level loading/error/stale states

**Files to create:**

- `app/dashboard/page.tsx` - widget grid container (enhanced from current dashboard)
- `lib/use-widget-layout.ts` - layout state hook
- `lib/widget-metadata.ts` - typed widget registry

### 7.3 Layout Persistence

- Serialize/deserialize layout state
- Versioned layouts (reset to default)
- Role-based template selection

## Phase 8: Identity, tenancy, permissions and audit

### 8.1 Permission System Enhancement

- Fine-grained permission catalog in `lib/rbac.ts` (already exists, extend)
- Server-side `assertPermission` + `assertOrganizationAccess` helpers
- Client-side UI disabled (not a substitute for server protection)
- Permission-based route protection

**Files to enhance:**

- `lib/rbac.ts` - extend permission definitions, add role hierarchies
- `lib/server/auth/authorization.ts` - add permission checks

### 8.2 Audit Logging

- AuditLog timeline visualization
- Entity/user change tracking
- Filter by actor, entity type, date range
- Export functionality

**Files to create:**

- `components/ui/audit-timeline.tsx` - change history view
- `lib/server/audit.ts` - audit log API routes

### 8.3 Tenancy & Organization

- Organization switcher in header
- Multi-org data isolation (RLS in Prisma or org_id filtering)
- Org settings management

## Phase 9: Backend, database and service contracts

### 9.1 Prisma Output Migration

- Migrate from `prisma-client-js` generator to `prisma-client` + `postgresql` provider
- Update `schema.prisma` if needed
- Regenerate Prisma client
- Update all imports from `prisma-client-js` to `@/lib/prisma`

### 9.2 Service Layer

- Standardized service patterns
- Error handling contracts
- Tenant-scoped data access
- AI gateway tool contracts (schema-validated, tenant-scoped, auditable)

**Files to create/modify:**

- `prisma/schema.prisma` - update generator output
- `lib/prisma.ts` - update client instantiation
- `lib/server/service/` - service layer patterns
- `lib/server/dashboard.ts` - enhance dashboard data services

---

## Critical Path & Dependencies

```
Phase 5 (forms)  →  Phase 6 (data tables/search)  →  Phase 7 (dashboard widgets)
      ↓                              ↓                       ↓
  validation schemas          command palette         dashboard platform
  form components              + context selectors      + widget engine

Phase 8 (permissions/audit)  →  Phase 9 (Prisma migration + services)
```

## Exit Gates per Phase

- **Phase 5 exit:** All form components pass TypeScript, vitest tests (10/10), build passes
- **Phase 6 exit:** Data table with server-side features, command palette functional, context selectors working
- **Phase 7 exit:** Modular dashboard with widget persistence, role templates, global filter propagation
- **Phase 8 exit:** Permission system enhanced, audit logging operational, org switcher functional
- **Phase 9 exit:** Prisma client migrated away from `prisma-client-js`, service layer operational, API contracts defined