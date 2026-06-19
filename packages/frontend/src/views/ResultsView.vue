<template>
  <v-container class="py-8" max-width="800">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <!-- Erro -->
    <v-alert
      v-else-if="error"
      type="error"
      rounded="xl"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <!-- Resultado -->
    <template v-else-if="response">

      <div>

        <!-- Cabeçalho -->
        <div class="text-center mb-8">
          <h1 class="text-h5 font-weight-bold text-primary mb-2">
            {{ response.name }}
          </h1>

          <p class="text-body-1 text-medium-emphasis">
            Seu Perfil de Dons Espirituais
          </p>
        </div>

        <!-- Top 3 dons -->
        <GiftBadges
          :scores="response.scores"
          class="mb-6"
        />

        <!-- Gráfico -->
        <ResultsChart
          ref="chartRef"
          :scores="response.scores"
          class="mb-8"
        />

        <!-- Análise IA -->
        <v-card
          rounded="xl"
          elevation="2"
          class="mb-6"
        >
          <AiAnalysis
            ref="aiAnalysisRef"
            :response-id="response.id"
            :response-name="response.name"
            :initial-text="response.ai_analysis"
          />
        </v-card>

        <!-- Crescimento -->
        <GrowthSection
          class="mb-6"
        />

        <!-- Recursos -->
        <ResourcesSection
          class="mb-6"
        />

        <!-- Data -->
        <div class="text-center mt-8">
          <p class="text-caption text-medium-emphasis">
            Teste realizado em {{ formatDate(response.created_at) }}
          </p>
        </div>

      </div>

      <!-- Histórico -->
      <HistoryList
        v-if="isOwner"
        :current-id="response.id"
        class="mt-6 mb-6"
      />

      <!-- Ações -->
      <v-card
        rounded="xl"
        variant="outlined"
        class="mb-6 pa-4"
      >
        <p
          v-if="isOwner && uiState.showRegenerateAction"
          class="text-body-2 text-medium-emphasis text-center mb-3"
        >
          O nome do resultado foi alterado. Atualize a análise para que ela reflita essa mudança.
        </p>

        <div class="d-flex flex-wrap justify-center ga-3">

          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-share-variant"
            @click="shareResult"
          >
            Compartilhar resultado
          </v-btn>

          <v-btn
            v-if="isOwner"
            color="primary"
            variant="text"
            prepend-icon="mdi-pencil"
            @click="openNameEditor"
          >
            Editar nome
          </v-btn>

          <v-btn
            v-if="isOwner && uiState.showRegenerateAction"
            color="primary"
            variant="text"
            prepend-icon="mdi-refresh"
            :loading="uiState.isRegenerating"
            @click="handleRegenerateAnalysis"
          >
            Atualizar análise com novo nome
          </v-btn>

          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-printer"
            @click="printResult"
          >
            Imprimir
          </v-btn>

          <v-btn
            v-if="!authStore.user"
            color="primary"
            prepend-icon="mdi-gift-outline"
            to="/login"
          >
            Quero descobrir meus dons
          </v-btn>

        </div>
      </v-card>

      <v-dialog
        v-model="nameEditor.isOpen"
        max-width="420"
      >
        <v-card rounded="xl">
          <v-card-title class="text-h6 font-weight-bold">
            Editar nome
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="saveName">
              <v-text-field
                v-model="nameEditor.draft"
                label="Nome"
                variant="outlined"
                density="comfortable"
                autofocus
                :disabled="nameEditor.isSaving"
                :error-messages="nameEditor.error"
              />
            </v-form>
          </v-card-text>

          <v-card-actions class="px-6 pb-5">
            <v-spacer />

            <v-btn
              variant="text"
              :disabled="nameEditor.isSaving"
              @click="nameEditor.isOpen = false"
            >
              Cancelar
            </v-btn>

            <v-btn
              color="primary"
              :loading="nameEditor.isSaving"
              @click="saveName"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="nameEditor.showSuccess"
        color="success"
        timeout="3000"
      >
        Nome atualizado com sucesso.
      </v-snackbar>

      <v-snackbar
        v-model="analysisRegenerationError"
        color="warning"
        timeout="4000"
      >
        Não foi possível atualizar a análise agora.
      </v-snackbar>

      <v-snackbar
        v-model="uiState.showAnalysisSuccess"
        color="success"
        timeout="3000"
      >
        Análise atualizada com sucesso.
      </v-snackbar>

    </template>

  </v-container>


</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { supabase } from '../services/supabase.js'

import GrowthSection from '../components/GrowthSection.vue'
import GiftBadges from '../components/GiftBadges.vue'
import ResultsChart from '../components/ResultsChart.vue'
import AiAnalysis from '../components/AiAnalysis.vue'
import ResourcesSection from '../components/ResourcesSection.vue'
import HistoryList from '../components/HistoryList.vue'

const route = useRoute()
const aiAnalysisRef = ref(null)

const authStore = useAuthStore()
const loading = ref(true)
const error = ref(null)
const response = ref(null)
const analysisRegenerationError = ref(false)
const nameEditor = reactive({
  isOpen: false,
  draft: '',
  isSaving: false,
  error: '',
  showSuccess: false,
})
const uiState = reactive({
  showRegenerateAction: false,
  isRegenerating: false,
  showAnalysisSuccess: false,
})

const isOwner = computed(() =>
  authStore.user &&
  response.value?.user_id === authStore.user.id
)

async function loadResponse() {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('responses')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (fetchError) throw fetchError

    response.value = data
  } catch {
    error.value = 'Resultado não encontrado.'
  } finally {
    loading.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function openNameEditor() {
  if (!isOwner.value) return

  nameEditor.draft = response.value?.name || ''
  nameEditor.error = ''
  nameEditor.isOpen = true
}

async function saveName() {
  if (!isOwner.value || !response.value) return

  const name = nameEditor.draft.trim()

  if (!name) {
    nameEditor.error = 'Informe um nome.'
    return
  }

  if (name === response.value.name) {
    nameEditor.isOpen = false
    return
  }

  nameEditor.isSaving = true
  nameEditor.error = ''

  try {
    const { data, error: updateError } = await supabase
      .from('responses')
      .update({ name })
      .eq('id', response.value.id)
      .eq('user_id', authStore.user.id)
      .select('name')
      .single()

    if (updateError) throw updateError

    response.value.name = data?.name || name
    uiState.showRegenerateAction = true
    nameEditor.isOpen = false
    nameEditor.showSuccess = true
  } catch (err) {
    console.error('Erro ao atualizar nome:', err)
    nameEditor.error = 'Não foi possível atualizar o nome.'
  } finally {
    nameEditor.isSaving = false
  }
}

async function regenerateAnalysis(responseId, name) {
  if (!responseId || !name || !aiAnalysisRef.value) return null

  return aiAnalysisRef.value.generateAnalysis(true)
}

async function handleRegenerateAnalysis() {
  if (!isOwner.value || !response.value) return

  uiState.isRegenerating = true
  uiState.showAnalysisSuccess = false
  analysisRegenerationError.value = false

  try {
    const generated = await regenerateAnalysis(
      response.value.id,
      response.value.name
    )

    if (!generated) {
      throw new Error('Falha ao atualizar análise')
    }

    response.value.ai_analysis = generated
    uiState.showRegenerateAction = false
    uiState.showAnalysisSuccess = true
  } catch (err) {
    console.error('Erro ao atualizar análise:', err)
    analysisRegenerationError.value = true
  } finally {
    uiState.isRegenerating = false
  }
}

async function shareResult() {
  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Meu Resultado - Dons Espirituais',
        text: 'Confira o resultado do meu teste de dons espirituais',
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência.')
    }
  } catch (err) {
    console.error('Erro ao compartilhar:', err)
  }
}

function printResult() {
  window.print()
}

onMounted(loadResponse)
</script>


<style scoped>
.v-card {
  transition: all 0.2s ease;
}
.v-card:hover {
  transform: translateY(-2px);
}
</style>
