'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { Button } from '@/components/ui/Button'

export default function PostsTable({ posts }) {
  const router = useRouter()

  const handleDelete = async id => {
    if (!confirm('Biztosan törölni szeretné ezt a bejegyzést?')) return
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const error = await res.json()
        alert('Hiba: ' + (error.message || 'Törlés sikertelen.'))
      }
    } catch (e) {
      alert('Hálózati hiba')
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 font-bold text-gray-700">Cím</th>
            <th className="px-4 py-3 font-bold text-gray-700">Szerző</th>
            <th className="px-4 py-3 font-bold text-gray-700">Címkék</th>
            <th className="px-4 py-3 font-bold text-gray-700">Dátum</th>
            <th className="px-4 py-3 font-bold text-gray-700">Típus</th>
            <th className="px-4 py-3 font-bold text-gray-700">Műveletek</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 font-medium text-school-blue">
                <Link href={`/posts/${post.slug}`} target="_blank">
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-4 text-gray-600">{post.author?.name || post.author?.email}</td>
              <td className="px-4 py-4 text-xs font-bold text-gray-600">
                {post.tags.map(t => t.icon).join(', ')}
              </td>
              <td className="px-4 py-4 text-gray-500">
                {format(new Date(post.createdAt), 'yyyy.MM.dd.', { locale: hu })}
              </td>
              <td className="px-4 py-4">
                {post.redirectUrl ? (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Átirányítás
                  </span>
                ) : post.isAktualis ? (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Aktuális
                  </span>
                ) : post.isKozhasznu ? (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Közhasznú
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Hír
                  </span>
                )}
              </td>
              <td className="px-4 py-4 flex flex-row items-center gap-3">
                <Button as={Link} href={`/admin/posts/${post.id}`} variant="ghost">
                  Szerkesztés
                </Button>
                <Button variant="ghostDanger" onClick={() => handleDelete(post.id)}>
                  Törlés
                </Button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan="6" className="px-4 py-10 text-center text-gray-400 italic">
                Még nincsenek bejegyzések.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
