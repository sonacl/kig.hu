import prisma from '@/lib/prisma'

const siteUrl = 'https://kig.hu'

export default async function sitemap() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLIC', OR: [{ redirectUrl: null }, { redirectUrl: '' }] },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const postEntries = posts.map(post => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...postEntries,
  ]
}
