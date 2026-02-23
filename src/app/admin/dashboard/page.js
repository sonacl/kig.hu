import AdminLayout from '@/components/layout/AdminLayout'
import prisma from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  const postCount = await prisma.post.count()
  const userCount = await prisma.user.count()
  return { postCount, userCount }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Vezérlőpult</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border rounded shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Bejegyzések</h3>
            <p className="text-3xl font-bold text-school-navy">{stats.postCount}</p>
            <div className="mt-4">
              <Link href="/admin/posts" className="text-school-blue text-sm hover:underline">
                Összes bejegyzés megtekintése →
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 border rounded shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Felhasználók</h3>
            <p className="text-3xl font-bold text-school-navy">{stats.userCount}</p>
            <div className="mt-4">
              <Link href="/admin/users" className="text-school-blue text-sm hover:underline">
                Felhasználók kezelése →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded text-blue-800 text-sm">
          <p>
            <strong>Üdvözöljük az új KIG Honlap Adminisztrációs felületén!</strong>
          </p>
          <p className="mt-1">
            Itt tudja kezelni a híreket, az aktualitásokat és a felhasználókat. A módosítások
            azonnal megjelennek a publikus oldalon.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
