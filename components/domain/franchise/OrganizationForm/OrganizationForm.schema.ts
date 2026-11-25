import { z } from 'zod'

export const organizationFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  legalName: z.string().trim().min(1, 'Legal name is required').max(200),
  taxId: z.string().trim().min(1, 'Tax ID is required').max(50),
  notes: z.string().max(2000).optional().default(''),
})

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>
