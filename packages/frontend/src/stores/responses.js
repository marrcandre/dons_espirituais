import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as responseRepository from '../repositories/responseRepository.js'
import { deleteResponseUseCase } from '../application/quiz/delete-response'

export const useResponsesStore = defineStore('responses', () => {
  const current = ref(null)
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchById(id) {
    loading.value = true
    error.value = null

    try {
      current.value = await responseRepository.findById(id)
    } catch (_err) {
      error.value = 'Resultado não encontrado.'
      current.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchByUserId(userId, opts = {}) {
    loading.value = true
    error.value = null

    try {
      list.value = await responseRepository.findByUserId(userId, opts.fields, opts)
    } catch (err) {
      console.error('Erro ao carregar resultados:', err)
      error.value = 'Não foi possível carregar seus resultados. Tente novamente.'
      list.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAll(fields = '*') {
    loading.value = true
    error.value = null

    try {
      list.value = await responseRepository.listAll(fields)
    } catch (err) {
      console.error(err)
      error.value = 'Erro ao carregar painel admin'
      list.value = []
    } finally {
      loading.value = false
    }
  }

  async function updateField(id, field, value) {
    try {
      await responseRepository.updateField(id, field, value)
      return true
    } catch (err) {
      console.error(`Erro ao atualizar ${field}:`, err)
      return false
    }
  }

  async function deleteItem(id) {
    loading.value = true
    error.value = null

    try {
      await deleteResponseUseCase({ responseId: id })
      list.value = list.value.filter((item) => item.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
      return true
    } catch (err) {
      console.error('Erro ao excluir teste:', err)
      error.value = 'Erro ao excluir teste. Tente novamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  function $reset() {
    current.value = null
    list.value = []
    loading.value = false
    error.value = null
  }

  return {
    current,
    list,
    loading,
    error,
    fetchById,
    fetchByUserId,
    fetchAll,
    updateField,
    deleteItem,
    $reset,
  }
})
