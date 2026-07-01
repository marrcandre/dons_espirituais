<template>
  <AppCard :variant="cardVariant" class="error-state" v-bind="$attrs">
    <div class="error-state__content text-center">
      <v-icon v-if="icon" :icon="icon" size="40" color="error" class="error-state__icon" />

      <h3 class="section-title text-primary">{{ title }}</h3>

      <p v-if="description" class="body-text text-secondary mt-sm">{{ description }}</p>

      <slot name="action">
        <AppButton
          v-if="buttonLabel"
          class="mt-md"
          color="error"
          variant="flat"
          @click="emit('action')"
        >
          {{ buttonLabel }}
        </AppButton>
      </slot>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'
import AppCard from './AppCard.vue'

withDefaults(
  defineProps<{
    icon?: string
    title?: string
    description?: string
    buttonLabel?: string
    cardVariant?: 'default' | 'outlined' | 'flat' | 'compact'
  }>(),
  {
    icon: 'mdi-alert-circle-outline',
    title: 'Algo deu errado',
    description: 'Ocorreu um erro inesperado.',
    buttonLabel: undefined,
    cardVariant: 'outlined',
  },
)

const emit = defineEmits<{
  action: []
}>()
</script>

<style>
.error-state {
  width: 100%;
}

.error-state__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.error-state__icon {
  margin-bottom: var(--space-xs);
}
</style>
