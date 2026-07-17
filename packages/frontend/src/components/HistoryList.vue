<template>
  <AppCard variant="interactive">
    <div class="d-flex align-center mb-4">
      <v-icon
        icon="mdi-history"
        color="primary"
        class="mr-2"
      />

      <h2 class="text-h6 font-weight-bold text-primary mb-2">
        Seus testes anteriores
      </h2>
    </div>

    <LoadingState v-if="loading" :size="32" class="py-4" />

    <v-list v-else-if="history.length" lines="two">
      <v-list-item v-for="item in history" :key="item.id" :to="{ name: 'results', params: { id: item.id } }"
        :class="item.id === currentId ? 'bg-primary-lighten-5' : ''" rounded="lg" class="mb-2">
        <template #title>
          <span class="font-weight-medium">{{ formatDate(item.created_at, { month: 'short' }) }}</span>
          <v-chip v-if="item.id === currentId" size="x-small" color="primary" class="ml-2">atual</v-chip>
        </template>
        <template #subtitle>
          {{ topGift(item.scores) }}
        </template>
        <template #append>
          <v-icon icon="mdi-chevron-right" color="grey" />
        </template>
      </v-list-item>
    </v-list>

    <EmptyState v-else-if="!error" title="Nenhum teste anterior." />

    <ErrorState v-else :message="error" />
  </AppCard>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useResponsesStore } from '../stores/responses.js'
import { formatDate } from '../helpers/date.js'
import { topGift } from '../domain/scoring'
import AppCard from './ui/AppCard.vue'
import LoadingState from './ui/LoadingState.vue'
import EmptyState from './ui/EmptyState.vue'
import ErrorState from './ui/ErrorState.vue'

defineProps({
  currentId: { type: String, required: true },
})

const authStore = useAuthStore()
const responseStore = useResponsesStore()

const loading = computed(() => responseStore.loading)
const history = computed(() => responseStore.list)
const error = computed(() => responseStore.error)

onMounted(() => {
  responseStore.fetchByUserId(authStore.user.id, {
    fields: 'id, created_at, scores',
    limit: 10,
  })
})
</script>
