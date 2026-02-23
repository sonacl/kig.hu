import AdminLayout from '@/components/layout/AdminLayout'
import PostEditor from '@/components/forms/PostEditor'

export default function NewPostPage() {
  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded border">
        <PostEditor />
      </div>
    </AdminLayout>
  )
}
