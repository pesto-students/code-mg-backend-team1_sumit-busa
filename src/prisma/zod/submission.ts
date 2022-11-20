import * as z from "zod"
import { CompleteAssignment, RelatedAssignmentModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const SubmissionModel = z.object({
  id: z.number().int(),
  submission: z.string(),
  language: z.string(),
  assignmentId: z.number().int(),
  studentId: z.number().int().nullish(),
  result: jsonSchema,
})

export interface CompleteSubmission extends z.infer<typeof SubmissionModel> {
  assignment: CompleteAssignment
}

/**
 * RelatedSubmissionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSubmissionModel: z.ZodSchema<CompleteSubmission> = z.lazy(() => SubmissionModel.extend({
  assignment: RelatedAssignmentModel,
}))
