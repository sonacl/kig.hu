import Link from 'next/link'
import { Button } from '@/components/ui/Button'

import { cookies } from 'next/headers'
import { lucia } from '@/lib/auth'

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value
  let user = null
  if (sessionId) {
    const { user: sessionUser } = await lucia.validateSession(sessionId)
    user = sessionUser
  }
  const role = user?.role || 'EDITOR'

  const links = [
    { href: '/admin/dashboard', label: 'Vezérlőpult' },
    { href: '/admin/posts', label: 'Összes bejegyzés' },
    { href: '/admin/posts/new', label: 'Új bejegyzés' },
  ]

  if (role === 'ADMIN') {
    links.push({ href: '/admin/redirects', label: 'Átirányítások' })
    links.push({ href: '/admin/navbar', label: 'Navigáció (Menü)' })
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
      <nav className="w-full md:w-64 bg-gray-50 border rounded p-4 h-full">
        <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>Adminisztráció</span>
        </h2>
        <ul className="space-y-1 text-sm">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-3 py-2 rounded text-gray-700 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {role === 'ADMIN' && (
            <li className="pt-4 mt-4 border-t">
              <Link
                href="/admin/users"
                className="block px-3 py-2 rounded text-gray-700 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                Felhasználók
              </Link>
            </li>
          )}
          <li>
            <form action="/api/auth/logout" method="POST">
              <Button
                type="submit"
                variant="ghostDanger"
                className="w-full text-left px-3 py-2 justify-start font-medium hover:bg-red-50"
              >
                Kijelentkezés
              </Button>
            </form>
          </li>
        </ul>
      </nav>

      <div className="grow">{children}</div>
    </div>
  )
}
