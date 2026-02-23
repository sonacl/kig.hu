import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="relative w-full h-24 md:h-28 overflow-hidden">
        <Image src="/assets/fejlec.png" alt="" fill className="object-cover object-top" priority />

        <div className="school-container relative h-full flex items-center justify-between pointer-events-none">
          <div className="relative h-15 md:h-15 w-70 md:w-100 transform translate-y-5.5">
            <Image
              src="/assets/logo_2.png"
              alt="KIG Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <div className="relative h-20 md:h-26 w-40 md:w-64 self-end hidden md:block">
            <Image
              src="/assets/iskola.png"
              alt="Iskola épület"
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>

      <div className="school-container py-3 md:py-16 border-t border-gray-100 mt-0 md:mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          <div className="text-[11px] md:text-[12px] font-semibold space-y-1 md:space-y-1.5 leading-tight text-center md:text-left w-full md:w-auto py-0 md:py-4">
            <p>
              <span className="text-gray-500 uppercase">Cím:</span>{' '}
              <span className="text-school-blue">1041 Budapest, Erzsébet utca 69.</span>
            </p>
            <p>
              <span className="text-gray-500 uppercase">Telefon:</span>{' '}
              <span className="text-school-blue">
                +36-1-369-2273 (alsó tagozat){' '}
                <span className="hidden md:inline text-gray-300">|</span> +36 1 369-3627 (felső
                tagozat, gimnázium)
              </span>
            </p>
            <p className="flex flex-wrap justify-center md:justify-start items-center gap-x-2">
              <span>
                <span className="text-gray-500 uppercase">E-mail:</span>{' '}
                <span className="text-school-blue">titkarsag.karolyii@ebtk.hu</span>
              </span>
              <span className="hidden md:inline text-gray-300">|</span>
              <span>
                <span className="text-gray-500 uppercase">OM-azonosító:</span>{' '}
                <span className="text-school-blue">034863</span>
              </span>
            </p>
          </div>

          <form
            action="/search"
            method="GET"
            className="flex items-center border border-gray-300 rounded overflow-hidden shadow-sm h-10 w-full md:w-auto max-w-sm md:max-w-none mb-3 md:mb-0"
          >
            <Input
              type="text"
              name="q"
              placeholder="Keresés..."
              className="w-full md:w-64 rounded-none border-0 ring-0 focus:ring-0 shadow-none border-r border-gray-300"
            />
            <Button type="submit" className="rounded-none h-full px-4">
              <span className="sr-only">Search</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
