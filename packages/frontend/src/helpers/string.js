import { rankGifts } from '../services/scoring.js'

export function initials(name) {
  if (!name) return ''
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function topGift(scores) {
  if (!scores) return ''
  const ranked = rankGifts(scores)
  return `Dom principal: ${ranked[0]?.gift.name}`
}
