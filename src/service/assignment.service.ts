import { LoggedInUserType } from '@/config/passport'
import prisma from '@/prisma/prisma'
import { CreateAssignment } from '@/routes/assignment.route'
import { z } from 'zod'
import { Language } from './compiler.service'

export const getAssignment = async (id: number, loggedInUser: LoggedInUserType) => {
  //todo Authenticate
  const result = await prisma.assignment.findUniqueOrThrow({
    where: { id },
    include: {
      submissions: { where: { studentId: loggedInUser.id } },
    },
  })

  let { allowedLanguages } = result
  if (!allowedLanguages || allowedLanguages.length < 1) {
    allowedLanguages = Object.keys(Language)
  }
  result.allowedLanguages = allowedLanguages

  return result
}

export const getAssignments = async (loggedInUser: LoggedInUserType) => {
  //todo todo filter results
  return await prisma.assignment.findMany({ where: {} })
}

export const createAssignment = async (data: z.infer<typeof CreateAssignment>, loggedInUser: LoggedInUserType) => {
  const { title, problemStatement, allowedLanguages, testCases, classId } = data

  const assignment = await prisma.assignment.create({
    data: {
      title,
      allowedLanguages,
      problemStatement,
      classId,
      testCases: {
        createMany: {
          data: testCases,
        },
      },
      createdById: loggedInUser.id,
    },
  })

  return assignment
}
