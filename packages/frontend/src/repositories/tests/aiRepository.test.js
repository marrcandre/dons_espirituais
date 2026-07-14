import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFunctions, mockChannel, mockRemoveChannel } = vi.hoisted(() => {
  const channel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(),
  }
  return {
    mockFunctions: { invoke: vi.fn() },
    mockChannel: channel,
    mockRemoveChannel: vi.fn(),
  }
})

vi.mock('../../services/supabase', () => ({
  supabase: {
    functions: mockFunctions,
    channel: vi.fn(() => mockChannel),
    removeChannel: mockRemoveChannel,
  },
}))

import * as aiRepository from '../aiRepository.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('aiRepository', () => {
  describe('invokeGenerateAI()', () => {
    it('calls invoke with correct params', async () => {
      mockFunctions.invoke.mockResolvedValue({ error: null })

      await aiRepository.invokeGenerateAI('r1', 'Test', false)

      expect(mockFunctions.invoke).toHaveBeenCalledWith('generate-ai', {
        body: { responseId: 'r1', name: 'Test', force: false },
      })
    })

    it('passes force=true when specified', async () => {
      mockFunctions.invoke.mockResolvedValue({ error: null })

      await aiRepository.invokeGenerateAI('r1', 'Test', true)

      expect(mockFunctions.invoke).toHaveBeenCalledWith('generate-ai', {
        body: { responseId: 'r1', name: 'Test', force: true },
      })
    })

    it('throws on error', async () => {
      mockFunctions.invoke.mockResolvedValue({ error: new Error('Invoke failed') })

      await expect(aiRepository.invokeGenerateAI('r1', 'Test')).rejects.toThrow('Invoke failed')
    })
  })

  describe('invokeNotifyAdmin()', () => {
    it('calls invoke with notify-admin function', async () => {
      mockFunctions.invoke.mockResolvedValue({ error: null })

      await aiRepository.invokeNotifyAdmin('r1')

      expect(mockFunctions.invoke).toHaveBeenCalledWith('notify-admin', {
        body: { responseId: 'r1' },
      })
    })

    it('throws on error', async () => {
      mockFunctions.invoke.mockResolvedValue({ error: new Error('Notify failed') })

      await expect(aiRepository.invokeNotifyAdmin('r1')).rejects.toThrow('Notify failed')
    })
  })

  describe('subscribeToUpdates()', () => {
    it('creates channel with postgres_changes listener', () => {
      const onChange = vi.fn()
      mockChannel.subscribe.mockReturnValue('channel-obj')

      const result = aiRepository.subscribeToUpdates('r1', onChange)

      expect(result).toBe('channel-obj')
      expect(mockChannel.on).toHaveBeenCalledWith(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'responses',
          filter: 'id=eq.r1',
        },
        expect.any(Function),
      )
      expect(mockChannel.subscribe).toHaveBeenCalled()
    })

    it('calls onChange when payload is received', () => {
      const onChange = vi.fn()
      let registeredCallback
      mockChannel.on.mockImplementation((_event, _config, callback) => {
        registeredCallback = callback
        return mockChannel
      })
      mockChannel.subscribe.mockReturnValue('channel-obj')

      aiRepository.subscribeToUpdates('r1', onChange)
      registeredCallback({ new: { id: 'r1', ai_analysis: 'done' } })

      expect(onChange).toHaveBeenCalledWith({ id: 'r1', ai_analysis: 'done' })
    })
  })

  describe('unsubscribeChannel()', () => {
    it('removes channel via supabase', () => {
      aiRepository.unsubscribeChannel('channel-1')

      expect(mockRemoveChannel).toHaveBeenCalledWith('channel-1')
    })

    it('does nothing when channel is null', () => {
      aiRepository.unsubscribeChannel(null)

      expect(mockRemoveChannel).not.toHaveBeenCalled()
    })

    it('does nothing when channel is undefined', () => {
      aiRepository.unsubscribeChannel(undefined)

      expect(mockRemoveChannel).not.toHaveBeenCalled()
    })
  })
})
