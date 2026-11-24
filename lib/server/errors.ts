/**
 * Typed application errors.
 *
 * These map cleanly onto HTTP status codes in route handlers and are surfaced
 * as structured results by server actions. Throw these instead of generic
 * `Error` so the presentation layer can render appropriate states.
 */
export class AppError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code: string, status = 400) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.status = status
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "UNAUTHORIZED", 401)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, "FORBIDDEN", 403)
    this.name = "ForbiddenError"
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404)
    this.name = "NotFoundError"
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 422)
    this.name = "ValidationError"
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, "CONFLICT", 409)
    this.name = "ConflictError"
  }
}

/** Narrows an unknown thrown value into an AppError for consistent handling. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  if (error instanceof Error) {
    return new AppError(error.message, "INTERNAL_ERROR", 500)
  }
  return new AppError("An unexpected error occurred", "INTERNAL_ERROR", 500)
}
