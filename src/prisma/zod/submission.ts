import * as z from "zod"
import { SubmissionStatus } from "@prisma/client"

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
  studentId: z.number().int(),
  status: z.nativeEnum(SubmissionStatus),
  result: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})
