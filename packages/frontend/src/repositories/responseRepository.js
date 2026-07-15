import { supabase } from '../services/supabase.js'
import { runSupabaseQuery } from '../services/supabaseQuery.js'

const DEFAULT_TIMEOUT = 10000

export async function findById(id) {
  const { data, error } = await runSupabaseQuery(
    supabase.from('responses').select('*').eq('id', id).single(),
    DEFAULT_TIMEOUT,
  )
  if (error) throw error
  return data
}

export async function findByUserId(userId, fields = '*', opts = {}) {
  let query = supabase
    .from('responses')
    .select(fields)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (opts.limit) query = query.limit(opts.limit)

  const { data, error } = await runSupabaseQuery(query, DEFAULT_TIMEOUT)
  if (error) throw error
  return data ?? []
}

export async function listAll(fields = '*') {
  const { data, error } = await runSupabaseQuery(
    supabase
      .from('responses')
      .select(fields)
      .order('created_at', { ascending: false }),
    DEFAULT_TIMEOUT,
  )
  if (error) throw error
  return data ?? []
}

export async function insert(payload) {
  const { data, error } = await runSupabaseQuery(
    supabase
      .from('responses')
      .insert(payload)
      .select('id')
      .single(),
    DEFAULT_TIMEOUT,
  )

  if (error) throw error
  return data
}

export async function updateField(id, field, value) {
  const { error } = await runSupabaseQuery(
    supabase.from('responses').update({ [field]: value?.trim() }).eq('id', id),
    DEFAULT_TIMEOUT,
  )
  if (error) throw error
}

export async function countByUserId(userId) {
  const { count, error } = await runSupabaseQuery(
    supabase
      .from('responses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    DEFAULT_TIMEOUT,
  )

  if (error) throw error
  return count ?? 0
}

export async function deleteResponse(id) {
  const { error } = await runSupabaseQuery(
    supabase.from('responses').delete().eq('id', id),
    DEFAULT_TIMEOUT,
  )
  if (error) throw error
}

export async function selectField(id, field) {
  const { data, error } = await runSupabaseQuery(
    supabase.from('responses').select(field).eq('id', id).single(),
    DEFAULT_TIMEOUT,
  )
  if (error) throw error
  return data?.[field] ?? null
}
