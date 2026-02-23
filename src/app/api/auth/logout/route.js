import { lucia } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId) {
    return Response.json({ success: true })
  }

  await lucia.invalidateSession(sessionId)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return Response.json({ success: true })
}
