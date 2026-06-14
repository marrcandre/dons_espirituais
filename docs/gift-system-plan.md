# Spiritual Gifts System — Single Source of Truth

## Objetivo

O sistema atualmente possui múltiplas definições da lista de dons espirituais espalhadas entre:

* Frontend (Vue)
* Backend (Supabase functions)
* Lógica de questions / quiz
* Análises de IA
* Gráficos e relatórios

Isso gera inconsistência e dificuldade de manutenção.

O objetivo deste documento é estabelecer uma **fonte única de verdade (Single Source of Truth)** para todos os dons espirituais do sistema.

---

# Princípio central

Existe apenas UMA definição oficial dos dons espirituais no sistema.

Qualquer outra referência deve derivar desta fonte.

---

# Fonte oficial

A lista oficial de dons deve estar centralizada em:

```text
packages/frontend/src/domain/spiritual-gifts.ts
```

ou (caso prefira compartilhado futuramente):

```text
packages/shared/spiritual-gifts.ts
```

---

# Estrutura recomendada

```ts
export interface SpiritualGift {
  id: string
  key: string
  name: string
  description?: string
}
```

---

# Regras obrigatórias

## 1. Nenhuma duplicação

A lista de dons NÃO pode existir em:

* Frontend hardcoded
* Backend duplicado
* Funções Supabase
* IA prompts fixos
* Arquivos de questions duplicados

---

## 2. IDs fixos

Cada dom deve ter um ID estável:

* Nunca mudar ID após criação
* Nome pode ser ajustado
* ID é referência global

---

## 3. Fonte única obrigatória

Qualquer uso deve importar:

```ts
import { SPIRITUAL_GIFTS } from '@/domain/spiritual-gifts'
```

---

## 4. Uso em scoring

O sistema de pontuação deve sempre referenciar essa lista para:

* Cálculo de resultados
* Ranking de dons
* Gráficos
* Análise de IA

---

## 5. Uso em IA

Prompts de IA NÃO devem conter lista hardcoded.

Devem receber a lista dinamicamente.

---

## 6. Supabase / Backend

O backend não deve manter lista própria.

Ele deve receber os IDs do frontend ou do shared module.

---

# Migração

## Etapas

### Fase 1

Criar arquivo central de dons

### Fase 2

Substituir referências no frontend

### Fase 3

Atualizar Supabase functions

### Fase 4

Atualizar sistema de IA

### Fase 5

Remover listas duplicadas antigas

---

# Critério de sucesso

* Existe apenas UMA lista de dons no projeto
* Todos os sistemas consomem essa lista
* Nenhuma duplicação hardcoded permanece
* Mudança de nome em um dom reflete em todo o sistema

---

# Objetivo final

Garantir consistência total entre:

* Quiz
* Resultados
* Gráficos
* IA
* Backend
* Frontend

sem divergência de nomes ou interpretações
