import { DB_URI } from '@/config/config'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { join } from 'path'
import { URL } from 'url'
import { v4 } from 'uuid'

const generateDatabaseURL = (schema: string) => {
  if (!DB_URI()) {
    throw new Error('please provide a database url')
  }
  const url = new URL(DB_URI())
  url.searchParams.append('schema', schema)
  return url.toString()
}

const schemaId = `test-${v4()}`
const prismaBinary = join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'prisma')

const url = generateDatabaseURL(schemaId)
process.env.DB_URI = url
const prisma = new PrismaClient({
  datasources: { db: { url } },
})

export default prisma

beforeAll(() => {
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DB_URI: generateDatabaseURL(schemaId),
    },
  })
})
afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)
  await prisma.$disconnect()
})
