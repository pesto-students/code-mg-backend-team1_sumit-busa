import { auth } from '@/config/passport'
import verifyRole from '@/middlewares/auth'
import { ClassModel } from '@/prisma/zod'
import { createClass, addStudents, getListOfClasses } from '@/service/class.service'
import { Role } from '@prisma/client'
import express from 'express'
import { z } from 'zod'

const router = express.Router()
router.use(auth())

export const CreateClassInput = ClassModel.pick({ name: true, description: true })
router.post('/', verifyRole([Role.Teacher]), async (req, res) => {
  const { loggedInUser, body } = req
  const payload = CreateClassInput.parse(body)

  const result = await createClass(payload, loggedInUser)
  res.json(result)
})

export const AddStudentsInput = z.object({ classId: z.number().int(), emails: z.array(z.string().email()).min(1) })
router.post('/add-students', verifyRole([Role.Teacher]), async (req, res) => {
  const { loggedInUser, body } = req
  const payload = AddStudentsInput.parse(body)

  await addStudents(payload, loggedInUser)
  res.status(200).send()
})

router.get('/', async (req, res) => {
  const { loggedInUser } = req

  const result = await getListOfClasses(loggedInUser)
  res.json(result)
})
export default router
