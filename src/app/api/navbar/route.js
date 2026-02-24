import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/api-utils'

export async function GET() {
  try {
    const navItems = await prisma.navItem.findMany({
      include: { subItems: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    })
    return Response.json(navItems)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const [user, errorResponse] = await requireAuth('ADMIN')
  if (errorResponse) return errorResponse

  try {
    const { items } = await req.json()

    // Transaction to ensure atomicity
    await prisma.$transaction([prisma.navSubItem.deleteMany(), prisma.navItem.deleteMany()])

    for (const [index, item] of items.entries()) {
      await prisma.navItem.create({
        data: {
          label: item.label,
          url: item.url || null,
          order: index,
          subItems: {
            create: (item.subItems || []).map((sub, sIndex) => ({
              label: sub.label,
              url: sub.url,
              order: sIndex,
            })),
          },
        },
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
