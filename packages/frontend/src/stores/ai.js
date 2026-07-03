import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as aiRepository from '../repositories/aiRepository.js'
import * as responseRepository from '../repositories/responseRepository.js'

export const useAiStore = defineStore('ai', () => {
  const activeSubscriptions = ref({})

  async function generate(responseId, name, force = false) {
    await aiRepository.invokeGenerateAI(responseId, name, force)
  }

  async function regenerate(responseId, name) {
    await aiRepository.invokeGenerateAI(responseId, name, true)
    return responseRepository.selectField(responseId, 'ai_analysis')
  }

  async function notifyAdmin(responseId) {
    await aiRepository.invokeNotifyAdmin(responseId)
  }

  function subscribe(responseId, onChange) {
    unsubscribe(responseId)

    const channel = aiRepository.subscribeToUpdates(responseId, onChange)
    activeSubscriptions.value[responseId] = channel
  }

  function unsubscribe(responseId) {
    const channel = activeSubscriptions.value[responseId]
    if (channel) {
      aiRepository.unsubscribeChannel(channel)
      delete activeSubscriptions.value[responseId]
    }
  }

  function unsubscribeAll() {
    for (const id of Object.keys(activeSubscriptions.value)) {
      unsubscribe(id)
    }
  }

  return {
    generate,
    regenerate,
    notifyAdmin,
    subscribe,
    unsubscribe,
    unsubscribeAll,
  }
})
