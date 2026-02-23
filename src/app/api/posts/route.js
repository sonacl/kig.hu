import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/api-utils'
import { generateUniqueSlug } from '@/lib/utils'

export async function POST(request) {
  const [user, errorResponse] = await requireAuth()
  if (errorResponse) return errorResponse

  try {
    const {
      title,
      content,
      description,
      featuredImage,
      redirectUrl,
      isAktualis,
      isKozhasznu,
      status,
      tags,
    } = await request.json()

    const uniqueSlug = await generateUniqueSlug(title)

    const post = await prisma.post.create({
      data: {
        title,
        slug: uniqueSlug,
        content,
        description: description || null,
        featuredImage,
        redirectUrl: redirectUrl || null,
        isAktualis,
        isKozhasznu: isKozhasznu || false,
        status: status || 'PUBLIC',
        authorId: user.id,
        tags: {
          connectOrCreate: tags.map(tagIcon => ({
            where: { name: tagIcon },
            create: { name: tagIcon, icon: tagIcon },
          })),
        },
      },
    })

    return Response.json(post)
  } catch (error) {
    console.error(error)
    return Response.json({ message: 'Error creating post' }, { status: 500 })
  }
}
