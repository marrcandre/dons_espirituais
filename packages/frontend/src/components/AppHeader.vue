<template>
  <v-app-bar color="primary" elevation="2">
    <!-- Logo + título -->
<router-link
  to="/"
  class="d-flex align-center text-decoration-none text-white ml-2"
>
<v-icon
  icon="mdi-home-outline"
  size="30"
  class="mr-3"
/>

  <span class="text-h6 font-weight-bold">
    Dons Espirituais
  </span>
</router-link>
    <v-spacer />

    <template #append>
      <v-btn
        v-if="authStore.canAccessAdminPanel"
        icon="mdi-shield-account"
        color="white"
        variant="text"
        to="/admin"
        title="Painel Admin"
      />

      <v-btn
        icon="mdi-history"
        color="white"
        variant="text"
        to="/meus-resultados"
        title="Meus resultados"
      />

      <v-btn
        :icon="theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        color="white"
        variant="text"
        :title="theme.global.name.value === 'dark' ? 'Modo claro' : 'Modo escuro'"
        @click="toggleTheme"
      />

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            variant="text"
          >
            <v-avatar
              size="32"
              color="secondary"
            >
              <img
                v-if="avatarUrl && !avatarError"
                :src="avatarUrl"
                :alt="initials"
                style="width:100%;height:100%;object-fit:cover;border-radius:50%"
                @error="avatarError = true"
              />

              <span
                v-else
                class="text-caption font-weight-bold text-white"
              >
                {{ initials }}
              </span>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item :subtitle="authStore.user?.email">
            <template #title>
              <span class="font-weight-medium">
                {{ authStore.user?.user_metadata?.full_name }}
              </span>
            </template>
          </v-list-item>

          <v-divider />

          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            @click="authStore.signOut()"
          />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useAuthStore } from '../stores/auth.js'
import { initials as getInitials } from '../helpers/string.js'

const theme = useTheme()
const authStore = useAuthStore()

theme.global.name.value = localStorage.getItem('theme') || 'light'

function toggleTheme() {
  const newTheme = theme.global.name.value === 'dark' ? 'light' : 'dark'
  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
}

const avatarError = ref(false)

const avatarUrl = computed(() =>
  authStore.user?.user_metadata?.avatar_url ||
  authStore.user?.user_metadata?.picture ||
  authStore.profile?.photo_url ||
  null
)

watch(avatarUrl, () => {
  avatarError.value = false
})

const initials = computed(() => {
  const name =
    authStore.user?.user_metadata?.full_name ||
    authStore.profile?.name ||
    ''

  return getInitials(name)
})
</script>