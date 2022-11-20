import * as z from "zod"
import { CompleteAssignment, RelatedAssignmentModel } from "./index"

export const TestCasesModel = z.object({
  id: z.number().int(),
  input: z.string(),
  expectedOutput: z.string(),
  assignmentId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteTestCases extends z.infer<typeof TestCasesModel> {
  assignment: CompleteAssignment
}

/**
 * RelatedTestCasesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTestCasesModel: z.ZodSchema<CompleteTestCases> = z.lazy(() => TestCasesModel.extend({
  assignment: RelatedAssignmentModel,
}))
