<template>
  <AppPage class="mt-lg mb-lg">

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
      <div class="result-header mb-2">
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
              v-if="isAdmin"
              data-testid="delete-button"
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              :loading="deleteLoading"
              :disabled="deleteLoading"
              @click="confirmDelete"
            />

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
        <div class="result-header-meta d-flex justify-center mt-0 mb-1 gift-badges-compact">
          <GiftBadges :scores="response.scores" />
        </div>
      </section>

      <!-- INSIGHTS -->
      <section class="mb-3 mb-sm-4">
        <CollapsibleCard title="Pontuação por dom" icon="mdi-chart-bar" v-model="chartOpen">
          <ResultsChart
            :scores="response.scores"
          />
        </CollapsibleCard>
      </section>

      <section class="mb-3 mb-sm-4">
        <CollapsibleCard title="Análise dos seus dons" icon="mdi-auto-fix" v-model="analysisOpen">
          <AiAnalysis
            :response-id="response.id"
            :response-name="response.name"
            :initial-text="response.ai_analysis"
          />
        </CollapsibleCard>
      </section>

      <section class="mb-3 mb-sm-4">
        <CollapsibleCard title="Desenvolvimento" icon="mdi-sprout" v-model="growthOpen">
          <GrowthSection />
        </CollapsibleCard>
      </section>

      <section class="mb-3 mb-sm-4">
        <CollapsibleCard title="Recursos" icon="mdi-bookshelf" v-model="resourcesOpen">
          <ResourcesSection />
        </CollapsibleCard>
      </section>

      <!-- SNACKBARS -->
      <v-snackbar v-model="nameEditor.showSuccess" color="success" timeout="3000">
        Nome atualizado com sucesso.
      </v-snackbar>

      <v-snackbar v-model="deleteSnackbar.show" :color="deleteSnackbar.color" timeout="3000">
        {{ deleteSnackbar.message }}
      </v-snackbar>

      <!-- DELETE CONFIRMATION DIALOG -->
      <v-dialog v-model="deleteDialog.open" persistent max-width="400" @click:outside="closeDeleteDialog">
        <v-card :loading="deleteLoading" :disabled="deleteLoading">
          <v-card-title class="text-h6">
            Excluir este resultado?
          </v-card-title>

          <v-card-text>
            <p class="mb-2">Esta ação removerá permanentemente este resultado e os dados associados.</p>
            <p class="font-weight-medium text-error">Esta exclusão não poderá ser desfeita.</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              data-testid="cancel-delete"
              variant="text"
              :disabled="deleteLoading"
              @click="closeDeleteDialog"
            >
              Cancelar
            </v-btn>
            <v-btn
              data-testid="confirm-delete"
              color="error"
              variant="elevated"
              :loading="deleteLoading"
              :disabled="deleteLoading"
              @click="executeDelete"
            >
              Excluir definitivamente
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </template>

    <div v-else class="result-empty-state" />

  </AppPage>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useResponsesStore } from '../stores/responses.js'

import GrowthSection from '../components/GrowthSection.vue'
import GiftBadges from '../components/GiftBadges.vue'
import ResultsChart from '../components/ResultsChart.vue'
import AiAnalysis from '../components/AiAnalysis.vue'
import ResourcesSection from '../components/ResourcesSection.vue'
import AppPage from '../components/ui/AppPage.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import CollapsibleCard from '../components/ui/CollapsibleCard.vue'
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

const isAdmin = computed(() => authStore.isAdmin)

const router = useRouter()

const deleteDialog = reactive({
  open: false,
})

const deleteLoading = ref(false)

const deleteSnackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

const chartOpen = ref(true)
const analysisOpen = ref(true)
const growthOpen = ref(true)
const resourcesOpen = ref(true)

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

/* DELETE */
function confirmDelete() {
  deleteDialog.open = true
}

function closeDeleteDialog() {
  if (deleteLoading.value) return
  deleteDialog.open = false
}

async function executeDelete() {
  if (!response.value) return

  deleteLoading.value = true

  try {
    await responseStore.deleteItem(response.value.id)

    deleteDialog.open = false
    deleteSnackbar.show = true
    deleteSnackbar.message = 'Teste excluído com sucesso.'
    deleteSnackbar.color = 'success'

    setTimeout(() => {
      if (authStore.user) {
        router.replace({ name: 'my-results' })
      } else {
        router.replace({ name: 'home' })
      }
    }, 1500)
  } catch (_err) {
    deleteDialog.open = false
    deleteSnackbar.show = true
    deleteSnackbar.message = 'Erro ao excluir teste. Tente novamente.'
    deleteSnackbar.color = 'error'
  } finally {
    deleteLoading.value = false
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