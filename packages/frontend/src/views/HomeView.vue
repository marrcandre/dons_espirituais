<template>
  <v-container class="py-8" max-width="700">

    <!-- Cabeçalho -->
    <div class="text-center mb-8">

      <h1 class="text-h4 font-weight-bold text-primary d-flex justify-center align-center mb-4">
        <v-icon icon="mdi-gift-outline" size="40" class="mr-3" />
        Descubra seus dons espirituais
      </h1>

      <p class="text-body-1 text-medium-emphasis mx-auto" style="max-width: 520px">
        Um teste para ajudá-lo a identificar os dons espirituais que Deus confiou a você.
      </p>

    </div>

    <!-- Aviso de atualização -->
    <v-card rounded="xl" elevation="2" class="pa-5 mb-6" color="warning" variant="tonal">
      <div class="d-flex align-start">
        <v-icon color="warning" size="28" class="mr-4 mt-1">
          mdi-information-outline
        </v-icon>

        <div>
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Atualização recente
          </div>

          <div class="text-body-2">
            Revisamos todas as perguntas do teste de dons espirituais para deixá-las mais claras e mais fiéis ao
            conteúdo original em inglês.

            <br /><br />

            Se você já realizou o teste anteriormente, recomendamos refazê-lo para obter um resultado mais preciso.
          </div>
        </div>
      </div>
    </v-card>

    <!-- Histórico -->
    <v-card v-if="hasHistory" rounded="xl" class="mb-6 pa-5 d-flex align-center justify-space-between" elevation="2">
      <div>
        <div class="d-flex align-center mb-4">
          <v-icon icon="mdi-history" color="primary" class="mr-2" />

          <p class="text-h6 font-weight-bold text-primary mb-2">
            Histórico de resultados
          </p>
        </div>

        <p class="text-body-2 text-medium-emphasis mb-2">
          Veja seus resultados e análises anteriores.
        </p>
      </div>

      <v-btn variant="tonal" color="primary" rounded="lg" size="small" to="/meus-resultados">
        Ver histórico
      </v-btn>
    </v-card>

    <!-- Sobre o teste -->
    <v-card rounded="xl" class="mb-6 pa-5" elevation="2">
      <div class="d-flex align-center mb-4">
        <v-icon icon="mdi-information-outline" color="primary" class="mr-2" />

        <p class="text-h6 font-weight-bold text-primary mb-2">
          Sobre o teste
        </p>
      </div>

      <p class="text-body-1 mb-4">
        Este teste é baseado no modelo de
        <strong>C. Peter Wagner</strong>
        e avalia
        <strong>27 dons espirituais</strong>
        por meio de
        <strong>135 afirmações</strong>.
      </p>

      <p class="text-body-1">
        Responda com sinceridade, considerando como você realmente age e serve hoje.
        Não existem respostas certas ou erradas.
      </p>
    </v-card>

    <!-- Preparação -->
    <v-card rounded="xl" class="mb-6 pa-5" elevation="2">
      <div class="d-flex align-center mb-4">
        <v-icon icon="mdi-lightbulb-outline" color="primary" class="mr-2" />

        <p class="text-h6 font-weight-bold text-primary mb-2">
          Preparação para o teste
        </p>
      </div>

      <p class="text-h6 font-weight-medium mb-4">
        Como responder
      </p>

      <div class="d-flex flex-wrap mb-5" style="gap: 6px 8px;">
        <v-chip v-for="(opt, i) in ANSWER_LABELS" :key="i" size="small" variant="tonal" color="primary" :prepend-icon="[
          'mdi-numeric-0-circle-outline',
          'mdi-numeric-1-circle-outline',
          'mdi-numeric-2-circle-outline',
          'mdi-numeric-3-circle-outline'
        ][i]">
          {{ opt.label }}
        </v-chip>
      </div>

      <v-divider class="mb-4" />

      <p class="text-h6 font-weight-medium mb-4">
        Antes de começar, reflita:
      </p>

      <ul class="text-body-1 pl-4" style="line-height: 1.8">
        <li v-for="(q, i) in reflectionQuestions" :key="i">
          {{ q }}
        </li>
      </ul>
    </v-card>

    <!-- Iniciar Teste -->
    <div class="text-center">
      <v-btn color="primary" size="large" rounded="xl" prepend-icon="mdi-play-circle" to="/quiz" min-width="220"
        class="text-none">
        Descobrir meus dons
      </v-btn>

      <p class="text-body-2 text-medium-emphasis mt-4">
        Responda no seu ritmo. Seu progresso será salvo automaticamente.
      </p>
    </div>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { ANSWER_LABELS } from '../data/questions.js'
import { supabase } from '../services/supabase.js'

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


<style scoped>
.v-card {
  transition: all 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
