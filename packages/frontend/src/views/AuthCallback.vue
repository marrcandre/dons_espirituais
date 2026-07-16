<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  await auth.init()
  router.replace('/')
})
</script>

<style scoped>
.auth-callback {
  height: 100vh;
}
</style>

<template>
  <div class="d-flex justify-center align-center auth-callback">
    Carregando login...
  </div>
</template>