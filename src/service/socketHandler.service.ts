import { ExtSocket } from '@/types/socket'
import { handleAssignmentSubmit, handleCustomRun, handleSaveCode } from './submission.service'

export const EVENTS = {
  submit: 'assignment:submit',
  customRun: 'assignment:custom-input',
  save: 'assignment:save',
} as const

export const handleSocketConnection = (socket: ExtSocket) => {
  //
  console.log(socket.request.user)
  socket.on(EVENTS.submit, (payload) => handleAssignmentSubmit(socket, payload))

  socket.on(EVENTS.customRun, (payload) => handleCustomRun(socket, payload))

  socket.on(EVENTS.save, (payload) => handleSaveCode(socket, payload))

  socket.on('Error', () => console.log('Error'))
}
