import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockGetUser, mockFindById } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFindById: vi.fn(),
}))

vi.mock('../../../repositories/authRepository', () => ({
  getUser: mockGetUser,
}))

vi.mock('../../../repositories/userRepository', () => ({
  findById: mockFindById,
}))

import { getUserProfile } from '../user-profile'

beforeEach(() => {
  mockGetUser.mockReset()
  mockFindById.mockReset()
})

describe('getUserProfile', () => {
  it('retorna name e email quando usuario autenticado tem perfil', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-1', email: 'joao@email.com' })
    mockFindById.mockResolvedValue({ name: 'João Silva' })

    const result = await getUserProfile()

    expect(result).toEqual({ name: 'João Silva', email: 'joao@email.com' })
  })

  it('retorna null quando nao ha usuario autenticado', async () => {
    mockGetUser.mockResolvedValue(null)

    const result = await getUserProfile()

    expect(result).toBeNull()
  })

  it('retorna name vazio quando usuario autenticado nao tem perfil', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-1', email: 'joao@email.com' })
    mockFindById.mockResolvedValue(null)

    const result = await getUserProfile()

    expect(result).toEqual({ name: '', email: 'joao@email.com' })
  })

  it('propaga erro quando repository falha', async () => {
    mockGetUser.mockRejectedValue(new Error('Auth error'))

    await expect(getUserProfile()).rejects.toThrow('Auth error')
  })

  it('propaga erro quando userRepository falha', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-1', email: 'joao@email.com' })
    mockFindById.mockRejectedValue(new Error('DB error'))

    await expect(getUserProfile()).rejects.toThrow('DB error')
  })
})
