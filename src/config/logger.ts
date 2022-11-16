import winston from 'winston'
import { IS_PRODUCTION } from '../config/config'
import Sentry from 'winston-transport-sentry-node'

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})


const options = {
  //todo add sentry
  sentry: {
    dsn: '',
  },
  level: 'error'
};

const logger = winston.createLogger({
  level: IS_PRODUCTION ? 'info' : 'debug',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    new Sentry(options)
  ],
})

export default logger
