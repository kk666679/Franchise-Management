/**
 * Emit a commerce event to the outbox (to be published post-commit).
 *
 * Call this inside the order creation transaction. The event is durable even
 * if the event bus is temporarily down — the outbox worker retries pending
 * entries. This is what decouples checkout from royalty.
 */
import { prisma } from "@/lib/prisma"
import { enqueueEvent } from "./outbox"

/** Emit order.created.v1 inside a transaction. */
export async function emitOrderCreated(
  tx: unknown,
  payload: Record<string, unknown>,
  orderId: string
) {
  return enqueueEvent(tx, {
    eventType: "order.created.v1",
    payloadJson: JSON.stringify(payload),
    aggregateId: orderId,
  })
}

/** Emit a generic event inside a transaction. */
export async function emitEvent(
  tx: unknown,
  eventType: string,
  payload: Record<string, unknown>,
  aggregateId?: string | null
) {
  return enqueueEvent(tx, {
    eventType,
    payloadJson: JSON.stringify(payload),
    aggregateId: aggregateId ?? null,
  })
}
