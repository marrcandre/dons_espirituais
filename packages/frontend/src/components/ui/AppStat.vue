<template>
  <AppCard variant="flat" class="app-stat" v-bind="$attrs">
    <div class="app-stat__content">
      <v-icon v-if="icon" :icon="icon" size="20" color="primary" class="app-stat__icon" />

      <div class="app-stat__text">
        <p class="app-stat__value main-title text-primary">{{ value }}</p>
        <p class="app-stat__label helper-text text-secondary">{{ label }}</p>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from './AppCard.vue'

withDefaults(
  defineProps<{
    value: string | number
    label: string
    icon?: string
  }>(),
  {
    icon: undefined,
  },
)
</script>

<style>
.app-stat__content {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.app-stat__icon {
  flex: 0 0 auto;
}

.app-stat__text {
  min-width: 0;
}

.app-stat__value {
  line-height: 1.2;
}

.app-stat__label {
  margin-top: var(--space-xs);
}
</style>
