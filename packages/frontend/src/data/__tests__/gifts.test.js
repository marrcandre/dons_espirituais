import { describe, it, expect } from 'vitest'
import { gifts } from '../../domain/spiritual-gifts'

describe('Gift data consistency', () => {

  it('deve ter exatamente 27 dons', () => {
    expect(gifts).toHaveLength(27)
  })

  it('deve ter IDs contínuos de 0 a 26', () => {
    const ids = gifts.map(g => g.id)
    expect(ids).toEqual([...Array(27).keys()])
  })

  it('deve ter nomes únicos (sem duplicatas)', () => {
    const names = gifts.map(g => g.name)
    const uniqueNames = new Set(names)
    expect(uniqueNames.size).toBe(27)
  })

  it('deve começar com Profecia e terminar com Liderança em Adoração', () => {
    expect(gifts[0].name).toBe('Profecia')
    expect(gifts[26].name).toBe('Liderança em Adoração')
  })

  it('cada dom deve ter name e icon como strings', () => {
    gifts.forEach(g => {
      expect(typeof g.name).toBe('string')
      expect(typeof g.icon).toBe('string')
    })
  })

  it('todos os ícones devem começar com mdi-', () => {
    gifts.forEach(g => {
      expect(g.icon).toMatch(/^mdi-/)
    })
  })

})
