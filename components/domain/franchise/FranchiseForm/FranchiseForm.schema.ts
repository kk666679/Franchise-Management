import { z } from "zod"

export const franchiseFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  legalName: z.string().trim().min(1, "Legal name is required").max(200),
  organizationId: z.string().uuid("Choose an organization"),
  territoryId: z.string().uuid().nullable(),
  notes: z.string().max(2000).optional().default(""),
})

export type FranchiseFormValues = z.infer<typeof franchiseFormSchema>
