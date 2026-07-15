<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer__brand">
        <AppLogo
          variant="full"
          :size="28"
          color="#1B5438"
        />
        <p class="app-footer__description">
          {{ APP_DESCRIPTION }}
        </p>
      </div>

      <nav class="app-footer__nav">
        <router-link
          to="/"
          class="app-footer__link"
        >
          Início
        </router-link>
        <router-link
          to="/sobre"
          class="app-footer__link"
        >
          Sobre
        </router-link>
      </nav>

      <div class="app-footer__extras">
        <a
          :href="APP_REPOSITORY_URL"
          class="app-footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          :href="'mailto:' + APP_CONTACT_EMAIL"
          class="app-footer__link"
        >
          Contato
        </a>
      </div>

      <div class="app-footer__support">
        <router-link
          to="/sobre"
          class="app-footer__support-link"
        >
          Apoie este projeto
        </router-link>
      </div>

      <div class="app-footer__copy">
        <span>{{ APP_COPYRIGHT_OWNER }}</span>
        <span class="app-footer__version">v{{ APP_VERSION }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import AppLogo from './AppLogo.vue'
import {
  APP_DESCRIPTION,
  APP_VERSION,
  APP_COPYRIGHT_OWNER,
  APP_CONTACT_EMAIL,
  APP_REPOSITORY_URL,
} from '../../config/app'
</script>

<style scoped>
.app-footer {
  margin-top: auto;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.app-footer__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg, 24px);
  max-width: var(--page-max-width, 900px);
  margin: 0 auto;
  padding: var(--space-xl, 32px) var(--space-md, 16px) var(--space-lg, 24px);
}

.app-footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm, 8px);
}

.app-footer__description {
  margin: 0;
  font-size: var(--font-size-caption, 12px);
  line-height: var(--line-height-body, 1.6);
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.app-footer__nav,
.app-footer__extras {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md, 16px);
}

.app-footer__link {
  font-size: var(--font-size-helper, 14px);
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  text-decoration: none;
  transition: color 0.2s ease;
}

.app-footer__link:hover {
  color: rgb(var(--v-theme-primary));
}

.app-footer__support {
  display: flex;
  align-items: center;
}

.app-footer__support-link {
  font-size: var(--font-size-helper, 14px);
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition: color 0.2s ease;
}

.app-footer__support-link:hover {
  text-decoration: underline;
}

.app-footer__copy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-caption, 12px);
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
  padding-top: var(--space-md, 16px);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}
</style>
