<template>
  <v-card rounded="xl" elevation="2" class="pa-6">
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
        :rules="[ageRule]"
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
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../services/supabase.js'

const emit = defineEmits(['submit'])

const formRef = ref(null)

const form = ref({
  name: '',
  gp: '',
  age: '',
})

const required = (v) => !!v?.trim() || 'Campo obrigatório'

const ageRule = (v) => {
  if (!v) return true

  const n = parseInt(v)

  return (n >= 5 && n <= 120) || 'Idade inválida'
}

onMounted(loadUserData)

async function loadUserData() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erro ao carregar nome do usuário:', error)
      return
    }

    if (data?.name) {
      form.value.name = data.name
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

<style scoped>
.v-card {
  transition: all 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>