import { z } from 'zod'

export const contractRenewalSchema = z.object({
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  royaltyRatePct: z.number().min(0).max(100),
  notes: z.string().max(2000).optional().default(''),
})

export type ContractRenewalValues = z.infer<typeof contractRenewalSchema>
