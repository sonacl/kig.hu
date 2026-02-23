import prisma from '@/lib/prisma'
import { lucia } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return Response.json({ message: 'Érvénytelen felhasználónév vagy jelszó' }, { status: 400 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return Response.json({ message: 'Érvénytelen felhasználónév vagy jelszó' }, { status: 400 })
    }

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    const cookieStore = await cookies()
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ message: 'Szerver hiba történt' }, { status: 500 })
  }
}
