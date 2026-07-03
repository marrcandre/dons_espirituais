<template>
    <v-row>
      <v-col v-for="res in resources" :key="res.title" cols="12" sm="4">
        <AppCard variant="outlined" class="resource-card">
          <a :href="res.url" target="_blank" rel="noopener" class="text-decoration-none">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="d-flex align-center">
                <v-icon :icon="res.icon" color="primary" class="mr-2" />
                <span class="text-h6 font-weight-bold text-primary">
                  {{ res.title }}
                </span>
              </div>

              <v-icon icon="mdi-open-in-new" size="18" color="medium-emphasis" />
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ res.subtitle }}</p>
          </a>
        </AppCard>
      </v-col>
    </v-row>
</template>

<script setup>
import { resources } from '../data/resources.js'
import AppCard from './ui/AppCard.vue'
</script>

<style scoped>
.resource-card {
  transition: transform var(--duration-fast, 150ms) var(--easing-standard, ease),
    box-shadow var(--duration-fast, 150ms) var(--easing-standard, ease);
}

.resource-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style>
