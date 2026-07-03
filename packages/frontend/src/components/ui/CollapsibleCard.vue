<template>
  <AppCard :variant="variant">
    <div
      class="d-flex align-center justify-space-between ga-2 mb-2"
      :class="{ 'mb-0': !isOpen }"
      style="cursor: pointer"
      @click="toggle"
    >
      <div class="d-flex align-center ga-2 min-width-0">
        <v-icon v-if="icon" :icon="icon" color="primary" size="20" class="flex-shrink-0" />
        <div class="min-width-0">
          <h3 class="section-title text-primary mb-0 text-truncate">{{ title }}</h3>
          <p v-if="subtitle" class="helper-text text-secondary mt-xs">{{ subtitle }}</p>
        </div>
      </div>

      <div class="d-flex align-center ga-1 flex-shrink-0">
        <slot name="actions" />

        <v-btn
          :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          variant="text"
          size="small"
          color="medium-emphasis"
          @click.stop="toggle"
        />
      </div>
    </div>

    <v-expand-transition>
      <div v-show="isOpen">
        <slot />
      </div>
    </v-expand-transition>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppCard from './AppCard.vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: string
    modelValue?: boolean
    variant?: 'default' | 'outlined' | 'flat' | 'compact' | 'interactive'
  }>(),
  {
    subtitle: undefined,
    icon: undefined,
    modelValue: true,
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed(() => props.modelValue)

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>
