# Deploy — Dons Espirituais

## Stack de deploy

| Componente | Serviço | Acesso |
|------------|---------|--------|
| Frontend | Vercel | [Dashboard Vercel](https://vercel.com) |
| Banco de dados | Supabase | [Dashboard Supabase](https://app.supabase.com) |
| Edge Functions | Supabase | Deploy via `supabase functions deploy` |
| Autenticação | Supabase Auth | Gerenciado no dashboard Supabase |
| Monitoramento | UptimeRobot | [Dashboard UptimeRobot](https://uptimerobot.com) |

## Frontend — Vercel

### Integração

O deploy é feito via **Vercel for GitHub** (integração nativa).

1. O repositório `marrcandre/dons-espirituais` foi importado no dashboard da Vercel
2. Vercel detecta automaticamente o framework Vite e configura build/output
3. O root directory do projeto Vercel é `packages/frontend/`

### Fluxo de deploy

| Evento | Ação | Ambiente |
|--------|------|----------|
| Push na `master` | Deploy automático | Produção |
| Pull Request aberto | Deploy automático | Preview |
| Push em PR | Deploy automático | Preview |

### Build settings (auto-detectados pela Vercel)

| Parâmetro | Valor |
|-----------|-------|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist/` |
| Install command | `npm ci` |
| Node version | 22.x (definido no `package.json` -> `engines.node`) |

### Variáveis de ambiente

Configuradas no dashboard Vercel → Project → Settings → Environment Variables:

| Variável | Descrição | Obrigatória | Ambientes |
|----------|-----------|:-----------:|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase (ex: `https://xxxxx.supabase.co`) | Sim | Produção, Preview |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase (pública, pode ser exposta no cliente) | Sim | Produção, Preview |
| `VITE_SENTRY_DSN` | DSN do projeto Sentry para error tracking | Não (opcional) | Produção |

> **Atenção:** `VITE_SUPABASE_ANON_KEY` é a chave anônima (pública), não a `service_role_key`. A `service_role_key` é usada apenas em Edge Functions e nunca deve ser exposta no frontend.
>
> **VITE_SENTRY_DSN:** Opcional. Se não definido, o Sentry não é inicializado. Configurar apenas se houver conta Sentry ativa.

### Domínio

- **Produção:** `https://dons-espirituais.vercel.app`
- **Preview:** URL gerada automaticamente pela Vercel para cada PR

Para configurar domínio personalizado: Dashboard Vercel → Project → Settings → Domains.

---

## Edge Functions — Supabase

### Deploy manual

```bash
cd supabase
supabase login
supabase link --project-ref <project-ref>

# Deploy de função específica
supabase functions deploy generate-ai
supabase functions deploy notify-admin
supabase functions deploy retry-ai-analysis
```

### Variáveis de ambiente

Definidas via `supabase secrets set`:

```bash
supabase secrets set SUPABASE_URL=<url>
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<key>
supabase secrets set GEMINI_API_KEY=<key>
supabase secrets set RESEND_API_KEY=<key>
supabase secrets set EMAIL_FROM=dons@seudominio.com.br
supabase secrets set ADMIN_EMAIL=marcoandre@gmail.com
supabase secrets set APP_URL=https://dons-espirituais.vercel.app
```

Ou configurar no dashboard: Supabase → Edge Functions → Secrets.

### Functions registradas

| Função | Arquivo | Config |
|--------|---------|--------|
| `generate-ai` | `supabase/functions/generate-ai/` | `config.toml` próprio |
| `notify-admin` | `supabase/functions/notify-admin/` | `config.toml` próprio |
| `retry-ai-analysis` | `supabase/functions/retry-ai-analysis/` | `supabase/config.toml` |

---

## CI (GitHub Actions)

O workflow CI roda automaticamente em push/PR na `master`:

```
lint → typecheck → test → build
```

Workflow: `.github/workflows/ci.yml`

A pipeline **não faz deploy**. O deploy é responsabilidade da integração nativa Vercel.

---

## Checklist de deploy

### Primeira configuração

- [ ] Importar repositório no dashboard Vercel
- [ ] Definir root directory como `packages/frontend`
- [ ] Configurar variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Verificar preview deployment em PR
- [ ] Configurar secrets das Edge Functions no Supabase
- [ ] Deploy das Edge Functions

### Deploy de nova versão

1. Fazer merge do PR na `master`
2. Vercel deploy automático inicia (monitorar em: Dashboard Vercel → Deployments)
3. Verificar healthcheck: `https://dons-espirituais.vercel.app/`
4. Verificar logs no dashboard Vercel se necessário
5. Se houver mudanças em Edge Functions: `supabase functions deploy <nome>`
