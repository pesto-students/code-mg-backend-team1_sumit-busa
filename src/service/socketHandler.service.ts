import { ExtSocket } from '@/types/socket'
import { handleAssignmentSubmit, handleCustomRun, handleSaveCode } from './submission.service'

export const handleSocketConnection = (socket: ExtSocket) => {
  //
  console.log(socket.request.user)
  socket.on('assignment:submit', (payload) => handleAssignmentSubmit(socket, payload))

  socket.on('assignment:custom-input', (payload) => handleCustomRun(socket, payload))

  socket.on('assignment:save', (payload) => handleSaveCode(socket, payload))

  socket.on('Error', () => console.log('Error'))
}
