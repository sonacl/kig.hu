import fs from 'fs'
import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? '',
})
const prisma = new PrismaClient({ adapter })

function decodeEntities(text) {
  if (!text) return ''
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

function cleanUrl(url) {
  if (!url) return null
  if (url === 'https://kig.hu/') return '/'
  if (url.startsWith('https://kig.hu/')) {
    const path = url.replace('https://kig.hu/', '')
    const cleanPath = path.replace(/\/$/, '')
    if (!cleanPath) return '/'
    return '/posts/' + cleanPath
  }
  return url
}

async function main() {
  const html = fs.readFileSync('homepage.html', 'utf8')

  // 1. Isolate the main menu block - more robust finding
  // Looking for the UL inside the nav element
  const navStart = html.indexOf('<nav  id="site-navigation-bottom-desktop"')
  if (navStart === -1) {
    console.error('Could not find nav element')
    return
  }

  const startTag = '<ul id="menu-fomenu"'
  const startIndex = html.indexOf(startTag, navStart)
  if (startIndex === -1) {
    console.error('Could not find start of menu ul')
    return
  }

  // Find matching </ul> for this specific menu
  let depth = 0
  let menuHtml = ''
  let cursor = startIndex

  // We need to find the specific </ul> that closes the one at startIndex
  while (cursor < html.length) {
    const nextStart = html.indexOf('<ul', cursor + 1)
    const nextEnd = html.indexOf('</ul>', cursor + 1)

    if (nextEnd === -1) break

    if (nextStart !== -1 && nextStart < nextEnd) {
      depth++
      cursor = nextStart
    } else {
      depth--
      cursor = nextEnd
      if (depth === -1) {
        // depth was 0, now -1 means we found the closing tag for our startTag
        menuHtml = html.substring(html.indexOf('>', startIndex) + 1, nextEnd)
        break
      }
    }
  }

  if (!menuHtml) {
    console.error('Failed to isolate menu HTML')
    return
  }

  console.log('🚀 Parsing WordPress Navbar (V3 - Improved Nesting)...')

  const items = []
  let itemCursor = 0

  // Top-level LI items have id="menu-item--bottom-desktop-..."
  while (itemCursor < menuHtml.length) {
    const liStartStr = '<li id="menu-item--bottom-desktop-'
    const liStart = menuHtml.indexOf(liStartStr, itemCursor)
    if (liStart === -1) break

    // Find the matching </li>
    let liDepth = 0
    let liEnd = -1
    let liSearch = menuHtml.indexOf('>', liStart) + 1

    while (liSearch < menuHtml.length) {
      const nextLiStart = menuHtml.indexOf('<li', liSearch)
      const nextLiEnd = menuHtml.indexOf('</li>', liSearch)

      if (nextLiEnd === -1) break

      if (nextLiStart !== -1 && nextLiStart < nextLiEnd) {
        liDepth++
        liSearch = nextLiStart + 3
      } else {
        if (liDepth === 0) {
          liEnd = nextLiEnd
          break
        }
        liDepth--
        liSearch = nextLiEnd + 5
      }
    }

    if (liEnd === -1) break

    const liContent = menuHtml.substring(liStart, liEnd)

    // Extract parent link - only looking at the start of the LI content
    const firstTagEnd = liContent.indexOf('>')
    const linkMatch = liContent.match(
      /<a(?: href="([^"]*)")?><span class="link-before">([\s\S]+?)<\/span><\/a>/
    )

    if (linkMatch) {
      let label = linkMatch[2].split('<span')[0]
      label = decodeEntities(label)
      const url = cleanUrl(linkMatch[1] || null)

      const subItems = []
      // Check for sub-menu within THIS LI
      const subMenuStart = liContent.indexOf('<ul class="sub-menu')
      if (subMenuStart !== -1) {
        const subMenuEnd = liContent.lastIndexOf('</ul>')
        const subHtml = liContent.substring(subMenuStart, subMenuEnd)

        // Sub-items are simple LIs inside
        const subItemRegex =
          /<li[^>]*><a href="([^"]*)"><span class="link-before">([\s\S]+?)<\/span><\/a>([\s\S]*?)<\/li>/g
        let subMatch
        while ((subMatch = subItemRegex.exec(subHtml)) !== null) {
          let subLabel = subMatch[2].split('<span')[0]
          subLabel = decodeEntities(subLabel)
          const subUrl = cleanUrl(subMatch[1])
          subItems.push({ label: subLabel, url: subUrl })

          // Nesting level 2 support
          const nestedSubMenuMatch = subMatch[3].match(/<ul class="sub-menu[^"]*">([\s\S]+?)<\/ul>/)
          if (nestedSubMenuMatch) {
            const nestedSubHtml = nestedSubMenuMatch[1]
            const nestedRegex =
              /<li[^>]*><a href="([^"]*)"><span class="link-before">([\s\S]+?)<\/span><\/a><\/li>/g
            let nMatch
            while ((nMatch = nestedRegex.exec(nestedSubHtml)) !== null) {
              let nLabel = nMatch[2].split('<span')[0]
              nLabel = decodeEntities(nLabel)
              const nUrl = cleanUrl(nMatch[1])
              // For our simple Navbar, we'll flatten level 2 into level 1 for now
              // or just add them as regular subitems if the UI supports it.
              subItems.push({ label: '  ↳ ' + nLabel, url: nUrl })
            }
          }
        }
      }

      items.push({ label, url, subItems })
    }

    itemCursor = liEnd + 5
  }

  console.log(`📥 Found ${items.length} top-level menu items.`)

  // 3. Update Database
  try {
    await prisma.navSubItem.deleteMany()
    await prisma.navItem.deleteMany()

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const createdItem = await prisma.navItem.create({
        data: {
          label: item.label,
          url: item.subItems.length > 0 ? null : item.url, // If has subitems, URL should be null for dropdown
          order: i,
        },
      })

      if (item.subItems.length > 0) {
        await prisma.navSubItem.createMany({
          data: item.subItems.map((sub, sIndex) => ({
            label: sub.label,
            url: sub.url,
            order: sIndex,
            navItemId: createdItem.id,
          })),
        })
      }
    }
    console.log('✅ Navbar imported successfully with sub-items!')
  } catch (err) {
    console.error('❌ Error updating database:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
