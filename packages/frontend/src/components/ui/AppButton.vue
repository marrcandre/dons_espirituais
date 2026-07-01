<template>
  <v-btn
    :size="size"
    :rounded="rounded"
    :loading="loading"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :icon="icon"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
    rounded?: '0' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | boolean | string
    loading?: boolean
    prependIcon?: string
    appendIcon?: string
    icon?: string | boolean
  }>(),
  {
    size: 'large',
    rounded: 'lg',
    loading: false,
    prependIcon: undefined,
    appendIcon: undefined,
    icon: false,
  },
)
</script>
