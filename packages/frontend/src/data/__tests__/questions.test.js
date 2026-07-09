import { describe, it, expect } from 'vitest'
import { questions } from '../questions.js'
import { gifts } from '../../domain/spiritual-gifts'

describe('Questions data consistency', () => {

  it('deve ter exatamente 135 perguntas', () => {
    expect(questions).toHaveLength(135)
  })

  it('deve ter 5 perguntas por dom (135 = 5 × 27)', () => {
    expect(questions.length).toBe(gifts.length * 5)
  })

  it('cada pergunta deve ter id e text como string', () => {
    questions.forEach(q => {
      expect(typeof q.id).toBe('number')
      expect(typeof q.text).toBe('string')
    })
  })

})

describe('Question-to-gift mapping (positional i % 27)', () => {

  gifts.forEach(gift => {
    const giftQuestions = questions.filter(q => q.id % 27 === gift.id)

    it(`dom "${gift.name}" (id=${gift.id}) deve ter 5 perguntas`, () => {
      expect(giftQuestions).toHaveLength(5)
    })

    it(`perguntas do dom "${gift.name}" devem ter IDs no formato giftId + block*27`, () => {
      giftQuestions.forEach(q => {
        const block = (q.id - gift.id) / 27
        expect(Number.isInteger(block)).toBe(true)
        expect(block).toBeGreaterThanOrEqual(0)
        expect(block).toBeLessThan(5)
      })
    })
  })

})
