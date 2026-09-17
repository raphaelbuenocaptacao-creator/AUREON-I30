# I30 Adaptive Business Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every I30 preview derive its business semantics and visual structure from the typed idea.

**Architecture:** Extract idea analysis into a deterministic app-model module and make the UI renderer consume model archetypes. Domain presets provide rich semantics while keyword derivation handles unknown ideas without a generic fallback.

**Tech Stack:** Vanilla JavaScript, CSS, Node assert tests, GitHub Pages/PWA.

**Spec:** `docs/superpowers/specs/2026-09-17-i30-adaptive-business-previews.md`

## Global Constraints
- Client-side deterministic generation.
- Vivid visual identity.
- Preserve history, project view, Instagram CTA to `@aureon_saas`, and PWA.
- Never fall back to `Meu App`.

---

### Task 1: Adaptive app model
**Files:** Create `creator/app-model.js`; modify `tests/creator-engine.test.js`.
- [ ] Add failing tests for watch, eyewear, mechanic and unknown ideas, including distinct domains/archetypes.
- [ ] Implement `buildAppModel(idea)` with domain vocabulary, name extraction, deterministic themes and archetypes.
- [ ] Verify model tests.

### Task 2: Archetype renderer
**Files:** Modify `creator/ui.js`, `creator.css`, `tests/creator-engine.test.js`.
- [ ] Add failing structural assertions for catalog/service/activity render support.
- [ ] Render hero, stats, actions and cards according to `model.archetype`.
- [ ] Add vivid archetype-specific CSS.
- [ ] Verify tests.

### Task 3: Publish/cache
**Files:** Modify `index.html`, `sw.js`, `tests/creator-engine.test.js`.
- [ ] Add model script and v9 cache assertions.
- [ ] Load `app-model.js` before UI and bump all assets/cache to v9.
- [ ] Verify repository files and available CI status.