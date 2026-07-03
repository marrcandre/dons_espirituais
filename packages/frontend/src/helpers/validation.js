export function required(v, msg = 'Campo obrigatório') {
  return !!v?.trim() || msg
}

export function ageRange(v, min = 5, max = 120) {
  if (!v) return true
  const n = parseInt(v)
  return (n >= min && n <= max) || `Idade deve estar entre ${min} e ${max}`
}
