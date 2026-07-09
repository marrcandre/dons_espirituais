export { topGift } from '../services/scoring.js'

export function initials(name) {
  if (!name) return ''
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}
