import { LoggedInUserType } from '@/config/passport'
import prisma from '@/prisma/prisma'
import { CreateAssignment } from '@/routes/assignment.route'
import { Role } from '@prisma/client'
import { z } from 'zod'
import { validateClass } from './class.service'

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


export const getListOfAssignment = async (loggedInUser: LoggedInUserType, classId: number) => {
  const { role, id } = loggedInUser
  await validateClass(classId, loggedInUser)

  if (role === Role.Student) return listOfAssignmentForStudent(id, classId)
  // else if (role === Role.Teacher) return listOfAssignmentForTeacher(id, classId)
}

const listOfAssignmentForStudent = (studentId: number, classId: number) => {
  return prisma.assignment.findMany({
    where: { classId },
    select: { submissions: { where: { studentId }, select: { status: true } }, title: true, createdAt: true },
  })
}
