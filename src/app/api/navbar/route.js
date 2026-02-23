import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const navItems = await prisma.navItem.findMany({
      include: { subItems: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(navItems)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { items } = await req.json()

    await prisma.navSubItem.deleteMany()
    await prisma.navItem.deleteMany()

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

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
