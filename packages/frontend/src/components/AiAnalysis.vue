<template>
  <div>
    <!-- Banner: nome alterado -->
    <AppAlert
      v-if="showRegenerateBanner"
      type="warning"
      variant="tonal"
      density="compact"
      class="mb-4"
    >
      <div class="text-body-2 mb-2">
        O nome do resultado foi alterado. Atualize a análise.
      </div>

      <div class="d-flex justify-center ga-2 flex-wrap">
        <AppButton
          size="small"
          color="warning"
          variant="flat"
          prepend-icon="mdi-refresh"
          :loading="isRegenerating"
          @click="handleRegenerate"
        >
          Atualizar
        </AppButton>

        <AppButton
          size="small"
          variant="text"
          color="warning"
          @click="dismissBanner"
        >
          Agora não
        </AppButton>
      </div>
    </AppAlert>

    <!-- Refresh -->
    <div
      v-if="authStore.isAdmin || !text"
      class="d-flex justify-center mb-4"
    >
      <v-tooltip text="Gerar análise">
        <template #activator="{ props }">
          <AppButton
            icon="mdi-refresh"
            variant="text"
            color="primary"
            v-bind="props"
            :loading="generating"
            @click="generateAnalysis(true)"
          />
        </template>
      </v-tooltip>
    </div>

    <!-- Carregando -->
    <div v-if="loading" class="text-center py-6">
      <v-progress-circular
        indeterminate
        color="primary"
        size="40"
        class="mb-3"
      />

      <p class="text-body-2 text-medium-emphasis mt-2">
        Preparando a análise...
      </p>
    </div>

    <!-- Análise disponível -->
    <div
      v-else-if="text"
      class="text-body-2 ai-analysis__text"
    >
      {{ text }}
    </div>

    <!-- Erro -->
    <AppAlert
      v-else-if="error"
      type="warning"
      variant="tonal"
      rounded="lg"
      class="text-body-2"
    >
      Não foi possível gerar sua análise agora.

      <br /><br />

      Você pode tentar novamente em alguns instantes usando o botão acima.

      <br /><br />

      Caso a análise ainda não esteja disponível, ela será gerada automaticamente assim que possível.
    </AppAlert>

    <!-- Sem análise -->
    <AppAlert
      v-else
      type="info"
      variant="tonal"
      rounded="lg"
      class="text-body-2"
    >
      Sua análise ainda não está disponível.

      <br /><br />

      Em alguns momentos a geração pode levar um pouco mais de tempo.

      <br /><br />

      Você pode tentar gerar a análise usando o botão acima ou voltar mais tarde.

      <br /><br />

      Esta página será atualizada automaticamente assim que a análise estiver pronta.
    </AppAlert>

    <!-- Snackbars -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      Análise atualizada com sucesso.
    </v-snackbar>

    <v-snackbar v-model="showError" color="warning" timeout="4000">
      Não foi possível atualizar a análise agora.
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useAiStore } from '../stores/ai.js'
import { useResponsesStore } from '../stores/responses.js'
import AppButton from './ui/AppButton.vue'
import AppAlert from './ui/AppAlert.vue'

const props = defineProps({
  responseId: { type: String, required: true },
  responseName: { type: String, required: true },
  initialText: { type: String, default: null },
})

const authStore = useAuthStore()
const aiStore = useAiStore()
const responseStore = useResponsesStore()

const text = ref(props.initialText)
const loading = ref(!props.initialText)
const generating = ref(false)
const error = ref(null)

const showRegenerateBanner = ref(false)
const isRegenerating = ref(false)
const showSuccess = ref(false)
const showError = ref(false)

let pollInterval = null
let pollAttempts = 0

const MAX_POLL_ATTEMPTS = 24

function stopPolling() {
  clearInterval(pollInterval)
  pollInterval = null
}

function startPolling() {
  stopPolling()
  pollAttempts = 0
  pollForAnalysis()
  pollInterval = setInterval(pollForAnalysis, 5000)
}

async function pollForAnalysis() {
  pollAttempts++

  const analysis = await responseStore.selectField(props.responseId, 'ai_analysis')

  if (analysis) {
    text.value = analysis
    loading.value = false
    error.value = null

    stopPolling()
    aiStore.unsubscribe(props.responseId)
  } else if (pollAttempts >= MAX_POLL_ATTEMPTS) {
    loading.value = false
    stopPolling()
  }
}

async function generateAnalysis(force = false) {
  generating.value = true
  loading.value = true
  error.value = null

  try {
    if (force) {
      const aiAnalysis = await aiStore.regenerate(
        props.responseId,
        props.responseName
      )

      text.value = aiAnalysis
      loading.value = false
      error.value = null
      stopPolling()

      if (responseStore.current) {
        responseStore.current.ai_analysis = aiAnalysis
      }

      return aiAnalysis
    }

    await aiStore.generate(props.responseId, '', false)
    startPolling()
    return true
  } catch (err) {
    console.error('Erro ao gerar análise:', err)

    loading.value = false

    error.value =
      'Não foi possível gerar a análise agora. Tente novamente em instantes.'
    return false
  } finally {
    generating.value = false
  }
}

async function handleRegenerate() {
  if (!authStore.isAdmin && responseStore.current?.user_id !== authStore.user?.id) return

  isRegenerating.value = true
  showError.value = false

  try {
    const generated = await generateAnalysis(true)

    if (!generated) throw new Error()

    showRegenerateBanner.value = false
    showSuccess.value = true
  } catch {
    showError.value = true
  } finally {
    isRegenerating.value = false
  }
}

function dismissBanner() {
  showRegenerateBanner.value = false
}

watch(() => props.responseName, () => {
  showRegenerateBanner.value = true
})

onMounted(() => {
  if (text.value) return

  aiStore.subscribe(props.responseId, (newData) => {
    if (newData?.ai_analysis) {
      text.value = newData.ai_analysis
      loading.value = false
      error.value = null
      stopPolling()
    }
  })

  generateAnalysis(false)
})

onUnmounted(() => {
  aiStore.unsubscribe(props.responseId)
  stopPolling()
})
</script>

<style scoped>
.ai-analysis__text {
  line-height: var(--line-height-relaxed);
  white-space: pre-wrap;
}
</style>
