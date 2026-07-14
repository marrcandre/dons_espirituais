import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const DEFAULT_TITLE = 'Descubra Seus Dons Espirituais'
const BASE_URL = 'https://dons-espirituais.vercel.app'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      public: true,
      title: 'Entrar — Descubra Seus Dons Espirituais',
      description: 'Faça login para acessar seu teste de dons espirituais e ver seus resultados.',
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Descubra Seus Dons Espirituais',
      description: 'Identifique seus talentos dados por Deus com nosso teste bíblico de dons espirituais.',
    },
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('../views/QuizView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Teste de Dons Espirituais — Descubra Seus Dons',
      description: 'Responda às perguntas do teste de dons espirituais e descubra seus talentos ministeriais.',
    },
  },
  {
    path: '/meus-resultados',
    name: 'my-results',
    component: () => import('../views/MyResultsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Meus Resultados — Dons Espirituais',
      description: 'Veja o histórico dos seus resultados do teste de dons espirituais.',
    },
  },
  {
    path: '/results/:id',
    name: 'results',
    component: () => import('../views/ResultsView.vue'),
    meta: {
      public: true,
      title: 'Resultado — Dons Espirituais',
      description: 'Veja o resultado completo do teste de dons espirituais com análise e gráficos.',
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: {
      requiresAdmin: true,
      title: 'Administração — Dons Espirituais',
      description: 'Painel administrativo do sistema de dons espirituais.',
    },
  },
  {
    path: '/sobre',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      public: true,
      title: 'Sobre — Dons Espirituais',
      description: 'Conheça o projeto Dons Espirituais: metodologia, tecnologia e propósito.',
    },
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('../views/AuthCallback.vue'),
    meta: {
      public: true,
      title: 'Autenticando — Dons Espirituais',
      description: 'Processando autenticação...',
    },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // ✅ 1. SEMPRE aguarda inicialização (sem exceções)
  if (!authStore.initialized) {
    try {
      await authStore.init()
      if (to.meta.requiresAuth && !authStore.user) {
        return { name: 'login' }
      }
    } catch (err) {
      console.error('Erro ao inicializar autenticação:', err)
    }
  }

  const isAuthRoute = to.meta.requiresAuth || to.meta.requiresAdmin

  // ❌ login com usuário logado → home
  if (to.name === 'login' && authStore.user) {
    return { name: 'home' }
  }

  // 🔒 precisa login
  if (isAuthRoute && !authStore.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 🔐 admin
  if (to.meta.requiresAdmin) {
    if (!authStore.canAccessAdminPanel) return { name: 'home' }
  }
})

router.afterEach((to) => {
  const title = to.meta?.title || DEFAULT_TITLE
  const description = to.meta?.description || ''

  document.title = title

  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc && description) {
    metaDesc.setAttribute('content', description)
  }

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', title)

  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc && description) ogDesc.setAttribute('content', description)

  const ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) ogUrl.setAttribute('content', `${BASE_URL}${to.path}`)

  const twitterTitle = document.querySelector('meta[name="twitter:title"]')
  if (twitterTitle) twitterTitle.setAttribute('content', title)

  const twitterDesc = document.querySelector('meta[name="twitter:description"]')
  if (twitterDesc && description) twitterDesc.setAttribute('content', description)
})

export default router