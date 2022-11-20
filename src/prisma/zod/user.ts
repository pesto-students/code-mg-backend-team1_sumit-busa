import * as z from "zod"
import { Role } from "@prisma/client"
import { CompleteAssignment, RelatedAssignmentModel } from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  fullName: z.string(),
  email: z.string(),
  mobile: z.string().nullish(),
  password: z.string().nullish(),
  role: z.nativeEnum(Role),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  assignments: CompleteAssignment[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  assignments: RelatedAssignmentModel.array(),
}))
