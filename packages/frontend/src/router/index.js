import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('../views/QuizView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/meus-resultados',
    name: 'my-results',
    component: () => import('../views/MyResultsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/results/:id',
    name: 'results',
    component: () => import('../views/ResultsView.vue'),
    meta: { public: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('../views/AuthCallback.vue'),
    meta: { public: true },
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

export default router