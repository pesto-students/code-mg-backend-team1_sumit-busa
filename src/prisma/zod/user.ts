import * as z from "zod"
import { Role } from "@prisma/client"

export const UserModel = z.object({
  id: z.number().int(),
  fullName: z.string().nullish(),
  email: z.string(),
  mobile: z.string().nullish(),
  password: z.string().nullish(),
  role: z.nativeEnum(Role),
  createdAt: z.date(),
  updatedAt: z.date(),
})
