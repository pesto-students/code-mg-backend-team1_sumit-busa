import express from 'express'
import auth from './auth.route'
import assignment from './assignment.route'

const routes = express.Router()

routes.use('/auth', auth)
routes.use('/assignment', assignment)

export default routes
