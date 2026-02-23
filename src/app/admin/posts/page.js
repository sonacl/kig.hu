import AdminLayout from '@/components/layout/AdminLayout'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import PostsTable from './PostsTable'

async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tags: true, author: { select: { name: true, email: true } } },
  })
}

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Összes bejegyzés</h1>
          <Link href="/admin/posts/new" className="no-underline">
            <Button variant="primary">+ Új hozzáadása</Button>
          </Link>
        </div>

        <PostsTable posts={JSON.parse(JSON.stringify(posts))} />
      </div>
    </AdminLayout>
  )
}
