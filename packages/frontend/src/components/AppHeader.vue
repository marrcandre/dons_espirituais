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
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

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

  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
})
</script>