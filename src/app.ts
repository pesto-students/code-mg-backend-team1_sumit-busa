import express from 'express'
import helmet from 'helmet'
// import xss from 'xss-clean'
import compression from 'compression'
import 'express-async-errors'
import cors from 'cors'
import routes from '@/routes'
import { morganSuccessHandler, morganErrorHandler } from '@/config/morgan'
import { IS_TEST, APP_PREFIX_PATH } from '@/config/config'
import httpStatus from 'http-status'
import ApiError from './utils/ApiError'
import { errorConverter, errorHandler } from './middlewares/error'
import passport from 'passport'
import { jwtStrategy } from '@/config/passport'
import logger from './config/logger'
const app = express()

app.use(passport.initialize())
passport.use(jwtStrategy)

if (!IS_TEST) {
  app.use(morganSuccessHandler)
  app.use(morganErrorHandler)
}

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json({ limit: '50mb' }))

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// gzip compression
app.use(compression())

app.use(cors())

app.use(APP_PREFIX_PATH, routes)

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  logger.error('Not found')
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(errorConverter)

app.use(errorHandler)

export default app
