# Building Agent Flows

Agentflow is the wireframe builder canvas that pulls everything together as singular, focused atomic graphlens. It maps different features onto the same sets of nodes, occupied by agents or frameworks. We will atomically connect:
- agents as nodes
- agent frameworks as nodes
- other agentflow graphs nested as nodes (hyperflows)

The product is many flows and hyperflows.

---

## Base Graph
The base graph is where you choose the agent. It is critical that each stays atomic so each thing can load and mix per individual agent.

### Agent-Level Definitions
- Manifest: what they specialize in.
- Persona: their human name and how they communicate to the tenant.
- Firearms license: only issued at agent level, never at node level and never at connector scopes.

### Connector Scopes
- Only here do we denote whether a firearms license is required, and which type.

### Node-Level Definitions (Agent or Framework)
- Task: what the node must complete, including floors/ceilings (e.g., debate rounds).
- Artefact: the document/output passed to the next agents. Separate from persona. Assets are delivered to the tenant/public platform.

---

## Frameworks
Frameworks (e.g., CrewAI, AutoGen) must be loadable atomically and remain open-ended so we can build a production line of factory agents to add more frameworks.

Each framework:
- must define a set of modes (e.g., debate, round-robin).
- must expose selectable modes individually.
- must expose tokens to agents who run the assembly line.
- must define required roles per framework.

---

## Blackboard vs Shared State
- Blackboard: strictly a scratch pad for agents/frameworks to read/write artefacts. It is not shared state for the entire graph.
- Shared state: a separate feature for the entire graph.

---

## Lenses

### Safetylens
- Define whether a node needs strategy lock (HIT).
- Group strategy locks into categories so tenants can choose which locks apply to which actions.

### 6-core-kpi
- Applies to nodes or the graph.
- Defines floors and ceilings for KPI targets.
- Each run adjusts toward KPI targets, learns from results, and updates future runs.

### Budgets
- May represent money, time, or max per week.
- Always set floors and ceilings.

### 3-wise-LLM
- Risk panel: run risky actions through three providers.
- Includes a predisposed skeptic and a cold caller.
- Uses current risk appetite guidelines.

### Contextlens
- Ensures outputs are personalized to the business and style.
- No brand guidelines; use Nexus (not Vertex).
- Nexus is per-tenant and globally updated (trends/best practices from t_system).
- Vector space populated by tenant sources (Pinterest, YouTube playlists, podcasts).
- Used for style, color, and KPI data.
- Enables RAG agents to pull data without predefined fields.
- Context can also be runtime web search or connector calls.

### Canvaslens
- Determines which canvas to show to the tenant.
- Multiple canvases: some collaborative, some “passenger”/viewer (presentation style).

### Tokenlens
- Core control surface.
- Each canvas exposes a set of tokens to humans via tools, toolbars, apps.
- Move away from a single god agent; instead expose tokens per node/agent within a framework.
- Agents are specialized (color, copy, layout, etc.).
- A creative vision agent may have no tokens; other agents translate the vision into canvas actions.
- Canvases are real-time for agents and humans; show work in motion.
- State is always synced between agents and humans.
- Changes are saved step-by-step; undo should support multiple steps.

### Privacylens
- Per node, define whether PII must be stripped.
- PII must be rehydrated on the way back to the client.

### Deliverylens
- Choose delivery destinations (Shopify, YouTube, Slack, email, in-app, etc.).
- Store assets in Nexus when required.
- Define formats per destination (HTML-only vs platform-native sections).

### Loglens
- Logging for each run: who did what, when.
- Separate views for t_system vs tenant.
- Track which agent consumed which data, and which agent wrote to which agent.
- Provide per-agent timelines to view sequencing and dependency timing.

### Subscriptionlens
- Gate features or limits per subscription level.
- Finalize mechanics later.
