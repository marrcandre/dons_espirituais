import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './styles/index.css'
import vuetify from './plugins/vuetify.js'
import { useAuthStore } from './stores/auth.js'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()

// 🔥 inicializa auth antes do app montar (SEGURADO)
auth.init()
  .catch((err) => {
    console.error('Erro ao inicializar auth:', err)
  })
  .finally(() => {
    app.use(router)
    app.use(vuetify)
    app.mount('#app')
  })