# ADR-0001: Merchant of record

- Status: Accepted
- Date: 2026-11-26
- Related paths: `lib/server/commerce/payments/routing.ts`, `app/shop/[tenant]/api/webhook/payment/route.ts`, `app/dashboard/commerce/settings/payment-routing/page.tsx`

## Context

Who is the merchant of record for online orders placed through a franchisee storefront? This determines who owns the Stripe account, who receives funds, who owns chargebacks, who sets refund policy, and who completes KYC.

| Option | Tax entity | Chargeback owner | Refund authority | KYC |
|---|---|---|---|---|
| Franchisor as MoR | Franchisor | Franchisor | Franchisor | Franchisor only |
| Franchisee as MoR | Each franchisee | Each franchisee | Each franchisee | Each franchisee |
| Split (franchisor online, franchisee in-store) | Mixed | Mixed | Mixed | Both |

## Decision

**Franchisee as MoR with franchisor oversight.** The territory-driven payment routing only makes sense if each franchisee receives their own funds. The franchisor's role is royalty collection via the event bus, not payment custody.

## Consequences

- Each franchisee needs a Stripe Connect (or equivalent) account. Onboarding is a Phase 10 dependency.
- `lib/server/commerce/payments/routing.ts` maps `territoryId → payment account` per franchisee.
- The franchisor never touches customer payment funds; it subscribes to `order.created.v1` to calculate royalties.
