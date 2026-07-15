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

Veja `README.md` e `docs/architecture-evolution-plan.md` para detalhes.

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a MIT License (veja `LICENSE`).
