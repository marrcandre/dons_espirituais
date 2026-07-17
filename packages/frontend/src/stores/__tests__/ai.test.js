import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const { mockInvokeGenerateAI, mockInvokeNotifyAdmin, mockSubscribeToUpdates, mockUnsubscribeChannel, mockSelectField } = vi.hoisted(() => ({
  mockInvokeGenerateAI: vi.fn(),
  mockInvokeNotifyAdmin: vi.fn(),
  mockSubscribeToUpdates: vi.fn(),
  mockUnsubscribeChannel: vi.fn(),
  mockSelectField: vi.fn(),
}))

vi.mock('../../repositories/aiRepository', () => ({
  invokeGenerateAI: mockInvokeGenerateAI,
  invokeNotifyAdmin: mockInvokeNotifyAdmin,
  subscribeToUpdates: mockSubscribeToUpdates,
  unsubscribeChannel: mockUnsubscribeChannel,
}))

vi.mock('../../repositories/responseRepository', () => ({
  selectField: mockSelectField,
}))

import { useAiStore } from '../ai'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useAiStore', () => {
  describe('generate', () => {
    it('calls invokeGenerateAI with given params', async () => {
      mockInvokeGenerateAI.mockResolvedValue(undefined)
      const store = useAiStore()

      await store.generate('r1', 'Test Name', false)

      expect(mockInvokeGenerateAI).toHaveBeenCalledWith('r1', 'Test Name', false)
    })
  })

  describe('regenerate', () => {
    it('calls invokeGenerateAI with force=true and returns selectField result', async () => {
      mockInvokeGenerateAI.mockResolvedValue(undefined)
      mockSelectField.mockResolvedValue({ ai_analysis: 'analysis text' })
      const store = useAiStore()

      const result = await store.regenerate('r1', 'Test')

      expect(mockInvokeGenerateAI).toHaveBeenCalledWith('r1', 'Test', true)
      expect(mockSelectField).toHaveBeenCalledWith('r1', 'ai_analysis')
      expect(result).toEqual({ ai_analysis: 'analysis text' })
    })

    it('throws if responseId is missing', async () => {
      const store = useAiStore()

      await expect(store.regenerate(null, 'Test')).rejects.toThrow('responseId obrigatório')
      await expect(store.regenerate(undefined, 'Test')).rejects.toThrow('responseId obrigatório')
    })

    it('throws if name is empty or blank', async () => {
      const store = useAiStore()

      await expect(store.regenerate('r1', '')).rejects.toThrow('name obrigatório')
      await expect(store.regenerate('r1', '   ')).rejects.toThrow('name obrigatório')
    })
  })

  describe('notifyAdmin', () => {
    it('calls invokeNotifyAdmin with given id', async () => {
      mockInvokeNotifyAdmin.mockResolvedValue(undefined)
      const store = useAiStore()

      await store.notifyAdmin('r1')

      expect(mockInvokeNotifyAdmin).toHaveBeenCalledWith('r1')
    })
  })

  describe('subscribe', () => {
    it('stores the channel and calls subscribeToUpdates', () => {
      mockSubscribeToUpdates.mockReturnValue('channel-1')
      const onChange = vi.fn()
      const store = useAiStore()

      store.subscribe('r1', onChange)

      expect(mockSubscribeToUpdates).toHaveBeenCalledWith('r1', onChange)
    })

    it('replaces existing subscription for the same id', () => {
      mockSubscribeToUpdates
        .mockReturnValueOnce('channel-old')
        .mockReturnValueOnce('channel-new')
      const store = useAiStore()
      store.subscribe('r1', vi.fn())

      store.subscribe('r1', vi.fn())

      expect(mockUnsubscribeChannel).toHaveBeenCalledWith('channel-old')
      expect(mockSubscribeToUpdates).toHaveBeenCalledTimes(2)
    })
  })

  describe('unsubscribe', () => {
    it('removes the channel for the given id', () => {
      mockSubscribeToUpdates.mockReturnValue('channel-1')
      const store = useAiStore()
      store.subscribe('r1', vi.fn())

      store.unsubscribe('r1')

      expect(mockUnsubscribeChannel).toHaveBeenCalledWith('channel-1')
    })

    it('does nothing if no subscription exists', () => {
      const store = useAiStore()

      store.unsubscribe('nonexistent')

      expect(mockUnsubscribeChannel).not.toHaveBeenCalled()
    })
  })

  describe('unsubscribeAll', () => {
    it('removes all active subscriptions', () => {
      mockSubscribeToUpdates
        .mockReturnValueOnce('ch-1')
        .mockReturnValueOnce('ch-2')
      const store = useAiStore()
      store.subscribe('r1', vi.fn())
      store.subscribe('r2', vi.fn())

      store.unsubscribeAll()

      expect(mockUnsubscribeChannel).toHaveBeenCalledWith('ch-1')
      expect(mockUnsubscribeChannel).toHaveBeenCalledWith('ch-2')
    })
  })
})
