import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? '',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const items = await prisma.navItem.findMany({
    orderBy: { order: 'asc' },
    include: { subItems: { orderBy: { order: 'asc' } } },
  })

  console.log(JSON.stringify(items, null, 2))
  await prisma.$disconnect()
}

main()
