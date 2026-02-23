import './globals.css'
import Layout from '@/components/layout/Layout'

const siteName = 'Újpesti Károlyi István Általános Iskola és Gimnázium'
const siteUrl = 'https://kig.hu'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    'Az Újpesti Károlyi István Általános Iskola és Gimnázium hivatalos weboldala. Hírek, aktualitások, közhasznú információk, felvételi tájékoztató.',
  keywords: [
    'Károlyi István',
    'általános iskola',
    'gimnázium',
    'Újpest',
    'Budapest',
    'iskola',
    'felvételi',
    'oktatás',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: siteUrl,
    siteName,
    title: siteName,
    description: 'Az Újpesti Károlyi István Általános Iskola és Gimnázium hivatalos weboldala.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
