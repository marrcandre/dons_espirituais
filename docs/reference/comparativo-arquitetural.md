# Relatório Comparativo — Dons Espirituais vs Cinco Ministérios

> **Data:** 2026-07-09
>
> **Referência:** `docs/reference/cinco_ministerios/` (13 documentos, sprints 0–6.3, v5.2.0, 134 testes)

---

## 1. Princípios Arquiteturais Extraídos da Referência

| Princípio | Descrição |
|-----------|-----------|
| Domínio puro | Lógica de negócio sem dependência de Vue, Vuetify ou qualquer framework |
| Camadas explícitas | Domain → Application → Infrastructure → Presentation (fluxo único) |
| Composables como ponte | UI não chama domain/infra diretamente; passa por composables |
| Módulos independentes | Cada funcionalidade pode ser movida/removida sem afetar as demais |
| Design System por tokens | Nenhum componente usa cores fixas; tudo via variáveis CSS |
| Offline first | Funciona sem rede; dados no navegador |
| Testes como documentação | Gabarito oficial validado em teste (não apenas em comentário) |
| Filosofia explicitada | philosophy.md + decisions.md — por que cada escolha foi feita |
| Auditoria arquitetural | Análise formal de cada camada (analise_arquitetura.md com notas 0-10) |
| Sprints atômicos | Cada sprint entrega uma camada completa e testada |

---

## 2. Comparativo de Camadas

### 2.1 Domínio

| Aspecto | Dons (atual) | Cinco Ministérios (referência) |
|---------|-------------|-------------------------------|
| Localização | `domain/spiritual-gifts.ts` + `domain/scoring.ts` | `domain/types.ts` + `ministries.ts` + `questions.ts` + `scoring.ts` |
| Tipo da fonte única | Array de 27 objetos com `id`, `name`, `icon`, `color` | Array de 5 objetos com `id` (string), `name`, `description` |
| Pureza | ✅ Sem dependência de framework | ✅ Sem dependência de framework |
| Tipos | Interface `Gift` + constantes derivadas | `Ministry`, `Question`, `Option`, `Answer`, `MinistryScore` |
| Constantes derivadas | `GIFT_COUNT`, `giftNames`, `giftById()` | Apenas acesso direto a arrays |
| Testes | 6 (gifts) + 12 (scoring) + 57 (questions) = 75 | 49 (questions + scoring + ministries) |

### 2.2 Application Layer

| Aspecto | Dons | Cinco Ministérios |
|---------|------|-------------------|
| Existe? | ❌ Não — `QuizView.vue` orquestra tudo | ✅ `test-session.ts` + `calculate-result.ts` |
| Casos de uso | Misturados em views/stores | Casos de uso explícitos com validação |
| Separação | QuizView + stores centralizam scoring, payload, persistência | Application orquestra, domain valida, infra persiste |
| Testes | N/A (não existe camada) | 20 testes (criação, respostas, conclusão, cálculo) |

### 2.3 Infrastructure / Persistência

| Aspecto | Dons | Cinco Ministérios |
|---------|------|-------------------|
| Mecanismo | Supabase (online) | localStorage (offline) |
| Camada | `repositories/` (response, ai, auth) + `stores/` (Pinia) | `infrastructure/storage/local-storage.ts` |
| Tratamento de erros | Parcial (timeouts inconsistentes) | Robusto (falhas silenciosas em todas as operações) |
| Isolamento | Stores misturam estado + persistência + lógica | Infrastructure é apenas persistência pura |

### 2.4 Presentation / UI

| Aspecto | Dons | Cinco Ministérios |
|---------|------|-------------------|
| Integração | Pinia stores (useQuizStore, etc.) | Composables (`useTestSession`) |
| Design System | AppPage, AppCard, AppButton, CollapsibleCard, etc. | AppContainer, AppHeader, AppFooter, AppLogo, etc. |
| Tokens CSS | Sim (design_plan.md) | Sim + dark theme via classe `.dark` |
| Tema Vuetify | Em `plugins/` | Em `styles/theme/` (junto dos tokens) |

### 2.5 Testes

| Métrica | Dons | Cinco Ministérios |
|---------|------|-------------------|
| Total | 78 | 134 |
| Cobertura | Não medida | 100% statements |
| Distribuição | 4 arquivos de teste | Múltiplos arquivos em `tests/` |
| Localização | `__tests__/` co-localizado | `tests/` centralizado + co-localizado |
| Testes de domínio | 75 | 49 |
| Testes de application | 0 | 20 |
| Testes de infraestrutura | 0 | 13 |
| Testes de composable | 0 | ~18 |
| Testes de integração | 0 | ~34 |

### 2.6 Documentação

| Documento | Dons | Cinco Ministérios |
|-----------|------|-------------------|
| Philosophy | ❌ | ✅ `philosophy.md` |
| Decisions | ❌ | ✅ `decisions.md` |
| Architecture | ✅ `gift-system-plan*.md` | ✅ `architecture.md` |
| Domain | Descrito nos planos | ✅ `domain.md` |
| Application | ❌ | ✅ `application.md` |
| Infrastructure | ❌ | ✅ `infrastructure.md` |
| Presentation | ❌ | ✅ `presentation.md` |
| Design System | ✅ `design_plan.md` | ✅ `design-system.md` |
| Audit | ✅ `gift-system-plan-analysis.md` | ✅ `analise_arquitetura.md` |
| Roadmap | ✅ `gift-system-plan.md` | ✅ `roadmap.md` |

---

## 3. Oportunidades de Evolução

### 3.1 Alta Prioridade

1. **Criar Application Layer** — Extrair casos de uso do `QuizView.vue` (`submitQuiz()`) para uma camada de aplicação dedicada. Isso isola a view de regras de orquestração (scoring + payload + persistência + notificação) e permite testar o fluxo completo sem componente Vue.

2. **Extrair QuizStore para composable + application** — A `stores/quiz.js` (Pinia) mistura estado, validação e persistência. Um composable `useQuizSession` nos mesmos moldes de `useTestSession` separaria responsabilidades.

3. **Application tests** — 0 testes de application atualmente. A camada de orquestração não tem rede de segurança.

4. **Infrastructure tests** — 0 testes de persistência. `repositories/` e `responses.js` store não têm testes.

### 3.2 Média Prioridade

5. **Centralizar tokens CSS** — O Dons já tem `design_plan.md` com tokens, mas não há arquivo de tokens CSS puros (variáveis CSS). Tokens em CSS permitem que Vuetify, componentes e estilos globais compartilhem os mesmos valores.

6. **Mover tema Vuetify para `styles/theme/`** — Seguir o padrão da referência: tema Vuetify junto dos tokens de design, não em `app/plugins/`.

7. **Documentação de camadas** — Criar `docs/application.md`, `docs/infrastructure.md`, `docs/presentation.md` seguindo o modelo da referência.

8. **Decisions document** — Criar `docs/decisions.md` registrando por que Supabase, Pinia, repositórios, etc.

### 3.3 Baixa Prioridade

9. **Modularizar componentes** — Componentes de teste em `components/test/` (QuestionStep, QuizProgress), resultados em `components/results/`, etc.

10. **@/ alias** — Configurar `@` como alias para `src/` (já é padrão Vite, verificar se está configurado).

11. **Tratamento de erros robusto na infraestrutura** — `repositories/` com operações seguras (sem exceções não tratadas), padronização de timeouts.

12. **100% coverage target** — Estabelecer meta de cobertura para statements.

---

## 4. Riscos de Migração

| Risco | Probabilidade | Impacto | Mitigação |
|-------|:------------:|:-------:|-----------|
| Quebrar fluxo de quiz ao extrair application layer | Média | Alto | Fazer extração em paralelo com o código existente (estilo Strangler Fig), validar com testes a cada passo |
| Regressão em persistência Supabase | Baixa | Alto | Manter repositories existentes durante a extração; testes de integração com Supabase local |
| Perda de funcionalidade ao refatorar stores | Média | Alto | Stores Pinia existentes continuam funcionando durante a migração; nova camada é adicionada, não substitui |
| Aumento de complexidade sem benefício real | Baixa | Médio | Seguir princípio da referência: application layer só vale se houver casos de uso reais (submitQuiz já é um caso claro) |
| Sobrecarga de documentação | Baixa | Baixo | Documentação incremental, apenas o que agrega valor |

---

## 5. Notas por Camada (Dons vs Referência)

### Domínio — Dons 8/10, Referência 10/10

O domínio do Dons está correto e puro. Perde pontos porque:
- A validação de `i % 27` (acoplamento posicional) não tem verificação runtime ou compile-time
- O domínio não expõe `isValidQuestionId()` ou similar
- `color: '#1B5438'` repetido 27x (poderia ser default)

### Application — Dons 0/10, Referência 7/10

O Dons **não tem** camada de application. O QuizView.vue faz o papel, violando SRP.

### Infrastructure — Dons 5/10, Referência 9/10

- Dons tem camada de dados (repositories) mas sem testes
- Tratamento de erros inconsistente (timeouts)
- Stores misturam estado + persistência + lógica

### Presentation — Dons 7/10, Referência 8/10

- Dons usa Pinia stores onde a referência usa composables (ambos válidos)
- Design System do Dons é mais rico (mais componentes)
- Mas falta modularização (componentes de teste, resultado, etc.)

### Testes — Dons 6/10, Referência 9/10

- Dons: 78 testes, sem application/infrastructure/composable tests
- Referência: 134 testes, 100% coverage, testa todas as camadas

### Documentação — Dons 6/10, Referência 9/10

- Dons tem boa documentação de planejamento mas faltam docs por camada
- Referência tem philosophy, decisions, e docs para cada camada

---

## 6. Recomendações de Próximos Passos

### Imediatos (próximo sprint)

1. **Criar `src/application/`** com:
   - `test-session.ts` — gerenciamento de sessão do teste
   - `calculate-result.ts` — orquestração do cálculo
   - Testes para ambos

2. **Extrair `submitQuiz()` do QuizView.vue** para um caso de uso em `application/submit-quiz.ts`

3. **Criar `docs/application.md`** documentando a camada

### Curto prazo (2–3 sprints)

4. **Criar `docs/decisions.md`** registrando decisões arquiteturais

5. **Adicionar testes de infrastructure** para repositories

6. **Centralizar tokens CSS** em arquivo de variáveis CSS

### Médio prazo

7. Migrar stores Pinia para composables + application layer (se houver benefício claro)

8. Auditoria arquitetural formal (nos moldes de `analise_arquitetura.md`)

9. Meta de cobertura: 100% statements no domínio + application

---

## 7. Resumo

O projeto **Cinco Ministérios** atinge 8.5/10 na auditoria arquitetural. Sua principal força é a separação clara em 4 camadas com domínio puro, application layer explícita, infrastructure isolada e presentation desacoplada via composables.

O projeto **Dons Espirituais** está em um estágio arquitetural intermediário: o domínio está consolidado (Sprints 0–5 concluídas), mas a application layer não existe, a infrastructure não tem testes, e a presentation centraliza orquestração no QuizView.

**A maior oportunidade é a criação da camada de Application**, que é o próximo passo natural após a conclusão da refatoração do domínio. A referência mostra que é possível fazer isso sem aumentar a complexidade geral — pelo contrário, simplifica as views e permite testar casos de uso independentemente do Vue.

> **Arquitetura geral:** Dons ~6.5/10 → potencial 8.5/10 com application layer + testes de camada.
