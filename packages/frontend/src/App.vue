<template>
  <v-app>
    <AppHeader v-if="authStore.user" />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
    <Analytics />
  </v-app>
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue'
import { injectSpeedInsights } from '@vercel/speed-insights'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/ui/AppFooter.vue'
import { useAuthStore } from './stores/auth.js'

injectSpeedInsights()

const authStore = useAuthStore()
</script>
