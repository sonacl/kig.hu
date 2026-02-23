import SidebarFeed from '@/components/ui/SidebarFeed'
import GalleryLink from '@/components/ui/GalleryLink'
import SocialIcons from '@/components/ui/SocialIcons'

export default function Sidebar({
  aktualisPosts = [],
  aktualisCurrentPage = 1,
  aktualisTotalPages = 1,
  kozhasznuPosts = [],
  kozhasznuCurrentPage = 1,
  kozhasznuTotalPages = 1,
}) {
  return (
    <aside className="w-full flex flex-col gap-10">
      <SidebarFeed
        variant="aktualis"
        posts={aktualisPosts}
        currentPage={aktualisCurrentPage}
        totalPages={aktualisTotalPages}
      />

      <SocialIcons />

      <SidebarFeed
        variant="kozhasznu"
        posts={kozhasznuPosts}
        currentPage={kozhasznuCurrentPage}
        totalPages={kozhasznuTotalPages}
      />

      <GalleryLink />

      <div className="w-1/3 h-px bg-gray-200 mx-auto"></div>
    </aside>
  )
}
