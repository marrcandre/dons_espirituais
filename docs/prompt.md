Eu faria um prompt único, que poderá ser reutilizado em todas as sprints. Assim o Opencode passa a seguir sempre o mesmo fluxo de trabalho.

---

```text
Estamos iniciando o Sprint 1 da refatoração do domínio dos dons espirituais.

Antes de qualquer alteração no código, siga obrigatoriamente o fluxo abaixo.

# 1. Leitura do contexto

Leia integralmente os seguintes documentos:

- docs/gift-system-plan.md
- docs/gift-system-plan-analysis.md
- docs/gift-system-plan-log.md

Considere estes documentos como a fonte oficial de contexto do projeto.

Não tome nenhuma decisão sem considerar as informações neles contidas.

---

# 2. Compreensão do estado atual

Após a leitura, apresente um resumo contendo:

- entendimento do objetivo geral da refatoração;
- entendimento do objetivo desta sprint;
- progresso realizado até o momento;
- pendências identificadas;
- riscos existentes;
- arquivos que provavelmente serão alterados.

Caso identifique divergências entre o código e a documentação, informe antes de prosseguir.

---

# 3. Planejamento

Antes de escrever qualquer código, elabore um plano contendo:

- estratégia para execução da sprint;
- módulos que serão alterados;
- ordem das atividades;
- justificativa técnica;
- possíveis riscos;
- estratégia de validação;
- estratégia de testes.

Não implemente nada antes da aprovação do plano.

---

# 4. Escopo da Sprint

Considere que o Sprint 0 (Auditoria) está concluído.

Nesta sessão iniciaremos exclusivamente o Sprint 1 — Estratégia de Testes.

Objetivo:

Construir uma rede de segurança para permitir as próximas etapas da refatoração.

Nesta sprint NÃO deverá haver:

- alteração de regras de negócio;
- alteração funcional;
- migração para TypeScript;
- criação da Fonte Única dos Dons;
- alterações de layout;
- alterações de banco de dados;
- alterações em migrations;
- alterações em RLS;
- alterações em autenticação.

O foco é exclusivamente criar testes.

Priorize testes para:

- cálculo das pontuações;
- ranking;
- desempates;
- ordenação dos dons;
- transformação dos dados;
- geração da análise;
- funções utilitárias do domínio.

Sempre que possível os testes deverão ser independentes de:

- Vue;
- navegador;
- Supabase;
- interface gráfica.

---

# 5. Atualização da documentação

Ao concluir a sprint, atualize obrigatoriamente:

docs/gift-system-plan-log.md

Registrando:

- atividades executadas;
- arquivos alterados;
- decisões tomadas;
- dificuldades encontradas;
- observações importantes.

Também atualize:

docs/gift-system-plan-analysis.md

Incluindo:

- análise do estado atual do projeto;
- decisões arquiteturais;
- problemas encontrados;
- débitos técnicos identificados;
- riscos remanescentes;
- próximos passos recomendados.

A documentação deverá refletir exatamente o estado do projeto após esta sprint.

---

# 6. Encerramento

Ao finalizar:

- confirme que todos os testes permanecem passando;
- informe os arquivos modificados;
- apresente um resumo das alterações;
- indique se a sprint pode ser considerada concluída ou se existe alguma pendência.

Durante toda a implementação siga rigorosamente os princípios definidos em docs/gift-system-plan.md, especialmente:

- Single Source of Truth
- Clean Architecture
- Clean Code
- SOLID
- DRY
- KISS
- YAGNI
- Type Safety
- Testabilidade

Não execute atividades de sprints futuras sem aprovação explícita.
```

Esse prompt tem uma vantagem importante: **ele é praticamente permanente**. Nas próximas sprints, você só precisará trocar uma pequena parte:

* Sprint 1 → "Estratégia de Testes";
* Sprint 2 → "Migração para TypeScript";
* Sprint 3 → "Fonte Única dos Dons";
* Sprint 4 → "Migração Gradual";
* Sprint 5 → "Limpeza".

Todo o restante (leitura da documentação, planejamento, atualização do log e da análise, encerramento e princípios) permanece idêntico, criando um processo consistente para todo o projeto.
