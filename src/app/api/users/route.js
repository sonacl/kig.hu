import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/api-utils'

export async function GET() {
  const [user, errorResponse] = await requireAuth('ADMIN')
  if (errorResponse) return errorResponse

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    })
    return Response.json(users)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const [user, errorResponse] = await requireAuth('ADMIN')
  if (errorResponse) return errorResponse

  try {
    const { email, name, role } = await req.json()
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || '',
        role: role || 'EDITOR',
      },
    })
    return Response.json(newUser)
  } catch (error) {
    if (error.code === 'P2002')
      return Response.json({ error: 'Email already exists' }, { status: 400 })
    return Response.json({ error: error.message }, { status: 500 })
  }
}
