# AUREON V30 App Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current video-focused V30 experience with a functional local AI-assisted app builder that turns a natural-language brief into a structured project, live preview, editable project state, persistent project history and exportable project definition.

**Architecture:** Keep V30 framework-free and compatible with GitHub Pages. Split the current single large app script into small ES modules for state, blueprint parsing, project generation, mutations, preview rendering, persistence and export. The browser runs a deterministic structured builder in Phase 1; no arbitrary code execution or secret API keys are introduced.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, localStorage, Node.js built-in test runner for pure modules, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-13-v30-app-builder-design.md`

## Global Constraints

- Primary UI name: **AUREON V30**.
- Descriptor: **AI APP BUILDER**.
- Headline: **Descreva. Construa. Publique.**
- No video creation terminology or controls may remain in V30.
- Existing I30 must keep working independently.
- No browser-side AI, GitHub, Supabase or Vercel secret keys.
- Never use `eval()` or execute user-provided JavaScript.
- Phase 1 preview must render only controlled schemas/templates.
- Storage keys must be V30-specific and versioned.
- Initial generated app types must include dashboard, CRM, finance, marketplace and scheduling/agenda.
- Desktop and mobile layouts must both remain usable.

---

## File Map

### Existing files to replace

- `v30/index.html` — new app-builder shell and all major workspace regions.
- `v30/styles.css` — new builder visual system and responsive behavior.
- `v30/app.js` — reduced to application bootstrap/orchestration.

### New modules

- `v30/modules/state.js` — creates/updates normalized V30 state.
- `v30/modules/blueprint.js` — parses a natural-language brief into a structured blueprint.
- `v30/modules/project-generator.js` — converts a blueprint into project/screens/entities/files.
- `v30/modules/mutations.js` — interprets supported chat change requests and mutates project state.
- `v30/modules/preview.js` — renders safe DOM previews from project schemas.
- `v30/modules/storage.js` — localStorage persistence with validation/recovery.
- `v30/modules/export.js` — serializes project data for download/export.

### New tests

- `v30/package.json` — enables Node ES modules and `node --test`.
- `v30/tests/blueprint.test.js`
- `v30/tests/project-generator.test.js`
- `v30/tests/mutations.test.js`
- `v30/tests/storage.test.js`
- `v30/tests/export.test.js`

---

### Task 1: Establish the normalized project model and blueprint parser

**Files:**
- Create: `v30/package.json`
- Create: `v30/modules/state.js`
- Create: `v30/modules/blueprint.js`
- Create: `v30/tests/blueprint.test.js`

**Interfaces:**
- Produces: `createEmptyProject() -> Project`
- Produces: `normalizeBlueprint(input) -> Blueprint`
- Produces: `parseBrief(brief) -> Blueprint`

- [ ] **Step 1: Add Node test configuration**

Create `v30/package.json`:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

- [ ] **Step 2: Write failing blueprint tests**

Create `v30/tests/blueprint.test.js` with assertions covering at least:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBrief } from '../modules/blueprint.js';

test('parses finance brief into finance blueprint', () => {
  const result = parseBrief('Crie um app financeiro com login Google, dashboard, dívidas e gastos');
  assert.equal(result.category, 'finance');
  assert.ok(result.features.includes('dashboard'));
  assert.ok(result.features.includes('expenses'));
  assert.ok(result.integrations.includes('google-auth'));
});

test('parses CRM brief with clients and pipeline', () => {
  const result = parseBrief('CRM para clientes, leads e funil de vendas');
  assert.equal(result.category, 'crm');
  assert.ok(result.features.includes('clients'));
  assert.ok(result.features.includes('pipeline'));
});
```

- [ ] **Step 3: Run tests and verify failure**

Run:

```bash
cd v30 && npm test
```

Expected: tests fail because `modules/blueprint.js` does not exist yet.

- [ ] **Step 4: Implement project and blueprint model**

`state.js` must export a factory returning this exact shape:

```js
{
  id,
  name,
  description,
  category,
  targetUser,
  style,
  stack,
  features: [],
  screens: [],
  entities: [],
  integrations: [],
  files: [],
  history: [],
  createdAt,
  updatedAt
}
```

`blueprint.js` must classify at minimum `finance`, `crm`, `marketplace`, `agenda`, `dashboard`, and fallback `saas`, and detect common intents such as login, Google auth, dashboard, expenses, debts, clients, pipeline, products, scheduling, ranking, notifications and Supabase.

- [ ] **Step 5: Run tests and verify pass**

Run:

```bash
cd v30 && npm test
```

Expected: all Task 1 tests pass.

- [ ] **Step 6: Commit**

```bash
git add v30/package.json v30/modules/state.js v30/modules/blueprint.js v30/tests/blueprint.test.js
git commit -m "feat(v30): add app blueprint engine"
```

---

### Task 2: Generate useful project structures for the five core app categories

**Files:**
- Create: `v30/modules/project-generator.js`
- Create: `v30/tests/project-generator.test.js`

**Interfaces:**
- Consumes: `Blueprint` from `blueprint.js`
- Produces: `generateProject(blueprint) -> Project`
- Project `screens[]` items must contain `{ id, name, type, title, components }`
- Project `entities[]` items must contain `{ name, fields }`
- Project `files[]` items must contain `{ path, language, content }`

- [ ] **Step 1: Write failing generation tests**

Cover all five required categories:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProject } from '../modules/project-generator.js';

const bp = category => ({
  name: 'Teste', description: 'Teste', category, targetUser: 'Usuário',
  style: 'futuristic-dark', stack: 'vanilla-pwa', features: [], integrations: []
});

test('finance creates finance dashboard and transactions', () => {
  const project = generateProject(bp('finance'));
  assert.ok(project.screens.some(s => s.type === 'finance-dashboard'));
  assert.ok(project.entities.some(e => e.name === 'transactions'));
});

test('crm creates pipeline screen', () => {
  const project = generateProject(bp('crm'));
  assert.ok(project.screens.some(s => s.type === 'pipeline'));
});
```

Add equivalent checks for marketplace, agenda and dashboard.

- [ ] **Step 2: Run tests and verify failure**

```bash
cd v30 && npm test
```

Expected: project-generator import fails.

- [ ] **Step 3: Implement deterministic generators**

Provide category-specific screen sets:

```text
finance     -> Overview, Transactions, Debts, Budget, Profile
crm         -> Overview, Leads, Pipeline, Clients, Activities
marketplace -> Home, Catalog, Product, Cart, Orders
agenda      -> Today, Calendar, Tasks, Notes, Profile
dashboard   -> Overview, Analytics, Reports, Activity, Settings
saas        -> Overview, Workspace, Data, Reports, Settings
```

Each generator must also produce a coherent entity list and an in-memory file tree containing at minimum `index.html`, `styles.css`, `app.js`, `manifest.webmanifest` and `README.md` representations.

- [ ] **Step 4: Run tests and verify pass**

```bash
cd v30 && npm test
```

Expected: all Task 1–2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add v30/modules/project-generator.js v30/tests/project-generator.test.js
git commit -m "feat(v30): generate category-specific app projects"
```

---

### Task 3: Add supported natural-language project mutations

**Files:**
- Create: `v30/modules/mutations.js`
- Create: `v30/tests/mutations.test.js`

**Interfaces:**
- Consumes: `Project`
- Produces: `applyMutation(project, message) -> { project, summary, supported }`

- [ ] **Step 1: Write failing mutation tests**

Tests must cover:

```js
applyMutation(project, 'adicione ranking')
applyMutation(project, 'deixe o visual mais futurista')
applyMutation(project, 'adicione login Google')
applyMutation(project, 'adicione Supabase')
applyMutation(project, 'crie uma tela de relatórios')
```

Expected behaviors:
- ranking request adds a ranking screen/feature only once;
- futuristic request sets `project.style = 'futuristic-dark'`;
- Google request adds `google-auth` integration;
- Supabase request adds `supabase` integration and appropriate data note;
- reports request adds a reports screen;
- unknown request returns `supported: false` without corrupting project state.

- [ ] **Step 2: Run and verify failure**

```bash
cd v30 && npm test
```

- [ ] **Step 3: Implement intent matcher and immutable-safe mutation flow**

Use normalized lowercase text and controlled intent handlers. Never execute text as code. Append a history entry containing the user request, summary and timestamp after successful mutation.

- [ ] **Step 4: Run and verify pass**

```bash
cd v30 && npm test
```

- [ ] **Step 5: Commit**

```bash
git add v30/modules/mutations.js v30/tests/mutations.test.js
git commit -m "feat(v30): add conversational project mutations"
```

---

### Task 4: Implement persistence and export

**Files:**
- Create: `v30/modules/storage.js`
- Create: `v30/modules/export.js`
- Create: `v30/tests/storage.test.js`
- Create: `v30/tests/export.test.js`

**Interfaces:**
- Produces: `saveProject(storage, project)`
- Produces: `loadProjects(storage) -> Project[]`
- Produces: `removeProject(storage, projectId)`
- Produces: `serializeProject(project) -> string`

- [ ] **Step 1: Write failing storage/export tests**

Use an in-memory fake storage object with `getItem`, `setItem`, `removeItem`.

Test:
- save/load roundtrip;
- corrupted JSON recovers to empty list;
- saving same project ID updates instead of duplicating;
- export JSON contains project name, screens, entities and files.

- [ ] **Step 2: Run and verify failure**

```bash
cd v30 && npm test
```

- [ ] **Step 3: Implement versioned storage**

Use exact key:

```text
aureon:v30:projects:v1
```

Validate loaded values are arrays of objects with string `id`, string `name`, and arrays for `screens`, `entities` and `files`. Invalid records are skipped.

- [ ] **Step 4: Implement export serializer**

`serializeProject()` must return pretty JSON (`JSON.stringify(project, null, 2)`) after stripping runtime-only references if any exist.

- [ ] **Step 5: Run and verify pass**

```bash
cd v30 && npm test
```

- [ ] **Step 6: Commit**

```bash
git add v30/modules/storage.js v30/modules/export.js v30/tests/storage.test.js v30/tests/export.test.js
git commit -m "feat(v30): add project persistence and export"
```

---

### Task 5: Replace the V30 video UI with the App Builder workflow

**Files:**
- Modify: `v30/index.html`
- Modify: `v30/styles.css`
- Modify: `v30/app.js`
- Create: `v30/modules/preview.js`

**Interfaces:**
- Consumes all modules from Tasks 1–4.
- Produces visible screens: Start, Blueprint Review, Builder Workspace.
- Produces `renderPreview(project, mountNode, screenId)`.

- [ ] **Step 1: Replace `index.html` structure**

Remove all video-specific controls and sections. Add these stable IDs:

```text
#startView
#briefInput
#buildBriefBtn
#recentProjects
#blueprintView
#blueprintSummary
#blueprintFeatures
#blueprintScreens
#blueprintData
#confirmBuildBtn
#editBriefBtn
#builderView
#chatHistory
#chatInput
#sendChatBtn
#previewMount
#viewportDesktopBtn
#viewportMobileBtn
#projectTabs
#filesPanel
#screensPanel
#dataPanel
#settingsPanel
#saveProjectBtn
#exportProjectBtn
```

Load `app.js` with `type="module"`.

- [ ] **Step 2: Rewrite the visual system in `styles.css`**

Create a dark AUREON builder workspace with:
- graphite/black backgrounds;
- gold/electric accents;
- three-column desktop workspace;
- responsive single-panel mobile workspace with Chat/Preview/Project navigation;
- clear focus/hover states;
- accessible contrast;
- no leftover video/timeline/storyboard classes in active markup.

- [ ] **Step 3: Implement safe preview renderer**

`preview.js` must build DOM nodes using `document.createElement()` and `textContent` for user-derived content. It must support component kinds required by generators, including metric cards, tables/lists, pipeline columns, calendar/task list, product cards and generic sections. It must never inject raw user strings through `innerHTML`.

- [ ] **Step 4: Rewrite `app.js` as orchestrator**

Required flow:

```text
brief -> parseBrief -> show blueprint -> confirm -> generateProject -> builder
chat -> applyMutation -> save -> rerender preview + panels
save -> storage
export -> serializeProject -> Blob download
reopen -> load project -> builder
```

The file should only coordinate UI state/events; generation logic remains in modules.

- [ ] **Step 5: Add useful inline error states**

Handle exact cases:
- empty brief;
- unsupported mutation;
- persistence unavailable;
- invalid saved project;
- preview renderer exception;
- export exception.

Each case must display a visible message and recovery action such as retry, return to start or continue without saving.

- [ ] **Step 6: Run automated tests**

```bash
cd v30 && npm test
```

Expected: all tests pass.

- [ ] **Step 7: Manual UI verification**

Open V30 through a local static server and verify:

```bash
python -m http.server 8080
```

Then test `/v30/` at desktop width and mobile width.

Verify these briefs produce visibly different previews:

```text
Crie um app financeiro com dashboard, dívidas e gastos
Crie um CRM para leads, clientes e pipeline
Crie um marketplace de produtos com carrinho e pedidos
Crie uma agenda pessoal com calendário, tarefas e notas
Crie um dashboard para acompanhar vendas e metas
```

- [ ] **Step 8: Commit**

```bash
git add v30/index.html v30/styles.css v30/app.js v30/modules/preview.js
git commit -m "feat(v30): replace video studio with AI app builder"
```

---

### Task 6: Connect I30 handoff into V30 without breaking standalone use

**Files:**
- Modify: `app.js` at repository root only where the existing selected-opportunity/build action is defined.
- Modify: `v30/app.js`
- Add/modify test coverage only if root logic is factored into a pure helper.

**Interfaces:**
- I30 handoff URL: `v30/?brief=<encoded text>`
- V30 consumes the optional `brief` query parameter and pre-fills/parses it.

- [ ] **Step 1: Locate the existing I30 build/prompt CTA**

Find the current action that represents taking a selected validated opportunity toward app construction.

- [ ] **Step 2: Change only that action to hand off to V30**

Build a concise brief from the chosen idea using the selected idea's name/problem/solution and navigate to:

```js
`v30/?brief=${encodeURIComponent(brief)}`
```

Do not change I30 idea generation, scoring, validation, ranking or history behavior.

- [ ] **Step 3: Make V30 consume `brief`**

On load, if `new URLSearchParams(location.search).get('brief')` exists, set `#briefInput` and immediately render the blueprint review for that brief.

- [ ] **Step 4: Regression verify I30**

Verify root `/` still:
- generates 30 ideas;
- validates and scores them;
- opens idea detail;
- preserves history;
- only changes the final build handoff behavior.

- [ ] **Step 5: Commit**

```bash
git add app.js v30/app.js
git commit -m "feat(i30): hand validated opportunities to V30 builder"
```

---

### Task 7: Final verification and cleanup

**Files:**
- Modify only files with discovered verification defects.

**Interfaces:**
- Final product must satisfy all acceptance criteria from the design spec.

- [ ] **Step 1: Run full automated suite**

```bash
cd v30 && npm test
```

Expected: zero failures.

- [ ] **Step 2: Search for forbidden/obsolete V30 video language**

Search `v30/` for:

```text
vídeo
video
Reels
TikTok
storyboard
renderer
narração
renderização
CRIAR VÍDEO
```

Expected: no active product/UI references remain. Historical docs outside `v30/` may remain.

- [ ] **Step 3: Verify persistence**

Create a project, mutate it, reload the page, reopen the project and confirm screens/data/style/history match the saved state.

- [ ] **Step 4: Verify export**

Export a project and confirm the downloaded JSON is valid and includes the same project ID, screens, entities and files shown in the UI.

- [ ] **Step 5: Verify responsive behavior**

Check desktop and mobile navigation, preview scrolling, chat input, project explorer and primary CTAs.

- [ ] **Step 6: Verify I30 regression**

Load root I30 and exercise its existing 30-idea -> validate -> select -> handoff flow.

- [ ] **Step 7: Final commit for verification fixes only**

```bash
git add v30 app.js
git commit -m "fix(v30): finalize app builder verification"
```

---

## Completion Criteria

Implementation is complete only when all of the following are demonstrably true:

1. V30 contains no video creation flow.
2. A free-form app brief creates a structured blueprint.
3. Confirming the blueprint creates a working project workspace.
4. Finance, CRM, marketplace, agenda and dashboard briefs produce distinct useful previews.
5. Supported chat mutations visibly update project state and preview.
6. Files/Screens/Data/Settings reflect the same project model.
7. Projects survive reload and can be reopened.
8. Exported project JSON is valid and consistent with UI state.
9. Mobile and desktop views are both usable.
10. I30 still works and can hand a selected opportunity into V30.
11. No secret keys or arbitrary code execution are introduced.
12. Full automated suite passes.
