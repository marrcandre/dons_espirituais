import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockInsert, mockNotifyAdmin, mockGenerateAI, mockClearSession } = vi.hoisted(() => ({
  mockInsert: vi.fn(),
  mockNotifyAdmin: vi.fn(),
  mockGenerateAI: vi.fn(),
  mockClearSession: vi.fn(),
}))

vi.mock('../../repositories/responseRepository', () => ({
  insert: mockInsert,
}))

vi.mock('../../repositories/aiRepository', () => ({
  invokeNotifyAdmin: (...args: any[]) => mockNotifyAdmin(...args),
  invokeGenerateAI: (...args: any[]) => mockGenerateAI(...args),
}))

vi.mock('../quiz/quiz-session', () => ({
  clearSession: mockClearSession,
}))

import { submitQuiz } from '../quiz/submit-quiz'

function makeAnswers(overrides: Record<number, number> = {}): Record<number, number> {
  const answers: Record<number, number> = {}
  for (let i = 0; i < 135; i++) {
    answers[i] = overrides[i] ?? 0
  }
  return answers
}

const validInput = {
  answers: makeAnswers({ 0: 3, 27: 3, 54: 3, 81: 3, 108: 3 }),
  userInfo: { name: 'João', gp: 'Igreja', age: '30' },
  userId: 'user-123',
  userEmail: 'joao@email.com',
  questionOrder: [0, 1, 2, 3, 4],
}

beforeEach(() => {
  mockInsert.mockReset()
  mockNotifyAdmin.mockReset()
  mockGenerateAI.mockReset()
  mockClearSession.mockReset()
  mockInsert.mockResolvedValue({ id: 'response-1' })
  mockNotifyAdmin.mockResolvedValue(undefined)
  mockGenerateAI.mockResolvedValue(undefined)
  mockClearSession.mockReturnValue(undefined)
})

describe('submitQuiz', () => {
  it('monta payload completo e persiste via responseRepository', async () => {
    const result = await submitQuiz(validInput)

    expect(mockInsert).toHaveBeenCalledOnce()
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        name: 'João',
        email: 'joao@email.com',
        gp: 'Igreja',
        age: 30,
        question_order: [0, 1, 2, 3, 4],
      }),
    )
    expect(result).toEqual({ id: 'response-1' })
  })

  it('calcula scores corretamente via domínio', async () => {
    await submitQuiz(validInput)

    const payload = mockInsert.mock.calls[0][0]
    expect(payload.scores[0]).toBe(15)
    for (let i = 1; i < 27; i++) {
      expect(payload.scores[i]).toBe(0)
    }
  })

  it('serializa answers como array indexado no payload', async () => {
    await submitQuiz(validInput)

    const payload = mockInsert.mock.calls[0][0]
    expect(Array.isArray(payload.answers)).toBe(true)
    expect(payload.answers).toHaveLength(135)
    expect(payload.answers[0]).toBe(3)
    expect(payload.answers[27]).toBe(3)
  })

  it('limpa sessão salva após persistência', async () => {
    await submitQuiz(validInput)

    expect(mockClearSession).toHaveBeenCalledWith('user-123')
    expect(mockClearSession).toHaveBeenCalledOnce()
  })

  it('dispara notificação admin e geração IA após persistência', async () => {
    await submitQuiz(validInput)

    expect(mockNotifyAdmin).toHaveBeenCalledWith('response-1')
    expect(mockGenerateAI).toHaveBeenCalledWith('response-1')
  })

  it('propaga erro quando insert falha', async () => {
    mockInsert.mockRejectedValueOnce(new Error('DB error'))

    await expect(submitQuiz(validInput)).rejects.toThrow('DB error')
  })

  it('não interrompe fluxo quando side effects falham (fire-and-forget)', async () => {
    mockNotifyAdmin.mockRejectedValueOnce(new Error('Notify failed'))
    mockGenerateAI.mockRejectedValueOnce(new Error('AI failed'))

    const result = await submitQuiz(validInput)

    expect(result).toEqual({ id: 'response-1' })
    expect(mockClearSession).toHaveBeenCalledOnce()
  })
})
