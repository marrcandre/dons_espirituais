<template>
  <AppPage class="mt-xl mb-xl">

    <!-- LOADING -->
    <LoadingState v-if="loading" class="py-16" :size="64" :thickness="6" />

    <!-- ERROR -->
    <div v-else-if="error" class="result-error-state mb-4">
      <v-alert type="error" rounded="xl">
        {{ error }}
      </v-alert>
    </div>

    <!-- RESULT -->
    <template v-else-if="response">

      <!-- HEADER -->
      <div class="result-header mb-3">
        <div class="result-header-main d-flex align-center justify-space-between flex-wrap ga-2">

          <!-- NAME + EDIT -->
          <div class="result-header-left d-flex align-center ga-2 flex-wrap">

            <!-- VIEW MODE -->
            <div v-if="!nameEditor.isEditing" class="d-flex align-center ga-2">
              <h1 class="text-h6 font-weight-bold text-primary mb-0">
                {{ response.name }}
              </h1>

              <v-btn
                v-if="isOwner"
                icon="mdi-pencil"
                variant="text"
                size="x-small"
                density="comfortable"
                @click="openNameEditor"
              />
            </div>

            <!-- EDIT MODE -->
            <div v-else class="d-flex align-center ga-2">
              <v-text-field
                v-model="nameEditor.draft"
                autofocus
                density="compact"
                hide-details
                variant="outlined"
                class="name-edit-input"
                @keyup.enter="saveName"
                @keyup.esc="cancelNameEdit"
              />

              <v-btn
                icon="mdi-check"
                color="success"
                size="small"
                :loading="nameEditor.isSaving"
                @click="saveName"
              />

              <v-btn
                icon="mdi-close"
                size="small"
                variant="text"
                @click="cancelNameEdit"
              />
            </div>

            <span class="text-caption text-medium-emphasis">
              · {{ formatDate(response.created_at) }}
            </span>
          </div>

          <!-- ACTIONS -->
          <div class="result-header-right d-flex ga-1">
            <v-btn
              icon="mdi-share-variant"
              variant="text"
              size="small"
              @click="shareResult"
            />

            <v-btn
              icon="mdi-printer"
              variant="text"
              size="small"
              @click="printResult"
            />
          </div>

        </div>
      </div>

      <!-- SUMMARY -->
      <section class="result-summary">
        <div class="result-header-meta d-flex justify-center mt-1 mb-2 gift-badges-compact">
          <GiftBadges :scores="response.scores" />
        </div>

        <div
          v-if="isOwner && uiState.showRegenerateAction && !uiState.dismissedRegenerateBanner"
          class="ai-regeneration-banner"
        >
          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            <div class="ai-banner-message text-body-2 mb-2">
              O nome do resultado foi alterado. Atualize a análise.
            </div>

            <div class="ai-banner-actions d-flex justify-center ga-2 flex-wrap">
              <div class="ai-banner-loading-state">
                <v-btn
                  size="small"
                  color="warning"
                  variant="flat"
                  prepend-icon="mdi-refresh"
                  :loading="uiState.isRegenerating"
                  @click="handleRegenerateAnalysis"
                >
                  Atualizar
                </v-btn>
              </div>

              <v-btn
                size="small"
                variant="text"
                color="warning"
                @click="dismissRegenerateBanner"
              >
                Agora não
              </v-btn>
            </div>
          </v-alert>
        </div>
      </section>

      <!-- INSIGHTS -->
      <section class="mb-6">
        <ResultsChart
          ref="chartRef"
          :scores="response.scores"
        />
      </section>

      <section class="mb-6">
        <AiAnalysis
          ref="aiAnalysisRef"
          :response-id="response.id"
          :response-name="response.name"
          :initial-text="response.ai_analysis"
        />
      </section>

      <section class="mb-6">
        <GrowthSection />
      </section>

      <section class="mb-6">
        <ResourcesSection />
      </section>

      <!-- SNACKBARS -->
      <v-snackbar v-model="nameEditor.showSuccess" color="success" timeout="3000">
        Nome atualizado com sucesso.
      </v-snackbar>

      <v-snackbar v-model="uiState.analysisRegenerationError" color="warning" timeout="4000">
        Não foi possível atualizar a análise agora.
      </v-snackbar>

      <v-snackbar v-model="uiState.showAnalysisSuccess" color="success" timeout="3000">
        Análise atualizada com sucesso.
      </v-snackbar>

    </template>

    <div v-else class="result-empty-state" />

  </AppPage>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useResponsesStore } from '../stores/responses.js'

import GrowthSection from '../components/GrowthSection.vue'
import GiftBadges from '../components/GiftBadges.vue'
import ResultsChart from '../components/ResultsChart.vue'
import AiAnalysis from '../components/AiAnalysis.vue'
import ResourcesSection from '../components/ResourcesSection.vue'
import AppPage from '../components/ui/AppPage.vue'
import LoadingState from '../components/ui/LoadingState.vue'

const route = useRoute()
const authStore = useAuthStore()
const responseStore = useResponsesStore()

const aiAnalysisRef = ref(null)

const response = computed(() => responseStore.current)
const loading = computed(() => responseStore.loading)
const error = computed(() => responseStore.error)

const uiState = reactive({
  showRegenerateAction: false,
  isRegenerating: false,
  showAnalysisSuccess: false,
  dismissedRegenerateBanner: false,
  analysisRegenerationError: false,
})

const nameEditor = reactive({
  isEditing: false,
  draft: '',
  isSaving: false,
  error: '',
  showSuccess: false,
})

const isOwner = computed(() =>
  authStore.user &&
  response.value?.user_id === authStore.user.id
)

async function loadResponse() {
  await responseStore.fetchById(route.params.id)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/* NAME EDIT */
function openNameEditor() {
  if (!isOwner.value) return

  nameEditor.draft = response.value?.name || ''
  nameEditor.error = ''
  nameEditor.isEditing = true
}

function cancelNameEdit() {
  if (nameEditor.isSaving) return

  nameEditor.draft = response.value?.name || ''
  nameEditor.error = ''
  nameEditor.isEditing = false
}

async function saveName() {
  if (!isOwner.value || !response.value) return

  const name = nameEditor.draft.trim()

  if (!name) {
    nameEditor.error = 'Informe um nome.'
    return
  }

  if (name === response.value.name) {
    nameEditor.isEditing = false
    return
  }

  nameEditor.isSaving = true
  nameEditor.error = ''

  try {
    const updated = await responseStore.updateField(response.value.id, 'name', name)

    if (!updated) {
      nameEditor.error = 'Não foi possível atualizar o nome.'
      return
    }

    responseStore.current.name = name
    uiState.showRegenerateAction = true
    uiState.dismissedRegenerateBanner = false

    nameEditor.isEditing = false
    nameEditor.showSuccess = true

  } catch (err) {
    console.error(err)
    nameEditor.error = 'Não foi possível atualizar o nome.'
  } finally {
    nameEditor.isSaving = false
  }
}

/* ANALYSIS */
async function regenerateAnalysis() {
  if (!aiAnalysisRef.value) return null
  return aiAnalysisRef.value.generateAnalysis(true)
}

async function handleRegenerateAnalysis() {
  if (!isOwner.value || !response.value) return

  uiState.isRegenerating = true
  uiState.analysisRegenerationError = false

  try {
    const generated = await regenerateAnalysis()

    if (!generated) throw new Error()

    response.value.ai_analysis = generated
    uiState.showRegenerateAction = false
    uiState.showAnalysisSuccess = true
  } catch (err) {
    uiState.analysisRegenerationError = true
  } finally {
    uiState.isRegenerating = false
  }
}

/* ACTIONS */
function shareResult() {
  const url = window.location.href

  if (navigator.share) {
    navigator.share({
      title: 'Meu Resultado - Dons Espirituais',
      text: 'Confira meu resultado',
      url,
    })
  } else {
    navigator.clipboard.writeText(url)
  }
}

function dismissRegenerateBanner() {
  uiState.showRegenerateAction = false
  uiState.dismissedRegenerateBanner = true
}

function printResult() {
  window.print()
}

onMounted(loadResponse)
</script>

<style scoped>
.gift-badges-compact {
  transform: scale(0.85);
  transform-origin: center;
  margin-top: -4px;
}

.gift-badges-compact > * {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.name-edit-input {
  width: 380px;
  max-width: 60vw;
}

</style>