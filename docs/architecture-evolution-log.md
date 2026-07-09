# Log de Execução — Evolução Arquitetural

---

## Sprint 6 — Fundação Arquitetural

> **Início:** 2026-07-09
>
> **Término:** (em andamento)
>
> **Status:** Planejamento

### Contexto

As Sprints 0–5 de refatoração do domínio foram concluídas com sucesso:

- Fonte única dos 27 dons em `domain/spiritual-gifts.ts`
- Regras de domínio em `domain/scoring.ts`
- `data/gifts.js` removido
- Código comentado removido
- 78 testes, build intacto
- README atualizado, TODO limpo

O projeto atingiu um estado onde **o domínio está consolidado, mas a orquestração ainda é monolítica** (`QuizView.vue` centraliza scoring, payload, persistência, notificação e IA).

### Gatilho para nova fase

Análise do projeto de referência **Cinco Ministérios** (`docs/reference/cinco_ministerios/`), que possui:

- Application Layer explícita (casos de uso)
- Composables como ponte UI-camadas
- Infrastructure isolada e testada
- 134 testes (vs 78 do Dons)
- Documentação por camada (domain, application, infrastructure, presentation)
- Decisions.md registrando decisões arquiteturais

### Documentos analisados

**Projeto Dons (estado atual):**
- `docs/gift-system-plan.md`
- `docs/gift-system-plan-analysis.md`
- `docs/gift-system-plan-log.md`
- `docs/design_plan.md`
- `CHANGELOG.md`
- `README.md`
- `TODO.md`
- `packages/frontend/src/domain/` (spiritual-gifts.ts, scoring.ts)
- `packages/frontend/src/services/` (aiAnalysis.js, supabase.js, supabaseQuery.js)
- `packages/frontend/src/repositories/` (response, ai, auth, user)
- `packages/frontend/src/stores/` (quiz, responses, ai, auth)
- `packages/frontend/src/views/` (QuizView, ResultsView, HomeView, etc.)
- `packages/frontend/src/components/` (ui/, domain components)

**Referência Cinco Ministérios:**
- `architecture.md`
- `analise_arquitetura.md`
- `decisions.md`
- `philosophy.md`
- `domain.md`
- `application.md`
- `infrastructure.md`
- `presentation.md`
- `design-system.md`
- `roadmap.md`
- `changelog.md`
- `sprint-6-publicacao.md`
- `_proximo_sprint.md`

### Decisões iniciais

| ID | Decisão | Justificativa |
|----|---------|---------------|
| D01 | Application Layer é prioridade máxima | Maior débito técnico; sem ela, fluxos não são testáveis |
| D02 | Composables complementam Pinia | Migração gradual sem quebrar stores existentes |
| D03 | Infrastructure isolada com compatibilidade | Repositories antigos coexistem com novos adaptadores |
| D04 | Testes antes da refatoração | Mesmo padrão da Sprint 1 — rede de segurança |
| D05 | TypeScript incremental | Application em TS; demais camadas conforme refatoração |
| D06 | CI/CD apenas na Sprint 10 | Pipeline sem application layer teria valor limitado |
| D07 | Decisions.md imediatamente | Registrar decisões desde o início da fase |
| D08 | Tokens CSS imediatamente | Baixo esforço, alto benefício para consistência |

### Arquitetura Alvo Proposta

```
domain/       → Regras puras (já consolidado)
application/  → Casos de uso (NOVO)
infrastructure/ → Adaptadores (NOVO)
presentation/ → Composables + componentes organizados (NOVO)
constants/    → Constantes de apresentação (já existe)
helpers/      → Utilitários puros (já existe)
```

### Próximos passos

1. **Sprint 6 (atual):** Finalizar documentação, criar `docs/decisions.md`, preparar estrutura de diretórios
2. **Sprint 7:** Criar `application/quiz/submit-quiz.ts` + testes
3. **Sprint 8:** Criar `infrastructure/supabase/` + testes
4. **Sprint 9:** Composables + organização de componentes
5. **Sprint 10:** CI/CD, cobertura, SEO, documentação final

### Métricas atuais (baseline para comparação)

| Métrica | Valor |
|---------|-------|
| Testes | 78 |
| Arquivos de teste | 4 |
| Cobertura (statements) | Não medida |
| Cobertura (domain) | ~95% (estimado) |
| Cobertura (application) | 0% |
| Cobertura (infrastructure) | 0% |
| Cobertura (presentation) | 0% |
| CI/CD | Nenhum |
| TypeScript | Apenas domain/ |
| Views com orquestração | QuizView.vue (submit centralizado) |
| Componentes | 11 (planos, sem módulos) |
| Design System | ui/ com 10 componentes |
| Tokens CSS | Documentados em design_plan.md, sem arquivo de variáveis |
