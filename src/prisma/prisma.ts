import { DB_URI } from '../config/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: { db: { url: DB_URI() } },
  log: ['info'],
})

export default prisma
