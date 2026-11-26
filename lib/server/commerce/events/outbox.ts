/**
 * Transactional outbox.
 *
 * Events are written to the OutboxEntry table in the same transaction as the
 * order, then published post-commit (best-effort). Publish failure does not
 * fail the order — a worker retries pending rows.
 */
import { prisma } from "@/lib/prisma"

export interface OutboxEntryInput {
  eventType: string
  payloadJson: string
  aggregateId?: string | null
}

/** Insert an outbox entry. Must be called within an active Prisma transaction. */
export async function enqueueEvent(tx: unknown, input: OutboxEntryInput) {
  // tx is typed loosely to keep this module agnostic to the transaction API;
  // callers pass the Prisma transaction client.
  const prismaTx = tx as typeof prisma
  return prismaTx.outboxEntry.create({
    data: {
      eventType: input.eventType,
      payloadJson: input.payloadJson,
      aggregateId: input.aggregateId ?? null,
      status: "pending",
      retryCount: 0,
    },
  })
}

/** Mark an outbox entry as published. */
export async function markPublished(id: string): Promise<void> {
  await prisma.outboxEntry.update({
    where: { id },
    data: { status: "published", publishedAt: new Date() },
  })
}

/** Mark an outbox entry as failed (will be retried by the worker). */
export async function markFailed(id: string, error: string): Promise<void> {
  await prisma.outboxEntry.update({
    where: { id },
    data: {
      status: "failed",
      lastError: error,
      retryCount: { increment: 1 },
    },
  })
}

/** Fetch pending outbox entries for the replay worker. */
export async function fetchPendingEvents(limit: number = 100) {
  return prisma.outboxEntry.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    take: limit,
  })
}
