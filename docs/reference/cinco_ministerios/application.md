# Application Layer

## Responsabilidade

A camada de aplicação orquestra os casos de uso do teste sem depender de framework ou interface. Ela importa e utiliza o domínio, mas o domínio não sabe de sua existência.

```
Interface (Vue) → Application → Domain
```

## Diferença entre Domain e Application

| Camada | Responsabilidade | Dependências |
|--------|------------------|--------------|
| Domain | Regras de negócio, dados oficiais do teste | Nenhuma |
| Application | Casos de uso, validação de sessão, orquestração | Domain apenas |

## Fluxo de execução do teste

```
createSession()
    ↓
addAnswer(session, questionId, ministry)  ← repetir 6×
    ↓
isCompleted(session) → true
    ↓
getAnswers(session)
    ↓
calculateResult(answers)
    ↓
{ scores: MinistryScore[] }
```

## TestSession

- `createSession()` — Cria sessão vazia (sem respostas, não concluída)
- `addAnswer(session, questionId, ministry)` — Adiciona resposta com validações:
  - Pergunta deve existir
  - Ministério deve ser um tipo válido
  - Pergunta não pode ter resposta duplicada
  - Retorna nova sessão (imutável)
- `isCompleted(session)` — True quando todas as 6 perguntas têm resposta
- `getAnswers(session)` — Retorna cópia das respostas

## CalculateResult

- `calculateResult(answers)` — Processa respostas via `calculateScores()` do domínio
- Retorna apenas `{ scores: MinistryScore[] }` — sem dados de UI

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `src/application/test-session.ts` | Sessão de teste |
| `src/application/calculate-result.ts` | Cálculo de resultado |
| `src/application/index.ts` | Barrel export |
