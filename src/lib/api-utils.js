import { getCurrentUser } from '@/lib/auth'

/**
 * Require authenticated user. Returns user or sends 401 response.
 * @param {'ADMIN'|'EDITOR'|null} requiredRole - Optional role check
 * @returns {Promise<[user, null] | [null, Response]>}
 */
export async function requireAuth(requiredRole = null) {
  const user = await getCurrentUser()
  if (!user) return [null, Response.json({ error: 'Unauthorized' }, { status: 401 })]
  if (requiredRole && user.role !== requiredRole)
    return [null, Response.json({ error: 'Forbidden' }, { status: 403 })]
  return [user, null]
}
