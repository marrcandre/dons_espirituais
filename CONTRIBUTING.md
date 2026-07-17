# Contribuindo — Dons Espirituais

## Pré-requisitos

- Node.js >= 18
- npm >= 9

## Setup

```bash
git clone https://github.com/marrcandre/dons-espirituais.git
cd dons-espirituais
npm install
```

## Variáveis de ambiente

Copie `packages/frontend/.env.example` para `packages/frontend/.env` e preencha:

```bash
cp packages/frontend/.env.example packages/frontend/.env
```

| Variável | Obrigatória | Descrição |
|----------|:-----------:|-----------|
| `VITE_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave anônima do Supabase |

## Desenvolvimento

```bash
npm run dev                  # Iniciar servidor de desenvolvimento
npm run dev -- --port 3000   # Porta customizada
```

## Testes

```bash
npm test                     # Rodar todos os testes (vitest run)
npm run test:watch           # Modo watch (TDD)
npm run test:coverage        # Relatório de cobertura
```

## Qualidade

Antes de commitar, verifique:

```bash
npm run lint                 # ESLint (0 erros esperado)
npm run typecheck            # vue-tsc (0 erros esperado)
npm test                     # Todos os testes passando
npm run build                # Build sem erros
```

## Commits

Usamos commits semânticos baseados em [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração sem mudança de comportamento
test: adição ou correção de testes
docs: documentação
chore: tarefas de manutenção
style: formatação, espaçamento
```

## Pull Requests

1. Crie um branch a partir da `master`
2. Faça as alterações necessárias
3. Execute lint, typecheck, testes e build
4. Abra um PR contra a `master`
5. O CI validará automaticamente lint, typecheck, testes e build
6. A Vercel criará um preview deployment automaticamente

## Arquitetura

O projeto segue arquitetura em 4 camadas:

```
domain/        → Regras de negócio (TypeScript puro)
application/   → Casos de uso (TypeScript)
infrastructure → Repositories, serviços (JavaScript/TypeScript)
presentation/  → Views, Componentes, Stores, Router (Vue + JS)
```

### Design System

Componentes Vuetify devem ser encapsulados pelo Design System.

- Use `<AppButton>` em vez de `<v-btn>` em componentes próprios.
- Use `<AppAlert>` em vez de `<v-alert>` em componentes próprios.
- Use `<AppCard>` em vez de `<v-card>` em componentes próprios.
- Use `LoadingState`, `EmptyState` e `ErrorState` para estados de carregamento, vazio e erro.
- Componentes estruturais do Vuetify (`v-app`, `v-main`, `v-list`, `v-dialog`, etc.) continuam permitidos.

Veja `docs/design_plan.md` para a documentação completa do Design System.

### Regra de encapsulamento

Componentes de abstração do Design System **devem preservar o comportamento nativo dos componentes Vuetify encapsulados**, especialmente APIs baseadas em detecção de slots.

**Exemplo:** O Vuetify `v-btn` usa `!slots.default && hasIcon` para decidir se renderiza um ícone. Um wrapper que sempre expõe um slot outlet (mesmo vazio) quebra esse comportamento. A correção é usar dois branches mutuamente exclusivos (`v-if="$slots.default"` com slot, `v-else` self-closing).

Todo wrapper deve ser testado com e sem slot content para validar que não há regressão no comportamento nativo.

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a MIT License (veja `LICENSE`).
