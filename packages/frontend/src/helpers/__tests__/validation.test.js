import { describe, it, expect } from 'vitest'
import { required, ageRange } from '../validation.js'

describe('required', () => {
  it('returns true for non-empty string', () => {
    expect(required('João')).toBe(true)
  })

  it('returns msg for empty string', () => {
    expect(required('')).toBe('Campo obrigatório')
  })

  it('returns msg for whitespace-only string', () => {
    expect(required('   ')).toBe('Campo obrigatório')
  })

  it('returns msg for null', () => {
    expect(required(null)).toBe('Campo obrigatório')
  })

  it('returns msg for undefined', () => {
    expect(required(undefined)).toBe('Campo obrigatório')
  })

  it('uses custom error message', () => {
    expect(required('', 'Nome é obrigatório')).toBe('Nome é obrigatório')
  })
})

describe('ageRange', () => {
  it('returns true for valid age', () => {
    expect(ageRange('25')).toBe(true)
  })

  it('returns true when value is empty', () => {
    expect(ageRange('')).toBe(true)
  })

  it('returns true for minimum age', () => {
    expect(ageRange('5')).toBe(true)
  })

  it('returns true for maximum age', () => {
    expect(ageRange('120')).toBe(true)
  })

  it('returns error for age below minimum', () => {
    expect(ageRange('3')).toBe('Idade deve estar entre 5 e 120')
  })

  it('returns error for age above maximum', () => {
    expect(ageRange('150')).toBe('Idade deve estar entre 5 e 120')
  })

  it('uses custom range', () => {
    expect(ageRange('1', 0, 10)).toBe(true)
    expect(ageRange('11', 0, 10)).toBe('Idade deve estar entre 0 e 10')
  })
})
