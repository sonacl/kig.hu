import NavbarItem from '@/components/ui/NavbarItem'
import MobileNav from '@/components/ui/MobileNav'
import prisma from '@/lib/prisma'

export default async function Navbar() {
  const navItems = await prisma.navItem.findMany({
    include: { subItems: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })

  const defaultItems = [
    { label: 'KEZDŐOLDAL', url: '/' },
    { label: 'ÜGYINTÉZÉS', url: '/ugyintezes' },
    { label: 'TÁJÉKOZTATÓK', url: '/tajekoztatok' },
    { label: 'KAPCSOLAT', url: '/kapcsolat' },
  ]

  const renderItems = navItems.length > 0 ? navItems : defaultItems
  const serializedItems = JSON.parse(JSON.stringify(renderItems))

  return (
    <>
      <nav className="bg-[#f2f7ff] border-y border-gray-200 relative z-50 hidden md:block">
        <div className="school-container">
          <ul className="flex flex-wrap items-center justify-start text-[11px] font-bold tracking-tight">
            {renderItems.map((item, index) => (
              <NavbarItem key={item.id || item.label} item={item} showSeparator={index > 0} />
            ))}
          </ul>
        </div>
      </nav>

      <MobileNav items={serializedItems} />
    </>
  )
}
