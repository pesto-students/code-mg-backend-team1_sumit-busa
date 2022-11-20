import { auth } from '@/config/passport'
import verifyRole from '@/middlewares/auth'
import { ClassModel } from '@/prisma/zod'
import { createClass, addStudents } from '@/service/class.service'
import { Role } from '@prisma/client'
import express from 'express'
import { z } from 'zod'

const router = express.Router()
router.use(auth())
router.use(verifyRole([Role.Teacher]))

export const CreateClassInput = ClassModel.pick({ name: true, description: true })
router.post('/', async (req, res) => {
  const { loggedInUser, body } = req
  const payload = CreateClassInput.parse(body)

  const result = await createClass(payload, loggedInUser)
  res.json(result)
})

export const AddStudentsInput = z.object({ classId: z.number().int(), emails: z.array(z.string().email()).min(1) })
router.post('/add-students', async (req, res) => {
  const { loggedInUser, body } = req
  const payload = AddStudentsInput.parse(body)

  await addStudents(payload, loggedInUser)
  res.status(200).send()
})
export default router
