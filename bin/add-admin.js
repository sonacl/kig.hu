import prisma from '../src/lib/prisma.js'
async function main() {
  const email = process.argv[2]
  const name = process.argv[3] || 'Admin'
  const role = process.argv[4]?.toUpperCase() || 'ADMIN'

  if (!email) {
    console.error(
      'Kérjük, adjon meg egy e-mail címet: bun run bin/add-admin.js <email> [név] [szerepkör (ADMIN/EDITOR)]'
    )
    process.exit(1)
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
      },
    })
    console.log(`Sikeresen hozzáadva: ${user.email} (${user.name}) - Szerepkör: ${user.role}`)
    console.log('Most már be tud jelentkezni a Google fiókjával a /admin/login oldalon.')
  } catch (error) {
    if (error.code === 'P2002') {
      console.error(`Hiba: Ez az e-mail cím (${email}) már létezik az adatbázisban.`)
    } else {
      console.error('Ismeretlen hiba történt:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
