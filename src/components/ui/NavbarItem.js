import Link from 'next/link'

export default function NavbarItem({ item, showSeparator }) {
  const hasSubItems = item.subItems && item.subItems.length > 0

  return (
    <li className="flex items-center relative group">
      {showSeparator && <span className="text-gray-300 h-4 border-l border-gray-300 mx-0"></span>}

      {hasSubItems ? (
        <div className="inline-block px-3 py-2.5 hover:bg-white hover:text-school-blue transition-colors uppercase cursor-pointer">
          {item.label} ▾
        </div>
      ) : (
        <Link
          href={item.url || '#'}
          className="inline-block px-3 py-2.5 hover:bg-white hover:text-school-blue transition-colors uppercase"
        >
          {item.label}
        </Link>
      )}

      {hasSubItems && (
        <ul className="absolute left-0 top-full hidden group-hover:block bg-white border border-gray-200 shadow-md min-w-[200px] z-50">
          {item.subItems.map(subItem => (
            <li
              key={subItem.id || subItem.label}
              className="border-b border-gray-100 last:border-b-0"
            >
              <Link
                href={subItem.url || '#'}
                className="block px-4 py-3 text-school-navy hover:bg-gray-50 transition-colors uppercase whitespace-nowrap"
              >
                {subItem.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
