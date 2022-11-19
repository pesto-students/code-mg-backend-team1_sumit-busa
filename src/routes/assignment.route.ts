import { auth } from '@/config/passport'
import { getAssignment } from '@/service/assignment.service'
import express from 'express'

const router = express.Router()
router.use(auth())

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { user } = req
  let parsedId: number
  if (id || id === '0') {
    parsedId = parseInt(id)
  } else parsedId = null
  const result = await getAssignment(parsedId, user)

  res.send(result)
})

export default router
