import { hashPassword } from '@/service/auth.service'
import prisma from './prisma'

const seed = async () => {
  return await prisma.$transaction(
    async (prisma) => {
      const student = await prisma.user.create({
        data: {
          email: 'student@test.com',
          fullName: 'student user',
          role: 'Student',
          password: await hashPassword('12345678'),
        },
      })

      const teacher = await prisma.user.create({
        data: {
          email: 'teacher@test.com',
          fullName: 'teacher user',
          role: 'Teacher',
          password: await hashPassword('12345678'),
        },
      })

      const class1 = await prisma.class.create({
        data: {
          description: 'some nice description for class',
          name: 'class 1',
          createdById: teacher.id,
        },
      })
      await prisma.assignment.create({
        data: {
          title: 'sum of two elements',
          problemStatement: 'find sum of two inputs',
          testCases: {
            createMany: {
              data: [
                { expectedOutput: '4', input: '2 2' },
                { expectedOutput: '6', input: '4 2' },
                { expectedOutput: '100', input: '50 50' },
              ],
            },
          },
          createdById: teacher.id,
          classId: class1.id,
        },
      })
    },
    { maxWait: 20000, timeout: 200000 },
  )
}
export default seed
