import { getUser } from '../../repositories/authRepository'
import { findById } from '../../repositories/userRepository'
import type { UserProfile } from './ports'

async function findByIdWithRetry(userId: string, retries = 3, delay = 300): Promise<Record<string, unknown> | null> {
  for (let i = 0; i < retries; i++) {
    const profile = await findById(userId).catch(() => null)
    if (profile) return profile
    if (i < retries - 1) await new Promise((r) => setTimeout(r, delay))
  }
  return null
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getUser()
  if (!user) return null

  const profile = await findByIdWithRetry(user.id)

  return {
    id: user.id,
    name: (profile?.name as string) ?? '',
    email: user.email ?? '',
    role: (profile?.role as string) ?? 'user',
  }
}
