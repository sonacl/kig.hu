import { notFound, redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export default async function SlugCatcher({ params }) {
  const { slug } = await params

  const rawPath = `/${slug}`

  let destination = null

  try {
    const matchedRedirect = await prisma.redirect.findUnique({
      where: { source: rawPath },
    })

    if (matchedRedirect) {
      destination = matchedRedirect.destination
    }
  } catch (error) {
    console.error('Failed to lookup redirect:', error)
  }

  if (destination) {
    redirect(destination, 'replace')
  }

  notFound()
}
