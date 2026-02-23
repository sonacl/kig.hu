import Image from 'next/image'
import Link from 'next/link'

const socialLinks = [
  {
    alt: 'Belépés a Krétába',
    href: 'https://klik034863001.e-kreta.hu/',
    src: '/assets/kreta_icon2.png',
  },
  {
    alt: 'Károlyi Kultúrportál - Kattanj rá!',
    href: 'https://www.facebook.com/karolyikulturaportal',
    src: '/assets/kkp_icon.png',
  },
  {
    alt: 'YouTube',
    href: 'https://www.youtube.com/@ujpestikarolyiistvanaltala1181',
    src: '/assets/youtube_icon.png',
  },
]

export const SocialIcons = () => (
  <div className="flex flex-col gap-4 items-center">
    {socialLinks.map(link => (
      <Link key={link.alt} href={link.href} className="w-full">
        <Image
          src={link.src}
          alt={link.alt}
          width={244}
          height={65}
          className="w-full h-auto object-contain"
        />
      </Link>
    ))}
  </div>
)

export default SocialIcons
