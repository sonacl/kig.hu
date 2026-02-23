import AdminLayout from '@/components/layout/AdminLayout'
import PostEditor from '@/components/forms/PostEditor'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  })

  if (!post) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded border">
        <PostEditor initialData={post} />
      </div>
    </AdminLayout>
  )
}
