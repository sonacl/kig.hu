import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/api-utils'

export async function PUT(req, { params }) {
  const [user, errorResponse] = await requireAuth('ADMIN')
  if (errorResponse) return errorResponse

  try {
    const { id } = await params
    const { email, name, role } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        role: role || 'EDITOR',
      },
    })
    return Response.json(updatedUser)
  } catch (error) {
    if (error.code === 'P2002')
      return Response.json({ error: 'Email already exists' }, { status: 400 })
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const [user, errorResponse] = await requireAuth('ADMIN')
  if (errorResponse) return errorResponse

  try {
    const { id } = await params

    await prisma.user.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
