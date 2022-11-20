import express from 'express'
import auth from './auth.route'
import assignment from './assignment.route'
import classRoute from './class.route'

const routes = express.Router()

routes.use('/auth', auth)
routes.use('/assignment', assignment)
routes.use('/class', classRoute)

export default routes
