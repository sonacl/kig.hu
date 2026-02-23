import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const redirects = await prisma.redirect.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(redirects)
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
    const { source, destination } = await req.json()
    const redirect = await prisma.redirect.create({
      data: {
        source: source.startsWith('/') ? source : `/${source}`,
        destination,
      },
    })
    return NextResponse.json(redirect)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
