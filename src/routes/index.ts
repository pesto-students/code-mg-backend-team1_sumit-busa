import express from 'express'
import auth from './auth.route'
import assignment from './assignment.route'
import classRoute from './class.route'
import student from './student.route'
import teacher from './teacher.route'

const routes = express.Router()

routes.use('/auth', auth)
routes.use('/assignment', assignment)
routes.use('/class', classRoute)
routes.use('/student', student)
routes.use('/teacher', teacher)


export default routes
