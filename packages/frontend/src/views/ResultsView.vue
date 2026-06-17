<template>
  <v-container class="py-8" max-width="800"   ref="pdfContentRef">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <!-- Erro -->
    <v-alert
      v-else-if="error"
      type="error"
      rounded="xl"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <!-- Resultado -->
    <template v-else-if="response">

      <!-- TUDO QUE VAI PARA O PDF -->
      <div id="pdf-content">

        <!-- Cabeçalho -->
        <div class="text-center mb-8">
          <h1 class="text-h5 font-weight-bold text-primary mb-2">
            {{ response.name }}
          </h1>

          <p class="text-body-1 text-medium-emphasis">
            Seu Perfil de Dons Espirituais
          </p>
        </div>

        <!-- Top 3 dons -->
        <GiftBadges
          :scores="response.scores"
          class="mb-6"
        />

        <!-- Gráfico -->
        <ResultsChart
          ref="chartRef"
          :scores="response.scores"
          class="mb-8"
        />

        <!-- Análise IA -->
        <v-card
          rounded="xl"
          elevation="2"
          class="mb-6"
        >
          <AiAnalysis
            :response-id="response.id"
            :initial-text="response.ai_analysis"
          />
        </v-card>

        <!-- Crescimento -->
        <GrowthSection
          class="mb-6"
        />

        <!-- Recursos -->
        <ResourcesSection
          class="mb-6"
        />

        <!-- Data -->
        <div class="text-center mt-8">
          <p class="text-caption text-medium-emphasis">
            Teste realizado em {{ formatDate(response.created_at) }}
          </p>
        </div>

      </div>

      <!-- FORA DO PDF -->

      <!-- Histórico -->
      <HistoryList
        v-if="isOwner"
        :current-id="response.id"
        class="mt-6 mb-6"
      />

      <!-- Ações -->
      <v-card
        rounded="xl"
        variant="outlined"
        class="mb-6 pa-4"
      >
        <div class="d-flex flex-wrap justify-center ga-3">

          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-download"
            @click="exportPDF"
            :loading="exportingPDF"
          >
            Baixar PDF
          </v-btn>

          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-share-variant"
            @click="shareResult"
          >
            Compartilhar
          </v-btn>

          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-printer"
            @click="printResult"
          >
            Imprimir
          </v-btn>

          <v-btn
            v-if="!authStore.user"
            color="primary"
            prepend-icon="mdi-gift-outline"
            to="/login"
          >
            Quero descobrir meus dons
          </v-btn>

        </div>
      </v-card>

    </template>

  </v-container>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { supabase } from '../services/supabase.js'

import GrowthSection from '../components/GrowthSection.vue'
import GiftBadges from '../components/GiftBadges.vue'
import ResultsChart from '../components/ResultsChart.vue'
import AiAnalysis from '../components/AiAnalysis.vue'
import ResourcesSection from '../components/ResourcesSection.vue'
import HistoryList from '../components/HistoryList.vue'
import { resources } from '../data/resources.js'

const route = useRoute()
// Refs for PDF sections
const pdfContentRef = ref(null)

const authStore = useAuthStore()
const loading = ref(true)
const error = ref(null)
const response = ref(null)
const exportingPDF = ref(false)

const isOwner = computed(() =>
  authStore.user &&
  response.value?.user_id === authStore.user.id
)

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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

async function shareResult() {
  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Meu Resultado - Dons Espirituais',
        text: 'Confira o resultado do meu teste de dons espirituais',
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência.')
    }
  } catch (err) {
    console.error('Erro ao compartilhar:', err)
  }
}

function printResult() {
  window.print()
}

async function exportPDF() {
  exportingPDF.value = true

  try {
    const [{ default: jsPDF }, { default: html2canvas }] =
      await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

    const element = pdfContentRef.value?.$el || pdfContentRef.value

    if (!element) {
      throw new Error('Elemento não encontrado')
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY,
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight
    )

    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight

      pdf.addPage()

      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      )

      heightLeft -= pageHeight
    }

    const slug = response.value.name
      .replace(/\s+/g, '-')
      .toLowerCase()

    pdf.save(`dons-espirituais-${slug}.pdf`)
  } catch (err) {
    console.error('Erro ao exportar PDF:', err)
  } finally {
    exportingPDF.value = false
  }
}

onMounted(loadResponse)
</script>


<style scoped>
.v-card {
  transition: all 0.2s ease;
}
.v-card:hover {
  transform: translateY(-2px);
}
</style>
