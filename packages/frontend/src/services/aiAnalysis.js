import { supabase } from './supabase.js'

export async function regenerateAiAnalysis(responseId, name) {
  if (!responseId) {
    throw new Error('responseId obrigatório')
  }

  if (!name?.trim()) {
    throw new Error('name obrigatório')
  }

  const { error: invokeError } = await supabase.functions.invoke(
    'generate-ai',
    {
      body: {
        responseId,
        name,
        force: true,
      },
    }
  )

  if (invokeError) {
    throw invokeError
  }

  const { data, error: fetchError } = await supabase
    .from('responses')
    .select('ai_analysis')
    .eq('id', responseId)
    .single()

  if (fetchError) {
    throw fetchError
  }

  return data?.ai_analysis || null
}
