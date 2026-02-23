import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { TAG_ICONS } from '@/lib/constants'

export default function PostCard({ post }) {
  return (
    <article className="flex flex-col md:flex-row gap-4 pb-6 border-b border-gray-100 last:border-0">
      {post.featuredImage && (
        <div className="w-full md:w-32 h-24 md:h-auto shrink-0 relative overflow-hidden rounded bg-gray-50">
          <img src={post.featuredImage} alt={post.title} className="object-cover w-full h-full" />
        </div>
      )}

      <div className="grow">
        <div className="text-[11px] text-gray-500 mb-1 font-medium">
          {format(new Date(post.createdAt), 'yyyy. MMMM d.', { locale: hu })}
        </div>

        <h3 className="font-bold text-lg md:text-xl mb-2 text-school-navy line-clamp-2 leading-snug">
          <Link href={post.redirectUrl || `/posts/${post.slug}`}>{post.title}</Link>
        </h3>

        <div className="flex gap-2">
          {post.tags.map(
            tag =>
              TAG_ICONS[tag.icon] && (
                <Image
                  key={tag.id}
                  src={TAG_ICONS[tag.icon].src}
                  alt={TAG_ICONS[tag.icon].label}
                  width={20}
                  height={20}
                  title={TAG_ICONS[tag.icon].label}
                />
              )
          )}
        </div>
      </div>
    </article>
  )
}
