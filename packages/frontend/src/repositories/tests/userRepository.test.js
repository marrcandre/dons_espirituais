import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockQueryBuilder } = vi.hoisted(() => {
  const builder = {
    abortSignal: vi.fn(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
  }
  return { mockQueryBuilder: builder }
})

vi.mock('../../services/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockQueryBuilder),
  },
}))

import * as userRepository from '../userRepository.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('userRepository', () => {
  describe('findById()', () => {
    it('returns user object when found', async () => {
      const fakeUser = { id: 'u1', name: 'John', email: 'john@test.com' }
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: fakeUser, error: null })

      const result = await userRepository.findById('u1')

      expect(result).toEqual(fakeUser)
    })

    it('returns null when user not found', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: null, error: null })

      const result = await userRepository.findById('u1')

      expect(result).toBeNull()
    })

    it('propagates supabase error', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: null, error: new Error('DB error') })

      await expect(userRepository.findById('u1')).rejects.toThrow('DB error')
    })
  })
})
