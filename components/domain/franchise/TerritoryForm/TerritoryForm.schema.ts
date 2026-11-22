import { z } from 'zod'

export const territoryFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  region: z.string().trim().min(1).max(120),
  bounds: z
    .object({
      north: z.number().min(-90).max(90),
      south: z.number().min(-90).max(90),
      east: z.number().min(-180).max(180),
      west: z.number().min(-180).max(180),
    })
    .optional(),
})

export type TerritoryFormValues = z.infer<typeof territoryFormSchema>
