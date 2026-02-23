import Pagination from '@/components/ui/Pagination'
import Sidebar from '@/components/layout/Sidebar'
import PostCard from '@/components/ui/PostCard'
import prisma from '@/lib/prisma'
import { getAktualis, getKozhasznu, PUBLIC_POST_WHERE } from '@/lib/queries'

const POSTS_PER_PAGE = 5

async function getPosts(page) {
  const skip = (page - 1) * POSTS_PER_PAGE
  const where = { ...PUBLIC_POST_WHERE }
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
  ])
  return { posts, totalPages: Math.ceil(totalCount / POSTS_PER_PAGE) }
}

export default async function HomePage({ searchParams }) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const aktualisPage = parseInt(params.aktualisPage || '1', 10)
  const kozhasznuPage = parseInt(params.kozhasznuPage || '1', 10)

  const [
    { posts, totalPages: postsTotalPages },
    { posts: aktualisPosts, totalPages: aktualisTotalPages },
    { posts: kozhasznuPosts, totalPages: kozhasznuTotalPages },
  ] = await Promise.all([getPosts(page), getAktualis(aktualisPage), getKozhasznu(kozhasznuPage)])

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/4 order-2 md:order-1">
        <Sidebar
          aktualisPosts={aktualisPosts}
          aktualisCurrentPage={aktualisPage}
          aktualisTotalPages={aktualisTotalPages}
          kozhasznuPosts={kozhasznuPosts}
          kozhasznuCurrentPage={kozhasznuPage}
          kozhasznuTotalPages={kozhasznuTotalPages}
        />
      </div>

      <div className="w-full md:w-3/4 order-1 md:order-2">
        <h1 className="text-school-navy font-bold text-xs tracking-[0.2em] border-b border-gray-200 pb-2 mb-8 uppercase text-center">
          Hírek
        </h1>

        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-20 text-gray-400 italic">Nincsenek hírek jelenleg.</div>
          )}
        </div>

        {posts.length > 0 && (
          <Pagination currentPage={page} totalPages={postsTotalPages} paramName="page" />
        )}
      </div>
    </div>
  )
}
