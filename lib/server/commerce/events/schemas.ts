/**
 * Zod validators matching the JSON event schemas in contracts/commerce/events.
 *
 * Consumers use these to validate incoming events without blocking on schema
 * failure — validation errors are logged and dead-lettered per ADR.
 */
import { z } from "zod"

export const orderCreatedV1Schema = z.object({
  orderId: z.string(),
  tenantId: z.string(),
  franchiseId: z.string(),
  territoryId: z.string(),
  customerId: z.string().nullable().optional(),
  totalMinor: z.number(),
  currency: z.string(),
  lines: z
    .array(
      z.object({
        sku: z.string(),
        qty: z.number(),
        unitPriceMinor: z.number(),
      })
    )
    .optional(),
  createdAt: z.string().datetime().optional(),
})

export type OrderCreatedV1 = z.infer<typeof orderCreatedV1Schema>

export const orderPaidV1Schema = z.object({
  orderId: z.string(),
  tenantId: z.string(),
  territoryId: z.string(),
  customerId: z.string().nullable().optional(),
  totalMinor: z.number(),
  currency: z.string(),
  providerRef: z.string().optional(),
  paidAt: z.string().datetime().optional(),
})

export type OrderPaidV1 = z.infer<typeof orderPaidV1Schema>

export const orderRefundedV1Schema = z.object({
  orderId: z.string(),
  tenantId: z.string(),
  territoryId: z.string(),
  returnId: z.string().optional(),
  refundMinor: z.number(),
  currency: z.string(),
  refundedAt: z.string().datetime().optional(),
})

export type OrderRefundedV1 = z.infer<typeof orderRefundedV1Schema>

export const orderFulfilledV1Schema = z.object({
  orderId: z.string(),
  tenantId: z.string(),
  territoryId: z.string(),
  trackingRef: z.string().optional(),
  fulfilledAt: z.string().datetime().optional(),
})

export type OrderFulfilledV1 = z.infer<typeof orderFulfilledV1Schema>
