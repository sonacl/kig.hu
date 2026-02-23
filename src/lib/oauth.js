import { Google } from 'arctic'

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
  process.env.GOOGLE_CLIENT_SECRET || 'placeholder_client_secret',
  process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    : 'http://localhost:3000/api/auth/google/callback'
)
