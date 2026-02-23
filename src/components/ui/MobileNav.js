'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav({ items }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = index => {
    setOpenDropdown(openDropdown === index ? null : index)
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full py-2.5 bg-[#f2f7ff] border-y border-gray-200 text-school-navy font-bold text-xs uppercase tracking-wider"
        aria-label="Menü megnyitása"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
        Menü
      </button>

      {isOpen && (
        <div className="bg-white border-b border-gray-200 shadow-lg">
          <ul className="divide-y divide-gray-100">
            {items.map((item, index) => {
              const hasSubItems = item.subItems && item.subItems.length > 0

              return (
                <li key={item.id || item.label}>
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-school-navy font-bold text-xs uppercase tracking-wide"
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openDropdown === index && (
                        <ul className="bg-gray-50 border-t border-gray-100">
                          {item.subItems.map(sub => (
                            <li key={sub.id || sub.label}>
                              <Link
                                href={sub.url || '#'}
                                onClick={() => setIsOpen(false)}
                                className="block px-8 py-3 text-school-blue text-xs font-medium uppercase border-b border-gray-100 last:border-b-0"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.url || '#'}
                      onClick={() => setIsOpen(false)}
                      className="block px-5 py-3.5 text-school-navy font-bold text-xs uppercase tracking-wide"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
