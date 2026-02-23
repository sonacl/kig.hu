import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
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
