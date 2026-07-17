# Monitoramento — Dons Espirituais

## Status atual

| Ferramenta | Status | Função |
|------------|--------|--------|
| UptimeRobot | ✅ Ativo | Monitoramento de disponibilidade |
| Vercel Analytics | ✅ Implementado | Métricas de uso e performance |
| Vercel Speed Insights | ✅ Implementado | Core Web Vitals (LCP, CLS, INP) |
| Sentry | ✅ Implementado | Error tracking (condicional ao DSN) |

---

## UptimeRobot

### O que monitora

O UptimeRobot está configurado para executar periodicamente a Edge Function `retry-ai-analysis`, que reprocessa análises de IA que falharam na primeira tentativa.

### Configuração

Acessar: [Dashboard UptimeRobot](https://uptimerobot.com) → Monitor Settings.

### Funcionamento

1. UptimeRobot faz uma requisição HTTP ao endpoint da Edge Function em intervalo regular
2. A função verifica registros com `ai_analysis_complete = false`
3. Reprocessa as análises pendentes chamando a Gemini API
4. Retorna status indicando quantas foram reprocessadas

---

## Vercel Analytics + Speed Insights

### O que é

Ferramentas nativas da Vercel que fornecem:
- **Web Analytics** — page views, visitantes únicos, visitas por rota (via `@vercel/analytics`)
- **Speed Insights** — Core Web Vitals: LCP, CLS, INP (via `@vercel/speed-insights`)

### Implementação

1. `@vercel/analytics` e `@vercel/speed-insights` instalados como dependências
2. `<Analytics />` do `@vercel/analytics/vue` adicionado ao `App.vue` — tracking automático de page views via `vue-router`
3. `injectSpeedInsights()` chamado no setup de `App.vue` — medição de performance
4. Ativar no dashboard Vercel: Project → Analytics → Enable

### Bundle impact

~4 kB adicionados ao chunk principal (251 kB total, < 500 kB).

---

## Sentry

### O que é

Plataforma de error tracking que captura exceções no frontend com:
- Stack trace detalhado
- Informações do browser e sistema operacional
- Source maps para debug em produção

### Implementação

1. `@sentry/vue` instalado como dependência
2. `src/plugins/sentry.js` criado com `initSentry(app)` — inicialização condicional
3. Sentry só é ativado se `VITE_SENTRY_DSN` estiver definido no ambiente
4. Desabilitado em desenvolvimento (`enabled: import.meta.env.PROD`)
5. Sem tracing avançado (`tracesSampleRate: 0`) — escopo inicial

### Configuração

```bash
# .env (desenvolvimento local — opcional)
VITE_SENTRY_DSN=https://exemplo@sentry.io/0000000
```

Para produção, configurar no dashboard Vercel:
Project → Settings → Environment Variables → `VITE_SENTRY_DSN`

### Ativação no Vercel

1. Criar conta em [sentry.io](https://sentry.io)
2. Criar projeto Vue/Vite
3. Copiar o DSN do projeto Sentry
4. Adicionar `VITE_SENTRY_DSN` nas variáveis de ambiente do Vercel
5. Fazer deploy — Sentry será ativado automaticamente

---

## Recomendações finais

| Prioridade | Ação | Esforço | Status |
|:----------:|------|:-------:|:------:|
| 1 | Ativar Vercel Analytics | 5min (dashboard) | ✅ |
| 2 | Configurar Sentry | 1h (DSN + deploy) | ✅ Implementado (aguarda DSN) |
| 3 | Source maps no Sentry | 2h (vite-plugin) | 📋 Backlog |
| 4 | Healthcheck endpoint | 1h (Edge Function) | 📋 Backlog |
| 5 | Logs estruturados no frontend | 2h (serviço de logging) | 📋 Backlog |
