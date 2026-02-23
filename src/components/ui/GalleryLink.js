import Image from 'next/image'
import Link from 'next/link'

export default function GalleryLink() {
  return (
    <div className="pt-4">
      <Link href="/karolyi-galeria" className="block group">
        <div className="relative aspect-3/4 w-full mb-3 overflow-hidden rounded shadow-sm border border-gray-100">
          <Image
            src="/assets/galeria_logo.jpg"
            alt="Károlyi István Galéria"
            fill
            className="object-cover"
          />
        </div>
        <span className="block text-center text-school-blue font-bold text-[14px] hover:underline uppercase tracking-wide">
          Károlyi István Galéria
        </span>
      </Link>
    </div>
  )
}
