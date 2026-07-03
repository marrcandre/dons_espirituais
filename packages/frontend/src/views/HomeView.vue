<template>
  <AppPage>
    <PageHeader
      title="Descubra seus dons espirituais"
      subtitle="Um teste para ajudá-lo a identificar os dons espirituais que Deus confiou a você."
      class="text-center mb-lg"
    >
      <v-icon icon="mdi-gift-outline" size="32" color="primary" />
    </PageHeader>

    <!-- Sobre o teste -->
    <CollapsibleCard title="Sobre o teste" icon="mdi-information-outline" v-model="sobreOpen" class="mb-md">
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
    </CollapsibleCard>

    <!-- Preparação -->
    <CollapsibleCard title="Preparação para o teste" icon="mdi-clipboard-list" v-model="preparacaoOpen" class="mb-md">
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
    </CollapsibleCard>

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
import { ref } from 'vue'
import { ANSWER_LABELS } from '../data/questions.js'
import AppPage from '../components/ui/AppPage.vue'
import AppButton from '../components/ui/AppButton.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import SectionTitle from '../components/ui/SectionTitle.vue'
import CollapsibleCard from '../components/ui/CollapsibleCard.vue'

const sobreOpen = ref(true)
const preparacaoOpen = ref(true)

const reflectionQuestions = [
  'Quais atividades no ministério ou serviço mais te energizam?',
  'O que as pessoas costumam pedir sua ajuda ou opinião?',
  'Quando você serve, em quais áreas parece fluir mais naturalmente?',
  'Que tipo de necessidade no corpo de Cristo mais te move a agir?',
]
</script>
