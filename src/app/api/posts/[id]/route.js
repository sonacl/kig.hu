import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/api-utils'

export async function PUT(request, { params }) {
  const { id } = await params
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

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        description: description || null,
        featuredImage,
        redirectUrl: redirectUrl || null,
        isAktualis,
        isKozhasznu: isKozhasznu !== undefined ? isKozhasznu : false,
        status: status || 'PUBLIC',
        tags: {
          set: [],
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
    return Response.json({ message: 'Error updating post' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const [user, errorResponse] = await requireAuth()
  if (errorResponse) return errorResponse

  try {
    await prisma.post.delete({
      where: { id },
    })

    return Response.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error(error)
    return Response.json({ message: 'Error deleting post' }, { status: 500 })
  }
}
