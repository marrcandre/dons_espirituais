import { gifts, GIFT_COUNT } from './spiritual-gifts'

export interface Scores {
  [giftId: number]: number
}

export interface RankedGift {
  gift: (typeof gifts)[number]
  score: number
}

export function calculateScores(answers: number[]): Scores {
  const scores: Scores = {}

  gifts.forEach((gift) => {
    let total = 0
    for (let block = 0; block < 5; block++) {
      const questionId = gift.id + block * GIFT_COUNT
      total += answers[questionId] ?? 0
    }
    scores[gift.id] = total
  })

  return scores
}

export function rankGifts(scores: Scores): RankedGift[] {
  return gifts
    .map((gift) => ({ gift, score: scores[gift.id] ?? 0 }))
    .sort((a, b) => b.score - a.score)
}

export function formatScoresForAI(scores: Scores): string {
  return rankGifts(scores)
    .map(({ gift, score }) => `${gift.name}: ${score}/15`)
    .join('\n')
}

export function topGift(scores: Scores | null | undefined): string {
  if (!scores) return ''
  const ranked = rankGifts(scores)
  return `Dom principal: ${ranked[0]?.gift.name}`
}
