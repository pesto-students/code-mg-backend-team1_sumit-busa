import { auth } from '@/config/passport'
import verifyRole from '@/middlewares/auth'
import { getAssignments, getSubmission, getSubmissions } from '@/service/teacher.service'
import express from 'express'

const router = express.Router()
router.use(auth())
router.use(verifyRole(['Teacher']))

router.get('/assignment', async (req, res) => {
  const classId = req.query.classId as string
  const { loggedInUser } = req
  const parsedClassId = parseInt(classId || '-1')
  const result = await getAssignments(parsedClassId, loggedInUser)
  res.json(result)
})

router.get('/submissions/:id', async (req, res) => {
  const { loggedInUser } = req
  const assignmentId = parseInt(req.params.id)

  const result = await getSubmissions(assignmentId, loggedInUser)
  res.json(result)
})

router.get('/submission/:id', async (req, res) => {
  const { loggedInUser } = req
  const submissionId = parseInt(req.params.id)

  const result = await getSubmission(submissionId, loggedInUser)
  res.json(result)
})
export default router
