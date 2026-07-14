import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: false }), // já importamos manualmente em plugins/vuetify.js
  ],
  optimizeDeps: {
    include: ['vuetify'],
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.js'],
  },
})
