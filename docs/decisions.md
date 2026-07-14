# Decisões Técnicas — Dons Espirituais

> **Propósito:** Registrar decisões arquiteturais, técnicas e de design, com contexto e justificativa.
>
> **Início:** 2026-07-09 (pós-refatoração Sprints 0–5)

---

## ADR-001: Fonte única dos dons em `domain/spiritual-gifts.ts`

**Data:** 2026-07-06 (Sprint 2)

**Contexto:** As definições dos 27 dons espirituais estavam duplicadas em 4 locais: `data/gifts.js`, `services/scoring.js`, `generate-ai/index.ts` e `legacy/`.

**Decisão:** Criar `domain/spiritual-gifts.ts` como única fonte de verdade. `data/gifts.js` foi transformado em adapter (re-export) e posteriormente removido (Sprint 5).

**Consequências:**
- Positivas: SSOT estabelecido; manutenção centralizada; consumo via import direto
- Negativas: Edge Function `generate-ai` mantém `GIFTS_ORDER` duplicado (gerenciado por validação CI futura)

**Status:** ✅ Implementado (Sprints 2–5)

---

## ADR-002: Domínio em TypeScript, demais camadas em JavaScript

**Data:** 2026-07-06 (Sprint 2)

**Contexto:** Projeto iniciado em JavaScript. A refatoração do domínio foi a oportunidade de introduzir TypeScript onde traria mais benefício.

**Decisão:** Migrar `domain/` para TypeScript. Demais camadas (stores, repositories, views, components) permanecem em JavaScript. A migração será incremental.

**Consequências:**
- Positivas: Domínio tipado e seguro; sem bloqueio para outras camadas
- Negativas: Type check limitado ao domínio

**Status:** ✅ Implementado (Sprint 2); evolução incremental planejada (Sprints 7–10)

---

## ADR-003: Application Layer será criada na fase pós-refatoração

**Data:** 2026-07-09 (Sprint 6)

**Contexto:** Durante Sprints 0–5, o foco foi consolidar o domínio. A orquestração permaneceu no `QuizView.vue`. Com o domínio estável, o próximo passo é extrair casos de uso.

**Decisão:** Criar `src/application/` com casos de uso orquestradores: `submit-quiz`, `resume-session`, `calculate-result`. Views não importarão domain diretamente — passarão por application.

**Consequências:**
- Positivas: Fluxos testáveis sem Vue; views menores; responsabilidades claras
- Negativas: Curva de aprendizado inicial; risco de over-engineering se não contido

**Status:** ⏳ Planejado (Sprint 7)

---

## ADR-004: Composables complementam Pinia (não substituem)

**Data:** 2026-07-09 (Sprint 6)

**Contexto:** Projeto usa Pinia para estado global (auth, quiz, responses, ai). A referência Cinco Ministérios usa composables. Avaliou-se substituir ou coexistir.

**Decisão:** Manter Pinia stores existentes. Criar composables para novos casos de uso ou quando houver refatoração clara. Composables encapsulam application layer e expõem estado/actions para as views.

**Consequências:**
- Positivas: Coexistência pacífica; sem retrabalho de migração; novo código já nasce com padrão melhor
- Negativas: Dois padrões de estado na base (gerenciável)

**Status:** ✅ Decidido

---

## ADR-005: Infrastructure isolada com compatibilidade retroativa

**Data:** 2026-07-09 (Sprint 6)

**Contexto:** `repositories/` atualmente são chamados diretamente por stores. Não há testes. Tratamento de erros é inconsistente.

**Decisão:** Criar `infrastructure/supabase/` com adaptadores testáveis. Repositories antigos não são removidos imediatamente — novos consumidores usam a nova camada. Migração progressiva.

**Consequências:**
- Positivas: Testabilidade; padronização de erros; isolamento
- Negativas: Código duplicado temporariamente

**Status:** ⏳ Planejado (Sprint 8)

---

## ADR-006: Tokens CSS como variáveis, não apenas documentação

**Data:** 2026-07-09 (Sprint 6)

**Contexto:** `design_plan.md` documenta tokens (cores, tipografia, espaçamentos), mas não há arquivo de variáveis CSS. Componentes usam valores hardcoded ou tokens Vuetify.

**Decisão:** Criar `src/styles/tokens/` com variáveis CSS para cores, tipografia e espaçamentos. Tema Vuetify movido de `plugins/` para `styles/theme/`. Componentes do DS passam a usar variáveis CSS.

**Consequências:**
- Positivas: Consistência visual; tema claro/escuro via troca de variáveis; componentes desacoplados do Vuetify theme
- Negativas: Refatoração de componentes existentes para usar as variáveis

**Status:** ⏳ Planejado (Sprint 6 ou 9)

---

## ADR-007: CI (Continuous Integration) na Sprint 10, CD na Sprint 13

**Data:** 2026-07-09 (Sprint 6) — atualizado em 2026-07-14 (Sprint 10.1)

**Contexto:** Não há pipeline automatizada. Decidiu-se não criar CI antes de ter application layer testável. A Sprint 10 original previa CI/CD completo, mas a avaliação mostrou que CD (deploy automático) faz mais sentido junto com a publicação institucional (Sprint 13).

**Decisão:**
- Sprint 10.2: **CI** (GitHub Actions) — lint + typecheck + test + build, sem deploy
- Sprint 13: **CD** (Continuous Deployment) — deploy automático + monitoramento

**Motivo da separação:** CI e CD são responsabilidades distintas. A CI valida qualidade do código e pode ser implementada independentemente do ambiente de produção. O CD depende de configuração de Vercel/Supabase e deve ser implementado junto com a publicação final.

**Consequências:**
- Positivas: CI disponível já na Sprint 10, sem depender de configuração de deploy
- Positivas: CD alinhado com a release v2.0.0 (Sprint 13)
- Negativas: Sprints 6–9 sem automação de validação
- Negativas: Deploy manual entre Sprints 10.2 e 13

**Status:** ✅ Atualizado (Sprint 10.1)

---

## ADR-008: TypeScript incremental, sem meta de 100% nesta fase

**Data:** 2026-07-09 (Sprint 6)

**Contexto:** Apenas `domain/` está em TS. A referência Cinco Ministérios tem toda a base em TS.

**Decisão:** A application layer (Sprint 7) já nasce em TypeScript. Infrastructure (Sprint 8) e presentation (Sprint 9) migram gradualmente conforme refatoração. Sem bloqueio por falta de TS em arquivos não refatorados.

**Consequências:**
- Positivas: Migração sem atrito; benefícios de tipo onde mais importa
- Negativas: Base mista (TS + JS) por mais tempo

**Status:** ✅ Decidido

---

## ADR-009: Manter Vuetify como framework de UI

**Data:** 2026-07-09 (Sprint 6)

**Contexto:** Avaliou-se substituir Vuetify por alternativa mais leve (sem framework de componentes).

**Decisão:** Manter Vuetify. Substituição traria retrabalho enorme sem benefício proporcional. O DS já abstrai componentes Vuetify atrás de componentes próprios (AppButton, AppCard etc.), o que permite substituição futura se necessário.

**Consequências:**
- Positivas: Zero retrabalho; DS já isola a dependência
- Negativas: Bundle maior (Vuetify é pesado)

**Status:** ✅ Decidido

---

## ADR-010: Testes antes da refatoração (padrão Sprint 1)

**Data:** 2026-07-09

**Contexto:** A Sprint 1 estabeleceu o padrão de criar testes antes de refatorar. Este padrão foi bem-sucedido e deve ser replicado.

**Decisão:** Antes de refatorar qualquer camada, criar testes que capturem o comportamento atual. Garantir que os testes passam antes e depois da refatoração.

**Consequências:**
- Positivas: Rede de segurança; confiança para refatorar
- Negativas: Esforço adicional de testes antes da entrega

**Status:** ✅ Decidido

---

## ADR-011: Experiência institucional como fase independente

**Data:** 2026-07-09

**Contexto:** A análise comparativa com o projeto Cinco Ministérios revelou que o Dons não possui elementos institucionais básicos esperados em uma aplicação pública: página Sobre, footer, SEO, Open Graph, identidade visual consolidada.

**Decisão:** A experiência institucional (página Sobre, header/footer definitivos, SEO, Open Graph, sitemap, robots, identidade visual) será tratada como uma **Fase 3 independente** do roadmap, após a conclusão da evolução arquitetural (Fase 2).

**Justificativa:**
- A Fase 2 reorganizará a camada de apresentação (composables, componentes modulares), estabelecendo os padrões que a Fase 3 utilizará
- Os componentes institucionais (AppFooter, AppLogo) seguem os mesmos padrões do Design System que será consolidado na Fase 2
- Fazer antes da Fase 2 poderia gerar retrabalho quando a estrutura de componentes for reorganizada
- O escopo é bem isolado e não conflita com as mudanças arquiteturais
- Usuários finais se beneficiam diretamente (página Sobre, compartilhamento enriquecido)

**Consequências:**
- Positivas: Roadmap completo e coerente; cada fase entrega valor distinto; sem retrabalho
- Negativas: Usuários continuam sem página Sobre e footer até o final da Fase 3

**Status:** ✅ Decidido

---

## ADR-012: Padrão da Application Layer

**Data:** 2026-07-14 (Sprint 7)

**Contexto:** A Sprint 7 cria a primeira versão da Application Layer do Dons Espirituais. É necessário estabelecer um padrão consistente para todos os casos de uso futuros.

**Decisão:** Todo caso de uso da Application Layer deve seguir estas regras:

- ser uma **função** (função pura ou async function), não uma classe
- receber um objeto `Input` como parâmetro
- retornar um objeto `Result` como saída
- **não depender de Vue** (nenhum import de `vue`, `@vue/*` ou similares)
- **não depender de componentes** (nenhum import de `*.vue`)
- **não depender de Pinia** (nenhum import de `pinia` ou stores)
- **não depender de Presentation** (nenhum import de `views/`, `components/`, `constants/`)
- **pode importar repositories** para acessar infraestrutura (`repositories/`)
- **pode importar domain** para regras de negócio (`domain/`)
- **pode importar helpers** puros (`helpers/`)

**Consequências:**
- Positivas: Casos de uso testáveis sem Vue; responsabilidades claras; isolamento de framework
- Negativas: Restrição intencional de imports; curva de aprendizado inicial

**Status:** ✅ Estabelecido na Sprint 7

---

## ADR-013: Composables por necessidade, não por antecipação

**Data:** 2026-07-14 (Sprint 9 — planejamento)

**Contexto:** Durante o planejamento da Sprint 9, avaliou-se a criação de composables como padrão para a Presentation Layer. O plano inicial previa criar `useQuizSession` e `useResults` antecipadamente. A revisão do roadmap pós-Sprint 8 questionou se essa abstração traria benefício real no momento.

**Decisão:** Composables da Presentation Layer serão criados **por necessidade real identificada durante a refatoração**, não por antecipação. Os critérios para criação são:

- Haver lógica reutilizada entre dois ou mais componentes
- Haver estado/comportamento compartilhado que justifique isolamento
- Haver necessidade de teste isolado de lógica de apresentação

**Não** criar composables apenas para:
- Substituir stores Pinia existentes (ADR-004)
- "Completar" a arquitetura com camadas que o projeto ainda não necessita
- Seguir padrão de referência sem comprovação de benefício

**Consequências:**
- Positivas: Evita abstração prematura (YAGNI); mantém arquitetura simples; evita camada View → Composable → Store sem responsabilidade clara
- Negativas: Pode postergar a criação de padrão reutilizável; views podem permanecer maiores por mais tempo

**Caso avaliado — Sprint 9.2:** `useInlineEditor`

**Resultado:** ❌ Não aprovado — implementação experimental descartada.

**Motivo:** A similaridade entre `ResultsView.vue` e `AdminView.vue` era visual e parcial. ResultsView edita um resultado individual (`responseStore.current`). AdminView edita múltiplas linhas de uma tabela administrativa com controle independente. A abstração aumentou acoplamento sem representar um conceito real compartilhado.

**Critério reforçado:** Código semelhante não significa responsabilidade compartilhada. Uma abstração só deve existir quando há:
- conceito de domínio compartilhado
- comportamento compartilhado
- remoção de duplicação que efetivamente reduz complexidade

**Status:** ✅ Decidido na Sprint 9

---

## ADR-014: Sprint 10 reorganizada em 5 sub-sprints independentes

**Data:** 2026-07-14 (Sprint 10.1)

**Contexto:** A Sprint 10 original ("Qualidade e Produto") agregava escopos muito diversos — CI/CD, cobertura 90%+, SEO, PWA, documentação. A avaliação mostrou que:
- 90% de cobertura é irrealista em uma sprint (0 testes de Presentation atualmente)
- SEO e PWA sobrepõem-se com o escopo institucional da Fase 3
- Ferramentas de qualidade (lint, tsconfig, vue-tsc) são pré-requisito do CI, mas não estavam listadas

**Decisão:** Reorganizar a Sprint 10 em 5 sub-sprints independentes porém sequenciais:

| Sub-sprint | Escopo | Status |
|---|---|---|
| 10.1 | Tooling Foundation (ESLint, vue-tsc, tsconfig, scripts) | ✅ Concluída |
| 10.2 | CI (GitHub Actions — lint, typecheck, test, build) | 📋 Planejada |
| 10.3 | Test Coverage (vitest --coverage, baseline, meta) | 📋 Planejada |
| 10.4 | Presentation Tests (stores, components, composables) | 📋 Planejada |
| 10.5 | Product Quality (SEO, OG, sitemap, robots, PWA, v2.0.0) | 📋 Planejada |

**Mudanças em relação ao plano original:**
- CI/CD → CI (CD separado para Sprint 13)
- Cobertura 90% → "cobertura configurada com meta documentada" (progressivo)
- SEO/PWA movidos de Fase 3 (Sprint 13) para Sprint 10.5
- Tooling Foundation adicionada como pré-requisito (não existia no plano original)
- Design System cleanup (24 `<v-btn>`, 6 `<v-alert>`) adiado para Fase 3

**Consequências:**
- Positivas: Cada sub-sprint produz valor autônomo
- Positivas: Roadmap mais realista e factível
- Positivas: Tooling Foundation já concluída (0 lint errors, 0 typecheck errors)
- Negativas: Fase 3 perde SEO/PWA, mas ganha foco em identidade institucional
- Negativas: CD adiado para Sprint 13 (deploy manual entre Sprints 10.2 e 13)

**Status:** ✅ Implementado
