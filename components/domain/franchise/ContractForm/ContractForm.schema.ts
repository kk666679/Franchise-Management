import { z } from 'zod'

export const contractFormSchema = z.object({
  franchiseId: z.string().uuid(),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  royaltyRatePct: z.number().min(0).max(100),
  notes: z.string().max(2000).optional().default(''),
})

export type ContractFormValues = z.infer<typeof contractFormSchema>
