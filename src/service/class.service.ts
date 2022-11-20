import { LoggedInUserType } from '@/config/passport'
import prisma from '@/prisma/prisma'
import { AddStudentsInput, CreateClassInput } from '@/routes/class.route'
import { ForbiddenError } from '@/utils/Errors'
import { Role } from '@prisma/client'
import { z } from 'zod'

export const createClass = async (data: z.infer<typeof CreateClassInput>, user: LoggedInUserType) => {
  const { name, description } = data

  const result = await prisma.class.create({ data: { name, description, createdById: user.id } })
  return result
}

export const addStudents = async (data: z.infer<typeof AddStudentsInput>, user: LoggedInUserType) => {
  const { classId, emails } = data
  await validateClass(classId, user)

  for (const email of emails) {
    await prisma.class.update({
      where: { id: classId },
      data: { students: { connectOrCreate: { create: { email, role: 'Student' }, where: { email } } } },
    })
  }
}

export const validateClass = async (id: number, user: LoggedInUserType) => {
  const result = await prisma.class.findUniqueOrThrow({
    where: { id },
    include: { students: { where: { id: user.id } } },
  })

  if (user.role === Role.Teacher && result.createdById !== user.id) {
    throw new ForbiddenError()
  } else if (user.role === Role.Student && (!result.students || result.students.length === 0)) {
    throw new ForbiddenError()
  }
}
