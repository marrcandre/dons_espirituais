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

## ADR-007: CI/CD apenas após application layer estável

**Data:** 2026-07-09 (Sprint 6)

**Contexto:** Não há pipeline automatizada. Decidiu-se não criar CI/CD antes de ter application layer testável.

**Decisão:** CI/CD (GitHub Actions) será implementado na Sprint 10, após application layer, infrastructure tests e composables estarem estabelecidos.

**Consequências:**
- Positivas: Pipeline já nasce com testes de todas as camadas
- Negativas: Sprints 6–9 sem automação de validação

**Status:** ✅ Decidido

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
