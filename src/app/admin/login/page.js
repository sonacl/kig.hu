import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
        <h1 className="text-2xl font-bold mb-6 text-school-navy">Adminisztrátori Belépés</h1>
        <Button
          as="a"
          href="/api/auth/google"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 py-3"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Bejelentkezés Google fiókkal
        </Button>
      </div>
    </div>
  )
}
