import { auth } from '@/config/passport'
import verifyRole from '@/middlewares/auth'
import { AssignmentModel, TestCasesModel } from '@/prisma/zod'
import { createAssignment } from '@/service/assignment.service'
import { Language } from '@/service/compiler.service'

import express from 'express'
import { z } from 'zod'

const router = express.Router()
router.use(auth())

const TestCasesCreate = z.object({
  testCases: z.array(TestCasesModel.pick({ expectedOutput: true, input: true })).min(1),
})
const allowedLanguages = Object.keys(Language) as Array<keyof typeof Language>
export const CreateAssignment = AssignmentModel.pick({
  allowedLanguages: true,
  problemStatement: true,
  classId: true,
  dueDate: true,
  maximumRunTime: true,
  title: true,
})
  .merge(TestCasesCreate)
  .merge(
    z.object({
      allowedLanguages: z.array(z.enum([allowedLanguages[0], ...allowedLanguages])).optional(),
      maximumRunTime: z.number().min(0).max(15).optional().default(5),
      dueDate: z
        .string()
        .optional()
        .default(new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString()),
    }),
  )
  .merge(z.object({}))
router.post('/', verifyRole(['Teacher']), async (req, res) => {
  const { body, loggedInUser } = req

  const validatedBody = CreateAssignment.parse(body)
  console.log({ validatedBody })

  const assignment = await createAssignment(validatedBody, loggedInUser)
  return res.json(assignment)
})

export default router
