import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatDate, formatRelativeDate, formatDateTime } from '../date.js'

afterEach(() => {
  vi.useRealTimers()
})

describe('formatDate', () => {
  it('formats ISO date with default month style', () => {
    const result = formatDate('2026-07-14T12:00:00Z')
    expect(result).toMatch(/14 de \w+ de 2026/)
  })

  it('formats with short month style', () => {
    const result = formatDate('2026-07-14T12:00:00Z', { month: 'short' })
    expect(result).toMatch(/14 de \w{3}\./)
  })
})

describe('formatRelativeDate', () => {
  it('returns "Hoje" for today', () => {
    const today = new Date().toISOString()
    expect(formatRelativeDate(today)).toBe('Hoje')
  })

  it('returns "Ontem" for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeDate(yesterday)).toBe('Ontem')
  })

  it('returns "Há X dias" for recent dates', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    const result = formatRelativeDate(fiveDaysAgo)
    expect(result).toMatch(/Há \d+ dias/)
    expect(result).toBe('Há 5 dias')
  })

  it('returns "Há 1 mês" for ~30 days', () => {
    vi.setSystemTime(new Date('2026-07-14'))
    const date = new Date('2026-06-14').toISOString()
    expect(formatRelativeDate(date)).toBe('Há 1 mês')
  })

  it('returns "Há X meses" for multi-month', () => {
    vi.setSystemTime(new Date('2026-07-14'))
    const date = new Date('2026-04-14').toISOString()
    expect(formatRelativeDate(date)).toBe('Há 3 meses')
  })

  it('returns "Há 1 ano" for ~12 months', () => {
    vi.setSystemTime(new Date('2026-07-14'))
    const date = new Date('2025-07-14').toISOString()
    expect(formatRelativeDate(date)).toBe('Há 1 ano')
  })

  it('returns "Há X anos" for multiple years', () => {
    vi.setSystemTime(new Date('2026-07-14'))
    const date = new Date('2023-07-14').toISOString()
    expect(formatRelativeDate(date)).toBe('Há 3 anos')
  })

  it('returns "Há X anos e Y meses" for years with months', () => {
    vi.setSystemTime(new Date('2026-07-14'))
    const date = new Date('2024-03-14').toISOString()
    expect(formatRelativeDate(date)).toBe('Há 2 anos e 4 meses')
  })
})

describe('formatDateTime', () => {
  it('formats ISO date with time', () => {
    const result = formatDateTime('2026-07-14T10:30:00')
    expect(result).toContain('14/07/2026')
  })
})
