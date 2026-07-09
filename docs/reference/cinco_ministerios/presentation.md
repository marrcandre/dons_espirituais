# Camada de Apresentação

## Fluxo do Usuário

```
Home (/)
  ↓
Iniciar ou Continuar teste
  ↓
Test (/test)
  ↓
6 perguntas com navegação
  ↓
Resultado (/result)
  ↓
Ranking completo dos 5 ministérios
```

## Responsabilidade das Páginas

### HomeView (`src/views/HomeView.vue`)

- Apresentação inicial do teste
- Verifica sessão existente no localStorage
- Oferece opções de continuar ou iniciar novo teste
- Navega para `/test` ou `/test?continue=true`

### TestView (`src/views/TestView.vue`)

- Controla o fluxo de perguntas
- Usa `useTestSession` para gerenciar estado
- Exibe pergunta atual via `QuestionCard`
- Mostra progresso via `TestProgress`
- Navega para `/result` ao finalizar

### ResultView (`src/views/ResultView.vue`)

- Carrega resultado do localStorage
- Exibe ranking via `ResultRanking`
- Oferece opção de refazer o teste

## Responsabilidade dos Componentes

### QuestionCard (`src/components/test/QuestionCard.vue`)

- Recebe objeto `Question` e ministério selecionado
- Renderiza texto da pergunta e lista de `QuestionOption`
- Emite `select` com o ministério escolhido

### QuestionOption (`src/components/test/QuestionOption.vue`)

- Representa uma alternativa clicável
- Estados: normal, hover, selecionado
- Emite `select` com o ministério

### TestProgress (`src/components/test/TestProgress.vue`)

- Exibe "Pergunta X de Y"
- Barra de progresso proporcional

### ResultRanking (`src/components/test/ResultRanking.vue`)

- Recebe `MinistryScore[]` ordenado
- Exibe posição, nome, descrição e pontuação de cada ministério
- Destaca o primeiro colocado

## Integração Entre Camadas

```
HomeView / TestView / ResultView
    ↓ (Vue)
useTestSession (composable)
    ↓
application/test-session.ts (casos de uso)
application/calculate-result.ts
    ↓
domain/ (regras de negócio)
    ↓
infrastructure/storage/local-storage.ts (persistência)
```

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `src/views/HomeView.vue` | Página inicial |
| `src/views/TestView.vue` | Página do teste |
| `src/views/ResultView.vue` | Página de resultado |
| `src/components/test/QuestionCard.vue` | Card de pergunta |
| `src/components/test/QuestionOption.vue` | Alternativa |
| `src/components/test/TestProgress.vue` | Barra de progresso |
| `src/components/test/ResultRanking.vue` | Ranking de resultados |
| `src/composables/useTestSession.ts` | Composable de integração |
