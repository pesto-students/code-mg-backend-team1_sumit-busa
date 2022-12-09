import { LoggedInUserType } from '@/config/passport'
import prisma from '@/prisma/prisma'
import { validateClass } from './class.service'

export const getAssignments = async (classId: number, loggedInUser: LoggedInUserType) => {
  await validateClass(classId, loggedInUser)
  const result = await prisma.assignment.findMany({
    where: { classId },
    select: {
      id: true,
      title: true,
      _count: {
        select: { submissions: true },
      },
      createdAt: true,
      dueDate: true,
    },
  })
  return result
}

export const getSubmissions = async (assignmentId: number, loggedInUser: LoggedInUserType) => {
  const assignment = await prisma.assignment.findUniqueOrThrow({ where: { id: assignmentId } })
  await validateClass(assignment?.classId, loggedInUser)

  const result = await prisma.submission.findMany({
    select: {
      id: true,
      student: { select: { fullName: true, email: true } },
      language: true,
      result: true,
      status: true,
      updatedAt: true,
    },
    where: { assignmentId },
  })
  
  return { submissions: result, assignment }
}
