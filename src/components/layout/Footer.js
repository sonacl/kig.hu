import Image from 'next/image'
import Link from 'next/link'
import PartnerLogos from '@/components/ui/PartnerLogos'

export default function Footer() {
  return (
    <footer className="bg-[#f0f2f5] mt-12 py-12 border-t border-gray-200">
      <div className="school-container">
        <div className="flex flex-col items-center gap-10">
          <div className="text-center">
            <p className="text-school-blue font-bold text-xs mb-4 uppercase tracking-wider">
              Fenntartónk az Észak-Budapesti Tankerületi Központ
            </p>
            <Link
              href="http://kk.gov.hu/hirek-eszakbudapesti"
              target="_blank"
              className="inline-block transition-transform hover:scale-105"
            >
              <Image
                src="/assets/tankerulet_logo.png"
                alt="Tankerület"
                width={400}
                height={100}
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="w-full max-w-lg h-px bg-gray-300"></div>

          <PartnerLogos />
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-[10px] text-gray-500">
          <p>cica</p>
        </div>
      </div>
    </footer>
  )
}
