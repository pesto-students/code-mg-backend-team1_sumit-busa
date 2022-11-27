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
  title: true,
})
  .merge(TestCasesCreate)
  .merge(
    z.object({
      allowedLanguages: z.array(z.enum([allowedLanguages[0], ...allowedLanguages])).optional(),
    }),
  )
router.post('/', verifyRole(['Teacher']), async (req, res) => {
  const { body, loggedInUser } = req

  const validatedBody = CreateAssignment.parse(body)
  const assignment = await createAssignment(validatedBody, loggedInUser)
  return res.json(assignment)
})

export default router
