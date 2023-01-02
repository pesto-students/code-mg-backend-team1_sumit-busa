import prisma from '@/prisma/prisma'
import { ExtSocket } from '@/types/socket'
import { SubmissionStatus } from '@prisma/client'
import { compile, Language, Response, Status } from './compiler.service'
import { EVENTS } from './socketHandler.service'

interface SubmitAssignment {
  assignmentId: number
  sourceCode: string
  language: keyof typeof Language
  stdin?: string
}
export const handleAssignmentSubmit = async (socket: ExtSocket, data: SubmitAssignment) => {
  const { assignmentId, language, sourceCode } = data

  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }, include: { testCases: true } })
  if (!assignment) {
    const error = `Assignment with ${assignmentId} id not found`
    socket.emit(EVENTS.submit, 'error : ' + error)
    return
  }

  try {
    const studentId = socket.request?.loggedInUser?.id || -1
    const submission = await prisma.submission.upsert({
      create: { assignmentId, result: Status.processing, language, submission: sourceCode, studentId },
      update: { language, submission: sourceCode, result: Status.processing },
      where: { assignmentId_studentId: { assignmentId, studentId } },
    })
    socket.emit(EVENTS.submit, { type: 'uploaded', count: assignment.testCases.length })

    const promises = assignment.testCases.map((test) => {
      return new Promise<{ type: string; status: Response & { expectedOutput: string; testId: number } }>(
        async (resolve, reject) => {
          try {
            const response = await compile(
              sourceCode,
              language,
              test.expectedOutput,
              test.input,
              assignment.maximumRunTime,
            )
            const result = {
              type: 'testCase',
              status: { ...response, expectedOutput: test.expectedOutput, testId: test.id },
            }
            socket.emit(EVENTS.submit, result)
            console.log(result)
            resolve(result)
          } catch (ex) {
            console.log(ex)
            reject(ex)
          }
        },
      )
    })

    const response = await Promise.all(promises)
    const totalCount = response.length
    const successCount = response.filter((r) => r.status.status.id === Status.success.id).length
    const errorCount = totalCount - successCount
    const result = { type: 'result', totalCount, successCount, errorCount }
    const status = totalCount === successCount ? SubmissionStatus.Pass : SubmissionStatus.Fail
    console.log({ result })
    socket.emit(EVENTS.submit, result)
    await prisma.submission.update({ where: { id: submission.id }, data: { result: { ...result, response }, status } })
    return result
  } catch (ex) {
    socket.emit(EVENTS.submit, 'error : something went wrong')
  }
}

export const handleCustomRun = async (socket: ExtSocket, data: SubmitAssignment) => {
  const { stdin, language, sourceCode, assignmentId } = data
  let input = stdin
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }, include: { testCases: true } })
  const output = assignment?.testCases[0].expectedOutput
  if (!stdin) {
    input = assignment?.testCases[0].input
  }
  try {
    const response = await compile(sourceCode, language, output, input || ' ')

    console.log({ response })
    socket.emit(EVENTS.customRun, { ...response, expectedOutput: stdin ? false : output })
  } catch (ex) {
    console.log(ex)
    socket.emit(EVENTS.customRun, 'error')
  }
}

export const handleSaveCode = async (socket: ExtSocket, data: SubmitAssignment) => {
  try {
    const { language, sourceCode, assignmentId } = data
    // throw new Error('fdsa')
    const studentId = socket.request?.loggedInUser?.id || -1
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
