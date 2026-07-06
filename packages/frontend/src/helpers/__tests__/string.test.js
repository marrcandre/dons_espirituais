import { describe, it, expect } from 'vitest'
import { topGift } from '../string.js'

describe('topGift', () => {

  it('retorna o nome do dom principal formatado', () => {
    const scores = { 0: 15, 1: 10 }
    const result = topGift(scores)
    expect(result).toBe('Dom principal: Profecia')
  })

  it('retorna string vazia para scores nulos', () => {
    expect(topGift(null)).toBe('')
  })

  it('retorna string vazia para objeto vazio', () => {
    expect(topGift({})).toBe('Dom principal: Profecia')
  })

})
