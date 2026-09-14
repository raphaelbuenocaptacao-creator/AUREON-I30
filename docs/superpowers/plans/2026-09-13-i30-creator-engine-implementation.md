# I30 Creator Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evoluir o I30 para transformar uma ideia em múltiplos formatos de criação, preservando o motor atual de 30 ideias de SaaS.

**Architecture:** Manter o app estático/PWA e sem chaves privadas no frontend. Adicionar módulos isolados em `creator/` para catálogo, geração local, histórico e UI; o fluxo legado de 30 SaaS continua em `app.js` e é acionado como um módulo especializado.

**Tech Stack:** HTML, CSS, JavaScript vanilla, localStorage, GitHub Pages/PWA, Node.js para testes.

**Spec:** `docs/superpowers/specs/2026-09-13-i30-creator-engine-design.md`

## Global Constraints
- Nome oficial: **I30**.
- Mobile-first e PWA.
- Sem respostas falsas de IA e sem chaves privadas no navegador.
- O modo Vídeo gera pacote de produção, não afirma renderizar MP4.
- Preservar o fluxo atual de 30 ideias, score e ranking.

### Task 1: Creator core
**Files:** Create `creator/catalog.js`, `creator/generators.js`, `tests/creator-engine.test.js`.
- [ ] Escrever teste falhando para catálogo e geração.
- [ ] Implementar catálogo e `generateCreation({type, idea, context})`.
- [ ] Rodar testes e confirmar verde.

### Task 2: Histórico e UI
**Files:** Create `creator/history.js`, `creator/ui.js`, `creator.css`; modify `index.html`.
- [ ] Testar persistência/migração básica.
- [ ] Implementar histórico local não destrutivo.
- [ ] Criar entrada de ideia, grade de formatos e workspace de resultado.
- [ ] Integrar `saas30` ao formulário legado sem duplicar o motor atual.
- [ ] Pré-preencher `?idea=` sem gerar automaticamente.

### Task 3: PWA e regressão
**Files:** Modify `sw.js`; create `.github/workflows/creator-engine-test.yml`.
- [ ] Incluir arquivos `creator/*` no shell.
- [ ] Bump de cache e alinhamento no registro do service worker.
- [ ] Rodar testes do creator e auditoria PWA.
- [ ] Validar que o fluxo legado continua presente no HTML/app.

### Task 4: Integração da home AUREON
**Files:** Modify `AUREON-TECH.github.io` em PR separado após o I30 estar verde.
- [ ] Adicionar CTA “Você tem uma ideia? O I30 transforma.”
- [ ] Encaminhar ideia via query string segura.
- [ ] Não duplicar o motor do I30 na home.
