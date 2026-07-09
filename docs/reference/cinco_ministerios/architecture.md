# Arquitetura

## Visão Geral

Arquitetura enxuta com separação clara entre domínio, interface e componentes reutilizáveis. Evitamos padrões complexos que não agregam valor ao tamanho do projeto.

## Estrutura

```
src/
  app/
    router/       # Configuração de rotas
    layouts/      # Layouts da aplicação

  components/
    ui/           # Componentes reutilizáveis do Design System

  composables/    # Composables Vue (lógica reutilizável com estado)

  domain/         # Lógica de domínio pura (sem dependências de framework)

  modules/        # Módulos da aplicação
    dashboard/    # Módulo inicial (placeholder)

  services/       # Serviços (localStorage, etc.)

  styles/
    tokens/       # Tokens de design (cores, tipografia, espaçamentos)
    theme/        # Configuração de tema (Vuetify)
    globals/      # Estilos globais (reset, global)
    utilities/    # Classes utilitárias

  utils/          # Funções utilitárias puras

  tests/          # Testes da aplicação
```

## Princípios

1. **Domínio puro** — Lógica de domínio não depende de Vue, Vuetify ou qualquer framework
2. **Composição** — Preferir composição a herança
3. **Componentes pequenos** — Cada componente faz uma coisa só
4. **Pastas planas** — Evitar aninhamento profundo
5. **Módulos independentes** — Cada módulo pode ser movido ou removido sem afetar os demais
6. **Temas via tokens** — Nenhum componente usa cores fixas; tudo vem de tokens CSS

## Fluxo de Dados

```
Componente → Composables → Services/Domain → localStorage
```

Componentes chamam composables, que orquestram services e domain. Services lidam com persistência. Domain contém regras de negócio.

## Tema

O composable `useTheme()` gerencia Light/Dark/System. Sincroniza classe `.dark` no `<html>` com o tema do Vuetify.

## Padrões

- `@/` como alias para `src/`
- Componentes em PascalCase
- Arquivos em kebab-case
- Composables prefixados com `use`
