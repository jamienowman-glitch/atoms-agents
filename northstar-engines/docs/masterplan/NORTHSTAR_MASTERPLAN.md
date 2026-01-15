# Project Northstar: The Masterplan

**Status**: Vision Definition
**Phase**: Transition from "Factory Building" to "Assembly Line Operation"

## 1. The Core Philosophy: "Factory -> Assembly -> App"

The project is structured around a repeatable manufacturing process.

### 🏭 Stage 1: The Factory (Infrastructure)
We build the machines that mass-produce components.
-   **Output**: Raw "Muscle" (Engines) and "Atoms" (UI Elements).
-   **Worker Agents**: `agents.md` defined workers who strictly follow "Blueprints" to output standardized parts.
-   **Current State**: ~90% Complete.

### ⛓️ Stage 2: The Assembly Line (Configuration)
We combine factory parts into "Flows" using **GraphLens**.
-   **Output**: "Agent Flows" (Stacked lenses of Logic, Safety, Tokens, UI).
-   **Tool**: `agentflow` (The first internal assembly app).
-   **Process**:
    1.  Select a Framework Node (e.g., AutoGen).
    2.  Apply **Lenses** (Safety, Context, Token).
    3.  Configure per **Tenant** and **Surface** (Marketing, Health, etc.).
-   **Current State**: In Progress (Wireframing).

### 📱 Stage 3: The Apps (Packaging)
We package Flows into user-facing products.
-   **Output**: "Super Apps" or "Flow Packs".
-   **Architecture**: A "Super Canvas" hosting multiple collaborative agents working in real-time.

---

## 2. The Architecture of a "Flow"

A Flow is not just a script; it is a **Graph of Nodes** wrapped in **Lenses**.

### 🧩 The Node (Atomic Unit)
-   **What is it?**: An Agent, a Framework (CrewAI/AutoGen), or another Flow.
-   **Manifest**: Defines what it specializes in.
-   **Task**: The job to be done (task.md).
-   **Firearms**: **Never at node level**. Only applied at Agent level.

### 🔍 The Lenses (The Stack)
Lenses allow us to "compose" capabilities onto a Flow without rewriting code.

1.  **GraphLens**: The base connection layer.
2.  **TokenLens**: **THE CORE**. Defines which UI controls (Tokens) are exposed to the agent.
    -   *Goal*: Move away from "God Mode" agents. Use specialized agents (e.g., Color Agent vs Copy Agent) with limited token access.
3.  **SafetyLens**: Applies "Strategy Lock" (Human-in-the-loop) and "Firearms Licenses".
4.  **ContextLens**: Personalization via **Tensor/Nexus**.
    -   *Nexus Lite*: A vector space for style/brand injection (Pinterest boards, transcripts) so agents "know" the vibe without prompt engineering.
5.  **CanvasLens**: Which canvas does this run on? (Collaborative, Presentation, etc.).
6.  **PrivacyLens**: PII stripping/rehydration (e.g., hiding "John Doe" during processing, restoring it for delivery).
7.  **LogLens**: Granular debugging. Who said what, when, and why.
8.  **3-Wise-LLM**: Risk panel for minimizing Strategy Lock (Skeptic/Advocate/Judge).
9.  **DeliveryLens**: Where does the result go? (Shopify, Slack, YouTube).

---

## 3. The "Super Canvas" & Multi-App Vision

We are not building *one* app. We are building a platform to spin up *many* apps.

-   **Collaborative Canvas**: Real-time work. Agents engage with the canvas state visible to the user.
    -   *State*: Shared state. Agent change = User sees it. User change = Agent knows it.
-   **Multi-21**: The "Super Element" grid used for high-density tool/content display.
-   **Surfaces**:
    -   **Marketing Surface**: Flows for creating content.
    -   **Health Surface**: Flows for fitness/energy.
    -   **Finance Surface**: Flows for money/budget.

---

## 4. Immediate Roadmap (The "Gap Closure")

### 🟢 Priority 1: The Super Canvas UI
1.  **Finish Multi21**: Harvest from `agentflow`, port to `atoms_factory`.
2.  **Tool Surfaces**: Finalize the "Chat Rail" and "Floating Toolbar" (Mobile/Desktop standards).
3.  **Chat Integration**: Get the Chat Rail working on the first Collaborative Canvas.

### 🟡 Priority 2: The Agent Assembly Line
1.  **Token Production Line**: Use `atoms_factory` to mass-produce atoms that expose the correct Tokens for the Super Canvas.
2.  **Connector Production Line**: Build connectors that expose scopes with optional "Firearms" flags.

### 🔴 Priority 3: The First Flow
1.  **Test Run**: Connect a simple agent to the Canvas.
2.  **Live State**: Verify the user interacts -> Agent sees it loop.

---

## 5. Technical Decisions (From Deep Dives)
-   **Repo Structure**: `northstar-engines` (Muscle), `northstar-agents` (Brain), `ui` (Hub).
-   **Tech Debt**: Flatten `northstar-engines` nest. Delete `aidtom_family` and `squared-agents-shell`.
-   **Migration**: Move `agentflow` code to `ui` and `atoms_factory`, then archive `agentflow`.
