<template>
  <AppCard variant="interactive">
    <h2 class="text-h6 font-weight-bold text-primary mb-4 d-flex align-center">
      <v-icon icon="mdi-gift-outline" class="mr-2" />
      Dons em destaque
    </h2>
    <v-row>
      <v-col v-for="({ gift, score }, i) in top3" :key="gift.id" cols="12" sm="4" class="py-1 py-sm-2">
        <div class="d-flex align-center pa-3 rounded-lg border-start flex-nowrap" :style="{
          borderLeft: `4px solid ${['#FFD700', '#B0BEC5', '#B08D57'][i]}`,
          backgroundColor: 'rgb(var(--v-theme-background))'
        }">
          <div class="mr-3">
            <span class="text-h6 font-weight-bold" :style="{ color: ['#D4AF37', '#78909C', '#8D6E63'][i] }">
              {{ i + 1 }}º
            </span>
          </div>
          <v-icon :icon="gift.icon" size="24" class="text-medium-emphasis mr-2 flex-shrink-0" />
          <div class="flex-grow-1 min-width-0" style="overflow:hidden">
            <div class="text-body-2 font-weight-bold text-high-emphasis text-truncate">{{ gift.name }}</div>
          </div>
          <div class="text-right ml-2 flex-shrink-0">
            <span class="text-h6 font-weight-black text-primary">{{ score }}</span>
            <span class="text-caption text-medium-emphasis">/15</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import { gifts } from '../data/gifts.js'
import { rankGifts } from '../services/scoring.js'
import AppCard from './ui/AppCard.vue'

const props = defineProps({
  scores: { type: Object, required: true },
})

const top3 = computed(() => rankGifts(props.scores).slice(0, 3))
</script>
