<template>
  <AppPage layout="reading">
    <PageHeader
      title="Sobre o Projeto"
      subtitle="Conheça a história, a metodologia e o propósito do teste de dons espirituais."
      class="text-center mb-lg"
    >
      <AppLogo variant="compact" :size="40" color="primary" />
    </PageHeader>

    <!-- Objetivo -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Objetivo" class="mb-sm" />
      <p class="body-text">
        O <strong>Dons Espirituais</strong> é uma ferramenta gratuita e
        open source destinada ao auxílio na descoberta dos dons espirituais
        e no desenvolvimento ministerial.
      </p>
      <p class="body-text">
        Nosso propósito é oferecer uma base inicial para reflexão, ajudando
        cada pessoa a servir no corpo de Cristo com mais clareza e confiança.
      </p>
    </AppCard>

    <!-- Como funciona -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Como funciona o teste" class="mb-sm" />
      <p class="body-text mb-sm">
        O teste apresenta <strong>135 afirmações</strong> sobre atitudes e
        práticas no serviço cristão. Para cada afirmação, você indica o
        quanto ela descreve sua realidade, usando uma escala de 0 a 3.
      </p>
      <p class="body-text">
        O cálculo é automático e seus resultados são exibidos imediatamente
        após a conclusão. A análise por inteligência artificial é
        complementar e não substitui o estudo bíblico nem o aconselhamento
        pastoral.
      </p>
    </AppCard>

    <!-- Metodologia -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Metodologia" class="mb-sm" />
      <p class="body-text mb-sm">
        O teste é baseado no modelo de <strong>C. Peter Wagner</strong>,
        um dos principais estudiosos contemporâneos sobre dons espirituais.
        Sua abordagem categoriza os dons em três esferas:
      </p>

      <v-list density="compact" class="mb-sm">
        <v-list-item v-for="(sphere, i) in spheres" :key="i">
          <template #prepend>
            <v-icon :icon="sphere.icon" color="primary" size="small" />
          </template>

          <v-list-item-title>
            {{ sphere.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ sphere.description }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <p class="body-text">
        Ao todo, são avaliados <strong>27 dons espirituais</strong> por meio
        de <strong>135 afirmações</strong> (5 afirmações por dom).
      </p>
      <p class="body-text mt-sm">
        Este projeto é uma ferramenta de apoio. Não pretende estabelecer
        posição doutrinária exclusiva nem substituir o acompanhamento
        pastoral.
      </p>
    </AppCard>

    <!-- Tecnologias -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Tecnologias utilizadas" class="mb-sm" />
      <div class="d-flex flex-wrap ga-3 mb-sm">
        <v-chip
          v-for="(tech, i) in technologies"
          :key="i"
          :prepend-icon="tech.icon"
          variant="tonal"
          color="primary"
          size="small"
        >
          {{ tech.name }}
        </v-chip>
      </div>
    </AppCard>

    <!-- Autor -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Autor" class="mb-sm" />
      <p class="body-text mb-sm">
        Projeto desenvolvido e mantido por
        <strong>{{ author.name }}</strong>.
      </p>
      <p class="body-text mb-sm">
        {{ author.description }}
      </p>
      <div class="d-flex ga-4">
        <a
          :href="author.github"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
          :title="'GitHub'"
        >
          <v-icon icon="mdi-github" color="primary" size="large" />
        </a>
        <a
          :href="author.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
          :title="'LinkedIn'"
        >
          <v-icon icon="mdi-linkedin" color="primary" size="large" />
        </a>
        <a
          :href="'mailto:' + author.email"
          class="text-decoration-none"
          :title="'Email'"
        >
          <v-icon icon="mdi-email" color="primary" size="large" />
        </a>
      </div>
    </AppCard>

    <!-- Licença -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Licença" class="mb-sm" />
      <p class="body-text">
        Este projeto é distribuído sob a licença MIT. Você pode livremente
        utilizar, copiar, modificar e distribuir este software, desde que
        mantenha os créditos aos autores originais.
      </p>
    </AppCard>

    <!-- Como contribuir -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Como contribuir" class="mb-sm" />
      <p class="body-text mb-sm">
        O Dons Espirituais é um projeto de código aberto. Você pode
        contribuir de diversas formas:
      </p>
      <ul class="mb-sm contribution-list">
        <li v-for="(item, i) in contributionWays" :key="i">
          {{ item }}
        </li>
      </ul>
      <div class="d-flex flex-wrap ga-2">
        <AppButton
          variant="outlined"
          prepend-icon="mdi-github"
          href="https://github.com/marrcandre/dons-espirituais"
          target="_blank"
        >
          GitHub
        </AppButton>

        <AppButton
          variant="tonal"
          prepend-icon="mdi-bug"
          href="https://github.com/marrcandre/dons-espirituais/issues"
          target="_blank"
        >
          Reportar problema
        </AppButton>
      </div>
    </AppCard>

    <!-- Apoie este projeto -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Apoie este projeto" class="mb-sm" />
      <p class="body-text mb-sm">
        Este projeto é gratuito e desenvolvido voluntariamente. Se você
        deseja contribuir financeiramente para ajudar na manutenção e
        evolução da ferramenta, sua contribuição é muito bem-vinda.
      </p>

      <div class="d-flex flex-column align-center ga-4 py-4">
        <canvas ref="canvasRef" class="pix-qr" />

        <div class="text-center">
          <p class="text-caption text-medium-emphasis mb-2">
            Chave PIX
          </p>
          <code class="pix-key text-body-2 font-weight-medium">
            {{ pix.key }}
          </code>
        </div>

        <AppButton
          prepend-icon="mdi-content-copy"
          variant="tonal"
          color="primary"
          @click="copyPixKey"
        >
          Copiar chave PIX
        </AppButton>
      </div>
    </AppCard>

    <!-- Outros projetos -->
    <AppCard variant="flat">
      <SectionTitle title="Outros projetos" class="mb-sm" />
      <p class="body-text mb-sm">
        Conheça também outros projetos do mesmo autor:
      </p>

      <v-list density="compact">
        <v-list-item
          v-for="(project, i) in relatedProjects"
          :key="i"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <template #prepend>
            <v-icon :icon="project.icon" color="primary" size="small" />
          </template>

          <v-list-item-title>
            {{ project.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ project.description }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </AppCard>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="bottom"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </AppPage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

import AppPage from '../components/ui/AppPage.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppButton from '../components/ui/AppButton.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import SectionTitle from '../components/ui/SectionTitle.vue'
import AppLogo from '../components/ui/AppLogo.vue'

const pix = {
  key: 'marcoandre@gmail.com',
  holder: 'Marco André Mendes',
}

const author = {
  name: 'Marco André Mendes',
  description:
    'Desenvolvedor e mantenedor de projetos open source com foco em aplicações web para o contexto cristão.',
  github: 'https://github.com/marrcandre',
  linkedin: 'https://www.linkedin.com/in/marrcandre/',
  email: 'marcoandre@gmail.com',
}

const technologies = [
  { name: 'Vue 3', icon: 'mdi-vuejs' },
  { name: 'Vuetify', icon: 'mdi-material-design' },
  { name: 'Supabase', icon: 'mdi-database' },
  { name: 'Gemini IA', icon: 'mdi-robot' },
  { name: 'Vercel', icon: 'mdi-cloud' },
  { name: 'JavaScript', icon: 'mdi-language-javascript' },
  { name: 'TypeScript', icon: 'mdi-language-typescript' },
  { name: 'Vitest', icon: 'mdi-test-tube' },
  { name: 'GitHub Actions', icon: 'mdi-github' },
]

const relatedProjects = [
  {
    name: 'Cinco Ministérios',
    description: 'Teste de ministérios baseado em Efésios 4:11.',
    url: 'https://github.com/marrcandre/cinco-ministerios',
    icon: 'mdi-account-group',
  },
]

const spheres = [
  {
    name: 'Dons de Ministério',
    description: 'Capacidades para liderar, ensinar e pastorear o povo de Deus.',
    icon: 'mdi-church',
  },
  {
    name: 'Dons de Suporte',
    description: 'Capacidades para servir, auxiliar e fortalecer a comunidade.',
    icon: 'mdi-hand-heart',
  },
  {
    name: 'Dons de Sinais',
    description: 'Capacidades para manifestar o poder de Deus e confirmar sua mensagem.',
    icon: 'mdi-lightning-bolt',
  },
]

const contributionWays = [
  'Sugestões e feedback',
  'Correções e relatos de bugs',
  'Pull requests no GitHub',
  'Melhorias na documentação',
  'Divulgação do projeto',
  'Apoio financeiro via PIX',
]

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
})

const canvasRef = ref(null)

function crc16(str) {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc = crc << 1
      }
      crc &= 0xFFFF
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function buildPixPayload(key, holder) {
  const merchantAccountInfo = `0014BR.GOV.BCB.PIX01${String(key.length).padStart(2, '0')}${key}`
  const merchantName = holder.substring(0, 25)
  const city = 'BRASILIA'
  const payload = `00020101021226${String(merchantAccountInfo.length).padStart(2, '0')}${merchantAccountInfo}5204000053039865802BR59${String(merchantName.length).padStart(2, '0')}${merchantName}60${String(city.length).padStart(2, '0')}${city}62070503***6304`
  return payload + crc16(payload)
}

async function copyPixKey() {
  try {
    await navigator.clipboard.writeText(pix.key)
    snackbar.value = {
      show: true,
      text: 'Chave PIX copiada para a área de transferência.',
      color: 'success',
      timeout: 3000,
    }
  } catch {
    snackbar.value = {
      show: true,
      text: 'Não foi possível copiar automaticamente. Copie a chave abaixo.',
      color: 'warning',
      timeout: 6000,
    }
  }
}

onMounted(async () => {
  if (canvasRef.value) {
    try {
      const payload = buildPixPayload(pix.key, pix.holder)
      // Cores do QR Code refletem o Design System (primary/surface).
      // São passadas como constantes porque a API toCanvas() não aceita CSS variables.
      await QRCode.toCanvas(canvasRef.value, payload, {
        width: 180,
        margin: 2,
        color: {
          dark: '#1a4d2e',
          light: '#ffffff',
        },
      })
    } catch {
      // QR code generation failed silently
      // Canvas remains empty, PIX key still available for copy
    }
  }
})
</script>

<style scoped>
.contribution-list {
  padding-left: 1.25rem;
}

.contribution-list li + li {
  margin-top: 4px;
}

.pix-qr {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.pix-key {
  display: inline-block;
  max-width: 280px;
  padding: 4px 12px;
  border-radius: 6px;
  word-break: break-all;
  background-color: var(--color-surface);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
}
</style>
