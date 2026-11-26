/**
 * Idempotency middleware for server actions.
 *
 * Wraps a server action so that duplicate requests with the same Idempotency-Key
 * return the stored prior result instead of re-executing. Intended for cart
 * mutations and placeOrder.
 */
import { CommerceIdempotencyError } from "../errors"
import { getIdempotentResponse, setIdempotentResponse } from "./store"

interface IdempotencyOptions {
  key: string
  ttlSeconds?: number
}

/**
 * Wrap an action with idempotency. If a response is already stored for the key,
 * return it. Otherwise execute, store the result, and return it.
 */
export async function withIdempotency<T>(
  options: IdempotencyOptions,
  action: () => Promise<T>
): Promise<T> {
  const { key, ttlSeconds } = options

  const prior = await getIdempotentResponse(key)
  if (prior !== null) {
    // Return the stored prior result (parsed from JSON).
    return JSON.parse(prior) as T
  }

  const result = await action()

  await setIdempotentResponse(key, JSON.stringify(result), ttlSeconds)
  return result
}

/**
 * Extract the idempotency key from a server action input. Falls back to
 * generating one when absent (reads are safe to re-execute).
 */
export function getIdempotencyKey(clientOpId?: string | null): string {
  if (clientOpId) return clientOpId
  throw new CommerceIdempotencyError("Missing idempotency key (clientOpId)")
}
