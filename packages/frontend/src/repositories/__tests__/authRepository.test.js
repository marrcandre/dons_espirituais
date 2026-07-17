import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: {
    getSession: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
  },
}))

vi.mock('../../infrastructure/supabase/client', () => ({
  supabase: { auth: mockAuth },
}))

import * as authRepository from '../authRepository.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authRepository', () => {
  describe('getSession()', () => {
    it('returns session when available', async () => {
      const fakeSession = { user: { id: 'u1' } }
      mockAuth.getSession.mockResolvedValue({ data: { session: fakeSession }, error: null })

      const result = await authRepository.getSession()

      expect(result).toEqual(fakeSession)
    })

    it('throws when getSession returns error', async () => {
      mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: new Error('Auth error') })

      await expect(authRepository.getSession()).rejects.toThrow('Auth error')
    })
  })

  describe('getUser()', () => {
    it('returns user when available', async () => {
      const fakeUser = { id: 'u1', email: 'test@test.com' }
      mockAuth.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

      const result = await authRepository.getUser()

      expect(result).toEqual(fakeUser)
    })

    it('throws when getUser returns error', async () => {
      mockAuth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('Not found') })

      await expect(authRepository.getUser()).rejects.toThrow('Not found')
    })
  })

  describe('onAuthStateChange()', () => {
    it('returns subscription and registers callback', () => {
      const callback = vi.fn()
      mockAuth.onAuthStateChange.mockReturnValue({ data: { subscription: 'sub-1' } })

      const result = authRepository.onAuthStateChange(callback)

      expect(result).toBe('sub-1')
      expect(mockAuth.onAuthStateChange).toHaveBeenCalledWith(callback)
    })
  })

  describe('signInWithGoogle()', () => {
    it('calls signInWithOAuth with google provider', async () => {
      mockAuth.signInWithOAuth.mockResolvedValue({ error: null })

      await authRepository.signInWithGoogle()

      expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
    })

    it('throws on error', async () => {
      mockAuth.signInWithOAuth.mockResolvedValue({ error: new Error('OAuth failed') })

      await expect(authRepository.signInWithGoogle()).rejects.toThrow('OAuth failed')
    })
  })

  describe('signOut()', () => {
    it('calls signOut without error', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null })

      await expect(authRepository.signOut()).resolves.toBeUndefined()
    })

    it('throws on error', async () => {
      mockAuth.signOut.mockResolvedValue({ error: new Error('Sign out failed') })

      await expect(authRepository.signOut()).rejects.toThrow('Sign out failed')
    })
  })
})
