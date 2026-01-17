# Core Surfaces Plan · Agentflow

> **Role**: This plan is owned by **Gem**.
> **Implementer**: Max executes this plan.
> **QA**: Claude verifies this plan.
> **Log**: All work must be logged to `docs/logs/DEV_LOG.md`.

## 1. Backlog & Context

This plan covers the "ground floor" UI surfaces:
- **SEO & Tracking**: The invisible layer of events, meta tags, and PII safety.
- **Auth & Login**: The entry point (`surface-login`, `surface-signup`).
- **Connectors Hub**: The configuration center for 3rd party tools (`surface-connectors`).

All work here must adhere to the **Constitution** (Mechanical IDs, Strategy Lock, 3-Wise).

---

## 2. Active Task

*(None currently active. Move a task here to start work.)*

---

## 3. Future Tasks

### CORE-TRACKING-SEO – Baseline SEO, AEO & Event Bus

**Goal**: Implement baseline SEO, AEO-friendly markup, and internal tracking events for all public/core surfaces.
- **Scope**: Global App Shell + Public Surfaces.
- **Outcome**: A unified event bus emitting `tenantId`, `userId`, `surfaceId`, `eventName` without PII, plus semantic HTML and meta tags.

**Phase C1: Event Payload & Hooks**
- **Goal**: Define the canonical internal event payload and hooks.
- **Files**: `lib/events/EventBus.ts`, `hooks/useTracking.ts`.
- **Steps (Max / Implementer)**:
  - Define the event payload shape: `{ tenantId, userId, surfaceId, eventName, props }`.
  - Implement `trackEvent` function.
  - Implement UTM parameter extraction (store in session).
  - **Rule**: Explicitly strip PII (email, names) from event props.
  - Define standard events: `viewed`, `started`, `step_completed`, `completed`.
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Phase C2: SEO & A11y Baseline**
- **Goal**: Enforce semantic structure and meta tags.
- **Files**: `components/shell/SEOMeta.tsx`, `pages/_app.tsx` (or layout root).
- **Steps (Max / Implementer)**:
  - Create a `SEOMeta` component for `<title>`, `<meta name="description">`, and OpenGraph.
  - Audit/Refactor Signup, Login, Connectors Hub to ensure:
    - Exactly one `<h1>` per page.
    - Semantic `<main>` and `<section>` tags.
    - All inputs have `<label>` and `aria-describedby` for errors.
  - Add a comment stub for future JSON-LD injection.
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Task Completion Ritual (Max)**
When all phases are complete:
1. Move **CORE-TRACKING-SEO** to **Completed Tasks**.
2. Verify that `docs/logs/DEV_LOG.md` contains entries for each phase.

---

### CORE-AUTH-LOGIN-SURFACE – Login UI & Shared Atoms

**Goal**: Define the login surface and extract reusable input/button atoms.
- **Scope**: `/login` route + Component Library.
- **Outcome**: A semantic login page (`surface-login`) built with reusable `Input` and `Button` atoms.

**Phase L1: Login Page Structure**
- **Goal**: Scaffold the login page.
- **Files**: `pages/login.tsx`, `components/auth/LoginLayout.tsx`.
- **Steps (Max / Implementer)**:
  - Create the layout with sections for Email, Password, Forgot Password, Submit.
  - Assign Atom IDs: `atom-login-email`, `atom-login-password`, `atom-login-submit`.
  - Hook up `login_viewed` event (from Task 1).
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Phase L2: Input Field Atom**
- **Goal**: Create a reusable, grid-aware Input component.
- **Files**: `components/ui/Input.tsx`.
- **Steps (Max / Implementer)**:
  - Build `Input` component with props: `label`, `placeholder`, `helperText`, `error`, `startIcon`, `endIcon`.
  - Support grid positioning props (e.g. `colSpan`, `xOffset`) if applicable, or standard width classes.
  - Ensure it uses `<label>` and `aria-invalid` correctly.
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Phase L3: Button Atom**
- **Goal**: Create a reusable Button component.
- **Files**: `components/ui/Button.tsx`.
- **Steps (Max / Implementer)**:
  - Build `Button` component with variants: `primary`, `secondary`, `outline`, `ghost`.
  - Support `loading` state, `disabled` state, and icons.
  - Enforce a consistent `onClick` event naming convention (or auto-track clicks if feasible).
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Task Completion Ritual (Max)**
When all phases are complete:
1. Move **CORE-AUTH-LOGIN-SURFACE** to **Completed Tasks**.
2. Verify that `docs/logs/DEV_LOG.md` contains entries for each phase.

---

### CORE-CONNECTORS-HUB-UI – Connectors Hub & Detail Pages

**Goal**: Define the Connectors Hub UI and detail pages matching the backend contract.
- **Scope**: `/connectors` route.
- **Outcome**: A hub listing connectors and detail pages for configuration, with Strategy Lock stubs.

**Phase H1: Hub Layout & Atoms**
- **Goal**: Grid of connector cards.
- **Files**: `pages/connectors/index.tsx`, `components/connectors/ConnectorGrid.tsx`.
- **Steps (Max / Implementer)**:
  - Render a card for each supported connector (Shopify, GA4, Meta, etc.).
  - Card UI: Logo, Name, Status (Active/Inactive), "Connect/Edit" button.
  - Atom IDs: `atom-connectors-card-shopify`, `atom-connectors-card-ga4`.
  - Events: `connectors_viewed`, `connector_card_clicked`.
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Phase H2: Connector Detail Form Contract**
- **Goal**: Configuration forms for each connector.
- **Files**: `pages/connectors/[connector].tsx`, `components/connectors/forms/*.tsx`.
- **Steps (Max / Implementer)**:
  - Create a generic wrapper for connector settings.
  - Implement forms for key connectors (Shopify: domain/key; GA4: measurementId; etc.).
  - Wire "Save" to `POST /api/connectors/save` with payload `{ connectorName, payload }`.
  - Event: `connector_saved`.
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Phase H3: Strategy Lock & 3-Wise Stubs**
- **Goal**: Reserve UI space for safety controls.
- **Files**: `components/connectors/ConnectorSafety.tsx`.
- **Steps (Max / Implementer)**:
  - Add a "Strategy Lock Info" section (Atom: `atom-connector-strategy-lock-info`) explaining what this connector allows.
  - Add a "3-Wise Check" button (Atom: `atom-connector-3wise-check`) for "Is this safe?".
  - Stub the interactions (no-op for now).
- **Logging & Status (Max)**:
  - Append an entry to `docs/logs/DEV_LOG.md`.
  - Mark this phase as Done in this plan.

**Task Completion Ritual (Max)**
When all phases are complete:
1. Move **CORE-CONNECTORS-HUB-UI** to **Completed Tasks**.
2. Verify that `docs/logs/DEV_LOG.md` contains entries for each phase.

---

## 4. Completed Tasks

*(None yet)*
