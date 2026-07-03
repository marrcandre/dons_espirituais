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
      </section>

      <!-- INSIGHTS -->
      <section class="mb-6">
        <ResultsChart
          :scores="response.scores"
        />
      </section>

      <section class="mb-6">
        <AiAnalysis
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

    </template>

    <div v-else class="result-empty-state" />

  </AppPage>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
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
import { formatDate } from '../helpers/date.js'

const route = useRoute()
const authStore = useAuthStore()
const responseStore = useResponsesStore()

const response = computed(() => responseStore.current)
const loading = computed(() => responseStore.loading)
const error = computed(() => responseStore.error)

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

    nameEditor.isEditing = false
    nameEditor.showSuccess = true

  } catch (err) {
    console.error(err)
    nameEditor.error = 'Não foi possível atualizar o nome.'
  } finally {
    nameEditor.isSaving = false
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