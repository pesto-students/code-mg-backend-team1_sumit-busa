import { LoggedInUserType } from '@/config/passport'
import prisma from '@/prisma/prisma'
import { CreateAssignment } from '@/routes/assignment.route'
import { z } from 'zod'

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
