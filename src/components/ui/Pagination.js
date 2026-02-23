'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function Pagination({ currentPage = 1, totalPages = 1, paramName = 'page' }) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const getHref = page => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramName, page)
    return `?${params.toString()}`
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-2 text-xs font-bold text-school-blue">
      {currentPage > 1 && (
        <Link href={getHref(currentPage - 1)} className="hover:underline">
          &lt;&lt; Előző
        </Link>
      )}

      <span className="text-black px-2 py-1 bg-gray-100 rounded">{currentPage}</span>

      {currentPage < totalPages && (
        <Link href={getHref(currentPage + 1)} className="hover:underline">
          {currentPage + 1}
        </Link>
      )}

      {currentPage < totalPages - 1 && (
        <>
          <span className="px-1">...</span>
          <Link href={getHref(totalPages)} className="hover:underline">
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link href={getHref(currentPage + 1)} className="hover:underline">
          Következő &gt;&gt;
        </Link>
      )}
    </div>
  )
}
