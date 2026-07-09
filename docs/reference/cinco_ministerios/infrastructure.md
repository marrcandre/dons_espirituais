# Infrastructure Layer

## Motivo do uso de localStorage

Esta aplicação não possui backend, autenticação ou banco de dados. O localStorage é o mecanismo de persistência padrão do navegador, suficiente para o MVP e que elimina qualquer dependência de infraestrutura externa.

## Responsabilidade da camada

A camada de infraestrutura é responsável apenas por persistir e recuperar dados. Ela não contém:

- regras de negócio;
- validações de domínio;
- lógica de aplicação.

O fluxo é sempre:

```
Application → Infrastructure → localStorage
```

A infraestrutura nunca é chamada diretamente pelo domínio.

## Limitações do MVP

- **Armazenamento local**: os dados existem apenas no navegador do usuário. Não há sincronização entre dispositivos.
- **Limite de tamanho**: ~5MB por domínio. Suficiente para sessões e resultados de texto.
- **Sem criptografia**: dados salvos em texto puro. Não adequado para informações sensíveis.
- **Volátil**: o usuário pode limpar os dados do navegador a qualquer momento.

## Funções

### Sessão

- `saveSession(session)` — Persiste a sessão atual
- `loadSession()` — Recupera a sessão salva (ou `null`)
- `clearSession()` — Remove a sessão

### Resultado

- `saveResult(result)` — Persiste o resultado
- `loadResult()` — Recupera o resultado salvo (ou `null`)
- `clearResult()` — Remove o resultado

### Geral

- `clearAll()` — Remove sessão e resultado

## Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `src/infrastructure/storage/local-storage.ts` | Adaptador localStorage |

## Tratamento de erros

Todas as funções são seguras (não lançam exceções):

- JSON inválido → retorna `null`
- Chave ausente → retorna `null`
- Storage cheio → falha silenciosa
- localStorage indisponível → falha silenciosa
