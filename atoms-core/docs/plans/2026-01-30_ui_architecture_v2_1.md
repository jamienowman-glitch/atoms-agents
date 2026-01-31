# Tech Spec: UI Architecture v2.1 (The Fleet & The Factory)

**Status**: FINAL DRAFT (V4)
**Architect**: Antigravity (on behalf of User)

## 1. Executive Vision
We are deploying **The Fleet** (Hundreds of Specialized Canvases).
These Canvases are the *prerequisites* for the **Atom Factory** (The Meta-Canvas).
**The Universal Rig** (`VarioHarness`) runs them all.

## 2. The Architecture

### A. The Universal Rig (`VarioHarness`)
*   **Role**: The Operating System Shell.
*   **Components**: TopPill (Nav), ChatRail (Comms), ToolPop (Contextual), ToolPill (Global Add).
*   **Context**: Injects `SpaceProvider` and `TenantProvider`.

### B. The Engine Backing (Muscles)
*   User explicitly mapped families to `atoms-muscle` logic (Video, CAD, Audio).
*   **Legacy**: `northstar-engines` holds `bot_better_know` (Slooshy Logic).

## 3. The File Tree (The Fleet)
**Constraint**: Do NOT nest deeply. Keep families distinct.

```text
atoms-ui/
├── harnesses/
│   └── vario/                # The Universal Rig
│       ├── VarioHarness.tsx
│       └── contexts/
├── canvases/
│   ├── spatial/              # "The World" (Immersive)
│   │   ├── haze/             # Planet Explorer
│   │   └── maybes/           # City Note Taker
│   ├── bi/                   # "The Brain" (Strategic)
│   │   ├── co-founder/       # Strategic Chat + Bento Feed
│   │   └── active-bi/        # Classic KPI Monitor
│   ├── ops/                  # "The Hands" (Operational)
│   │   ├── tandd/            # Transport & Delivery
│   │   └── feeds/            # Feed Manager Board
│   ├── task-force/           # "The Studio" (Creative Suite)
│   │   ├── stigma/           # Figma-style Web Builder
│   │   ├── fume/             # Photoshop-style Image Editor
│   │   ├── zonk/             # Illustrator-style Vector Tool
│   │   ├── lbu/              # InDesign-style Print Tool
│   │   └── ten-fooot/        # Affinity-style Branding Tool
│   ├── viddy/                # "The Cinema" (Video Suite)
│   │   ├── aftertime/        # CapCut-style Editor
│   │   ├── after21/          # Web Animation Editor
│   │   ├── nous2/            # Gen-Image Studio
│   │   └── vous2/            # Gen-Video Studio
│   ├── slooshy/              # "The Microphone" (Audio Suite)
│   │   └── bot-better-know/  # Podcast/Audio Intelligence Canvas
│   ├── bska/                 # "The Site" (Construction Suite)
│   │   ├── mynx/             # CAD Ingestion & BOQ
│   │   └── cnt/              # Gantt Planning
│   └── multi21/              # "The Builders" (Functional)
│       ├── web/              # Website Builder (Multi²¹-WEB)
│       ├── seb/              # DM/Flow Builder (Multi²¹-SEB)
│       ├── red/              # Email Builder (Multi²¹-RED)
│       └── deck/             # Presentation Builder (Multi²¹-DECK)
└── ui-atoms/                 # Shared Primitives
```

## 4. The Atom Factory (Meta-Architecture Law)
**Status**: NORTHSTAR VISION
**Goal**: The Assembly Line where Canvases are stitched into AgentFlows.

### 1. The Base Layer: The Agent Flow (The Logic)
This is the "Master Graph." This is what you build first.
 * **What it represents**: Pure LangGraph logic (Nodes, Edges, State).
 * **Visuals**: Standard nodes (Agents, Tools) and wires.
 * **Headless Capability**: If you build a flow here and never touch the other Lenses, it runs purely as a backend automation or a "SaaS" process with no UI.
 * **The "Agent Card" (Inspector)**: When you click a node here, you configure the Model, System Prompt, and Tools. Nothing else.

### 2. The GraphLenses (The Overlays)
You do not build "Stage Containers." You build the Graph, and then you switch GraphLens to map experiences to that Graph.
When you toggle a GraphLens in the UI, the Graph visually transforms. The nodes stay in the same X/Y position, but their appearance and connectors change to reflect that specific view.

#### A. The Canvas Lens (UI Layer)
 * **The Action**: You switch the builder to "Canvas GraphLens."
 * **The Visual**: Most nodes fade out. Only the nodes that trigger a UI change stay active.
 * **The Interaction**: You don't drag agents; you drag Canvas States (e.g., Planning Canvas, Builder Canvas) and "pin" them to specific nodes in the Agent Flow.
 * **Meaning**: "When the Logic reaches [Node A], the User Screen triggers [Planning Canvas]."

#### B. The Chat Lens (Interaction Layer)
 * **The Action**: You switch to "Chat GraphLens."
 * **The Visual**: The nodes show the AgentFax configuration.
 * **The Interaction**: You set the "Voice" for that moment.
   * Node A (Kickoff): You pin a "Consultant" persona.
   * Node B (Background Processing): You pin a "Silent/Hidden" status.
   * Node C (Presentation): You pin the "Recap" hidden prompt.

#### C. The Safety Lens (Strategy Lock)
 * **The Action**: You switch to "Safety GraphLens."
 * **The Visual**: The graph highlights Critical Junctions.
 * **The Interaction**: This is where you drag and drop the Strategy Lock component onto a specific wire or node.
   * **Manual Mode**: Forces a HITL "Approve" button on the user's screen.
   * **Auto Mode**: Replaces the HITL with the Tribunal (3-LLM Jury).
   * **Visualizing the Tribunal**: In this Lens, the Strategy Lock expands to show the 3 voters (Cold/Neutral/Safety).

#### D. The Token Lens (Data & Surface Layer)
 * **The Action**: You switch to "Token GraphLens."
 * **The Context**: This Lens reacts to the Canvas you selected in the Canvas Lens. It exposes the UI Tool Harness available for that specific canvas (mapping to the tool surfaces/controls you have designed).
 * **The Visual**:
   * **The Token Palette (Left Side)**: A floating palette of colored "Poker Chips" or "Tags" representing data categories.
     * 🔵 Blue Tokens: Layout/CSS Controls (e.g., Margins, Colors).
     * 🟢 Green Tokens: Copy Body (e.g., Paragraphs, Descriptions).
     * 🟣 Pink Tokens: Copy Taglines (e.g., Headers, CTAs).
   * **The Node Surface**: The Agent Node expands to show "Sockets" corresponding to your UI Harness controls (e.g., Mobile Sliders, Text Fields, Image Containers).
 * **The Interaction**: You drag a specific colored Token from the palette to a specific Agent.
   * Example: You drag a Pink Token (Tagline) to "Agent A" and a Green Token (Body) to "Agent B."
 * **Meaning**: You are visually assigning granular responsibility. "Agent A is strictly responsible for updating the Header Text Slider. Agent B is strictly responsible for the Body Text Block."
 * **The Usage**: This maps directly to what the end-user sees. If they move a slider in the UI, it updates the variable tied to the Blue Token, which flows back to the Agent.

#### E. Future Lens Expansion (The Open Protocol)
**Note**: This list is **NOT EXHAUSTIVE**. The GraphLens architecture is designed to support any future interface that maps to the Base Graph.
*   **3D Lens**: Spatial visualization of the graph nodes.
*   **Humanoid Lens**: Mapping graph nodes to physical robot actions/expressions.
*   **BCI Lens**: Brain-Computer Interface controls.
*   **HID Lens**: Custom Hardware Interface Device mappings.

### 3. How this solves the "Complex Behaviors"
**The "Refinement Loop" (Planning -> Feedback -> Update):**
 * **In the Agent Flow (Base)**: It is a cyclic graph. Node A (Draft) -> Node B (Critique) -> Router -> Back to A or forward to C.
 * **In the Canvas Lens**: Node A and Node B are both pinned to the same "Planning Canvas." The user doesn't see the screen flash; they just see the content update.
 * **In the Chat Lens**: Node B is set to "Feedback Mode" (Asking "What do you want to change?").

**The "Strategy Lock" (The Gate):**
 * It is not a container. It is a Modifier applied in the Safety Lens.
 * If the user runs the flow in "SaaS Mode" (Headless), the Strategy Lock defaults to the Tribunal (Auto) setting defined in that Lens.
 * If the user runs in "Interactive Mode," the Strategy Lock triggers the UI approval modal.

### 4. Summary of the Corrected Builder UI
 * **Main Workspace (Mobile First)**: An infinite grid displaying the Agent Flow.
   * **On Mobile**: The graph flows Vertically (Top-to-Bottom) to optimize for one-handed thumb use.
   * **On Desktop**: The graph flows Horizontally (Left-to-Right).
   * Regardless of device, the logic and connections remain identical; only the orientation shifts.
 * **The GraphLens Carousel (The Circular Navigation)**:
   * Instead of a static menu, the Lenses exist as stacked layers in a circular carousel.
   * **Mobile Interaction**: You Swipe Left or Right to rotate through the Lenses.
   * **The Circular Loop**: The navigation is infinite. If you swipe past "Safety," it loops back to "Logic."
   * **The Indicator**: A centralized "Dot" or "Label" indicator at the bottom shows exactly which GraphLens you are currently viewing (e.g., Dot 3 of 5).
 * **The "Ghost" Effect**:
   * When in a specific GraphLens, unrelated graph elements become semi-transparent so you can focus on that specific layer (e.g., in Canvas Lens, you don't care about the internal reasoning of a background agent, so that detail is hidden).
   * **Carousel Depth**: As you swipe between Lenses, the "Ghost" of the layers sitting underneath remains visible in the background. This provides context, ensuring the user always feels the connection between the Base Logic and the current Overlay.

## 5. Atomic Task Plan (For Vario Agent)

### Phase 1: The Vario Foundation
*   [ ] **Create**: `harnesses/vario/VarioHarness.tsx`.
*   [ ] **Context**: Ensure `SpaceProvider` is the root.

### Phase 2: Family Migration
*   [ ] **Move**: `canvases/haze` -> `canvases/spatial/haze`.
*   [ ] **Move**: `canvases/maybes` -> `canvases/spatial/maybes`.

### Phase 3: Family Scaffolding
*   [ ] **Scaffold**: `canvases/task-force/` (5 sub-folders).
*   [ ] **Scaffold**: `canvases/viddy/` (4 sub-folders).
*   [ ] **Scaffold**: `canvases/multi21/` (4 sub-folders).
*   [ ] **Scaffold**: `canvases/slooshy/` (1 sub-folder).
*   [ ] **Scaffold**: `canvases/bska/` (2 sub-folders).
