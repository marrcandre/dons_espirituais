import { describe, it, expect } from 'vitest'
import { calculateScores, rankGifts, formatScoresForAI, topGift } from '../../domain/scoring'
function makeAnswers(giftIndex, score) {
  const answers = new Array(135).fill(0)
  for (let block = 0; block < 5; block++) {
    answers[giftIndex + block * 27] = score
  }
  return answers
}

describe('calculateScores', () => {

  it('calcula score 15 para o dom que recebe 5 respostas 3', () => {
    const answers = makeAnswers(0, 3)
    const scores = calculateScores(answers)
    expect(scores[0]).toBe(15)
    for (let i = 1; i < 27; i++) {
      expect(scores[i]).toBe(0)
    }
  })

  it('retorna score 0 para todos os dons quando answers é vazio', () => {
    const scores = calculateScores([])
    for (let i = 0; i < 27; i++) {
      expect(scores[i]).toBe(0)
    }
  })

  it('lida com answers parciais (menos de 135 elementos)', () => {
    const answers = new Array(100).fill(1)
    const scores = calculateScores(answers)
    expect(Object.keys(scores)).toHaveLength(27)
  })

  it('mapeia cada grupo de 5 perguntas para o dom correto via i % 27', () => {
    const answers = new Array(135).fill(0)
    answers[0] = 3
    answers[27] = 3
    answers[54] = 3
    answers[81] = 3
    answers[108] = 3
    const scores = calculateScores(answers)
    expect(scores[0]).toBe(15)
    for (let i = 1; i < 27; i++) {
      expect(scores[i]).toBe(0)
    }
  })

})

describe('rankGifts', () => {

  it('retorna dons ordenados do maior para o menor score', () => {
    const scores = { 0: 5, 1: 10, 2: 3 }
    const ranked = rankGifts(scores)
    expect(ranked[0].gift.id).toBe(1)
    expect(ranked[0].score).toBe(10)
    expect(ranked[1].gift.id).toBe(0)
    expect(ranked[1].score).toBe(5)
    expect(ranked[2].gift.id).toBe(2)
    expect(ranked[2].score).toBe(3)
  })

  it('mantém ordem consistente em caso de empate', () => {
    const scores = { 0: 10, 1: 10, 2: 8 }
    const ranked = rankGifts(scores)
    expect(ranked[0].gift.id).toBe(0)
    expect(ranked[1].gift.id).toBe(1)
    expect(ranked[2].gift.id).toBe(2)
  })

  it('retorna todos os 27 dons com score 0 quando scores é vazio', () => {
    const ranked = rankGifts({})
    expect(ranked).toHaveLength(27)
    ranked.forEach(({ score }) => {
      expect(score).toBe(0)
    })
  })

})

describe('formatScoresForAI', () => {

  it('formata scores corretamente', () => {
    const scores = { 0: 15, 1: 10 }
    const result = formatScoresForAI(scores)
    expect(result).toContain('Profecia: 15/15')
    expect(result).toContain('Pastoreio: 10/15')
  })

  it('ordena linhas do maior para o menor score', () => {
    const scores = { 1: 10, 0: 15 }
    const result = formatScoresForAI(scores)
    const lines = result.split('\n')
    expect(lines[0]).toMatch(/^Profecia/)
    expect(lines[1]).toMatch(/^Pastoreio/)
  })

})

describe('topGift', () => {

  it('retorna o nome do dom principal formatado', () => {
    const scores = { 0: 15, 1: 10 }
    const result = topGift(scores)
    expect(result).toBe('Dom principal: Profecia')
  })

  it('retorna string vazia para scores nulos ou undefined', () => {
    expect(topGift(null)).toBe('')
    expect(topGift(undefined)).toBe('')
  })

  it('retorna o primeiro dom quando scores estão vazios', () => {
    expect(topGift({})).toBe('Dom principal: Profecia')
  })

})
