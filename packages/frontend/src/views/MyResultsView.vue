<template>
  <v-container class="py-8" max-width="700">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold text-primary">
        Histórico de testes
      </h1>

      <v-btn
        color="primary"
        rounded="xl"
        prepend-icon="mdi-play-circle"
        to="/quiz"
        class="text-none"
      >
        Novo teste
      </v-btn>
    </div>

    <div v-if="loading" class="text-center py-16">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      rounded="xl"
      class="mb-4"
    >
      {{ error }}

      <template #append>
        <v-btn
          variant="text"
          color="error"
          @click="loadResults"
        >
          Tentar novamente
        </v-btn>
      </template>
    </v-alert>

    <v-card
      v-else-if="rows.length === 0"
      rounded="xl"
      elevation="2"
      class="pa-8 text-center"
    >
      <v-icon
        size="56"
        color="grey-lighten-1"
        class="mb-4"
      >
        mdi-clipboard-text-outline
      </v-icon>

      <p class="text-body-1 text-medium-emphasis mb-4">
        Você ainda não fez nenhum teste.
      </p>

      <v-btn
        color="primary"
        rounded="xl"
        prepend-icon="mdi-play-circle"
        to="/quiz"
        class="text-none"
      >
        Fazer o primeiro teste
      </v-btn>
    </v-card>

    <div v-else>
      <div
        v-for="(item, index) in rows"
        :key="item.id"
        class="history-item"
        @click="goToResult(item.id)"
      >
        <div
          v-if="index === 0"
          class="text-caption text-primary font-weight-bold mb-1"
        >
          Último teste
        </div>

        <div class="text-subtitle-1 font-weight-medium">
          {{ formatDate(item.created_at) }}
        </div>

        <div class="text-caption text-medium-emphasis">
          {{ formatRelativeDate(item.created_at) }}
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { runSupabaseQuery } from '../services/supabaseQuery.js'
import { supabase } from '../services/supabase.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const rows = ref([])

onMounted(loadResults)

function goToResult(id) {
  router.push({
    name: 'results',
    params: { id },
  })
}

async function loadResults() {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await runSupabaseQuery(
      supabase
        .from('responses')
        .select('id, created_at')
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: false })
    )

    if (fetchError) throw fetchError

    rows.value = data ?? []
  } catch (err) {
    console.error('Erro ao carregar resultados:', err)

    error.value =
      'Não foi possível carregar seus resultados. Tente novamente.'
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

function formatRelativeDate(iso) {
  const now = new Date()
  const date = new Date(iso)

  const diffDays = Math.floor(
    (now - date) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 30) return `Há ${diffDays} dias`

  const totalMonths = Math.floor(diffDays / 30)

  if (totalMonths < 12) {
    return totalMonths === 1
      ? 'Há 1 mês'
      : `Há ${totalMonths} meses`
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (months === 0) {
    return years === 1
      ? 'Há 1 ano'
      : `Há ${years} anos`
  }

  const yearsText = years === 1
    ? '1 ano'
    : `${years} anos`

  const monthsText = months === 1
    ? '1 mês'
    : `${months} meses`

  return `Há ${yearsText} e ${monthsText}`
}

</script>

<style scoped>
.history-item {
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  opacity: 0.7;
}

.history-item:first-child {
  padding-top: 0;
}
</style>