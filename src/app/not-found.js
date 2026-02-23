import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h2 className="text-8xl font-bold text-school-navy mb-6">404</h2>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Hoppá! Ez az oldal nem található.</h3>
      <p className="text-gray-500 mb-10 max-w-md mx-auto">
        Úgy tűnik, a keresett oldal már nem létezik, vagy elgépelted a webcímet.
      </p>
      <Link
        href="/"
        className="text-school-blue text-sm hover:text-school-blue hover:underline mb-6 inline-block"
      >
        ← Vissza a főoldalra
      </Link>
    </div>
  )
}
