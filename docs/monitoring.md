# Monitoramento — Dons Espirituais

## Status atual

| Ferramenta | Status | Função |
|------------|--------|--------|
| UptimeRobot | ✅ Ativo | Monitoramento de disponibilidade |
| Vercel Analytics | △ Não implementado | Métricas de uso e performance |
| Sentry | △ Não implementado | Error tracking |

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

## Vercel Analytics (recomendação)

### O que é

Ferramenta nativa da Vercel que fornece:
- **Métricas de uso** — page views, visitantes únicos, visitas por rota
- **Métricas de performance** — TTFB, First Contentful Paint (FCP), Largest Contentful Paint (LCP)
- **Dados em tempo real** — sessões ativas

### Prós

- Integração zero-config com Vercel
- Não precisa de cookie consent (dados anônimos e agregados)
- Impacto mínimo no bundle (~1KB)
- Gratuito no plano Hobby

### Contras

- Dados apenas de sessões, não de erros individuais
- Requer ativação no dashboard Vercel (Project → Analytics → Enable)

### Passos para implementar

1. Dashboard Vercel → Project → Analytics → Enable
2. Nenhuma alteração de código necessária (Vercel injeta o script automaticamente)

### Recomendação

Implementação simples e sem riscos. Ativar diretamente no dashboard Vercel.

---

## Sentry (recomendação)

### O que é

Plataforma de error tracking que captura exceções no frontend com:
- Stack trace detalhado
- Informações do browser e sistema operacional
- Breadcrumbs do usuário (ações que levaram ao erro)
- Source maps para debug em produção

### Prós

- Monitoramento proativo de erros no frontend
- Integração nativa com Vue 3 e Vite
- Plano gratuito generoso (5k eventos/mês)

### Contras

- Aumento de ~30-40KB no bundle (pode ser reduzido com tree-shaking)
- Requer configuração de source maps no build
- Requer conta Sentry

### Passos para implementar

1. Criar conta em [sentry.io](https://sentry.io)
2. Criar projeto Vue/Vite
3. Adicionar dependência: `@sentry/vue` e `@sentry/vite-plugin`
4. Configurar no `main.js`:

```js
import * as Sentry from '@sentry/vue'
Sentry.init({
  app,
  dsn: '<DSN_DO_PROJETO>',
  environment: import.meta.env.MODE,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2,
})
```

5. Adicionar plugin Sentry no `vite.config.js` para upload de source maps
6. Configurar `VITE_SENTRY_DSN` nas variáveis de ambiente do Vercel

### Recomendação

Aguardar demanda. Para o volume atual de usuários, o monitoramento do UptimeRobot + logs manuais no Supabase são suficientes. Sentry agrega valor quando houver tráfego significativo ou relatos de erros não reproduzíveis.

---

## Recomendações finais

| Prioridade | Ação | Esforço | Impacto |
|:----------:|------|:-------:|:-------:|
| 1 | Ativar Vercel Analytics | 5min (dashboard) | Alto |
| 2 | Configurar Sentry | 2h (código + dashboard) | Alto (quando houver tráfego) |
| 3 | Healthcheck endpoint | 1h (Edge Function) | Médio |
| 4 | Logs estruturados no frontend | 2h (serviço de logging) | Médio |
