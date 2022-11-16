import app from './app'
import { APP_PORT } from '@/config/config'
import logger from './config/logger'
import { Server } from 'socket.io'
import { handleSocketConnection } from './service/socketHandler.service'
import passport from 'passport'
import { auth } from './config/passport'

const server = app.listen(APP_PORT, () => {
  logger.info(`server listening on ${APP_PORT}`)
})

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next)
const io = new Server(server)
io.use(wrap(passport.initialize()))
io.use(wrap(auth()))
io.on('connection', handleSocketConnection)


process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: ' + err)
})
