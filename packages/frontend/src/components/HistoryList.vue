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

    <div v-if="loading" class="text-center py-4">
      <v-progress-circular indeterminate color="primary" size="32" />
    </div>

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

    <p v-else class="text-body-2 text-medium-emphasis">Nenhum teste anterior.</p>
  </AppCard>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useResponsesStore } from '../stores/responses.js'
import { formatDate } from '../helpers/date.js'
import { topGift } from '../domain/scoring'
import AppCard from './ui/AppCard.vue'

defineProps({
  currentId: { type: String, required: true },
})

const authStore = useAuthStore()
const responseStore = useResponsesStore()

const loading = computed(() => responseStore.loading)
const history = computed(() => responseStore.list)

onMounted(() => {
  responseStore.fetchByUserId(authStore.user.id, {
    fields: 'id, created_at, scores',
    limit: 10,
  })
})
</script>
