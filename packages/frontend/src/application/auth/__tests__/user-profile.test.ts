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
  it('retorna id, name, email e role quando usuario autenticado tem perfil', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-1', email: 'joao@email.com' })
    mockFindById.mockResolvedValue({ name: 'João Silva', role: 'admin' })

    const result = await getUserProfile()

    expect(result).toEqual({ id: 'user-1', name: 'João Silva', email: 'joao@email.com', role: 'admin' })
  })

  it('retorna null quando nao ha usuario autenticado', async () => {
    mockGetUser.mockResolvedValue(null)

    const result = await getUserProfile()

    expect(result).toBeNull()
  })

  it('retorna valores padrao quando usuario autenticado nao tem perfil', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-1', email: 'joao@email.com' })
    mockFindById.mockResolvedValue(null)

    const result = await getUserProfile()

    expect(result).toEqual({ id: 'user-1', name: '', email: 'joao@email.com', role: 'user' })
  })

  it('usa retry quando primeira chamada falha', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-1', email: 'joao@email.com' })
    mockFindById
      .mockRejectedValueOnce(new Error('DB error'))
      .mockResolvedValueOnce({ name: 'João Silva', role: 'admin' })

    const result = await getUserProfile()

    expect(mockFindById).toHaveBeenCalledTimes(2)
    expect(result).toEqual({ id: 'user-1', name: 'João Silva', email: 'joao@email.com', role: 'admin' })
  })

  it('retorna null apos todas as tentativas de retry falharem', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-1', email: 'joao@email.com' })
    mockFindById.mockRejectedValue(new Error('DB error'))

    const result = await getUserProfile()

    expect(mockFindById).toHaveBeenCalledTimes(3)
    expect(result).toEqual({ id: 'user-1', name: '', email: 'joao@email.com', role: 'user' })
  })

  it('propaga erro quando authRepository falha', async () => {
    mockGetUser.mockRejectedValue(new Error('Auth error'))

    await expect(getUserProfile()).rejects.toThrow('Auth error')
  })
})
