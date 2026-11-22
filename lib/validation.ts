/** zod-based validation schemas for Phase 5 Forms.
 * Pure functions — no runtime dependencies beyond zod.
 * All schemas are RSC-safe (no form state, just validation logic).
 */

import { z } from "zod"

/** Base input schema with common constraints. */
export const baseInputSchema = z.object({
  value: z.string().min(1, "This field is required"),
  errorMessage: z.string().optional(),
})

/** Email input schema. */
export const emailSchema = baseInputSchema.extend({
  value: z.string().email("Please enter a valid email address"),
})

/** Password schema (minimum 8 chars, at least 1 number, 1 uppercase). */
export const passwordSchema = baseInputSchema.extend({
  value: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
})

/** Number schema with min/max constraints. */
export const numberSchema = (opts: { min?: number; max?: number; step?: number }) =>
  baseInputSchema.extend({
    value: z
      .number()
      .refine((val) => opts.min == null || val >= opts.min, {
        message: opts.min != null ? `Must be at least ${opts.min}` : undefined,
      })
      .refine((val) => opts.max == null || val <= opts.max, {
        message: opts.max != null ? `Must be at most ${opts.max}` : undefined,
      })
      .refine((val) => opts.step == null || Number.isFinite(val) && (val - opts.step) % opts.step === 0, {
        message: opts.step != null ? `Must be in steps of ${opts.step}` : undefined,
      }),
  })

/** Currency schema (number + currency code). */
export const currencySchema = (allowedCurrencies: string[]) =>
  baseInputSchema.extend({
    value: z
      .string()
      .refine(
        (val) => {
          if (!val) return true
          // Strip currency prefix if user includes it
          const numeric = val.replace(/[^0-9.-]/g, "")
          return !isNaN(Number(numeric))
        },
        "Enter a valid number",
      )
      .refine(
        (val) => {
          if (!val) return true
          const currency = val.split(" ")[1]?.toUpperCase()
          return allowedCurrencies.includes(currency ?? "")
        },
        `Select a valid currency (${allowedCurrencies.join(", ")})`,
      ),
  })

/** Date schema (ISO string). */
export const dateSchema = baseInputSchema.extend({
  value: z.string().refine(
    (val) => !val || !isNaN(new Date(val).getTime()),
    "Enter a valid date",
  ),
})

/** Date range schema (start/end). */
export const dateRangeSchema = z.object({
  start: z.string().refine((val) => !val || !isNaN(new Date(val).getTime()), {
    message: "Start date must be a valid date",
  }),
  end: z.string().refine((val) => !val || !isNaN(new Date(val).getTime()), {
    message: "End date must be a valid date",
  }),
})

/** Select schema (validates against allowed options). */
export const selectSchema = (allowedValues: string[]) =>
  z.string().refine((val) => allowedValues.includes(val), {
    message: `Select one of: ${allowedValues.join(", ")}`,
  })

/** Multi-select (array) schema. */
export const multiSelectSchema = (allowedValues: string[]) =>
  z.array(z.string()).refine(
    (vals) => vals.every((v) => allowedValues.includes(v)),
    {
      message: `Select valid values from: ${allowedValues.join(", ")}`,
    },
  )

/** Form error extraction from ZodError. */
export type ZodValidationError = {
  field: string
  message: string
}

/** Extracts field-level errors from a ZodError. */
export function extractZodErrors(error: z.ZodError): ZodValidationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }))
}

/** Generic form schema that takes a partial object of field schemas. */
export function createFormSchema<Fields extends Record<string, z.ZodTypeAny>>(
  fields: Fields,
) {
  return z.object(fields)
}

export type FormSchemaOf<Fields extends Record<string, z.ZodTypeAny>> = z.ZodObject<Fields>