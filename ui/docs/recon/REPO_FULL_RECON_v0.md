# REPO FULL RECON v0

## 0) Repo snapshot metadata
- **Repo Name**: `ui` (northstar-ui)
- **Branch**: `chat-rail-recon`
- **Commit**: `33cec661c735fe0f0c7690f9cf23a81de9339871`
- **Generated via**: `find . -maxdepth 4` and manual inspection.

## 1) Full file tree (FULL DEPTH)
See Appendix A for full tree.

## 2) “What canvases exist right now?”
Only one major canvas surface exists.

### **Main Canvas (Studio)**
- **Name**: "Studio" / "Canvas Preview"
- **Route**: `/` (Main App)
- **Mount Point**: `apps/studio/src/App.tsx` (renders `<CanvasFrame><CanvasView .../></CanvasFrame>`)
- **Core Component Files**:
    - `packages/canvas-kernel/src/index.ts` (State logic)
    - `packages/projections/src/index.tsx` (Visuals)
    - `apps/studio/src/components/CanvasFrame.tsx` (Container)
- **State Model**: `CanvasKernel` (Optimistic + Committed state). Uses `CanvasState` from `canvas-kernel`.
- **Collaborations Hooks**:
    - `packages/transport` handles `EventSource` (SSE) and `WebSocket`.
    - `App.tsx` initializes `CanvasTransport`.
- **Atomic Canvas?**: **YES**. It is decoupled from the app shell (`CanvasView` takes state props).

## 3) “Builder” existence + what it’s called
Yes, a "Builder" exists. It is referred to as **"Northstar Builder"** in the UI and code.

- **Layout/Styling**:
    - `packages/builder-layout`
    - `apps/studio/src/components/CanvasFrame.tsx`
- **Section/Block List UI**:
    - `packages/builder-layout/src/Sidebar.tsx` (Left Sidebar)
- **Canvas Area UI**:
    - `apps/studio/src/App.tsx` (Central area)
- **Inspector/Settings UI**:
    - `packages/builder-inspector/src/index.tsx` (Right Sidebar)
- **Mobile Sidebar Visibility**:
    - Controlled by CSS media query in `apps/studio/src/App.tsx`: `.desktop-only-panel { display: none !important; }` on screens < 768px.

## 4) UI elements (atoms) that can be inserted/moved on a canvas

| Element Name | Kind (ID) | File Paths | Insertion | Token Usage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Section** | `hero-section` | `packages/builder-layout/src/components.tsx` | Sidebar | Unknown | KEEP |
| **Text Section** | `text-section` | `packages/builder-layout/src/components.tsx` | Sidebar | Unknown | KEEP |
| **Feed ([DELETED])** | `multi21-feed-block` | `[DELETED]` | Toolpill | - | **DELETE** |
| **Media Block** | `media-block` | `packages/ui-atoms/src/components/MediaBlock.tsx` | Toolpill | `src`, `filters.brightness` | KEEP |
| **Guides Block** | `guides-block` | `packages/ui-atoms/src/components/GuidesBlock.tsx` | Toolpill | `layout.mode` | KEEP |
| **Vector Block** | `vector-block` | `packages/ui-atoms/src/components/VectorBlock.tsx` | Toolpill | `path.d` | KEEP |
| **Button Block** | `button-block` | `packages/ui-atoms/src/components/ButtonBlock.tsx` | Toolpill | `content.label`, `action.href` | KEEP |
| **Text Block** | `text-block` | `packages/ui-atoms/src/components/TextBlock.tsx` | Toolpill | `content.text`, `style.typography` | KEEP |

**Notes:**
- `Multi21` is explicitly marked for deletion.
- `Multi21Controls.tsx` contains the "bad" slider implementations.

## 5) Chat surfaces inventory (DO NOT MODIFY)

### **ChatRail**
- **Location**: `apps/studio/src/components/ChatRail/ChatRail.tsx`
- **Mount Point**: `apps/studio/src/App.tsx` (Omnipresent overlay)
- **Icons**: `apps/studio/src/components/ChatRail/icons.tsx`
- **Messages**: Local React state (`useState<Message[]>`). Not currently persisted or connected to a real store.
- **Transports**: None active. Uses `setTimeout` mock replies.

## 6) Tooling surfaces inventory (Toolpill / Toolpop)

### **Toolpill**
- **Location**: `apps/studio/src/components/Toolpill/Toolpill.tsx`
- **Mount**: `apps/studio/src/App.tsx` (Z-indexed overlay)
- **Renders**: Draggable pill that expands into a grid of insertable items.
- **Data Source**: `catalog.insertables` from `CatalogClient`.

### **Toolpop**
- **Location**: `apps/studio/src/components/Toolpop/Toolpop.tsx`
- **Mount**: Inside `ChatRail`'s Drawer (`ChatRail.tsx`).
- **Decider**: Checks `catalog.manifests` for `selectedAtomKind`.
- **Fallback**: Contains an **EMERGENCY SHIM** (lines 38-52) that hardcodes manifests for `[DELETED]` if missing from catalog.

### **Tool Drawer**
- **Location**: Inside `ChatRail.tsx` (lines 116-139).
- **Behavior**: Overlays the rail when opened.

### **Registry/Catalog Usage**
- **Live Endpoint**: `vibes-engine` (env `VITE_ENGINES_BASE_URL`).
- **Client**: `packages/agent-driver/src/catalog.ts` (`CatalogClient`).
- **Mocks**: `CatalogClient` has a `getMockCatalog` fallback (lines 66-138) used when fetch fails.

## 7) Registries + tokens (UI side)

### **7A) Token Usage Map**
- **Agent Driver**: `packages/agent-driver/src/index.ts` defines `set_token` action.
- **Toolpop**: `apps/studio/src/components/Toolpop/Toolpop.tsx` calls `onUpdateToken` (mapped to `handleUpdateProperty` in App).
- **Multi21 Controls**: `packages/ui-atoms/src/components/Multi21/Multi21Controls.tsx` calls `onUpdate` with hardcoded keys:
    - `tile.cols_desktop`
    - `tile.cols_mobile`
    - `tile.variant`
- **Compliance Check**:
    - `Toolpop.tsx` **invents tokens** in its shim (`tile.gap`, `source.kind`).
    - `Multi21Controls.tsx` hardcodes token keys that may or may not exist in the contract.

### **7B) Registry Usage Map**
- **System 1 (Agent Driver)**: `CatalogClient` fetching from `/ui/catalog`. Used by Toolpill/Toolpop.
- **System 2 (Builder Registry)**: `packages/builder-registry/src/models.ts` exports `SCHEMAS` constant. Used by `Sidebar` (legacy) and `Inspector`.
- **Status**: **DUPLICATE SYSTEMS**. `Sidebar`/`Inspector` use `builder-registry`. `Toolpill`/`Toolpop` use `agent-driver`.

## 8) Safety / logging / events / infra / memory / agent flows

- **Safety UI**: `apps/studio/src/App.tsx` (lines 108-125). Displays `lastSafetyDecision`.
- **Logging/Event Stream**:
    - `packages/transport` implements `EventSource`/`WebSocket`.
    - `packages/contracts` defines `StreamEvent` types (including `SafetyDecisionEvent`).
- **Agent Flows**:
    - `packages/agent-driver/src/index.ts`: `runScriptedAgent` executes `AgentPlan`.
    - `apps/studio/src/components/Inspector.tsx` uses `runScriptedAgent` to simulate typing.
- **Infra Clients**: `CatalogClient` in `agent-driver`.

## 9) Delete-candidate list (STRICT)

### **9A) DELETE: Multi-21**
- `packages/ui-atoms/src/components/Multi21/` (Entire Directory)
- `packages/ui-atoms/src/components/Multi21FeedBlock.tsx`
- **References**:
    - `packages/ui-atoms/src/index.tsx` (Imports & Exports)
    - `apps/studio/src/components/Toolpop/Toolpop.tsx` (Shim logic)
    - `packages/agent-driver/src/catalog.ts` (Mock data)

### **9B) DELETE: slider tooling**
- `packages/ui-atoms/src/components/Multi21/Multi21Controls.tsx` (The specific "bad" implementation)

### **9C) KEEP: ChatRail / Toolpill / Toolpop / Canvas**
- `apps/studio/src/components/ChatRail/ChatRail.tsx`
- `apps/studio/src/components/Toolpill/Toolpill.tsx`
- `apps/studio/src/components/Toolpop/Toolpop.tsx`
- `apps/studio/src/components/CanvasFrame.tsx`
- `packages/canvas-kernel/`
- `packages/projections/`

## 10) Token contract compliance check (factual)

- **Invented Tokens**: `Toolpop.tsx` shim (removed) used to invent tokens.
- **Non-contract State**: `Multi21FeedBlock.tsx` manages `items` state locally via `useState` (simulated fetch), not via tokens/props initially.
- **Missing Schemas**: The `Inspector` relies on `builder-registry` `SCHEMAS`. If an atom is in `agent-driver` catalog but NOT in `builder-registry`, it shows "No settings available".

---

## Appendix A: File Tree (Summarized)

```
apps/
  studio/
    src/
      App.tsx (Main Mount)
      components/
        CanvasFrame.tsx
        ChatRail/ (KEEP)
        Toolpill/ (KEEP)
        Toolpop/ (KEEP)
packages/
  agent-driver/ (CatalogClient, AgentDriver)
  builder-copy/ (Atoms: Headline, Text, Button)
  builder-core/ (Hooks: useBuilder)
  builder-inspector/ (Inspector UI)
  builder-layout/ (Sidebar, Section Atoms)
  builder-registry/ (Duplicate Registry: SCHEMAS)
  canvas-kernel/ (State Management)
  contracts/ (Shared Types)
  projections/ (CanvasView)
  transport/ (SSE/WS)
  ui-atoms/ (P0 Atoms + Multi21)
    src/
      components/
        Multi21/ (DELETE)
        Multi21FeedBlock.tsx (DELETE)
        ... (Other Atoms: KEEP)
```
