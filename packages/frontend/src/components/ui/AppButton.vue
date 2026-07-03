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
    :size="size"
    :rounded="rounded"
    :loading="loading"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>
