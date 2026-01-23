# Plan 04: Agentflow Wireframe Prep

**Phase**: Parallel Track - "Agentflow Wireframe Prep"
**Target**: `agentflow` (Frontend)
**Status**: APPROVED

## 1. The Objective
Prepare the `agentflow` UI to serve as the "Wireframe Builder" for the Northstar Agent Factory.
We must adhere to the **Dual Magnifier** interaction model and support the **Geometry Engine** for responsive layouts (Mobile Vertical / Desktop Horizontal).

## 2. Component Reconnaissance
**Current Status:**
- `Workbench.tsx`: Orchestrates the `Cartridge` and `Lens` state.
- `GraphLens.tsx`: Implements the visual graph. Currently uses simple `flex-col` for mobile and pan/zoom for desktop.
- `DualMagnifier.tsx`: Implements the interaction wheel (Left=Mode, Right=Tool).
- `ConsoleContext.tsx`: Robust SSE listener for real-time state.

**Gaps:**
- **Geometry Flip**: Mobile logic is simplistic (just a stack). Needs true "Axis Flip".
- **Lens Carousel**: Mobile needs horizontal swipe navigation for Lenses.
- **Registry Pickers**: No UI for selecting Frameworks/Agents/Models from `northstar-agents`.
- **Collaborative Wiring**: `GraphLens` interactions are local-only.
- **Persistence**: No way to save/load work.

## 3. Task 1: The Geometry Engine (Axis Flip)
We must implement a layout engine that flips the main axis based on device capability.

**CSS/Layout Strategy:**
- **Desktop (`flex-row`)**:
    - **Main Axis (X)**: Infinite Canvas (GraphLens).
    - **Cross Axis (Y)**: Stacked Inspectors (ContextLens, TokenLens).
- **Mobile (`flex-col`)**:
    - **Main Axis (Y)**: Infinite Scroll (GraphLens Nodes).
    - **Lens Interaction**: The "Lenses" (Graph vs Context vs Safety) become full-screen slides in a horizontal carousel.

**Implementation Plan:**
1.  Modify `WorkbenchShell` to accept `deviceMode`.
2.  In `GraphLens.tsx`, formalize the `deviceMode` prop:
    - `desktop`: Retain current SVG/Div pan-zoom.
    - `mobile`: Implement `framer-motion` layout where Nodes are cards in a vertical list.

## 4. Task 2: The Registry Pickers (Atomic Selectors)
We need "Atomic Pickers" to populate the Graph. These will replace the hardcoded toolbar in `GraphLens`.

**Components to Build:**
1.  `AtomPicker<T>`: Generic dropdown/modal trigger.
2.  `FrameworkPicker`: Selects `crewai`, `autogen`, `langgraph`.
3.  `AgentPicker`: Selects `brand_writer_v1`, etc. (loaded from Registry API).
4.  `CapabilityPicker`: Multi-select for `web_search`, `code_exec`.

**Registry API Integration:**
- Create `services/RegistryService.ts` in `agentflow`.
- Endpoints (mocked or real):
    - `GET /api/registry/frameworks`
    - `GET /api/registry/agents`
- Components will use `swr` or `react-query` to fetch these lists.

## 5. Task 3: The Lens Carousel (Mobile Navigation)
On mobile, we cannot show the Graph and the Inspector side-by-side.
We will use the **Dual Magnifier** as the navigation controller.

**Interaction Model:**
- **Left Magnifier (Selector)**: Scrolls through Nodes (Vertical).
- **Right Magnifier (Lens)**: Switches View Mode (Horizontal Carousel).
    - Mode 1: **Graph** (The Node List).
    - Mode 2: **Context** (The Data/Prompt View).
    - Mode 3: **Tokens** (The Safety/Cost View).

**Implementation:**
- Use a "Snap Scroll" container for the horizontal views.
- Sync `DualMagnifier` state (`activeTool`) to the scroll position.
- If User swipes left, update `DualMagnifier` to "Context".

## 6. Task 4: Collaborative Wiring (ConsoleContext)
The Canvas must be "Live".

**Strategy:**
1.  **Read**: `ConsoleContext` already listens to SSE. We need to map `run_event` to Graph updates (e.g., Node color change on execution).
2.  **Write**: Create `useGraphTransport` hook.
    - `addNode(node)` -> `POST /api/cmd/node/add`
    - `connectEdge(source, target)` -> `POST /api/cmd/edge/connect`
3.  **Optimistic UI**: Update local state immediately, revert if SSE doesn't confirm within X seconds.

## 7. Task 5: Flow Persistence (Save/Load)
Users must be able to persist their wireframes. We will use a local `.agentflow` JSON file format.

### 7.1 The Schema (v0.1)
```typescript
interface AgentFlowFile {
  version: "0.1";
  meta: {
    name: string;
    created_at: string; // ISO Date
    updated_at: string;
    author_id?: string;
  };
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  lenses: {
     // Optional: save state of specific lenses (e.g. open tabs)
     active_lens?: string;
  };
}
```

### 7.2 UI Requirements
1.  **Export (Download)**:
    - Add "Save / Export" button to `WorkbenchHeader` (or ToolPill secondary action).
    - Action: Serialize current `flow` state -> `Blob` -> Trigger Download (`my-flow.agentflow`).
2.  **Import (Upload)**:
    - Add "Load Flow" button/modal on `Workbench` startup (empty state).
    - Action: File Input -> Parse JSON -> Validate Version -> `setFlow(loadedFlow)`.

## 8. Execution Order
1.  **Scaffold Registry Service**: Define the types and mock clients.
2.  **Build Persistence Layer**: Implement `useFlowPersistence` hook (Task 5).
3.  **Build Atomic Pickers**: Create the UI components in `components/registry/`.
4.  **Upgrade GraphLens**: Implement the specific Mobile/Desktop distinct rendering paths (Task 1 & 3).
5.  **Wire ConsoleContext**: Connect the "FIRE" button in `GraphLens` to the Transport layer.
