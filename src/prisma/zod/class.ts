import * as z from "zod"

export const ClassModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  createdById: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
