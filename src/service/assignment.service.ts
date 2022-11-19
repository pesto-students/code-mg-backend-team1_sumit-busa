import prisma from '@/prisma/prisma'

export const getAssignment = async (id: number | null, loggedInUser: Express.User) => {
  if (id !== null) {
    return await prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: { where: { studentId: loggedInUser.id } },
      },
    })
  }
  //todo return only assigned
  return await prisma.assignment.findMany({})
}
