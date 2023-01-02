import * as z from "zod"

export const AssignmentModel = z.object({
  id: z.number().int(),
  title: z.string(),
  problemStatement: z.string(),
  createdById: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  allowedLanguages: z.string().array(),
  dueDate: z.date(),
  maximumRunTime: z.number().int(),
  classId: z.number().int(),
})
