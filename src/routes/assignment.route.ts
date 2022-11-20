import { auth } from '@/config/passport'
import verifyRole from '@/middlewares/auth'
import { AssignmentModel, TestCasesModel } from '@/prisma/zod'
import { createAssignment, getAssignment, getAssignments } from '@/service/assignment.service'

import express from 'express'
import { z } from 'zod'

const router = express.Router()
router.use(auth())

router.get('/', async (req, res) => {
  const { loggedInUser } = req
  const result = await getAssignments(loggedInUser)

  res.send(result)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { loggedInUser } = req

  const result = await getAssignment(parseInt(id), loggedInUser)

  res.send(result)
})

const TestCasesCreate = z.object({ testCases: z.array(TestCasesModel.pick({ expectedOutput: true, input: true })) })
export const CreateAssignment = AssignmentModel.pick({
  allowedLanguages: true,
  problemStatement: true,
  title: true,
}).merge(TestCasesCreate)

router.post('/', verifyRole(['Teacher']), async (req, res) => {
  const { body, loggedInUser } = req

  const validatedBody = CreateAssignment.parse(body)

  const assignment = await createAssignment(validatedBody, loggedInUser)
  return res.json(assignment)
})

export default router
