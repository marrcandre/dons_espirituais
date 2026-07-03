# TODO — Dons Espirituais

## 🔴 Alta Complexidade

### Implementação Pendente
- [ ] Admin: esconder coluna "Idade" no mobile
- [ ] Substituir 21 `<v-btn>` raw por `AppButton` em 7 arquivos
- [ ] Criar `src/domain/spiritual-gifts.ts` (fonte única dos 27 dons)
- [ ] Eliminar duplicação dos dons entre frontend e backend
- [ ] Padronizar botões (Sprint 7)
- [ ] Padronizar alertas (Sprint 7)

### ResultsView
- [ ] Melhorar legibilidade da análise IA

### Responsividade
- [ ] Auditoria mobile completa (360/390/412/430 px)
- [ ] Auditoria tablet
- [ ] Auditoria desktop

---

## 🟡 Média Complexidade

### Design System
- [ ] GiftBadges: substituir gold/silver/bronze hardcoded por tokens
- [ ] Migrar ~12 estilos inline para classes/tokens CSS
- [ ] Eliminar duplicata `line-height: 1.9` (usar `--line-height-body`)
- [ ] Padronizar tabelas (Sprint 7)

### Navegação e UX
- [ ] Revisar menu principal (AppHeader)
- [ ] Revisar fluxo Login → Teste → Resultado
- [ ] Revisar estados de carregamento e mensagens de erro

### Consistência Visual
- [ ] Revisar espaçamentos entre seções
- [ ] Revisar uso de chips e badges
- [ ] Revisar densidade de informações por tela

### Arquitetura (Clean Code)
- [ ] Inverter dependência: mover `topGift()` de `helpers/string.js` para `services/scoring.js`
- [ ] Refatorar `UserInfoForm.vue` para usar store (remove chamada direta a repositories)
- [ ] Análise de viabilidade: substituir Supabase SDK por REST API
  - Mapear endpoints CRUD + auth + IA + notificações
  - Avaliar modelo híbrido (manter auth Supabase, DB via REST)
  - Avaliar substitutos para Realtime (polling vs WebSocket vs SSE)
  - Avaliar migração das Edge Functions para endpoints próprios
  - Avaliar impacto nas regras RLS
  - Comparar latência e bundle size (SDK ~70kB vs fetch nativo)
  - Decidir: manter, substituir total, ou híbrido
  - Documentar recomendação final

### Arquitetura IA (Sprint 1.3)
- [ ] Eliminar dependências da ResultsView na geração da análise
- [ ] Revisar estratégia de envio de e-mail
- [ ] Avaliar fila assíncrona para crescimento futuro
- [ ] Avaliar uso de Edge Functions desacopladas

### Dados e Banco (Sprint 3)
- [ ] Revisar estrutura de scoring
- [ ] Padronizar nomes dos dons
- [ ] Padronizar ordenação dos dons
- [ ] Revisar índices do Supabase
- [ ] Revisar crescimento da tabela responses

### Segurança (Sprint 4 remanescente)
- [ ] Revisar permissões das Edge Functions
- [ ] Revisar uso da Service Role
- [ ] Revisar exposição de dados
- [ ] Revisar variáveis de ambiente

---

## 🟢 Baixa Complexidade

### Refatoração de Componentes
- [ ] AiAnalysis: receber dados por props em vez de importar store
- [ ] HistoryList: receber dados por props em vez de importar store

### Conteúdo Institucional (Sprint 5)
- [ ] Página Sobre (história, metodologia, limitações)
- [ ] FAQ
- [ ] Página de Contato + Política de Privacidade

### DevOps
- [ ] Criar endpoint healthcheck
- [ ] Monitorar Edge Functions
- [ ] Monitorar Vercel
- [ ] Monitorar Supabase

### Acessibilidade (Sprint 7)
- [ ] Revisar contraste de cores
- [ ] Navegação por teclado
- [ ] Compatibilidade com leitores de tela

### Documentação
- [ ] Atualizar README.md (remove descrição Python, documenta app real)
- [ ] Manter CHANGELOG atualizado
- [ ] Documentar arquitetura geral
- [ ] Documentar banco de dados
- [ ] Documentar prompt da IA e estratégia de retry
- [ ] Registrar versões do prompt
