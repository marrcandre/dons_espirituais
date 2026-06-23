<template>
  <v-container class="py-8" max-width="800">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <!-- Erro -->
    <v-alert v-else-if="error" type="error" rounded="xl" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Resultado -->
    <template v-else-if="response">

<!-- ========================= -->
<!-- HEADER ULTRA COMPACTO -->
<!-- ========================= -->
<div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-3">

  <!-- LADO ESQUERDO: Nome + data -->
  <div class="d-flex align-center ga-2 flex-wrap">

    <h1 class="text-h6 font-weight-bold text-primary mb-0">
      {{ response.name }}
    </h1>

    <!-- Editar nome -->
    <v-btn
      v-if="isOwner"
      icon="mdi-pencil"
      variant="text"
      size="x-small"
      density="comfortable"
      @click="openNameEditor"
    />

    <!-- Data bem próxima do nome -->
    <span class="text-caption text-medium-emphasis">
      · {{ formatDate(response.created_at) }}
    </span>

  </div>

  <!-- LADO DIREITO: Ações -->
  <div class="d-flex ga-1">

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

<!-- Badges (abaixo, mas bem compacto) -->
<div class="d-flex justify-center mt-1 mb-2 gift-badges-compact">
  <GiftBadges :scores="response.scores" />
</div>

      <!-- ========================= -->
      <!-- BANNER IA (mais leve) -->
      <!-- ========================= -->
      <v-alert
        v-if="isOwner && uiState.showRegenerateAction && !uiState.dismissedRegenerateBanner"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        <div class="text-body-2 mb-2">
          O nome do resultado foi alterado. Atualize a análise.
        </div>

        <div class="d-flex justify-center ga-2 flex-wrap">
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

      <!-- ========================= -->
      <!-- GRÁFICO (FOCO PRINCIPAL) -->
      <!-- ========================= -->
      <ResultsChart
        ref="chartRef"
        :scores="response.scores"
        class="mb-8"
      />

      <!-- ========================= -->
      <!-- ANÁLISE IA -->
      <!-- ========================= -->
      <v-card rounded="xl" elevation="2" class="mb-6">
        <AiAnalysis
          ref="aiAnalysisRef"
          :response-id="response.id"
          :response-name="response.name"
          :initial-text="response.ai_analysis"
        />
      </v-card>

      <!-- ========================= -->
      <!-- SEÇÕES SECUNDÁRIAS -->
      <!-- ========================= -->
      <GrowthSection class="mb-6" />
      <ResourcesSection class="mb-6" />

      <!-- ========================= -->
      <!-- SNACKBARS -->
      <!-- ========================= -->
      <v-snackbar v-model="nameEditor.showSuccess" color="success" timeout="3000">
        Nome atualizado com sucesso.
      </v-snackbar>

      <v-snackbar v-model="analysisRegenerationError" color="warning" timeout="4000">
        Não foi possível atualizar a análise agora.
      </v-snackbar>

      <v-snackbar v-model="uiState.showAnalysisSuccess" color="success" timeout="3000">
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

/* =========================================================
   ROUTE / STORE
========================================================= */
const route = useRoute()
const authStore = useAuthStore()

/* =========================================================
   REFS (BASE STATE)
========================================================= */
const aiAnalysisRef = ref(null)

const loading = ref(true)
const error = ref(null)
const response = ref(null)

/* =========================================================
   UI STATE
========================================================= */
const uiState = reactive({
  showRegenerateAction: false,
  isRegenerating: false,
  showAnalysisSuccess: false,
  dismissedRegenerateBanner: false,
  analysisRegenerationError: false,
})

/* =========================================================
   EDITOR STATE (NAME)
========================================================= */
const nameEditor = reactive({
  isEditing: false,
  draft: '',
  isSaving: false,
  error: '',
  showSuccess: false,
})

/* =========================================================
   DERIVED STATE
========================================================= */
const isOwner = computed(() =>
  authStore.user &&
  response.value?.user_id === authStore.user.id
)

/* =========================================================
   DATA LAYER
========================================================= */
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

/* =========================================================
   HELPERS
========================================================= */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/* =========================================================
   NAME EDIT FLOW
========================================================= */
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
    const { error: updateError } = await supabase
      .from('responses')
      .update({ name })
      .eq('id', response.value.id)

    if (updateError) throw updateError

    response.value.name = name
    uiState.showRegenerateAction = true
    uiState.dismissedRegenerateBanner = false

    nameEditor.isEditing = false
    nameEditor.showSuccess = true

  } catch (err) {
    console.error('Erro ao atualizar nome:', err)
    nameEditor.error = 'Não foi possível atualizar o nome.'
  } finally {
    nameEditor.isSaving = false
  }
}

/* =========================================================
   ANALYSIS FLOW
========================================================= */
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

    if (!generated) throw new Error('Falha ao atualizar análise')

    response.value.ai_analysis = generated
    uiState.showRegenerateAction = false
    uiState.showAnalysisSuccess = true
  } catch (err) {
    console.error(err)
    uiState.analysisRegenerationError = true
  } finally {
    uiState.isRegenerating = false
  }
}

/* =========================================================
   UI ACTIONS
========================================================= */
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

/* =========================================================
   LIFECYCLE
========================================================= */
onMounted(loadResponse)
</script>

<style scoped>
.v-card {
  transition: all 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.name-editor-field {
  max-width: 360px;
}

.tight-date {
  margin-top: 2px;
  line-height: 1.2;
  opacity: 0.7;
}

.gift-badges-compact {
  transform: scale(0.85);
  transform-origin: center;
  margin-top: -4px;
}

.gift-badges-compact > * {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>