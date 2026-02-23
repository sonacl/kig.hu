import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { getAktualis, getKozhasznu } from '@/lib/queries'
import { TAG_ICONS } from '@/lib/constants'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, description: true, featuredImage: true },
  })
  if (!post) return { title: 'Bejegyzés nem található' }

  return {
    title: post.title,
    description:
      post.description || `${post.title} — Újpesti Károlyi István Általános Iskola és Gimnázium`,
    openGraph: {
      title: post.title,
      description: post.description || post.title,
      type: 'article',
      ...(post.featuredImage && { images: [{ url: post.featuredImage }] }),
    },
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params

  const [post, { posts: aktualisPosts }, { posts: kozhasznuPosts }] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
      include: { tags: true, author: { select: { name: true } } },
    }),
    getAktualis(),
    getKozhasznu(),
  ])

  if (!post) notFound()

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/4 order-2 md:order-1">
        <Sidebar aktualisPosts={aktualisPosts} kozhasznuPosts={kozhasznuPosts} />
      </div>

      <div className="w-full md:w-3/4 order-1 md:order-2">
        <Link href="/" className="text-school-blue text-sm hover:underline mb-6 inline-block">
          ← Vissza a főoldalra
        </Link>

        <article className="bg-white">
          <header className="mb-8">
            <div className="text-[12px] text-gray-500 mb-2 font-medium">
              {format(new Date(post.createdAt), 'yyyy. MMMM d.', { locale: hu })}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-school-navy leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex gap-3 items-center">
              {post.tags.map(
                tag =>
                  TAG_ICONS[tag.icon] && (
                    <div
                      key={tag.id}
                      className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"
                    >
                      <Image
                        src={TAG_ICONS[tag.icon].src}
                        alt={TAG_ICONS[tag.icon].label}
                        width={20}
                        height={20}
                      />
                      <span className="text-[11px] font-bold text-gray-700">
                        {TAG_ICONS[tag.icon].label}
                      </span>
                    </div>
                  )
              )}
            </div>
          </header>

          <div
            className="prose prose-blue max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  )
}
