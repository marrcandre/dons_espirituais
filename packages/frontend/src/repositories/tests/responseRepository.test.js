import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockQueryBuilder } = vi.hoisted(() => {
  const builder = {
    abortSignal: vi.fn(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  }
  return { mockQueryBuilder: builder }
})

vi.mock('../../infrastructure/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => mockQueryBuilder),
  },
}))

import * as responseRepository from '../responseRepository.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('responseRepository', () => {
  describe('findById()', () => {
    it('returns response when found', async () => {
      const fakeData = { id: 'r1', user_id: 'u1', scores: [1, 2, 3] }
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: fakeData, error: null })

      const result = await responseRepository.findById('r1')

      expect(result).toEqual(fakeData)
    })

    it('propagates error when query returns error', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: null, error: new Error('Query failed') })

      await expect(responseRepository.findById('r1')).rejects.toThrow('Query failed')
    })
  })

  describe('findByUserId()', () => {
    it('returns list of responses', async () => {
      const fakeData = [
        { id: 'r1', user_id: 'u1', scores: [1, 2] },
        { id: 'r2', user_id: 'u1', scores: [3, 4] },
      ]
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: fakeData, error: null })

      const result = await responseRepository.findByUserId('u1')

      expect(result).toEqual(fakeData)
    })

    it('applies limit when specified', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: [{ id: 'r1' }], error: null })

      await responseRepository.findByUserId('u1', '*', { limit: 1 })

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(1)
    })
  })

  describe('insert()', () => {
    it('persists payload and returns id', async () => {
      const fakeResult = { id: 'new-id' }
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: fakeResult, error: null })

      const result = await responseRepository.insert({ user_id: 'u1', scores: [1, 2, 3] })

      expect(result).toEqual(fakeResult)
    })
  })

  describe('countByUserId()', () => {
    it('returns correct count', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ count: 5, error: null })

      const result = await responseRepository.countByUserId('u1')

      expect(result).toBe(5)
    })

    it('returns zero when count is null', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ count: null, error: null })

      const result = await responseRepository.countByUserId('u1')

      expect(result).toBe(0)
    })
  })

  describe('updateField()', () => {
    it('executes update without error', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ error: null })

      await expect(
        responseRepository.updateField('r1', 'name', 'updated'),
      ).resolves.toBeUndefined()
    })
  })

  describe('deleteResponse()', () => {
    it('deletes response successfully', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ error: null })

      await expect(
        responseRepository.deleteResponse('r1'),
      ).resolves.toBeUndefined()
    })

    it('propagates error when delete fails', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ error: new Error('Delete failed') })

      await expect(responseRepository.deleteResponse('r1')).rejects.toThrow('Delete failed')
    })
  })

  describe('selectField()', () => {
    it('returns field value', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: { name: 'John' }, error: null })

      const result = await responseRepository.selectField('r1', 'name')

      expect(result).toBe('John')
    })

    it('returns null when field does not exist', async () => {
      mockQueryBuilder.abortSignal.mockResolvedValue({ data: {}, error: null })

      const result = await responseRepository.selectField('r1', 'name')

      expect(result).toBeNull()
    })
  })
})
