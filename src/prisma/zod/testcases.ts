import * as z from "zod"

export const TestCasesModel = z.object({
  id: z.number().int(),
  input: z.string(),
  expectedOutput: z.string(),
  assignmentId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
