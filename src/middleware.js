import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('auth_session')

  if (!sessionCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/users/:path*', '/api/redirects/:path*'],
}
