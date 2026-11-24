import { compare, hash } from "bcryptjs"

/**
 * Password hashing utilities (server-only).
 *
 * Uses bcryptjs (pure JS, zero native deps) with a work factor of 12. Hashes
 * are stored in the `User.passwordHash` column; plaintext never leaves the
 * request boundary and is never logged.
 */
const SALT_ROUNDS = 12
export const MIN_PASSWORD_LENGTH = 12

/** Returns a user-safe password policy message, or null when valid. */
export function validatePassword(plaintext: string): string | null {
  if (plaintext.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  if (
    !/[a-z]/.test(plaintext) ||
    !/[A-Z]/.test(plaintext) ||
    !/\d/.test(plaintext)
  ) {
    return "Password must include uppercase, lowercase, and a number."
  }

  return null
}

/** Rejects empty or malformed hashes before invoking bcrypt. */
export function isPasswordHash(value: string): boolean {
  return /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value)
}

/** Hashes a plaintext password for storage. */
export async function hashPassword(plaintext: string): Promise<string> {
  const policyError = validatePassword(plaintext)
  if (policyError) throw new Error(policyError)

  return hash(plaintext, SALT_ROUNDS)
}

/** Constant-time comparison of a plaintext password against a stored hash. */
export async function verifyPassword(
  plaintext: string,
  hashed: string
): Promise<boolean> {
  if (!plaintext || !isPasswordHash(hashed)) return false
  return compare(plaintext, hashed)
}
