import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? '',
})

const prisma = new PrismaClient({ adapter })

const WP_ENDPOINTS = [
  'https://kig.hu/wp-json/wp/v2/posts?_embed&per_page=100',
  'https://kig.hu/wp-json/wp/v2/pages?_embed&per_page=100',
]

// Mapping WordPress category IDs to our system
const CAT_MAP = {
  9: 'A', // Alsó tagozat
  10: 'F', // Felső tagozat
  11: 'G', // Gimnázium
}

const AKTUALIS_CAT_ID = 8

function decodeEntities(text) {
  if (!text) return ''
  return text
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
}

async function main() {
  console.log('🚀 Starting FULL WordPress import (Posts + Pages) from kig.hu...')

  // 1. Get an admin user to assign posts to
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  })

  if (!admin) {
    console.error('❌ No admin user found in database. Run add-admin.js first.')
    return
  }

  console.log(`👤 Assigning posts to: ${admin.email}`)

  let totalImported = 0

  for (const endpoint of WP_ENDPOINTS) {
    console.log(`\n📥 Fetching from: ${endpoint}`)
    let page = 1
    let hasMore = true

    while (hasMore) {
      console.log(`  📄 Page ${page}...`)
      try {
        const response = await fetch(`${endpoint}&page=${page}`)

        if (!response.ok) {
          if (response.status === 400) {
            console.log('  🏁 End of endpoint.')
          } else {
            console.error(`  ❌ WP API error: ${response.status} ${response.statusText}`)
          }
          hasMore = false
          break
        }

        const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1')
        const wpPosts = await response.json()

        if (!wpPosts || wpPosts.length === 0) {
          hasMore = false
          break
        }

        for (const wpPost of wpPosts) {
          const title = decodeEntities(wpPost.title.rendered)
          const slug = wpPost.slug
          const content = wpPost.content.rendered
          const createdAt = new Date(wpPost.date)

          let featuredImage = null
          if (
            wpPost._embedded &&
            wpPost._embedded['wp:featuredmedia'] &&
            wpPost._embedded['wp:featuredmedia'][0]
          ) {
            featuredImage = wpPost._embedded['wp:featuredmedia'][0].source_url
          }

          const wpCats = wpPost.categories || []
          const tagsToConnect = []
          let isAktualis = false

          for (const catId of wpCats) {
            if (CAT_MAP[catId]) {
              tagsToConnect.push(CAT_MAP[catId])
            }
            if (catId === AKTUALIS_CAT_ID) {
              isAktualis = true
            }
          }

          try {
            await prisma.post.upsert({
              where: { slug },
              update: {
                title,
                content,
                featuredImage,
                isAktualis,
                createdAt,
              },
              create: {
                title,
                slug,
                content,
                featuredImage,
                isAktualis,
                status: 'PUBLIC',
                authorId: admin.id,
                createdAt,
                tags: {
                  connectOrCreate: tagsToConnect.map(tagIcon => ({
                    where: { name: tagIcon },
                    create: { name: tagIcon, icon: tagIcon },
                  })),
                },
              },
            })
            totalImported++
            process.stdout.write('.')
          } catch (err) {
            console.error(`\n  ❌ Error importing "${title}":`, err.message)
          }
        }

        if (page >= totalPages) {
          hasMore = false
        } else {
          page++
        }
      } catch (error) {
        console.error(`\n  ❌ Failed: ${error.message}`)
        hasMore = false
      }
    }
  }

  console.log(`\n\n✅ FULL IMPORT FINISHED! Total items processed: ${totalImported}`)
  await prisma.$disconnect()
}

main()
