import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from './prisma'
import { cookies } from 'next/headers'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: attributes => {
    return {
      email: attributes.email,
      name: attributes.name,
      googleId: attributes.googleId,
      role: attributes.role,
    }
  },
})

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value
  if (!sessionId) return null
  const { user } = await lucia.validateSession(sessionId)
  return user
}
