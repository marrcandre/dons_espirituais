<template>
  <router-link
    to="/"
    class="app-logo"
    :class="`app-logo--${variant}`"
    :style="{ color: cssColor, gap: `${iconSize * 0.25}px` }"
  >
    <v-icon
      :icon="icon"
      :size="iconSize"
      :color="color"
    />

    <span
      v-if="variant === 'full'"
      class="app-logo__text"
      :style="{ fontSize: `${iconSize * 0.5}px` }"
    >
      Dons Espirituais
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    icon?: string
    size?: number | string
    color?: string
    variant?: string
  }>(),
  {
    icon: 'mdi-gift-outline',
    size: 30,
    color: 'white',
    variant: 'full',
  },
)

const themeColorMap: Record<string, string> = {
  primary: 'rgb(var(--v-theme-primary))',
  secondary: 'rgb(var(--v-theme-secondary))',
  white: '#FFFFFF',
}

const cssColor = computed(() => themeColorMap[props.color] ?? props.color)
const iconSize = computed(() => Number(props.size))
</script>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.app-logo:hover {
  opacity: 0.85;
}

.app-logo__text {
  font-weight: 700;
  line-height: 1;
}
</style>
