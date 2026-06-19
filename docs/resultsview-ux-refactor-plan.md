# ResultsView.vue — UX Refactor (Actions + Name Editing + AI Regeneration)

## 🎯 Objetivo

Refatorar o bloco de ações do ResultsView.vue para melhorar UX e hierarquia de ações, introduzindo edição de nome e regeneração contextual da análise da IA, sem alterar estrutura de banco ou comportamento base do sistema.

---

## 🚫 Restrições importantes (OBRIGATÓRIO)

- NÃO alterar estrutura de tabelas do Supabase
- NÃO criar versionamento de nome ou análise
- NÃO modificar lógica de autenticação existente
- NÃO alterar comportamento de compartilhamento atual
- NÃO quebrar componentes existentes (AiAnalysis, GiftBadges, etc.)
- IGNORAR completamente a pasta legacy (não usar como referência)
- Fazer o mínimo de mudanças possível em cada fase

---

## 🧱 Escopo geral

O refactor será dividido em 3 fases incrementais:

---

# 🧩 Fase 1 — Refatoração do bloco de ações (UI/UX)

## Objetivo
Redesenhar hierarquia visual das ações do resultado.

## Mudanças

### Ação principal
- Compartilhar resultado (botão primário destacado)

### Ações secundárias
- Editar nome (ação textual ou secundária)
- Imprimir (ação discreta)

### Remoções
- Remover botão de "Baixar PDF"

### CTA de login (visitantes)
- Manter botão "Quero descobrir meus dons"
- Apenas para usuários não autenticados

## Regras
- Nenhuma lógica nova
- Apenas reorganização visual
- Nenhuma mudança em Supabase ou IA

---

# ✏️ Fase 2 — Edição de nome

## Objetivo
Permitir que o usuário dono do resultado edite seu nome diretamente na tela.

## Requisitos

- Apenas o dono pode editar (usar isOwner já existente)
- Atualização sobrescreve response.name
- Não criar histórico de versões

## Comportamento

Ao salvar novo nome:
- Atualizar UI imediatamente
- Exibir feedback de sucesso
- Marcar estado interno: nameWasEdited = true
- Exibir sugestão de regeneração da análise

## Estados novos

- nameWasEdited: boolean
- showRegenerateAction: boolean

---

# 🤖 Fase 3 — Regeneração contextual da análise

## Objetivo
Permitir regeneração da análise da IA quando o nome for alterado.

## Regras

- NÃO regenerar automaticamente
- Só exibir ação quando nome for alterado
- Usuário deve clicar manualmente para regenerar

## Comportamento

Quando ativado:
- Reutilizar lógica existente de geração da IA
- Sobrescrever response.ai_analysis
- Ocultar sugestão após execução

---

## 🖨️ Impressão

- Manter window.print()
- Permanecer como ação secundária discreta

---

## 🔐 Segurança

- Edição de nome apenas para dono (isOwner)
- Compartilhamento permanece público e read-only
- Nenhuma mudança em RLS ou autenticação

---

## 🎨 Nova hierarquia de ações

### Principal
- Compartilhar resultado

### Secundárias
- Editar nome
- Atualizar análise (condicional)
- Imprimir

### Contextual
- Login CTA (visitantes apenas)

---

## 🧠 Princípio de design

- Compartilhar é o objetivo principal do usuário
- Edição de nome é ajuste de contexto
- Regeneração de IA é opcional e sob demanda
- Impressão é fallback utilitário

---

## ⚠️ Regra de ouro

Cada fase deve ser implementada isoladamente, sem antecipar a próxima.

# ResultsView.vue — UX Refactor (FINAL CLEANUP + ARCHITECTURE POLISH)

## 🎯 Objetivo

Finalizar o refactor do ResultsView.vue com foco em:

- Limpeza de estados redundantes
- Desacoplamento leve da lógica de IA
- Melhoria de UX copy
- Consolidação de responsabilidades
- Remoção de código morto

---

## 🚫 REGRAS GLOBAIS (OBRIGATÓRIO)

- NÃO alterar estrutura de banco (Supabase)
- NÃO criar versionamento de dados
- NÃO modificar autenticação
- NÃO reintroduzir PDF export
- NÃO usar pasta legacy
- NÃO quebrar componentes existentes
- Fazer mudanças mínimas e cirúrgicas

---

# 🧹 FASE 8 — LIMPEZA DE ESTADO E CÓDIGO MORTO

## Objetivo
Remover estados e variáveis que não têm mais função real.

## Ações

- Remover `nameWasEdited` se não estiver sendo usado
- Garantir que `uiState` contenha apenas estados ativos:
  - showRegenerateAction
  - isRegenerating

## Regras
- Não alterar comportamento visual
- Apenas limpeza interna

---

# 🧠 FASE 9 — DESACOPLAR REGENERAÇÃO DE IA (REFATOR LEVE)

## Objetivo
Reduzir acoplamento direto com AiAnalysis.vue.

## Ações

- Criar função intermediária no ResultsView.vue:
  - regenerateAnalysis(responseId, name)

- Essa função deve ser a única responsável por:
  - chamar AiAnalysis (via ref OU service futuro)
  - atualizar response.ai_analysis
  - gerenciar loading e erro

## Regras
- Não alterar interface do AiAnalysis ainda (refatoração mínima)
- Apenas centralizar lógica no ResultsView

---

# 💬 FASE 10 — MELHORIA DE UX COPY

## Objetivo
Ajustar textos da interface para melhorar clareza.

## Ações

- Ajustar botão:
  - "Compartilhar" → "Compartilhar resultado"

- Ajustar mensagem de regeneração para:
  "O nome foi atualizado. Deseja atualizar a análise para refletir essa mudança?"

## Regras
- Apenas texto e UI copy
- Nenhuma mudança de lógica

---

# 🧪 FASE 11 — CONSISTÊNCIA DE FLUXO

## Objetivo
Garantir consistência do estado após ações do usuário.

## Ações

Após regeneração:

- reset showRegenerateAction = false
- reset nameWasEdited (se existir)
- garantir feedback de sucesso

Adicionar feedback visual:

- "Análise atualizada com sucesso"

---

# 🧠 PRINCÍPIO FINAL

- ResultsView deve ser orquestrador leve
- AiAnalysis deve ser executor de geração
- UI deve ser reativa e previsível
- Nenhuma lógica duplicada entre componentes

---

# ⚠️ NÃO FAZER

- Não criar novas tabelas
- Não criar versionamento
- Não adicionar novas features fora do escopo
- Não refatorar layout geral