import { login } from '@/service/auth.service'
import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
  const token = await login(req.body)
  res.send(token)
})

export default router
