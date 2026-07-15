import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const { mockFindById, mockFindByUserId, mockListAll, mockUpdateField, mockDeleteResponse } = vi.hoisted(() => ({
  mockFindById: vi.fn(),
  mockFindByUserId: vi.fn(),
  mockListAll: vi.fn(),
  mockUpdateField: vi.fn(),
  mockDeleteResponse: vi.fn(),
}))

vi.mock('../../repositories/responseRepository', () => ({
  findById: mockFindById,
  findByUserId: mockFindByUserId,
  listAll: mockListAll,
  updateField: mockUpdateField,
  deleteResponse: mockDeleteResponse,
}))

import { useResponsesStore } from '../responses'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useResponsesStore', () => {
  describe('fetchById', () => {
    it('sets current response and loading state on success', async () => {
      const data = { id: 'r1', name: 'Test', scores: {} }
      mockFindById.mockResolvedValue(data)
      const store = useResponsesStore()

      await store.fetchById('r1')

      expect(store.current).toEqual(data)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(mockFindById).toHaveBeenCalledWith('r1')
    })

    it('sets error message and nulls current when not found', async () => {
      mockFindById.mockRejectedValue(new Error('Not found'))
      const store = useResponsesStore()

      await store.fetchById('r1')

      expect(store.current).toBeNull()
      expect(store.error).toBe('Resultado não encontrado.')
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchByUserId', () => {
    it('sets list on success', async () => {
      const data = [{ id: 'r1' }, { id: 'r2' }]
      mockFindByUserId.mockResolvedValue(data)
      const store = useResponsesStore()

      await store.fetchByUserId('u1', { fields: 'id,created_at' })

      expect(store.list).toEqual(data)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(mockFindByUserId).toHaveBeenCalledWith('u1', 'id,created_at', { fields: 'id,created_at' })
    })

    it('clears list and sets error on failure', async () => {
      mockFindByUserId.mockRejectedValue(new Error('fail'))
      const store = useResponsesStore()
      store.list = [{ id: 'old' }]

      await store.fetchByUserId('u1')

      expect(store.list).toEqual([])
      expect(store.error).toBe('Não foi possível carregar seus resultados. Tente novamente.')
      expect(store.loading).toBe(false)
    })
  })

  describe('fetchAll', () => {
    it('sets list on success', async () => {
      const data = [{ id: 'r1' }]
      mockListAll.mockResolvedValue(data)
      const store = useResponsesStore()

      await store.fetchAll()

      expect(store.list).toEqual(data)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('clears list and sets error on failure', async () => {
      mockListAll.mockRejectedValue(new Error('fail'))
      const store = useResponsesStore()

      await store.fetchAll()

      expect(store.list).toEqual([])
      expect(store.error).toBe('Erro ao carregar painel admin')
      expect(store.loading).toBe(false)
    })
  })

  describe('updateField', () => {
    it('returns true on success', async () => {
      mockUpdateField.mockResolvedValue(undefined)
      const store = useResponsesStore()

      const result = await store.updateField('r1', 'name', 'New Name')

      expect(result).toBe(true)
      expect(mockUpdateField).toHaveBeenCalledWith('r1', 'name', 'New Name')
    })

    it('returns false on error', async () => {
      mockUpdateField.mockRejectedValue(new Error('fail'))
      const store = useResponsesStore()

      const result = await store.updateField('r1', 'name', 'New')

      expect(result).toBe(false)
    })
  })

  describe('deleteItem', () => {
    it('removes item from list and clears current on success', async () => {
      mockDeleteResponse.mockResolvedValue(undefined)
      const store = useResponsesStore()
      store.list = [{ id: 'r1' }, { id: 'r2' }]
      store.current = { id: 'r1' }

      const result = await store.deleteItem('r1')

      expect(result).toBe(true)
      expect(store.list).toEqual([{ id: 'r2' }])
      expect(store.current).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(mockDeleteResponse).toHaveBeenCalledWith('r1')
    })

    it('keeps current when deleting unrelated item', async () => {
      mockDeleteResponse.mockResolvedValue(undefined)
      const store = useResponsesStore()
      store.list = [{ id: 'r1' }, { id: 'r2' }]
      store.current = { id: 'r2' }

      const result = await store.deleteItem('r1')

      expect(result).toBe(true)
      expect(store.list).toEqual([{ id: 'r2' }])
      expect(store.current).toEqual({ id: 'r2' })
    })

    it('returns false and sets error on failure', async () => {
      mockDeleteResponse.mockRejectedValue(new Error('Delete failed'))
      const store = useResponsesStore()

      const result = await store.deleteItem('r1')

      expect(result).toBe(false)
      expect(store.error).toBe('Erro ao excluir teste. Tente novamente.')
      expect(store.loading).toBe(false)
    })
  })

  describe('$reset', () => {
    it('clears current, list, loading and error', () => {
      const store = useResponsesStore()
      store.current = { id: 'r1' }
      store.list = [{ id: 'r1' }]
      store.loading = true
      store.error = 'some error'

      store.$reset()

      expect(store.current).toBeNull()
      expect(store.list).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })
})
