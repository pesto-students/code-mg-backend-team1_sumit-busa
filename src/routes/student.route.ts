import { auth } from '@/config/passport'
import verifyRole from '@/middlewares/auth'
import { getAssignments, getAssignment } from '@/service/student.service'
import express from 'express'

const router = express.Router()
router.use(auth())
router.use(verifyRole(['Student']))

router.get('/assignment', async (req, res) => {
  const classId = req.query.classId as string
  const { loggedInUser } = req
  const parsedClassId = parseInt(classId || '-1')
  const result = await getAssignments(parsedClassId, loggedInUser)
  res.json(result)
})

router.get('/assignment/:id', async (req, res) => {
  const {
    loggedInUser,
    params: { id },
  } = req
  const parsedId = parseInt(id)
  const result = await getAssignment(parsedId, loggedInUser)
  res.json(result)
})

export default router
