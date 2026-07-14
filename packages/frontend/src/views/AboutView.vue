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
        O <strong>Dons Espirituais</strong> é uma ferramenta gratuita e online para ajudar
        cristãos a identificarem os dons espirituais que Deus lhes confiou.
        Nosso propósito é auxiliar no autoconhecimento ministerial e encorajar
        cada pessoa a servir no corpo de Cristo com mais clareza e confiança.
      </p>
    </AppCard>

    <!-- Explicação do teste -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Como funciona o teste" class="mb-sm" />
      <p class="body-text mb-sm">
        O teste apresenta <strong>135 afirmações</strong> sobre atitudes e práticas
        no serviço cristão. Para cada afirmação, você indica o quanto ela
        descreve sua realidade, usando uma escala de 0 a 3.
      </p>
      <p class="body-text">
        Ao final, suas respostas são processadas para calcular o perfil dos seus
        dons espirituais, destacando seus dons principais e oferecendo uma
        análise personalizada gerada por inteligência artificial.
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
        Ao todo, são avaliados <strong>27 dons espirituais</strong> por meio de
        <strong>135 afirmações</strong> (5 afirmações por dom).
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

    <!-- Autoria -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Autoria" class="mb-sm" />
      <p class="body-text mb-sm">
        Projeto desenvolvido e mantido por <strong>Marco André</strong>.
      </p>
      <p class="body-text">
        Este teste foi construído a partir de uma necessidade real de
        comunidades cristãs que buscavam uma ferramenta acessível, gratuita
        e teologicamente fundamentada para descoberta de dons espirituais.
      </p>
    </AppCard>

    <!-- Licença -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Licença" class="mb-sm" />
      <p class="body-text mb-sm">
        Este projeto é distribuído sob a licença MIT.
      </p>
      <p class="body-text">
        Você pode livremente utilizar, copiar, modificar e distribuir este
        software, desde que mantenha os créditos aos autores originais.
      </p>
    </AppCard>

    <!-- Contribuição -->
    <AppCard class="mb-md" variant="flat">
      <SectionTitle title="Contribuição" class="mb-sm" />
      <p class="body-text mb-sm">
        O Dons Espirituais é um projeto de código aberto. Contribuições são
        bem-vindas!
      </p>
      <div class="d-flex flex-wrap ga-2">
        <AppButton
          variant="outlined"
          prepend-icon="mdi-github"
          href="https://github.com/anomalyco/dons-espirituais"
          target="_blank"
        >
          GitHub
        </AppButton>

        <AppButton
          variant="tonal"
          prepend-icon="mdi-bug"
          href="https://github.com/anomalyco/dons-espirituais/issues"
          target="_blank"
        >
          Reportar problema
        </AppButton>
      </div>
    </AppCard>

    <!-- Projetos relacionados -->
    <AppCard variant="flat">
      <SectionTitle title="Projetos relacionados" class="mb-sm" />
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
  </AppPage>
</template>

<script setup>
import AppPage from '../components/ui/AppPage.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppButton from '../components/ui/AppButton.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import SectionTitle from '../components/ui/SectionTitle.vue'
import AppLogo from '../components/ui/AppLogo.vue'

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

const technologies = [
  { name: 'Vue 3', icon: 'mdi-vuejs' },
  { name: 'Vuetify', icon: 'mdi-material-design' },
  { name: 'Supabase', icon: 'mdi-database' },
  { name: 'Gemini IA', icon: 'mdi-robot' },
  { name: 'Vercel', icon: 'mdi-cloud' },
  { name: 'JavaScript', icon: 'mdi-language-javascript' },
  { name: 'TypeScript', icon: 'mdi-language-typescript' },
  { name: 'GitHub Actions', icon: 'mdi-github' },
]

const relatedProjects = [
  {
    name: 'Cinco Ministérios',
    description: 'Teste de ministérios baseado em Efésios 4:11.',
    url: 'https://github.com/anomalyco/cinco-ministerios',
    icon: 'mdi-account-group',
  },
]
</script>
