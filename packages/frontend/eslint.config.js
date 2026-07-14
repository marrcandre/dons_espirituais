import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

const tsRecommended = tseslint.configs.recommended

export default [
  { ignores: ['dist/', 'node_modules/', 'fix-vue-*.js'] },

  js.configs.recommended,

  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },

  {
    languageOptions: {
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        navigator: 'readonly',
        AbortController: 'readonly',
        process: 'readonly',
      },
    },
  },

  {
    ...tsRecommended[0],
    files: ['**/*.ts'],
  },
  {
    ...tsRecommended[1],
    files: ['**/*.ts'],
  },
  {
    ...tsRecommended[2],
    files: ['**/*.ts', '**/*.vue'],
  },

  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
  },

  {
    files: ['**/AdminView.vue'],
    rules: {
      'vue/valid-v-slot': 'off',
    },
  },

  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
]
