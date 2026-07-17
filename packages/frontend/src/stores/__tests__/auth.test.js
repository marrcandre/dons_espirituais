import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

let onAuthCallback

const { mockGetSession, mockSignInWithGoogle, mockSignOut, mockGetUserProfile } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockSignInWithGoogle: vi.fn(),
  mockSignOut: vi.fn(),
  mockGetUserProfile: vi.fn(),
}))

vi.mock('../../repositories/authRepository', () => ({
  getSession: mockGetSession,
  signInWithGoogle: mockSignInWithGoogle,
  signOut: mockSignOut,
  onAuthStateChange: vi.fn((callback) => {
    onAuthCallback = callback
    return 'subscription'
  }),
}))

vi.mock('../../application/auth/user-profile', () => ({
  getUserProfile: mockGetUserProfile,
}))

vi.mock('../../router', () => ({
  default: { push: vi.fn() },
}))

import { useAuthStore } from '../auth'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  onAuthCallback = null
})

describe('useAuthStore', () => {
  describe('init', () => {
    it('sets user and profile when session exists', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'test@test.com' } })
      mockGetUserProfile.mockResolvedValue({ id: 'u1', name: 'Admin', email: 'test@test.com', role: 'admin' })
      const store = useAuthStore()

      await store.init()

      expect(store.user).toEqual({ id: 'u1', email: 'test@test.com' })
      expect(store.profile).toEqual({ id: 'u1', name: 'Admin', email: 'test@test.com', role: 'admin' })
      expect(store.initialized).toBe(true)
      expect(mockGetSession).toHaveBeenCalledTimes(1)
      expect(mockGetUserProfile).toHaveBeenCalledOnce()
    })

    it('sets user to null and skips profile when no session', async () => {
      mockGetSession.mockResolvedValue({ user: null })
      const store = useAuthStore()

      await store.init()

      expect(store.user).toBeNull()
      expect(store.profile).toBeNull()
      expect(store.initialized).toBe(true)
      expect(mockGetUserProfile).not.toHaveBeenCalled()
    })

    it('handles errors without throwing', async () => {
      mockGetSession.mockRejectedValue(new Error('Network error'))
      const store = useAuthStore()

      await store.init()

      expect(store.user).toBeNull()
      expect(store.profile).toBeNull()
      expect(store.initialized).toBe(true)
    })

    it('sets up auth subscription on first call', async () => {
      mockGetSession.mockResolvedValue({ user: null })
      const store = useAuthStore()

      await store.init()

      expect(onAuthCallback).toBeDefined()
    })
  })

  describe('signInWithGoogle', () => {
    it('delegates to authRepository', async () => {
      mockSignInWithGoogle.mockResolvedValue(undefined)
      const store = useAuthStore()

      await store.signInWithGoogle()

      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
    })
  })

  describe('signOut', () => {
    it('calls signOut, clears state and navigates to /login', async () => {
      mockSignOut.mockResolvedValue(undefined)
      const store = useAuthStore()
      store.user = { id: 'u1' }
      store.profile = { id: 'u1', role: 'admin' }

      await store.signOut()

      expect(mockSignOut).toHaveBeenCalledTimes(1)
      expect(store.user).toBeNull()
      expect(store.profile).toBeNull()
    })
  })

  describe('computed roles', () => {
    it('isAdmin is true when role is admin', () => {
      const store = useAuthStore()
      store.profile = { role: 'admin' }

      expect(store.isAdmin).toBe(true)
      expect(store.isSupervisor).toBe(false)
      expect(store.canAccessAdminPanel).toBe(true)
    })

    it('isSupervisor is true when role is supervisor', () => {
      const store = useAuthStore()
      store.profile = { role: 'supervisor' }

      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(true)
      expect(store.canAccessAdminPanel).toBe(true)
    })

    it('canAccessAdminPanel is false for other roles', () => {
      const store = useAuthStore()
      store.profile = { role: 'user' }

      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(false)
      expect(store.canAccessAdminPanel).toBe(false)
    })

    it('isAdmin is false when profile is null', () => {
      const store = useAuthStore()

      expect(store.isAdmin).toBe(false)
      expect(store.isSupervisor).toBe(false)
      expect(store.canAccessAdminPanel).toBe(false)
    })
  })
})
