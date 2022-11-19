import prisma from '@/prisma/prisma'
import { ExtSocket } from '@/types/socket'
import ApiError from '@/utils/ApiError'
import httpStatus from 'http-status'
import { compile, Language, Response, Status } from './compiler.service'
import { EVENTS } from './socketHandler.service'

interface SubmitAssignment {
  assignmentId: number
  sourceCode: string
  language: keyof typeof Language
  stdin?: string
}
export const handleAssignmentSubmit = async (socket: ExtSocket, data: string) => {
  const { assignmentId, language, sourceCode }: SubmitAssignment = JSON.parse(data)

  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }, include: { testCases: true } })
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, `Assignment with ${assignmentId} id not found`)
  }

  const studentId = socket.request.user.id
  const submission = await prisma.submission.upsert({
    create: { assignmentId, result: Status.processing, language, submission: sourceCode, studentId },
    update: { language, submission: sourceCode, result: Status.processing },
    where: { assignmentId_studentId: { assignmentId, studentId } },
  })
  socket.emit('ack', 'code uploaded')

  const promises = assignment.testCases.map((test) => {
    return new Promise<{ testCaseId: number; response: Response; expected: string }>(async (resolve, reject) => {
      try {
        const response = await compile(sourceCode, language, test.expectedOutput, test.input)
        const result = { testCaseId: test.id, response, expected: test.expectedOutput }
        socket.emit('ack', result)
        resolve(result)
      } catch (ex) {
        reject(ex)
      }
    })
  })

  const result = await Promise.all(promises)
  const totalCount = result.length
  const successCount = result.filter((r) => r.response.status.id === Status.success.id).length
  const errorCount = totalCount - successCount
  socket.emit('ack', {
    totalCount,
    successCount,
    errorCount,
  })
  await prisma.submission.update({ where: { id: submission.id }, data: { result } })
  return result
}

export const handleCustomRun = async (socket: ExtSocket, data: SubmitAssignment) => {
  const { stdin, language, sourceCode } = data
  try {
    const response = await compile(sourceCode, language, ' ', stdin || ' ')
    socket.emit(EVENTS.customRun, response)
  } catch (ex) {
    socket.emit(EVENTS.customRun, 'error occured' + ex)
  }
}

export const handleSaveCode = async (socket: ExtSocket, data: SubmitAssignment) => {
  try {
    const { language, sourceCode, assignmentId } = data
    // throw new Error('fdsa')
    const studentId = socket.request.user?.id || 1
    await prisma.submission.upsert({
      create: { assignmentId, result: Status.processing, language, submission: sourceCode, studentId },
      update: { language, submission: sourceCode, result: Status.processing },
      where: { assignmentId_studentId: { assignmentId, studentId } },
    })
    console.log('saved code')
    socket.emit(EVENTS.save, 'success')
  } catch (ex) {
    console.log('error')
    socket.emit(EVENTS.save, 'error')
  }
}
