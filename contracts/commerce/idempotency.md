# Idempotency — replay semantics

## Key model

Every mutating commerce action (add cart line, place order, receive webhook) carries an `Idempotency-Key` header tied to a `clientOpId` generated client-side. The key is the primary key of an `IdempotencyKey` table.

## Replay behavior

1. First request with a new key: execute the action, store the response (status code + body) keyed by `clientOpId`.
2. Duplicate request with the same key: return the stored prior response without re-executing.
3. Keys expire (TTL) after 30 days; expired keys are re-executed.

## Order creation

The order `clientOpId` is `UNIQUE` in the database. Steps 1–4 (idempotency check, tenant resolution, price re-validation, transaction) are atomic. If the transaction commits, the idempotency key row is inserted in the same transaction. A duplicate `placeOrder` returns the stored response — the order is created exactly once.

## Webhooks

Payment and fulfillment webhooks are idempotent on `idempotencyKey`. A redelivered webhook returns the prior acknowledgment without re-applying the state transition.

## Consumer contract

Event consumers (e.g. royalty service) must be idempotent on the CloudEvents `idempotencykey` field, which mirrors the `clientOpId`.
