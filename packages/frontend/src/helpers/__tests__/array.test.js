import { describe, it, expect } from 'vitest'
import { shuffle } from '../array.js'

describe('shuffle', () => {
  it('returns array with same length', () => {
    const result = shuffle([1, 2, 3, 4, 5])
    expect(result).toHaveLength(5)
  })

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result.sort()).toEqual(input.sort())
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5]
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('handles single-element array', () => {
    expect(shuffle([42])).toEqual([42])
  })

  it('produces different orderings probabilistically', () => {
    const input = Array.from({ length: 20 }, (_, i) => i)
    const results = new Set()
    for (let i = 0; i < 10; i++) {
      results.add(shuffle(input).join(','))
    }
    expect(results.size).toBeGreaterThan(1)
  })
})
