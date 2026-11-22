import { z } from 'zod'

export const branchFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  franchiseId: z.string().uuid(),
  address: z.object({
    line1: z.string().trim().min(1).max(200),
    line2: z.string().max(200).optional().default(''),
    city: z.string().trim().min(1).max(100),
    region: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().min(1).max(20),
    country: z.string().trim().length(2),
  }),
  isActive: z.boolean().default(true),
})

export type BranchFormValues = z.infer<typeof branchFormSchema>
