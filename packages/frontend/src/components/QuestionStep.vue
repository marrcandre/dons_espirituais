<template>
  <v-card rounded="xl" elevation="2" class="pa-6">
    <p class="text-body-1 font-weight-medium mb-6">
      {{ question.text }}
    </p>

    <div class="d-flex flex-column gap-2 mb-6">
      <AppButton
        v-for="opt in ANSWER_LABELS"
        :key="opt.value"
        :color="modelValue === opt.value ? 'primary' : undefined"
        :variant="modelValue === opt.value ? 'flat' : 'outlined'"
        :prepend-icon="modelValue === opt.value ? 'mdi-check-circle' : 'mdi-circle-outline'"
        rounded="lg"
        size="large"
        class="justify-start text-body-2 font-weight-regular question-step__option"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </AppButton>
    </div>

    <div class="d-flex justify-space-between gap-2">
      <AppButton
        variant="outlined"
        color="grey"
        prepend-icon="mdi-arrow-left"
        :disabled="isFirst"
        @click="$emit('prev')"
      >
        Anterior
      </AppButton>

      <AppButton
        color="primary"
        :append-icon="isLast ? 'mdi-check-circle' : 'mdi-arrow-right'"
        :disabled="modelValue === undefined || modelValue === null"
        @click="$emit('next')"
      >
        {{ isLast ? 'Finalizar' : 'Próxima' }}
      </AppButton>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ANSWER_LABELS } from '../constants/likert.js'
import AppButton from './ui/AppButton.vue'

export interface Question {
  id: number
  text: string
}

withDefaults(
  defineProps<{
    question: Question
    modelValue?: number
    isFirst?: boolean
    isLast?: boolean
  }>(),
  {
    modelValue: undefined,
    isFirst: false,
    isLast: false,
  },
)

defineEmits<{
  'update:modelValue': [value: number | undefined]
  next: []
  prev: []
}>()
</script>


<style scoped>
.v-card {
  transition: all 0.2s ease;
}
.v-card:hover {
  transform: translateY(-2px);
}
.question-step__option {
  width: 100%;
  height: 52px;
}
</style>
