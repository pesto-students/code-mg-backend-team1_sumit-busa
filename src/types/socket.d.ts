import { LoggedInUserType } from '@/config/passport'
import { IncomingMessage } from 'http'
import { Socket } from 'socket.io'

interface ExtRequest extends IncomingMessage {
  user?: LoggedInUserType
}

interface ExtSocket extends Socket {
  request?: ExtRequest
}
