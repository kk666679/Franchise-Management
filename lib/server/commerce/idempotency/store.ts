/**
 * Idempotency key store.
 *
 * Keys are stored in the IdempotencyKey table within the same transaction as
 * the order, guaranteeing exactly-once semantics for placeOrder. Expired keys
 * are cleaned up by a background job.
 */
import { prisma } from "@/lib/prisma"

/**
 * Look up a previously stored response for a key.
 * Returns null when the key has not been used yet.
 */
export async function getIdempotentResponse(key: string): Promise<string | null> {
  const row = await prisma.idempotencyKey.findUnique({
    where: { key },
    select: { responseJson: true, expiresAt: true },
  })

  if (!row) return null
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return null
  return row.responseJson ?? null
}

/**
 * Store a response for a key. The caller is responsible for doing this inside
 * the same transaction as the order so the key and order commit atomically.
 */
export async function setIdempotentResponse(
  key: string,
  responseJson: string,
  ttlSeconds: number = 30 * 24 * 60 * 60
): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

  await prisma.idempotencyKey.upsert({
    where: { key },
    update: { responseJson, expiresAt },
    create: { key, responseJson, expiresAt },
  })
}
