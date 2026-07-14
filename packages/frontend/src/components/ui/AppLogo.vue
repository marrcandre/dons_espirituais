<template>
  <router-link
    to="/"
    class="app-logo"
    :class="`app-logo--${variant}`"
    :style="{ color, gap: `${iconSize * 0.25}px` }"
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

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, default: 'mdi-gift-outline' },
  size: { type: [Number, String], default: 30 },
  color: { type: String, default: 'white' },
  variant: { type: String, default: 'full' },
})

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
