import { google } from '@/lib/oauth'
import { lucia } from '@/lib/auth'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const cookieStore = await cookies()
  const storedState = cookieStore.get('google_oauth_state')?.value ?? null
  const storedCodeVerifier = cookieStore.get('google_code_verifier')?.value ?? null

  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response(null, {
      status: 400,
      statusText: 'Invalid OAuth state',
    })
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)
    const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    })

    const googleUser = await googleUserResponse.json()

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.sub }, { email: googleUser.email }],
      },
    })

    if (!existingUser) {
      return new Response('Hozzáférés megtagadva.', {
        status: 403,
      })
    }

    if (!existingUser.googleId) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: googleUser.sub,
          name: googleUser.name || existingUser.name,
        },
      })
    }

    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/dashboard',
      },
    })
  } catch (e) {
    console.error(e)
    return new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
}
