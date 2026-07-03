<template>
  <AppPage
    class="fill-height d-flex align-center justify-center login-page"
  >
    <AppCard max-width="440" width="100%" class="login-card">
      <PageHeader
        title="Descubra Seus Dons Espirituais"
        subtitle="Teste baseado no modelo de C. Peter Wagner"
        class="text-center mb-lg"
      >
        <v-icon size="56" color="primary" class="mb-2">mdi-gift</v-icon>
      </PageHeader>

      <v-alert v-if="error" type="error" variant="tonal" class="mb-3 mb-sm-4" closable @click:close="error = null">
        {{ error }}
      </v-alert>

      <AppButton color="primary" size="large" block rounded="lg" :loading="loading" prepend-icon="mdi-google"
        @click="handleLogin">
        Entrar com Google
      </AppButton>

      <p class="text-caption text-center text-medium-emphasis mt-4">
        Seus dados são usados somente para identificação do seu resultado.
      </p>
    </AppCard>
  </AppPage>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import AppPage from '../components/ui/AppPage.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppButton from '../components/ui/AppButton.vue'
import PageHeader from '../components/ui/PageHeader.vue'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  loading.value = true
  error.value = null
  try {
    await authStore.signInWithGoogle()
  } catch (err) {
    error.value = 'Não foi possível entrar. Tente novamente.'
    loading.value = false
  }
}
</script>


<style scoped>
.login-card {
  transition: all 0.2s ease;
}
.login-card:hover {
  transform: translateY(-2px);
}

.login-page {
  min-height: 100vh;
  background: linear-gradient(
    160deg,
    rgb(var(--v-theme-primary)) 0%,
    color-mix(in srgb, rgb(var(--v-theme-primary)) 80%, white) 100%
  );
}
</style>
