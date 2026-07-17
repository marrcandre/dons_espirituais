<script setup lang="ts">
withDefaults(defineProps<{
  size?: string
  rounded?: string | boolean
  loading?: boolean
}>(), {
  size: 'large',
  rounded: 'lg',
  loading: false,
})
</script>

<template>
  <v-btn
    v-if="$slots.default"
    :size="size"
    :rounded="rounded"
    :loading="loading"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
  <v-btn
    v-else
    :size="size"
    :rounded="rounded"
    :loading="loading"
    v-bind="$attrs"
  />
</template>
