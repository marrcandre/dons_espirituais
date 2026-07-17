import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: false }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vuetify')) {
            return 'vendor-vuetify'
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vuetify'],
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.js'],
    css: true,
    deps: {
      inline: ['vuetify'],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**'],
      exclude: [
        'src/main.js',
        'src/env.d.ts',
        'src/**/*.test.*',
        'src/**/tests/**',
        'src/**/__tests__/**',
      ],
      reportsDirectory: './coverage',
    },
  },
})
