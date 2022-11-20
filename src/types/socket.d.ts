import { LoggedInUserType } from '@/config/passport'
import { IncomingMessage } from 'http'
import { Socket } from 'socket.io'

interface ExtRequest extends IncomingMessage {
  loggedInUser?: LoggedInUserType
}

interface ExtSocket extends Socket {
  request?: ExtRequest
}
