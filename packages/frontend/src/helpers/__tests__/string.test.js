import { describe, it, expect } from 'vitest'
import { initials } from '../string.js'

describe('initials', () => {

  it('retorna as duas primeiras iniciais em maiúsculas', () => {
    expect(initials('João Silva')).toBe('JS')
  })

  it('retorna string vazia para nome vazio', () => {
    expect(initials('')).toBe('')
  })

  it('retorna string vazia para null', () => {
    expect(initials(null)).toBe('')
  })

})
