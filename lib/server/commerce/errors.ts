/**
 * Commerce plane errors.
 *
 * Extends the AppError pattern from lib/server/errors so the presentation
 * layer can map codes to HTTP statuses consistently across planes.
 */
import { AppError } from "@/lib/server/errors"

export class CommerceError extends AppError {
  constructor(message: string, code: string, status = 400) {
    super(message, code, status)
    this.name = "CommerceError"
  }
}

export class CommerceNotFoundError extends CommerceError {
  constructor(message = "Commerce resource not found") {
    super(message, "COMMERCE_NOT_FOUND", 404)
  }
}

export class CommercePriceOutOfBoundsError extends CommerceError {
  constructor(message = "Price out of bounds") {
    super(message, "PRICE_OUT_OF_BOUNDS", 422)
  }
}

export class CommerceTenantMismatchError extends CommerceError {
  constructor(message = "Tenant mismatch") {
    super(message, "TENANT_MISMATCH", 404)
  }
}

export class CommerceIdempotencyError extends CommerceError {
  constructor(message = "Idempotency key conflict") {
    super(message, "IDEMPOTENCY_CONFLICT", 409)
  }
}
