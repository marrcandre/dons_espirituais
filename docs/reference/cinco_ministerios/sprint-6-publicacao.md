## Sprint 6.3 — Experiência Institucional (concluído)

### Status: ✅ Concluído

### Objetivo

Criar uma apresentação institucional pública para o projeto, incluindo informações sobre autoria, privacidade, projetos relacionados e apoio, mantendo consistência com a identidade visual definida.

---

### Arquivos criados

| Arquivo | Descrição |
|---|---|
| `src/views/AboutView.vue` | Página institucional `/sobre` com informações do projeto, metodologia, privacidade, autor, projetos relacionados e apoio PIX |
| `src/components/ui/AppFooter.vue` | Footer institucional responsivo com navegação, links e referência para apoio |
| `src/components/ui/AppLogo.vue` | Componente reutilizável do símbolo oficial do projeto |

---

### Arquivos alterados

| Arquivo | Ação |
|---|---|
| `src/app/router/index.ts` | Adicionada rota `/sobre` |
| `src/app/layouts/DefaultLayout.vue` | Integrado footer ao layout principal |
| `src/components/ui/AppHeader.vue` | Adicionado logo, navegação e link para home |
| `src/views/HomeView.vue` | Logo removido do hero após revisão visual |
| `src/views/AboutView.vue` | Adicionados projetos relacionados, links e ação copiar PIX |
| `docs/sprint-6-publicacao.md` | Registro do sprint |

---

### Decisões tomadas

- **Logo**
  - Mantido no Header e página Sobre.
  - Removido da Home para preservar foco no início do teste.

- **Página Sobre**
  Inclui:
  - objetivo do projeto;
  - metodologia;
  - privacidade;
  - autor;
  - contatos;
  - projetos relacionados;
  - apoio PIX.

- **Projetos relacionados**
  Incluídos:

  **Cinco Ministérios**
  - Aplicação publicada;
  - Código fonte.

  **Dons Espirituais**
  - Aplicação relacionada.

- **Contatos**
  Links funcionais:
  - GitHub;
  - LinkedIn;
  - Email.

- **PIX**
  Implementado como ação de cópia:
  - evita exposição desnecessária no footer;
  - melhora experiência do usuário.

---

### Validações

| Comando | Resultado |
|---|---|
| `npm run lint` | ✅ Sem erros |
| `npm run typecheck` | ✅ Sem erros |
| `npm run test` | ✅ 134 testes aprovados |
| `npm run build` | ✅ Build bem-sucedido |

---

# Sprint 6.4 — Revisão Final e Release (próximo)

## Objetivo

Validar a aplicação antes da publicação pública e preparar a primeira versão estável.

Escopo:

- revisão visual;
- revisão de responsividade;
- validação SEO;
- revisão README;
- atualização CHANGELOG;
- verificação de links;
- criação da tag Git `v1.0.0`;
- criação da release no GitHub.