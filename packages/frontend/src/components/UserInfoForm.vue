<template>
  <AppCard variant="compact">
    <h2 class="text-h6 font-weight-bold text-primary mb-4">
      Sobre você
    </h2>

    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-text-field
        v-model="form.name"
        label="Nome completo"
        variant="outlined"
        rounded="lg"
        :rules="[required]"
        prepend-inner-icon="mdi-account"
        class="mb-4"
        autofocus
      />

      <v-text-field
        v-model="form.gp"
        label="Quem é seu líder? (apascentador, coordenador, supervisor, etc.)"
        variant="outlined"
        rounded="lg"
        prepend-inner-icon="mdi-account-group"
        class="mb-4"
      />

      <v-text-field
        v-model="form.age"
        label="Idade"
        variant="outlined"
        rounded="lg"
        type="number"
        :rules="[ageRange]"
        prepend-inner-icon="mdi-calendar"
        class="mb-6"
      />

      <div class="d-flex justify-center">
        <v-btn
          type="submit"
          color="primary"
          size="large"
          rounded="xl"
          append-icon="mdi-arrow-right"
          class="text-none"
          min-width="220"
        >
          Começar o teste
        </v-btn>
      </div>
    </v-form>
  </AppCard>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as authRepository from '../repositories/authRepository.js'
import * as userRepository from '../repositories/userRepository.js'
import { required, ageRange } from '../helpers/validation.js'
import AppCard from './ui/AppCard.vue'

const emit = defineEmits(['submit'])

const formRef = ref(null)

const form = ref({
  name: '',
  gp: '',
  age: '',
})

onMounted(loadUserData)

async function loadUserData() {
  try {
    const user = await authRepository.getUser()
    if (!user) return

    const profile = await userRepository.findById(user.id)
    if (profile?.name) {
      form.value.name = profile.name
    }
  } catch (err) {
    console.error('Erro ao carregar usuário:', err)
  }
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  emit('submit', { ...form.value })
}
</script>