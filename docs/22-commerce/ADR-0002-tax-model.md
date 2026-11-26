# ADR-0002: Tax model

- Status: Accepted
- Date: 2026-11-26
- Related paths: `lib/server/commerce/tax/resolver.ts`, `lib/server/commerce/tax/rates.ts`, `app/dashboard/commerce/settings/tax/page.tsx`

## Context

Who registers for and remits sales tax in each jurisdiction? Options: marketplace facilitator (franchisor registers everywhere), seller-of-record (each franchisee registers per jurisdiction), or hybrid.

| Option | Registration | Tool |
|---|---|---|
| Marketplace facilitator | Franchisor registers everywhere | Stripe Tax with franchisor as taxpayer |
| Seller-of-record | Each franchisee registers per jurisdiction | Stripe Tax with franchisee accounts |
| Hybrid | Franchisor registers in some states, franchisees in others | Split routing in the tax resolver |

## Decision

**Seller-of-record, matching ADR-0001.** The franchisee is responsible for their own tax registrations. The franchisor provides a dashboard showing registration status per territory.

## Consequences

- `lib/server/commerce/tax/resolver.ts` must return a tax result per franchisee registration, not one global rate.
- Tax registration status is tracked per territory in the franchise-admin settings UI.
