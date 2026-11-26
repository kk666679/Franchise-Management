# ADR-0003: Inventory model

- Status: Accepted
- Date: 2026-11-26
- Related paths: `lib/server/commerce/catalog/service.ts`, `app/shop/[tenant]/products/page.tsx`, `components/commerce/adapters/ProductGridAdapter.tsx`

## Context

How is product availability tracked across franchisees? Options: single shared pool, per-franchisee pool, or pool with reservation.

| Option | Oversell possible? | Cross-franchisee BOPIS? |
|---|---|---|
| Single pool | No — one inventory, first-come | Yes |
| Per-franchisee pool | Yes — each franchisee tracks own | No |
| Pool + reservation | No — reserve at cart | Yes, with reservation crossing lines |

## Decision

**Per-franchisee pool.** Matches the merchant-of-record choice. Cross-franchisee BOPIS is out of scope for v1.

## Consequences

- The product grid must show per-territory availability, not global stock.
- A SKU available in territory A may be sold out in territory B.
- `lib/server/commerce/catalog/service.ts` scopes inventory reads by `territoryId`.
