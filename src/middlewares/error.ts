/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ApiError from '../utils/ApiError'
import httpStatus from 'http-status'
import { IS_PRODUCTION, IS_TEST } from '../config/config'
import logger from '../config/logger'
import { NotFoundError, PrismaClientValidationError } from '@prisma/client/runtime'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err

  if (error instanceof PrismaClientValidationError) {
    const statusCode = httpStatus.BAD_REQUEST
    error = new ApiError(httpStatus.BAD_REQUEST, httpStatus[statusCode] as string, true, err.stack)
  } else if (error instanceof NotFoundError) {
    const statusCode = httpStatus.NOT_FOUND
    error = new ApiError(httpStatus.NOT_FOUND, httpStatus[statusCode] as string, true, err.stack)
  } else if (error instanceof ZodError) {
    const validations = error.errors
    const statusCode = httpStatus.BAD_REQUEST
    error = new ApiError(httpStatus.BAD_REQUEST, httpStatus[statusCode] as string, true, err.stack)
    error.validation = validations
  } else if (!(err.statusCode && err.message)) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR
    const message = httpStatus[statusCode]
    error = new ApiError(statusCode, message as string, true, err.stack)
  }
  next(error)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err
  if (IS_PRODUCTION && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR].toString()
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(err.validation && { validations: err.validation }),
    ...(!IS_PRODUCTION && { stack: err.stack }),
  }

  if (!IS_TEST) {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}
