<template>
  <AppCard variant="interactive">
    <h2 class="text-h6 font-weight-bold text-primary mb-4 d-flex align-center">
      <v-icon icon="mdi-gift-outline" class="mr-2" />
      Dons em destaque
    </h2>
    <v-row>
      <v-col v-for="({ gift, score }, i) in top3" :key="gift.id" cols="12" sm="4" class="py-1 py-sm-2">
        <div
          class="d-flex align-center pa-3 rounded-lg border-start flex-nowrap gift-badge"
          :class="`gift-badge--${['gold', 'silver', 'bronze'][i]}`"
        >
          <div class="mr-3">
            <span class="text-h6 font-weight-bold gift-badge__rank" :class="`gift-badge__rank--${['gold', 'silver', 'bronze'][i]}`">
              {{ i + 1 }}º
            </span>
          </div>
          <v-icon :icon="gift.icon" size="24" class="gift-badge__icon mr-2 flex-shrink-0" />
          <div class="flex-grow-1 min-width-0 gift-badge__name">
            <div class="text-body-2 font-weight-bold gift-badge__name-text text-truncate">{{ gift.name }}</div>
          </div>
          <div class="text-right ml-2 flex-shrink-0">
            <span class="text-h6 font-weight-black gift-badge__score">{{ score }}</span>
            <span class="text-caption gift-badge__score-label">/15</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Scores } from '../domain/scoring'
import { rankGifts } from '../domain/scoring'
import AppCard from './ui/AppCard.vue'

const props = defineProps<{
  scores: Scores
}>()

const top3 = computed(() => rankGifts(props.scores).slice(0, 3))
</script>

<style scoped>
.gift-badge--gold {
  border-left: 4px solid var(--color-gold);
  background-color: var(--color-background);
}
.gift-badge--gold .gift-badge__rank {
  color: var(--color-gold-text);
}

.gift-badge--silver {
  border-left: 4px solid var(--color-silver);
  background-color: var(--color-background);
}
.gift-badge--silver .gift-badge__rank {
  color: var(--color-silver-text);
}

.gift-badge--bronze {
  border-left: 4px solid var(--color-bronze);
  background-color: var(--color-background);
}
.gift-badge--bronze .gift-badge__rank {
  color: var(--color-bronze-text);
}

.gift-badge__icon {
  color: var(--color-text-secondary);
}

.gift-badge__name {
  overflow: hidden;
}

.gift-badge__name-text {
  color: var(--color-text-primary);
}

.gift-badge__score {
  color: var(--color-primary);
}

.gift-badge__score-label {
  color: var(--color-text-secondary);
}
</style>
