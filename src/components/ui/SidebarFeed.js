import Image from 'next/image'
import Link from 'next/link'
import Pagination from '@/components/ui/Pagination'

const FEED_VARIANTS = {
  aktualis: {
    title: 'Aktuális',
    border: 'border-school-red',
    paramName: 'aktualisPage',
    showDescription: false,
  },
  kozhasznu: {
    title: 'Közhasznú infó',
    border: 'border-school-blue',
    paramName: 'kozhasznuPage',
    showDescription: true,
  },
}

export default function SidebarFeed({
  variant = 'aktualis',
  posts,
  currentPage = 1,
  totalPages = 1,
}) {
  if (!posts || posts.length === 0) return null
  const config = FEED_VARIANTS[variant]

  return (
    <div className={`bg-[#f8f9fa] p-4 rounded-sm border-l-4 ${config.border}`}>
      <h2 className="text-gray-800 font-bold text-sm mb-4 uppercase tracking-wider">
        {config.title}
      </h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="flex gap-2 items-start group">
            <div className="shrink-0 mt-0.5">
              <Image src="/assets/fjel.png" alt="" width={16} height={16} className="opacity-80" />
            </div>
            <div>
              <Link
                href={post.redirectUrl || `/posts/${post.slug}`}
                className="text-school-blue text-[15px] font-medium hover:underline leading-tight"
              >
                {post.title}
              </Link>
              {config.showDescription && post.description && (
                <p className="text-gray-500 text-xs mt-0.5 leading-snug">{post.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paramName={config.paramName}
        />
      </div>
    </div>
  )
}
