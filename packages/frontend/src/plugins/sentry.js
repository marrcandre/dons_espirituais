import * as Sentry from '@sentry/vue'

export function initSentry(app) {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) return

  Sentry.init({
    app,
    dsn,
    environment: import.meta.env.MODE,
    integrations: [],
    tracesSampleRate: 0,
    enabled: import.meta.env.PROD,
  })
}
