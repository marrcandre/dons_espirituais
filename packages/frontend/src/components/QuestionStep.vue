<template>
  <v-card rounded="xl" elevation="2" class="pa-6">
    <p class="text-body-1 font-weight-medium mb-6" style="line-height: 1.6">
      {{ question.text }}
    </p>

    <div class="d-flex flex-column gap-2 mb-6">
      <v-btn
        v-for="opt in ANSWER_LABELS"
        :key="opt.value"
        :color="modelValue === opt.value ? 'primary' : undefined"
        :variant="modelValue === opt.value ? 'flat' : 'outlined'"
        :prepend-icon="modelValue === opt.value ? 'mdi-check-circle' : 'mdi-circle-outline'"
        rounded="lg"
        size="large"
        class="justify-start text-body-2 font-weight-regular"
        style="width: 100%; height: 52px"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </v-btn>
    </div>

    <div class="d-flex justify-space-between gap-2">
      <v-btn
        variant="outlined"
        color="grey"
        prepend-icon="mdi-arrow-left"
        :disabled="isFirst"
        @click="$emit('prev')"
      >
        Anterior
      </v-btn>

      <v-btn
        color="primary"
        :append-icon="isLast ? 'mdi-check-circle' : 'mdi-arrow-right'"
        :disabled="modelValue === undefined || modelValue === null"
        @click="$emit('next')"
      >
        {{ isLast ? 'Finalizar' : 'Próxima' }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ANSWER_LABELS } from '../constants/likert.js'

defineProps({
  question: { type: Object, required: true },
  modelValue: { type: Number, default: undefined },
  isFirst: { type: Boolean, default: false },
  isLast: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'next', 'prev'])
</script>


<style scoped>
.v-card {
  transition: all 0.2s ease;
}
.v-card:hover {
  transform: translateY(-2px);
}
</style>
