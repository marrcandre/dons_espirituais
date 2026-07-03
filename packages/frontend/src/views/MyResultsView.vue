<template>
  <AppPage class="mt-xl mb-xl">
    <PageHeader title="Histórico de testes" class="mb-lg">
      <AppButton
        color="primary"
        rounded="xl"
        prepend-icon="mdi-play-circle"
        to="/quiz"
        class="text-none"
      >
        Novo teste
      </AppButton>
    </PageHeader>

    <LoadingState v-if="loading" class="py-16" size="48" thickness="4" />

    <ErrorState
      v-else-if="error"
      :description="error"
      button-label="Tentar novamente"
      @action="loadResults"
    />

    <EmptyState
      v-else-if="rows.length === 0"
      icon="mdi-clipboard-text-outline"
      title="Nenhum teste encontrado"
      description="Você ainda não fez nenhum teste."
    >
      <template #action>
        <AppButton
          color="primary"
          rounded="xl"
          prepend-icon="mdi-play-circle"
          to="/quiz"
          class="text-none"
        >
          Fazer o primeiro teste
        </AppButton>
      </template>
    </EmptyState>

    <div v-else class="d-flex flex-column ga-3">
      <div
        v-for="(item, index) in rows"
        :key="item.id"
      >
        <AppCard variant="interactive" @click="goToResult(item.id)">
          <div class="d-flex align-center">
            <div class="flex-grow-1 min-width-0">
              <div class="d-flex align-center ga-2 mb-1">
                <span class="text-subtitle-1 font-weight-medium text-truncate">
                  {{ formatDate(item.created_at) }}
                </span>

                <v-chip
                  v-if="index === 0"
                  size="x-small"
                  color="primary"
                >
                  Último
                </v-chip>
              </div>

              <div class="d-flex align-center ga-2">
                <span class="text-caption text-medium-emphasis text-no-wrap">
                  {{ formatRelativeDate(item.created_at) }}
                </span>
              </div>
            </div>

            <v-icon icon="mdi-chevron-right" color="medium-emphasis" class="ml-2" />
          </div>
        </AppCard>
      </div>
    </div>
  </AppPage>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useResponsesStore } from '../stores/responses.js'
import AppPage from '../components/ui/AppPage.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppButton from '../components/ui/AppButton.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import { formatDate, formatRelativeDate } from '../helpers/date.js'

const router = useRouter()
const authStore = useAuthStore()
const responseStore = useResponsesStore()

const loading = computed(() => responseStore.loading)
const error = computed(() => responseStore.error)
const rows = computed(() => responseStore.list)

onMounted(loadResults)

function goToResult(id) {
  router.push({
    name: 'results',
    params: { id },
  })
}

async function loadResults() {
  await responseStore.fetchByUserId(authStore.user.id, { fields: 'id, created_at' })
}

</script>