import { hashPassword } from '@/service/auth.service'
import prisma from './prisma'

const seed = async () => {
  return await prisma.$transaction(
    async (prisma) => {
      const user1 = await prisma.user.create({
        data: {
          email: 'test@test.com',
          fullName: 'test user',
          role: 'Student',
          password: await hashPassword('12345678'),
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
          createdById: user1.id,
        },
      })
    },
    { maxWait: 20000, timeout: 200000 },
  )
}
export default seed
