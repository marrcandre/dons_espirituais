import { supabase } from '../infrastructure/supabase/client.js'

export async function invokeGenerateAI(responseId, name, force = false) {
  const { error } = await supabase.functions.invoke('generate-ai', {
    body: { responseId, name, force },
  })
  if (error) throw error
}

export async function invokeNotifyAdmin(responseId) {
  const { error } = await supabase.functions.invoke('notify-admin', {
    body: { responseId },
  })
  if (error) throw error
}

export function subscribeToUpdates(responseId, onChange) {
  const channel = supabase
    .channel(`response-ai-${responseId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'responses',
        filter: `id=eq.${responseId}`,
      },
      (payload) => {
        onChange(payload.new)
      },
    )
    .subscribe()

  return channel
}

export function unsubscribeChannel(channel) {
  if (channel) {
    supabase.removeChannel(channel)
  }
}
