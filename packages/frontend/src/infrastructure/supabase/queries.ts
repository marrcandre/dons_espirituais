const DEFAULT_QUERY_TIMEOUT_MS = 10000

export async function runSupabaseQuery<T>(query: { abortSignal: (_signal: AbortSignal) => T }, timeoutMs = DEFAULT_QUERY_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await query.abortSignal(controller.signal)
  } finally {
    clearTimeout(timeout)
  }
}
