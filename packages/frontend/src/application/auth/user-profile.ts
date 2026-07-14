import { getUser } from '../../repositories/authRepository'
import { findById } from '../../repositories/userRepository'
import type { UserProfile } from './ports'

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getUser()
  if (!user) return null

  const profile = await findById(user.id)

  return {
    name: profile?.name ?? '',
    email: user.email ?? '',
  }
}
