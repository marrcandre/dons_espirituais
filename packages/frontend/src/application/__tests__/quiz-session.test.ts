import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkSavedSession, clearSession } from '../quiz/quiz-session'

function mockLocalStorage() {
  const store: Record<string, string> = {}
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  })
}

const VALID_SESSION = {
  questionOrder: [0, 1, 2, 3],
  answers: { 0: 1, 1: 2 },
  currentIndex: 2,
  userInfo: { name: 'João', gp: 'Igreja', age: '30' },
  savedAt: Date.now(),
}

const USER_ID = 'user-123'

describe('checkSavedSession', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('retorna sessão quando existe dado válido no localStorage', () => {
    localStorage.setItem(`quiz_state_${USER_ID}`, JSON.stringify(VALID_SESSION))
    const result = checkSavedSession(USER_ID)
    expect(result).not.toBeNull()
    expect(result?.userInfo.name).toBe('João')
    expect(result?.questionOrder).toEqual([0, 1, 2, 3])
  })

  it('retorna null quando não há dado salvo', () => {
    const result = checkSavedSession(USER_ID)
    expect(result).toBeNull()
  })

  it('retorna null para JSON inválido', () => {
    localStorage.setItem(`quiz_state_${USER_ID}`, 'not-json')
    const result = checkSavedSession(USER_ID)
    expect(result).toBeNull()
  })

  it('retorna null quando questionOrder está ausente', () => {
    const { questionOrder: _, ...invalid } = VALID_SESSION
    localStorage.setItem(`quiz_state_${USER_ID}`, JSON.stringify(invalid))
    const result = checkSavedSession(USER_ID)
    expect(result).toBeNull()
  })

  it('retorna null quando userInfo está ausente', () => {
    const { userInfo: _, ...invalid } = VALID_SESSION
    localStorage.setItem(`quiz_state_${USER_ID}`, JSON.stringify(invalid))
    const result = checkSavedSession(USER_ID)
    expect(result).toBeNull()
  })
})

describe('clearSession', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('remove a chave do localStorage', () => {
    localStorage.setItem(`quiz_state_${USER_ID}`, JSON.stringify(VALID_SESSION))
    expect(checkSavedSession(USER_ID)).not.toBeNull()
    clearSession(USER_ID)
    expect(checkSavedSession(USER_ID)).toBeNull()
  })

  it('não lança erro quando não há sessão salva', () => {
    expect(() => clearSession(USER_ID)).not.toThrow()
  })
})
