# AUREON V30 App Builder — Design

## Objective

Transform `AUREON-I30/v30` from a video-generation interface into an AI-assisted application builder. The product relationship becomes explicit:

- **I30** discovers and validates SaaS/app opportunities.
- **V30** turns a selected opportunity or a free-form brief into a working application project.

The current video-specific concepts, controls, storyboard, rendering, social-platform configuration and download-video flow are removed from V30.

## Product Promise

The V30 must let a user describe an application in natural language, refine the brief through conversation, generate a project structure, inspect a live preview, request iterative changes, review generated files/configuration and prepare the project for publication.

Primary promise: **“Describe the app. V30 plans it, builds it, previews it and prepares it to publish.”**

## Core User Flow

1. User opens V30 and sees a project brief input instead of video settings.
2. User types a request such as: “Create a finance PWA with Google login, dashboard, debts, expenses and notifications.”
3. V30 parses the brief into a normalized app blueprint:
   - app name
   - category
   - target user
   - key features
   - screens
   - data entities
   - authentication needs
   - visual direction
   - deployment target
4. V30 shows the blueprint and allows the user to accept or edit it.
5. After confirmation, V30 generates a project shell and opens the Builder workspace.
6. Workspace presents:
   - conversational AI panel
   - live app preview
   - project/files panel
   - project status and build actions
7. User requests changes in natural language, for example:
   - “make the dashboard more futuristic”
   - “add a ranking screen”
   - “change the login to Google”
   - “add Supabase tables for users and transactions”
8. V30 applies changes to its project model and refreshes the preview.
9. User can inspect generated files and project configuration.
10. V30 offers a Publish/Export stage for GitHub/Vercel integration when a real backend/publish connector is available.

## Information Architecture

### 1. Start / Project Brief

Replaces the current hero about “30 video ideas”.

Contents:
- V30 App Builder branding
- natural-language project brief
- optional starter chips: SaaS, Dashboard, CRM, PWA, Marketplace, Internal Tool
- “Build app” primary CTA
- “Import from I30” secondary CTA
- recent projects/history

### 2. Blueprint Review

Shows the interpreted specification before generation.

Sections:
- product summary
- target user
- feature list
- screen list
- data model summary
- integrations
- visual style
- generated stack recommendation

Actions:
- Build project
- Edit blueprint
- Return to brief

### 3. Builder Workspace

Desktop-first layout with responsive fallback.

#### Left: AI Conversation

- project conversation history
- text input for change requests
- quick actions such as Add screen, Change style, Add auth, Add database
- activity/status messages

#### Center: Live Preview

- rendered application mock/live DOM preview
- desktop/mobile viewport switcher
- refresh/reset controls
- selected screen name

#### Right: Project Explorer

Tabs:
- Files
- Screens
- Data
- Settings

Files initially represent a generated in-memory project, not arbitrary execution of untrusted code.

### 4. Publish / Export

Initial implementation may expose a readiness checklist and exportable project package/model. Real GitHub/Vercel publication is added only through authenticated server-side or connector-backed integration; secrets are never embedded in frontend code.

## Visual Direction

Keep the AUREON identity but remove “video studio” metaphors.

- dark futuristic base
- premium black/graphite panels
- gold/electric accent details
- restrained glow
- high contrast typography
- desktop builder feel similar to modern AI development workspaces, without copying any specific product
- mobile remains usable through stacked panels and a bottom navigation for Chat / Preview / Project

## Application Model

V30 should not generate arbitrary executable source from free-form input entirely inside the browser in the first implementation. Instead, the frontend maintains a structured `project` model and renders safe templates from that model.

Suggested normalized shape:

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

Each screen should have a declarative component tree or safe schema so the preview can update without evaluating user-provided JavaScript.

## Generation Strategy

### Phase 1 — Functional Local Builder

Use deterministic/local generation to make the V30 interface truly functional before external AI is connected.

Capabilities:
- parse a brief with rule-based heuristics
- generate app blueprint
- create common screens from templates
- generate a coherent file tree representation
- mutate the project using supported natural-language intents
- render a live preview
- save/reopen projects in localStorage
- export project definition as JSON/text package

This replaces the current fake/random video idea engine with an app-focused project engine.

### Phase 2 — Real AI Backend

Add a secure backend endpoint that calls an LLM and returns structured output matching the project schema. API keys remain server-side.

AI responsibilities:
- interpret complex briefs
- propose architecture
- generate/refine screens
- generate source files
- explain changes
- produce migrations/configuration suggestions

### Phase 3 — Real Project Delivery

Integrate authenticated GitHub/Vercel workflows so V30 can create or update a repository, generate deployment-ready files and publish the app. Supabase integration can provision or configure database/auth separately when authorized.

## Relationship With I30

The I30 remains the opportunity engine. Its current flow is preserved:

`THEME -> 30 IDEAS -> VALIDATE -> SCORE -> BEST OPPORTUNITY -> BUILD`

The final “build” action should deep-link or hand off a normalized selected opportunity to V30.

V30 also supports independent use without I30.

## Existing Files to Replace / Refactor

Current V30 files:
- `v30/index.html`
- `v30/styles.css`
- `v30/app.js`

The current `v30/app.js` is video-specific and too large for the new responsibilities. The implementation should split behavior into focused modules where feasible while preserving GitHub Pages compatibility.

Recommended structure:

```text
v30/
  index.html
  styles.css
  app.js
  modules/
    state.js
    blueprint.js
    project-generator.js
    mutations.js
    preview.js
    storage.js
    export.js
```

No framework is required for the first functional conversion; ES modules keep deployment simple on GitHub Pages.

## Persistence

Phase 1 uses `localStorage` for:
- project list
- current project
- conversation history
- user preferences

Storage keys must be V30-specific and versioned to avoid collisions with the old video history.

Later phases may sync authenticated projects to AUREON BASE/Supabase.

## Safety and Security

- Never expose AI, GitHub, Supabase or Vercel secret keys in browser JavaScript.
- Never `eval()` generated code.
- Preview is rendered from controlled schemas/templates in Phase 1.
- External publication requires authenticated connector/server integration.
- User-provided text must be escaped before injecting into HTML.

## Error Handling

The UI must handle:
- empty brief
- unsupported mutation request
- invalid/corrupted saved project
- missing browser storage
- preview render failure
- export failure

Errors appear inside the app with actionable recovery controls rather than silent failures.

## Acceptance Criteria for the First Conversion

The first implementation is complete when:

1. No video-creation terminology or controls remain in V30.
2. User can enter a natural-language app brief.
3. V30 generates and displays a structured app blueprint.
4. User can build a project from that blueprint.
5. Builder workspace has Chat, Preview and Project Explorer.
6. At least the following app types generate visibly different useful previews: dashboard, CRM, finance, marketplace, scheduling/agenda.
7. User can request supported modifications from chat and see the preview change.
8. Screens/files/data tabs reflect the same project state.
9. Projects persist locally and can be reopened.
10. User can export the project definition/package.
11. Layout works on desktop and mobile.
12. Existing I30 continues to work independently.

## Non-Goals for the First Conversion

- No browser-side secret API keys.
- No arbitrary code execution.
- No guaranteed full production code generation from every prompt.
- No automatic database provisioning without authenticated backend integration.
- No real Vercel/GitHub publication until secure integration is wired.
- No video creation features inside V30.

## Testing Strategy

The conversion must be verified with:
- blueprint generation tests for several briefs
- project mutation tests
- local persistence tests
- manual desktop/mobile UI verification
- reload/reopen project verification
- export verification
- regression check that the parent I30 page still loads

## Product Naming

Primary UI name: **AUREON V30**
Descriptor: **AI APP BUILDER**

Recommended headline: **“Descreva. Construa. Publique.”**

Recommended supporting line: **“Transforme uma ideia em um aplicativo estruturado, visual e pronto para evoluir.”**
