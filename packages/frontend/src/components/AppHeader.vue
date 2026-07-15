<template>
  <v-app-bar
    color="surface"
    elevation="0"
    height="56"
  >
    <AppLogo
      :size="24"
      color="rgb(var(--v-theme-primary))"
      class="ml-2"
    />

    <v-spacer />

    <template #append>
      <v-btn
        v-if="authStore.canAccessAdminPanel"
        icon="mdi-shield-account"
        variant="text"
        class="app-header__icon"
        to="/admin"
        title="Painel Admin"
      />

      <v-btn
        icon="mdi-history"
        variant="text"
        class="app-header__icon"
        to="/meus-resultados"
        title="Meus resultados"
      />

      <v-btn
        variant="text"
        class="app-header__icon text-none"
        to="/sobre"
        title="Sobre o projeto"
      >
        Sobre
      </v-btn>

      <v-btn
        :icon="theme.global.name.value === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
        variant="text"
        class="app-header__icon"
        :title="theme.global.name.value === 'dark' ? 'Modo claro' : 'Modo escuro'"
        @click="toggleTheme"
      />

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            variant="text"
            class="app-header__icon"
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
import AppLogo from '../components/ui/AppLogo.vue'

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

<style scoped>
.app-header__icon {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.app-header__icon:hover {
  color: rgb(var(--v-theme-primary));
}

.app-header__icon.router-link-active {
  color: rgb(var(--v-theme-primary));
}
</style>
