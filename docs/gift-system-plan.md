# Refatoração do Domínio dos Dons Espirituais

> **Status:** Sprint 5 concluída
>
> **Objetivo:** Consolidar os metadados dos dons espirituais em uma única fonte de verdade (Single Source of Truth), reduzindo a duplicação de código, aumentando a segurança das alterações e melhorando a arquitetura do projeto.

---

# Objetivos

Esta refatoração tem como objetivos:

- Eliminar a duplicação das definições dos dons espirituais.
- Tornar a manutenção mais simples e segura.
- Melhorar a organização do domínio da aplicação.
- Aumentar a cobertura de testes das regras de negócio.
- Migrar os módulos centrais do domínio para TypeScript.
- Adotar princípios de Clean Architecture e Clean Code durante toda a implementação.

---

# Problema Atual

Atualmente as definições dos dons encontram-se distribuídas em diversos pontos da aplicação.

Isso provoca problemas como:

- duplicação de informações;
- risco de inconsistências;
- necessidade de alterar diversos arquivos para uma única mudança;
- dificuldade para manutenção;
- maior risco de bugs.

O projeto deve evoluir para possuir apenas uma única fonte de verdade para todos os metadados relacionados aos dons espirituais.

---

# Escopo

Esta refatoração contempla apenas a arquitetura do domínio.

Ficam fora deste escopo:

- alterações de layout;
- alterações de UX;
- novas funcionalidades;
- mudanças nas regras de negócio;
- mudanças no banco de dados.

---

# Fora do Escopo

Esta refatoração não contempla:

- código localizado na pasta `legacy/`;
- scripts de importação utilizados apenas durante a migração inicial dos dados;
- protótipos ou ferramentas descartadas;
- experimentos antigos.

Esses arquivos deverão ser tratados apenas como referência histórica e não deverão influenciar as decisões arquiteturais da nova implementação.


---

# Restrições

Durante esta refatoração **não deverá haver**:

- alterações no schema do banco;
- novas tabelas;
- alterações em migrations;
- alterações em RLS;
- alterações em políticas de segurança;
- alterações na estrutura dos dados existentes;
- mudanças nos IDs dos dons;
- mudanças na lógica de cálculo das pontuações;
- mudanças na experiência do usuário;
- alterações na estrutura funcional do questionário.
-
O objetivo é exclusivamente arquitetural.

---

# Princípios Arquiteturais

Toda implementação deverá seguir os princípios abaixo.

## Single Source of Truth (SSOT)

Toda informação sobre um dom espiritual deverá existir em apenas um local.

Não serão permitidas listas duplicadas.

---

## Clean Architecture

Separar claramente:

- Domínio
- Aplicação
- Infraestrutura
- Interface (UI)

O domínio não deve depender de Vue, Supabase ou componentes visuais.

---

## Clean Code

Todo código novo deverá priorizar:

- nomes claros;
- funções pequenas;
- responsabilidade única;
- baixo acoplamento;
- alta coesão;
- eliminação de código morto;
- eliminação de duplicações;
- legibilidade.

---

## SOLID

Aplicar os princípios SOLID sempre que fizer sentido, evitando abstrações desnecessárias.

---

## DRY

Não repetir:

- listas;
- constantes;
- enums;
- labels;
- categorias;
- IDs;
- descrições.

---

## KISS

Preferir sempre a solução mais simples possível.

---

## YAGNI

Não implementar funcionalidades pensando em necessidades futuras não existentes.

---

## Type Safety

Sempre que possível:

- utilizar TypeScript;
- evitar `any`;
- derivar tipos automaticamente;
- centralizar os tipos do domínio.

---

## Testabilidade

Toda regra de negócio criada ou refatorada deverá poder ser testada independentemente de:

- Vue;
- Supabase;
- Browser;
- Componentes visuais.

Sempre que possível, o domínio deverá permanecer desacoplado da infraestrutura.

---

## Compatibilidade

Durante toda a refatoração deverá ser preservada a compatibilidade funcional do sistema.

A refatoração não deverá alterar resultados, pontuações, análises ou comportamento esperado da aplicação.

---

# Plano de Execução

## Sprint 0 — Auditoria

Objetivo:

Compreender completamente o estado atual do projeto.

Atividades:

- localizar todas as definições dos dons;
- localizar enums;
- localizar arrays;
- localizar constantes;
- localizar tipos;
- localizar componentes que utilizam os dons;
- localizar serviços;
- localizar cálculos;
- localizar gráficos;
- localizar transformações de dados;
- identificar duplicações;
- documentar todos os pontos encontrados.

**Nenhuma alteração de código deverá ser realizada nesta etapa.**

---

## Sprint 1 — Estratégia de Testes

Objetivo:

Garantir uma rede de segurança para a refatoração.

Criar testes para:

- cálculo de pontuação;
- ranking;
- geração da análise;
- ordenação dos dons;
- transformação dos dados;
- funções utilitárias do domínio.

Toda a suíte deverá permanecer verde durante toda a refatoração.

---

## Sprint 2 — Migração para TypeScript

Objetivo:

Migrar os módulos centrais do domínio para TypeScript.
A migração deverá ser incremental.
Cada arquivo migrado deverá manter todos os testes passando antes da próxima migração.
Nenhuma alteração funcional deverá ocorrer nesta etapa.


Regras:

- preservar comportamento;
- não alterar lógica;
- adicionar tipagem;
- eliminar usos desnecessários de `any`;
- preparar o domínio para a fonte única.

---

## Sprint 3 — Fonte Única dos Dons

Objetivo:

Criar uma única fonte de verdade para os dons espirituais.
Antes da implementação deverá ser definida a melhor localização para este módulo.
A decisão deverá ser justificada durante a auditoria.
Todo código de produção deverá consumir exclusivamente essa fonte única.
Nenhum outro arquivo poderá manter definições próprias dos dons.
Antes da implementação deverá ser confirmada a melhor estratégia para compartilhamento entre Frontend e Edge Functions.
A solução escolhida deverá evitar, sempre que possível, qualquer duplicação dos metadados dos dons.

---

## Sprint 4 — Organização Arquitetural ✅ Concluída

Mover regras de domínio para `domain/`, eliminar re-exports temporários, separar responsabilidades.

Atividades executadas:

- `services/scoring.ts` movido para `domain/scoring.ts` ✅
- Re-export de `topGift` removido de `helpers/string.js` ✅
- `HistoryList.vue` importa `topGift` diretamente de `domain/scoring` ✅
- `ANSWER_LABELS` extraído para `constants/likert.js` ✅
- Comentários enormes removidos de `data/questions.js` ✅
- `GIFT_COUNT` adotado em `domain/scoring.ts` (em vez de `27` literal) ✅
- Helpers revisados — nenhuma alteração necessária ✅

---

## Sprint 5 — Limpeza e Remoção de Compatibilidade ✅ Concluída

Atividades executadas:

- `data/gifts.js` removido (adapter de compatibilidade) ✅
- Comentários desatualizados removidos de `data/questions.js` ✅
- Documentação final da arquitetura atualizada ✅
- Última validação completa da aplicação executada (78/78 testes, build intacto) ✅

---

# Critérios de Aceite

A refatoração será considerada concluída quando:

- existir apenas uma definição dos dons;
- todas as duplicações tiverem sido eliminadas;
- todos os consumidores utilizarem a fonte única;
- todos os testes estiverem passando;
- não houver alteração de comportamento da aplicação;
- não houver alterações no banco de dados;
- não houver regressões conhecidas.
- nenhuma lista paralela dos dons permanece no código de produção;
- toda alteração em um dom pode ser realizada em apenas um local;
- todas as regras de negócio relacionadas aos dons estão cobertas por testes.

---

# Definição de Pronto (Definition of Done)

A refatoração somente será considerada concluída quando:

- todos os critérios de aceite forem atendidos;
- toda a suíte de testes estiver aprovada;
- não houver duplicações remanescentes no código de produção;
- a documentação estiver atualizada;
- o código estiver compatível com os princípios arquiteturais definidos neste documento.

---

# Melhorias Futuras

Após a conclusão desta refatoração poderão ser avaliadas iniciativas como:

- persistir os metadados dos dons em banco de dados;
- internacionalização dos metadados;
- geração automática de documentação do domínio;
- fortalecimento da arquitetura baseada em domínio (DDD);
- ampliação da cobertura de testes;
- auditoria completa das demais entidades do sistema.

Estas melhorias não fazem parte desta etapa.


> **Importante:** Este documento descreve uma estratégia de migração incremental. A implementação poderá ser adaptada conforme as descobertas da auditoria, desde que os objetivos, princípios arquiteturais e critérios de aceite definidos neste documento sejam preservados.

---

# Checklist

## Auditoria

- [x] Inventário completo das definições dos dons.
- [x] Inventário das duplicações.
- [x] Inventário dos consumidores.

## Testes

- [x] Testes unitários criados (78 testes, Vitest).
- [ ] Testes de integração criados.
- [x] Cobertura validada (scoring, ranking, topGift, gifts, questions).

## TypeScript

- [x] Domínio migrado (`domain/spiritual-gifts.ts`, `services/scoring.ts`).
- [x] Tipagem revisada.
- [x] Sem regressões.

## Fonte Única

- [x] Localização definida (`domain/spiritual-gifts.ts`).
- [x] Fonte única criada.
- [x] Consumidores migrados.
- [x] Duplicações físicas removidas (`data/gifts.js` agora é re-export).

## Finalização

- [x] Código limpo (Sprint 5).
- [x] Documentação atualizada.
- [x] Todos os testes aprovados (78/78).
- [x] Refatoração concluída.