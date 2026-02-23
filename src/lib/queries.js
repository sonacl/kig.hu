import prisma from '@/lib/prisma'

const DEFAULT_TAKE = 10

export async function getPaginatedPosts(where, page = 1, perPage = DEFAULT_TAKE) {
  const skip = (page - 1) * perPage
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ])
  return { posts, totalPages: Math.ceil(totalCount / perPage) }
}

export function getAktualis(page = 1, perPage = DEFAULT_TAKE) {
  return getPaginatedPosts({ isAktualis: true, status: 'PUBLIC' }, page, perPage)
}

export function getKozhasznu(page = 1, perPage = DEFAULT_TAKE) {
  return getPaginatedPosts({ isKozhasznu: true, status: 'PUBLIC' }, page, perPage)
}

export const PUBLIC_POST_WHERE = {
  status: 'PUBLIC',
  OR: [{ redirectUrl: null }, { redirectUrl: '' }],
}
