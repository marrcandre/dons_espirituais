# TODO — Dons Espirituais

## 🔴 Alta Complexidade

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
- [ ] Padronizar nomenclatura de diretórios de testes: `tests` vs `__tests__` (atualmente misturado)
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

### Conteúdo Institucional (Fase 3)
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
- [x] README.md atualizado — descreve app Vue/Supabase
- [ ] Manter CHANGELOG atualizado
- [ ] Documentar arquitetura geral
- [ ] Documentar banco de dados
- [ ] Documentar prompt da IA e estratégia de retry
- [ ] Registrar versões do prompt

## ✅ Concluídas

### Sprint 10 — Qualidade e Produto ✓
- [x] **10.1** Tooling Foundation — ESLint + vue-tsc + tsconfig + scripts de qualidade
- [x] **10.2** CI (Continuous Integration) — GitHub Actions (lint → typecheck → test → build)
- [x] **10.3** Test Coverage — vitest --coverage, relatório, meta documentada
- [x] **10.4.1** Store Tests — 4 stores cobertas (47 testes)
- [x] **10.4.2** Component Tests — 7 componentes cobertos (34 testes)
- [x] **10.4.3** Infrastructure Tests + Helpers — authRepository (10), aiRepository (10), array (6), date (10), validation (13)
- [x] **10.4.4** Presentation Coverage Review — UserInfoForm (5) + HistoryList (4)
- [x] **10.5.1** SEO & Discovery — robots.txt, sitemap.xml, OG, Twitter, OG image, favicon
- [x] **10.5.2** PWA & Performance — manifest.json, icons, theme-color, preconnect
- [x] **10.5.3** Release v2.0.0 — version bump, CHANGELOG, docs review

> **Nota:** Sprint 10 implementa apenas **CI** (continuous integration). **CD** (continuous deployment / deploy automático) fica para a Sprint 13.

### Sprint 9 — Consolidação da Presentation Layer ✓
- [x] **9.1** Auditoria — 7 views, 21 componentes, 4 stores analisados. Zero violações.
- [x] **9.2** Avaliação useInlineEditor — implementado e revertido. ADR-013.
- [x] **9.3** Consolidação — dead code removido, quiz session centralizada, Vue Test Utils instalado.
- [x] **9.3.1** 4 testes saveSession. Total: 114 testes.

### Sprint 8 — Correções, Testes e Consolidação ✓
- [x] **8.1** Refatorar `UserInfoForm.vue` para usar `getUserProfile()` da Application Layer
- [x] **8.2** Padronizar timeout em `responseRepository.insert()` e `countByUserId()` com `runSupabaseQuery`
- [x] **8.3** Criar `repositories/tests/responseRepository.test.js` (10 testes)
- [x] **8.3** Criar `repositories/tests/userRepository.test.js` (3 testes)
- [x] **8.4** Remover `services/aiAnalysis.js` (verificar se há consumidores)
- [x] **8.5** Eliminar duplicação entre `quizStore.checkSavedState()` e `quizSession.checkSavedSession()`
- [x] **8.6** Avaliar desacoplamento de `AiAnalysis.vue` e `HistoryList.vue` (decisão: manter estado atual)

### Sprint 7 — Application Layer ✓
- [x] Todos os itens concluídos (ver CHANGELOG.md)

### Sprints 0–6 — Fundação e Domínio ✓
- [x] Todas concluídas (ver CHANGELOG.md)
