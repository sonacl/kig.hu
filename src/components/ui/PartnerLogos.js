import Image from 'next/image'
import Link from 'next/link'

const partners = [
  {
    name: 'Újpest',
    href: 'https://ujpest.hu',
    src: '/assets/ujpest_cimer.jpg',
    w: 60,
    h: 90,
    imgClass: 'h-20 w-auto object-contain',
  },
  {
    name: 'Határtalanul',
    href: 'https://hatartalanul.net/',
    src: '/assets/hatartalanul_logo.jpg',
    w: 200,
    h: 80,
    imgClass: 'h-16 w-auto object-contain',
  },
  {
    name: 'Erasmus+',
    href: 'https://www.tka.hu/palyazatok/108/erasmus+',
    src: '/assets/erasmus_logo.png',
    w: 150,
    h: 50,
    imgClass: 'h-10 w-auto object-contain',
  },
  {
    name: 'MTA Alumni Program',
    href: 'https://mta.hu/alumni',
    src: '/assets/mta_logo.jpg',
    w: 150,
    h: 50,
    imgClass: 'h-10 w-auto object-contain',
  },
  {
    name: 'NEA',
    href: 'https://emet.gov.hu',
    src: '/assets/nea_logo.png',
    w: 150,
    h: 50,
    imgClass: 'h-12 w-auto object-contain',
  },
  {
    name: 'Internet Hotline',
    href: 'https://nmhh.hu/internethotline/',
    src: '/assets/hotline_logo.jpg',
    w: 150,
    h: 50,
    imgClass: 'h-10 w-auto object-contain',
  },
]

export const PartnerLogos = () => (
  <div className="text-center">
    <p className="text-gray-500 font-bold text-[10px] mb-6 uppercase tracking-widest">
      Köszönetnyilvánítás
    </p>
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
      {partners.map(p => (
        <Link
          key={p.name}
          href={p.href}
          target="_blank"
          className="transition-transform hover:scale-105 hover:opacity-100 opacity-80"
        >
          <Image src={p.src} alt={p.name} width={p.w} height={p.h} className={p.imgClass} />
        </Link>
      ))}
    </div>
  </div>
)

export default PartnerLogos
