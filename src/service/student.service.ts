import { LoggedInUserType } from '@/config/passport'
import prisma from '@/prisma/prisma'
import { validateClass } from './class.service'
import { Language } from './compiler.service'

export const getAssignments = async (classId: number, loggedInUser: LoggedInUserType) => {
  await validateClass(classId, loggedInUser)
  const result = await prisma.assignment.findMany({
    where: { classId },
    select: {
      id: true,
      title: true,
      createdBy: { select: { fullName: true } },
      submissions: {
        select: { status: true, updatedAt: true },
        where: { studentId: loggedInUser.id },
      },
    },
  })
  return result
}

export const getAssignment = async (id: number, loggedInUser: LoggedInUserType) => {
  const assignment = await validateAssignment(id, loggedInUser)

  let { allowedLanguages } = assignment
  if (!allowedLanguages || allowedLanguages.length < 1) {
    allowedLanguages = Object.keys(Language)
  }
  assignment.allowedLanguages = allowedLanguages

  return assignment
}

const validateAssignment = async (id: number, loggedInUser: LoggedInUserType) => {
  const assignment = await prisma.assignment.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      problemStatement: true,
      title: true,
      allowedLanguages: true,
      classId: true,
      submissions: { where: { studentId: loggedInUser.id } },
    },
  })

  await validateClass(assignment.classId, loggedInUser)

  return assignment
}
