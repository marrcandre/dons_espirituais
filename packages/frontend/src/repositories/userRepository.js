import { supabase } from '../services/supabase.js'
import { runSupabaseQuery } from '../services/supabaseQuery.js'

const DEFAULT_TIMEOUT = 8000

export async function findById(userId) {
  const { data, error } = await runSupabaseQuery(
    supabase.from('users').select('*').eq('id', userId).maybeSingle(),
    DEFAULT_TIMEOUT,
  )
  if (error) throw error
  return data ?? null
}
