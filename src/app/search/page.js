import prisma from '@/lib/prisma'
import PostCard from '@/components/ui/PostCard'
import Sidebar from '@/components/layout/Sidebar'
import Fuse from 'fuse.js'
import { getAktualis, getKozhasznu, PUBLIC_POST_WHERE } from '@/lib/queries'

export const metadata = {
  title: 'Keresés',
  description:
    'Keresés az Újpesti Károlyi István Általános Iskola és Gimnázium bejegyzései között.',
}

async function searchPosts(query) {
  const posts = await prisma.post.findMany({
    where: PUBLIC_POST_WHERE,
    orderBy: { createdAt: 'desc' },
    include: { tags: true },
  })

  const fuse = new Fuse(posts, {
    keys: ['title', 'content'],
    threshold: 0.1,
    ignoreLocation: true,
    ignoreFieldNorm: true,
  })

  return fuse.search(query).map(r => r.item)
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams
  const query = params.q || ''

  const [searchResults, { posts: aktualisPosts }, { posts: kozhasznuPosts }] = await Promise.all([
    query ? searchPosts(query) : Promise.resolve([]),
    getAktualis(),
    getKozhasznu(),
  ])

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/4 order-2 md:order-1">
        <Sidebar aktualisPosts={aktualisPosts} kozhasznuPosts={kozhasznuPosts} />
      </div>

      <div className="w-full md:w-3/4 order-1 md:order-2">
        <h1 className="text-school-navy font-bold text-xs tracking-[0.2em] border-b border-gray-200 pb-2 mb-8 uppercase text-center">
          Keresési eredmények: {query}
        </h1>

        <div className="space-y-8">
          {searchResults.length > 0 ? (
            searchResults.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-20 text-gray-400 italic">
              {query
                ? 'Nincs találat erre a keresésre.'
                : 'Kérjük, adjon meg egy keresési kifejezést.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
