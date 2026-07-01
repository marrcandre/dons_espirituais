<template>
  <AppPage>
    <PageHeader
      title="Descubra seus dons espirituais"
      subtitle="Um teste para ajudá-lo a identificar os dons espirituais que Deus confiou a você."
      class="text-center mb-xl"
    >
      <v-icon icon="mdi-gift-outline" size="32" color="primary" />
    </PageHeader>

    <!-- Aviso de atualização -->
    <AppCard variant="flat" color="warning" class="mb-lg">
      <SectionTitle title="Atualização recente" class="mb-sm" />

      <p class="body-text">
        Revisamos todas as perguntas do teste de dons espirituais para deixá-las mais claras e mais fiéis ao
        conteúdo original em inglês.
      </p>

      <p class="body-text mt-md">
        Se você já realizou o teste anteriormente, recomendamos refazê-lo para obter um resultado mais preciso.
      </p>
    </AppCard>

    <!-- Histórico -->
    <AppCard v-if="hasHistory" class="mb-lg">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div>
          <SectionTitle
            title="Histórico de resultados"
            subtitle="Veja seus resultados e análises anteriores."
          />
        </div>

        <AppButton variant="tonal" color="primary" size="small" to="/meus-resultados">
          Ver histórico
        </AppButton>
      </div>
    </AppCard>

    <!-- Sobre o teste -->
    <AppCard class="mb-lg">
      <SectionTitle title="Sobre o teste" class="mb-sm" />

      <p class="body-text mb-md">
        Este teste é baseado no modelo de
        <strong>C. Peter Wagner</strong>
        e avalia
        <strong>27 dons espirituais</strong>
        por meio de
        <strong>135 afirmações</strong>.
      </p>

      <p class="body-text">
        Responda com sinceridade, considerando como você realmente age e serve hoje.
        Não existem respostas certas ou erradas.
      </p>
    </AppCard>

    <!-- Preparação -->
    <AppCard class="mb-lg">
      <SectionTitle title="Preparação para o teste" class="mb-sm" />

      <SectionTitle title="Como responder" class="mb-sm" />

      <div class="d-flex flex-wrap ga-2 mb-md">
        <v-chip v-for="(opt, i) in ANSWER_LABELS" :key="i" size="small" variant="tonal" color="primary" :prepend-icon="[
          'mdi-numeric-0-circle-outline',
          'mdi-numeric-1-circle-outline',
          'mdi-numeric-2-circle-outline',
          'mdi-numeric-3-circle-outline'
        ][i]">
          {{ opt.label }}
        </v-chip>
      </div>

      <v-divider class="mb-md" />

      <SectionTitle title="Antes de começar, reflita:" class="mb-sm" />

      <ul class="body-text pl-4">
        <li v-for="(q, i) in reflectionQuestions" :key="i">
          {{ q }}
        </li>
      </ul>
    </AppCard>

    <!-- Iniciar Teste -->
    <div class="text-center">
      <AppButton color="primary" prepend-icon="mdi-play-circle" to="/quiz" class="text-none">
        Descobrir meus dons
      </AppButton>

      <p class="helper-text text-secondary mt-sm">
        Responda no seu ritmo. Seu progresso será salvo automaticamente.
      </p>
    </div>
  </AppPage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { ANSWER_LABELS } from '../data/questions.js'
import { supabase } from '../services/supabase.js'
import AppPage from '../components/ui/AppPage.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppButton from '../components/ui/AppButton.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import SectionTitle from '../components/ui/SectionTitle.vue'

const authStore = useAuthStore()

const hasHistory = ref(false)

onMounted(async () => {
  const { count } = await supabase
    .from('responses')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', authStore.user?.id)
  hasHistory.value = (count ?? 0) > 0
})

const reflectionQuestions = [
  'Quais atividades no ministério ou serviço mais te energizam?',
  'O que as pessoas costumam pedir sua ajuda ou opinião?',
  'Quando você serve, em quais áreas parece fluir mais naturalmente?',
  'Que tipo de necessidade no corpo de Cristo mais te move a agir?',
]
</script>
