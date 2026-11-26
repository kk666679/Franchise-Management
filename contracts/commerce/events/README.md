# Commerce event contracts

CloudEvents 1.0 envelopes emitted by the commerce plane and consumed by the control plane.

| Event | Type | Emitted by |
|---|---|---|
| order.created.v1 | `com.franchise.commerce.order.created.v1` | `lib/server/commerce/orders/create.ts` |
| order.paid.v1 | `com.franchise.commerce.order.paid.v1` | `lib/server/commerce/payments/webhook.ts` |
| order.refunded.v1 | `com.franchise.commerce.order.refunded.v1` | `lib/server/commerce/returns/refund.ts` |
| order.fulfilled.v1 | `com.franchise.commerce.order.fulfilled.v1` | `lib/server/commerce/fulfillment/service.ts` |

## Versioning

- The `v1` suffix in the type is the contract version. Breaking changes increment the version (e.g. `order.created.v2`).
- New fields are additive within a version; consumers must ignore unknown fields.
- The `idempotencykey` field mirrors the commerce `clientOpId` and consumers must deduplicate on it.

## Consumer contract

- Must be idempotent on `idempotencykey`.
- Must NOT block on schema validation failure — log and dead-letter.
- Royalty consumers must emit `royalty.calculated.v1` back to the control plane.

## Replay

The outbox retains events for 30 days. A consumer that falls behind can replay. Events are immutable once emitted.
