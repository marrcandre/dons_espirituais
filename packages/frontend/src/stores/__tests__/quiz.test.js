import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const { mockCheckSavedSession, mockClearSession, mockSaveSession } = vi.hoisted(() => ({
  mockCheckSavedSession: vi.fn(),
  mockClearSession: vi.fn(),
  mockSaveSession: vi.fn(),
}))

vi.mock('../auth', () => ({
  useAuthStore: () => ({ user: { id: 'user-1' } }),
}))

vi.mock('../../helpers/array', () => ({
  shuffle: (arr) => [...arr].sort(),
}))

vi.mock('../../application/quiz/quiz-session', () => ({
  checkSavedSession: mockCheckSavedSession,
  clearSession: mockClearSession,
  saveSession: mockSaveSession,
}))

import { useQuizStore } from '../quiz'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useQuizStore', () => {
  describe('startFresh', () => {
    it('initializes question order with 135 ids, clears answers, persists', () => {
      const store = useQuizStore()

      store.startFresh()

      expect(store.questionOrder.length).toBe(135)
      expect(store.answers).toEqual({})
      expect(store.currentIndex).toBe(0)
      expect(store.userInfo).toEqual({ name: '', gp: '', age: '' })
      expect(store.hasSavedState).toBe(false)
      expect(mockSaveSession).toHaveBeenCalledTimes(1)
    })
  })

  describe('setAnswer', () => {
    it('records answer and persists', () => {
      const store = useQuizStore()
      store.startFresh()
      mockSaveSession.mockClear()

      store.setAnswer(1, 2)

      expect(store.answers[1]).toBe(2)
      expect(mockSaveSession).toHaveBeenCalledTimes(1)
    })

    it('overwrites existing answer', () => {
      const store = useQuizStore()
      store.startFresh()

      store.setAnswer(1, 1)
      store.setAnswer(1, 3)

      expect(store.answers[1]).toBe(3)
    })
  })

  describe('nextQuestion', () => {
    it('advances currentIndex and persists', () => {
      const store = useQuizStore()
      store.startFresh()
      mockSaveSession.mockClear()

      store.nextQuestion()

      expect(store.currentIndex).toBe(1)
      expect(mockSaveSession).toHaveBeenCalledTimes(1)
    })

    it('does not advance beyond the last question', () => {
      const store = useQuizStore()
      store.currentIndex = 134

      store.nextQuestion()

      expect(store.currentIndex).toBe(134)
    })
  })

  describe('prevQuestion', () => {
    it('goes back one question', () => {
      const store = useQuizStore()
      store.currentIndex = 5

      store.prevQuestion()

      expect(store.currentIndex).toBe(4)
    })

    it('does not go before the first question', () => {
      const store = useQuizStore()

      store.prevQuestion()

      expect(store.currentIndex).toBe(0)
    })
  })

  describe('setUserInfo', () => {
    it('merges provided fields into userInfo', () => {
      const store = useQuizStore()

      store.setUserInfo({ name: 'John' })

      expect(store.userInfo).toEqual({ name: 'John', gp: '', age: '' })
    })

    it('preserves existing fields on partial update', () => {
      const store = useQuizStore()
      store.setUserInfo({ name: 'John' })

      store.setUserInfo({ gp: 'GP1' })

      expect(store.userInfo).toEqual({ name: 'John', gp: 'GP1', age: '' })
    })
  })

  describe('totalQuestions', () => {
    it('returns 135', () => {
      const store = useQuizStore()

      expect(store.totalQuestions).toBe(135)
    })
  })

  describe('currentQuestionId', () => {
    it('returns id at currentIndex', () => {
      const store = useQuizStore()
      store.questionOrder = [5, 3, 1]

      expect(store.currentQuestionId).toBe(5)
    })

    it('returns undefined when questionOrder is empty', () => {
      const store = useQuizStore()

      expect(store.currentQuestionId).toBeUndefined()
    })
  })

  describe('progress', () => {
    it('returns percentage of answered questions', () => {
      const store = useQuizStore()
      store.answers = Object.fromEntries(Array.from({ length: 34 }, (_, i) => [i, 1]))

      expect(store.progress).toBe(25)
    })
  })

  describe('checkSavedState', () => {
    it('returns true when saved session exists', () => {
      mockCheckSavedSession.mockReturnValue({ answers: { 1: 2 } })
      const store = useQuizStore()

      const result = store.checkSavedState()

      expect(result).toBe(true)
      expect(store.hasSavedState).toBe(true)
      expect(mockCheckSavedSession).toHaveBeenCalledWith('user-1')
    })

    it('returns false when no saved session', () => {
      mockCheckSavedSession.mockReturnValue(null)
      const store = useQuizStore()

      const result = store.checkSavedState()

      expect(result).toBe(false)
      expect(store.hasSavedState).toBe(false)
    })
  })

  describe('restoreSaved', () => {
    it('restores quiz state from saved session', () => {
      mockCheckSavedSession.mockReturnValue({
        questionOrder: [1, 2, 3],
        answers: { 1: 2 },
        currentIndex: 1,
        userInfo: { name: 'John', gp: '', age: '' },
      })
      const store = useQuizStore()

      store.restoreSaved()

      expect(store.questionOrder).toEqual([1, 2, 3])
      expect(store.answers).toEqual({ 1: 2 })
      expect(store.currentIndex).toBe(1)
      expect(store.userInfo.name).toBe('John')
    })

    it('does nothing when no saved session', () => {
      mockCheckSavedSession.mockReturnValue(null)
      const store = useQuizStore()

      store.restoreSaved()

      expect(store.questionOrder).toEqual([])
    })
  })

  describe('clearState', () => {
    it('clears all state and calls clearSession', () => {
      mockClearSession.mockReturnValue()
      const store = useQuizStore()
      store.startFresh()

      store.clearState()

      expect(store.questionOrder).toEqual([])
      expect(store.answers).toEqual({})
      expect(store.currentIndex).toBe(0)
      expect(store.hasSavedState).toBe(false)
      expect(mockClearSession).toHaveBeenCalledWith('user-1')
    })
  })

  describe('savedAnswerCount', () => {
    it('returns count from saved answers', () => {
      mockCheckSavedSession.mockReturnValue({ answers: { 1: 2, 2: 3 } })
      const store = useQuizStore()

      expect(store.savedAnswerCount).toBe(2)
    })

    it('returns 0 when no saved session', () => {
      mockCheckSavedSession.mockReturnValue(null)
      const store = useQuizStore()

      expect(store.savedAnswerCount).toBe(0)
    })
  })
})
