const STORAGE_PREFIX = 'quiz_state_'

interface SavedSession {
  questionOrder: number[]
  answers: Record<number, number>
  currentIndex: number
  userInfo: { name: string; gp: string; age: string }
  savedAt: number
}

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`
}

export function checkSavedSession(userId: string): SavedSession | null {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return null

    const parsed = JSON.parse(raw) as SavedSession
    if (parsed.questionOrder?.length && parsed.userInfo) {
      return parsed
    }
  } catch {
    // Invalid JSON — treat as no session
  }
  return null
}

export function clearSession(userId: string): void {
  localStorage.removeItem(storageKey(userId))
}

export function saveSession(userId: string, session: SavedSession): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(session))
}
