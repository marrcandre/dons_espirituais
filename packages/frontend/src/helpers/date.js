export function formatDate(iso, options = {}) {
  const { month = 'long' } = options
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month,
    year: 'numeric',
  })
}

export function formatRelativeDate(iso) {
  const now = new Date()
  const date = new Date(iso)

  const diffDays = Math.floor(
    (now - date) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 30) return `Há ${diffDays} dias`

  const totalMonths = Math.floor(diffDays / 30)

  if (totalMonths < 12) {
    return totalMonths === 1
      ? 'Há 1 mês'
      : `Há ${totalMonths} meses`
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (months === 0) {
    return years === 1
      ? 'Há 1 ano'
      : `Há ${years} anos`
  }

  const yearsText = years === 1
    ? '1 ano'
    : `${years} anos`

  const monthsText = months === 1
    ? '1 mês'
    : `${months} meses`

  return `Há ${yearsText} e ${monthsText}`
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
