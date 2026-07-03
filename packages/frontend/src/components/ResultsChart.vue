<template>
    <div ref="chartWrapperEl" class="chart-wrapper" :style="{ height: chartHeight }">
      <Bar :data="chartData" :options="chartOptions" :plugins="chartPlugins" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { rankGifts } from '../services/scoring.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  scores: { type: Object, required: true },
})

const chartWrapperEl = ref(null)

function getChartCanvas() {
  return chartWrapperEl.value?.querySelector('canvas') ?? null
}

defineExpose({ getChartCanvas })

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
const { mobile } = useDisplay()
const chartHeight = computed(() => mobile.value ? '300px' : '520px')

const textColor = computed(() => isDark.value ? '#E0E0E0' : '#424242')
const gridColor = computed(() => isDark.value ? 'rgba(255,255,255,0.12)' : '#e0e0e0')

const ranked = computed(() => rankGifts(props.scores))

// Gradiente verde: score alto = verde escuro, baixo = verde bem claro
function scoreColor(score) {
  const ratio = score / 15
  const r = Math.round(27 + (220 - 27) * (1 - ratio))
  const g = Math.round(84 + (240 - 84) * (1 - ratio))
  const b = Math.round(56 + (230 - 56) * (1 - ratio))
  return `rgb(${r},${g},${b})`
}

const chartData = computed(() => ({
  labels: ranked.value.map(({ gift }) => gift.name),
  datasets: [
    {
      label: 'Pontuação',
      data: ranked.value.map(({ score }) => score),
      backgroundColor: ranked.value.map(({ score }) => scoreColor(score)),
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
}))

const chartPlugins = [
  {
    id: 'valueLabel',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart
      ctx.save()
      ctx.font = 'bold 11px sans-serif'
      ctx.fillStyle = textColor.value
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'

      const dataset = data.datasets[0]
      const meta = chart.getDatasetMeta(0)

      meta.data.forEach((bar, index) => {
        const val = dataset.data[index]
        const posX = bar.x + 6
        const posY = bar.y
        ctx.fillText(`${val}`, posX, posY)
      })
      ctx.restore()
    }
  }
]

const chartOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 25
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.raw}/15`,
      },
    },
  },
  scales: {
    x: {
      min: 0,
      max: 15,
      ticks: { stepSize: 3, color: textColor.value },
      grid: { color: gridColor.value },
    },
    y: {
      ticks: { font: { size: 12 }, color: textColor.value },
      grid: { display: false },
    },
  },
}))
</script>
