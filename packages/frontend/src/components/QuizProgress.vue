<template>
  <div class="mb-4">
    <div class="d-flex justify-space-between text-caption text-medium-emphasis mb-2">
      <span>Questão {{ current }} de {{ total }}</span>
      <span>{{ progress }}% concluído</span>
    </div>
    <v-progress-linear
      :model-value="progress"
      color="primary"
      rounded
      height="8"
      bg-color="grey-lighten-3"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number
  current: number
  total: number
}>()
</script>
