import httpStatus from 'http-status'
import ApiError from './ApiError'

export class ForbiddenError extends ApiError {
  constructor() {
    super(httpStatus.FORBIDDEN, 'Forbidden')
  }
}
