import * as z from 'zod'
import {
  CompleteUser,
  RelatedUserModel,
  CompleteSubmission,
  RelatedSubmissionModel,
  CompleteTestCases,
  RelatedTestCasesModel,
} from './index'

export const AssignmentModel = z.object({
  id: z.number().int(),
  title: z.string(),
  problemStatement: z.string(),
  createdById: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  allowedLanguages: z.string().array(),
})

export interface CompleteAssignment extends z.infer<typeof AssignmentModel> {
  createdBy: CompleteUser
  submissions: CompleteSubmission[]
  testCases: CompleteTestCases[]
}

/**
 * RelatedAssignmentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAssignmentModel: z.ZodSchema<CompleteAssignment> = z.lazy(() =>
  AssignmentModel.extend({
    createdBy: RelatedUserModel,
    submissions: RelatedSubmissionModel.array(),
    testCases: RelatedTestCasesModel.array(),
  }),
)
