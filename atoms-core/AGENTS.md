# AGENTS.md — Atoms Core (The OS)

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.


## 🗺️ Strategic Infrastructure (V2 VISION)
> **The Hierarchy**: Tenant (Org) -> Space (Context) -> Surface (Flow).
> **The 4 Spaces**: `Health`, `Marketing`, `Quantum`, `Tuning`.

*   **Space**: The Shared Nexus (Memory & Config). Multiple Surfaces share ONE Space.
*   **Surface**: The Flow Container (Not an App). It runs on a Domain (URL).
*   **Tenant**: The Billing Unit.

*   [Auth & Key Playbook (GCP/AWS)](docs/infra/NORTHSTAR_AUTH_SETUP.md)
*   [Nexus Architecture (Spaces & Domains)](docs/infra/NEXUS_ARCHITECTURE.md)

## 🎨 UI FOUNDRY (V2 STANDARD)
> **The Law**: All new Canvases must use the **V2 Contract** and **Vario Harness**.
> **The 3 Surfaces**:
> 1.  **ChatRail (Left)**: Communication & Stream.
> 2.  **TopPill (Top-Right)**: Global View/Export.
> 3.  **ToolPop (Bottom)**: Contextual "Dynamic Island" with Dual Magnifiers & Sliders.

> **Execution**: Use the `canvas-contract-builder` skill to scaffold from JSON Contract.
> **Reference**: `atoms-ui/.agent/skills/canvas-contract-builder/SKILL.md`

> **The Atoms-Fam**: "We are creating Shopify, Klaviyo, Photoshop, CapCut... all run by Agents and Humans on collaborative Canvases."

## 🔁 REALTIME GATEWAY CONTRACT (V1)
**Canonical Doc:** `docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`
**Alignment Retrofit:** `docs/plans/2026-01-28_realtime-retrofit-alignment.md`

`atoms-core` is the **single backend truth spine** for collaborative canvases:
*   **Realtime Gateway:** SSE downstream truth; WS upstream ephemeral (optional).
*   **Command Ingestion:** Typed commands only; idempotent; identity-enforced.
*   **Artifacts:** Presign uploads; emit sidecar refs (never inline media).
*   **Identity:** All routes must be tenant/mode/project/surface/app scoped.

## 🛑 THE ATOMIC MANDATE
1.  **Never Monolith**: Every concern must be its own "Atom" (Table, Component, Service, Site).
2.  **Registry First**: The DB Registry (`public.registry_entries`) is the Source of Truth.
3.  **Atomic Expansion**: One OS, many Microsites.
4.  **NO GHOST ASSETS**: All fonts/assets must be in `atoms-app` and registered in `supabase`. `agentflow` is dead to us.
5.  **Config Driven**: Use the `/dashboard/config` UI to manage resources. Do not hardcode files.
6.  **DB-First Registry**: The database is the source of truth for all registries.
    *   **Authoring**: Use the `/dashboard/config` UI (God mode) or dedicated admin APIs.
    *   **Auto-Registration**: Muscles are auto-registered from code (`atoms-muscle/src/{category}/{name}/service.py` -> DB).
    *   **Legacy**: The old file-based `atoms-registry/` directory is deprecated and quarantined (do not recreate it).
7.  **Tenant Compute First (Production)**: Interactive rendering must default to **client device CPU/GPU**. Server render only for explicit export/offline requests. **No local fallbacks** in production.

## 🏗️ CONTEXT: THE FLEET OF 7
*   **atoms-core:** The OS (Identity, Routing, Safety). **[YOU ARE HERE]**
*   **atoms-agents:** The Brain (Logic, Personas).
*   **atoms-flow:** The UI (Console).
*   **atoms-muscle:** The Power (GPU, Video). **[THE HEAVY LIFTER]**
*   **atoms-connectors:** The Tools (MCP Servers).
*   **atoms-site:** The Face (Marketing).
*   **atoms-tuning:** The Lab (Optimization).

> [!CAUTION]
> **DEPRECATION WARNING**: `northstar-engines` is deprecated. Do not write new code there. All OS logic belongs in `atoms-core`.

## Mission
This is the Operating System. High stability, zero hallucinations.

## The Stack
- **Runtime:** Python (uv)
- **Framework:** FastAPI
- **Auth:** Supabase Auth (atoms-fam-core)

## 🛑 THE LAWS
1.  **Identity is King:** All routes must pass `IdentityMiddleware`.
2.  **God Mode:** `t_system` is hardcoded in constants; do not query DB for it.
3.  **No Deep Nesting (The "Burying" Rule)**: Do not nest modules inside generic folders like `core/` or `utils/`.
    *   **BAD**: `src/core/vault`
    *   **GOOD**: `src/vault`
    *   **Mandate**: All primary modules must live at `src/{module_name}`.
4.  **No northstar imports:** `northstar-engines` is deprecated. Do not import it anywhere in new work.
5.  **Vault Only (No .env)**:
    *   **FORBIDDEN**: `.env`, `os.environ.get("KEY")`.
    *   **REQUIRED**: Use `src/vault` API.
    *   **Reason**: Cloud Agents cannot read local `.env` files. They must call the API.

## 🔐 Connector Factory Laws (Schema-First)
* **God Config Name (Locked):** `Connector Factory — God Config` (log this exact name in all layers).
* **UX Law (God Config):** Use existing config style but avoid nested cards/boxes. Flat sections with collapsible headers; mobile-first usability.
* **Firearms Only Gate:** No danger levels, risk scores, allow-lists, or parallel gating fields. Safety is **only** `requires_firearm` + `firearm_type_id`.
* **Firearms Handling (Locked):** Agents must leave `requires_firearm=false` and `firearm_type_id` empty in drafts. Only humans set firearms in the UI.
* **Draft-Only Rule:** Connector contracts remain `draft` until a human explicitly approves in the UI.
* **UTM Templates Schema (Locked):** `utm_templates` must include `template_id`, `provider_slug` (indexed), `content_type_slug`, `static_params` (jsonb), `allowed_variables` (jsonb array), `pattern_structure`, `is_approved` (default false). Builder must drop empty variables cleanly (no double underscores).
* **Metric Mappings Schema (Locked):** `metric_mappings` must exist with `mapping_id`, `provider_slug` (indexed), `raw_metric_name`, `standard_metric_slug`, `aggregation_method` (sum/avg/max), `is_approved` (default false).
* **Firearms Licenses Registry (Locked):** `firearms_licenses` registry table with `license_key` (pk), `category`, `description`. Seed initial licenses for Financial, Communication, System/Founder.
* **Core KPIs Schema (Locked):** `core_kpis.missing_components` is jsonb array of strings; `core_kpis.metadata` is jsonb (store and do not drop).
    *   **Vault Secret Mount Rule**: Secrets live in `/Users/jaynowman/northstar-keys/` and must be loaded via Vault loaders.

## 🧠 MEMORY ARCHITECTURE
> **Philosophy**: "Context is money. Don't waste it."
> **Registry**: `public.services` (Keys: `memory_whiteboard`, `memory_blackboard`).

We employ a 3-Tier Memory System to optimize for cost and context window efficiency.

### 1. The Nexus (Long-Term)
*   **Scope:** Eternal.
*   **Tech:** LanceDB (Vectors) + Supabase (Metadata).
*   **Usage:** Embeddings, RAG, "Remembering".
*   **Access:** Slow, Semantic Search.

### 2. The Whiteboard (Flow State)
*   **Scope:** Single Agent Flow execution (Run ID).
*   **Tech:** **Supabase (Postgres)**.
*   **Decision Record:** We chose Postgres over RAM because **RAM is wiped** when Cloud Run instances scale to zero. We chose Postgres over Redis to avoid adding new infrastructure.
*   **Config:** `memory_whiteboard` in `public.services`.
*   **Usage:** Shared state between all nodes in a flow.
*   **Role:** The "Consciousness" of the current task.
*   **🛑 RAM Safety Rule:** **NEVER** store blobs (Images/Video) in Whiteboard. Store them in S3, and put the **URL** in the Whiteboard. Keep JSON light.

### 3. The Blackboard (Node State)
*   **Scope:** Immediate (Node-to-Node).
*   **Tech:** JSON Packet (Direct Pass).
*   **Config:** `memory_blackboard` in `public.services`.
*   **Usage:** Direct output passed from Node A to Node B.
*   **Role:** Keeps Context Windows LOW. Only pass what the next node needs.

## 💾 MEDIA STORAGE (The Heavy Stuff)
> **Rule**: "Database rows are cheap. Video blobs are expensive."

*   **Location**: **AWS S3** (`northstar-media-dev`).
*   **Access**: Presigned URLs generated by `atoms-core`.
*   **Flow**:
    1.  Frontend requests Upload URL.
    2.  User uploads DIRECT to S3.
    3.  `atoms-muscle` downloads from S3 to process.
    4.  Visual Vectors stored in LanceDB (S3).
    5.  **NEVER** pass binary data through the API Gateway.

## 💸 INFRASTRUCTURE & COSTS
> **Reference**: [Free Tier Limits & Risk Register](docs/infra/COST_CONTROL.md)
> **Status**: `public.services` Registry.

We maintain a strict "Scale-to-Zero" policy.
*   **Risk**: Cloud Run "Runaway" scaling.
*   **Control**: `max-instances` = 1 (Dev), 10 (Prod).

## 🏋️ THE MUSCLE REGISTRY (atoms-muscle)
> **Source of Truth**: `public.muscles` table (Supabase).
> **Mechanism**: **Auto-Populated** via `sentinel.py` (Watchdog) or `sync_muscles.py`.
> **Role**: Catalog of heavy tools available for internal use AND external sale (MCP).

**Architecture Law (Muscle as Service):**
* `atoms-core` is the **library** (pure logic/models).
* `atoms-muscle` is the **runtime/service** (MCP wrappers, API routes, billing decorators).
* **Never** merge namespaces at runtime. `atoms-muscle` must import explicitly from `atoms-core`.
* **Rescue Protocol:** Port dependency logic from `northstar-engines` into `atoms-core` first. `atoms-muscle` must never import `northstar-engines`.
* **Slice Rule:** Deployment slices include the required `atoms-core` modules; muscles are not standalone without atoms-core.
* **Vault Law:** **No .env files**. Secrets must be loaded via the Vault Loader.

## 🌐 WEBSITE PRINTING PRESS (GLOBAL)
- Templates live in the monorepo at `/Users/jaynowman/dev/atoms-site-templates/`.
- Live customer sites must be **separate repos** outside `/Users/jaynowman/dev/` (e.g., `/Users/jaynowman/sites/<site>`).
- The Press pipeline (clone → repo → Pages → DNS) is the only supported path for marketing site deploys.

**For Agents (Building Muscles)**:
1.  **Start Sentinel**: `python3 atoms-muscle/scripts/sentinel.py`
2.  **Write Code**: Create `src/{category}/{name}/service.py`.
3.  **Done**: The sentinel auto-generates `SKILL.md` + `mcp.py` and registers it in Supabase.


**Usage**:
1.  **For Agents**: Query `public.muscles` to find the `mcp_endpoint` or `api_endpoint`.
2.  **For Humans**: Check `/dashboard/infra/muscles` (Coming Soon) or the Config.

**Current Inventory (Registered in DB)**:
*   `muscle_video_extract`: **Nexus Cutter**. (FFmpeg). Status: **Ready**.
*   `muscle_audio_whisper`: **Nexus Ear**. (Whisper). Status: **Ready**.
*   `muscle_vision_clip`: **Nexus Eye**. (OpenCLIP). Status: **Ready**.

**MCP Strategy (Monetization)**:
We expose these Muscles as **MCP Tools** in `atoms-connectors`.
*   External Devs hire our "Muscle" via MCP.
*   We charge for the Compute/API calls.
*   **Rule**: Never duplicate Muscle logic. Implement in `atoms-muscle`, expose via API, wrap in MCP.

## 🌍 ARCHITECTURE: SURFACES & TENANTS
> **Clarification**: "Surfaces are separate Apps running on the same OS."

*   **Tenant (User):** The human/entity logging in. (e.g., "Founder A").
*   **Surface (App):** The vertical application context (e.g., "AGNˣ" for Marketing, "=mc2" for Health).
*   **The OS (`atoms-core`):** The shared substrate handling Auth, Routing, and Safety across all Surfaces.

### 6. THE CONNECTIVITY PROTOCOL (External I/O)
Atoms-Fam is not an island. It connects to the "Real World" via strict, authorized pipes.

#### A. Email & Messaging (Resend)
*   **Infrastructure:** We use **Resend** for all email delivery (Transactional & Marketing).
*   **Tenant Isolation:** Emails must strictly obey Tenant boundaries. A Tenant cannot email another Tenant's user base without explicit cross-tenant handshake.
*   **Templating:** We use **React Email**. We do *not* write raw HTML. We compose semantic React components (`<Button>`, `<Container>`) which the system compiles to client-safe HTML.
*   **Verification:** All sender domains must be verified via DNS (DKIM/SPF) before Atoms-Fam allows a `send()` command.
*   **God Mode Access:** The `EmailService` is exposed to the God Console. Agents can inspect delivery logs, bounce rates, and configure new domains via the Supervisor Agent.

### 7. THE ONE TRUTH (Source Code)
The code on disk is the only reality.
*   If it is not in `git`, it does not exist.
*   If it is not tested, it is broken.
*   If the Types do not match, the Logic is flawed.

We do not "guess". We `read_file`. We `verify`. Then we `write`.

### The Console (`atoms-app`)
The Console is the **Launcher**.
1.  User logs in.
2.  User selects a **Surface**.
3.  The OS switches Context (Data isolation, Agent selection).
4.  User interacts with Flows/Canvases specific to that Surface.

### Registry Manifest
Surfaces are defined in the DB registry (Supabase). The Console uses DB-backed registries to render the App Switcher.

### Typography Registry (`public.font_families`)
*   **Source**: `/atoms-app/public/fonts` (Variable Fonts Only).
*   **Database**: `font_families` (Definitions) and `font_presets` (Axes/Snapshots).
*   **Management**: `/dashboard/typography` (Requires God Mode).
*   **Forbidden**: Do not use `agentflow/public/fonts`. That repo is deprecated.


## 🔐 PROTOCOL 5: THE VAULT
> **The Law**: "We do not use `.env` files. Secrets live in the Vault."

**Location**: `/Users/jaynowman/northstar-keys/` (Local Key Management).

**Naming Convention (System)**:
-   `supabase-url.txt`: The API URL.
-   `supabase-anon-key.txt`: The Public Client Key.
-   `supabase-service-key.txt`: The **God Mode** Admin Key.

**Naming Convention (Tenant)**:
-   `openai-key-{tenant_id}.txt`: Bring Your Own Key.

**Usage**:
-   Python: `read_vault("supabase-service-key.txt")`
-   Next.js: Load into process.env at build time (or runtime via Vault Loader).
-   **NEVER** commit keys to Git. The Vault is outside the repo.

## Tenant/Surface/Space Law
- Tenant is the billing unit. Snax wallets are tenant-scoped and spendable across all surfaces/spaces.
- Surface is the configuration layer for tenants. Data isolation is per-surface unless explicitly shared.
- Space is shared context across one or more surfaces; only surfaces explicitly mapped to a space share performance/nexus data.
- Do not hardcode surface names in schemas or code; treat surfaces/spaces as registry/config data.

## 🏭 MUSCLE FACTORY STANDARD (2026)
- **Path law:** muscles live in `atoms-muscle/src/{category}/{name}` (no legacy nesting).
- **Wrapper law:** every muscle must include a complete `mcp.py` (no stubs).
- **Skill law:** every muscle must include `SKILL.md` using the global template and **unique** content (no placeholders).
- **Imports:** `atoms-muscle` is runtime/service; `atoms-core` is library. Use explicit `from atoms_core.src.<domain> ...` imports only.
- **No northstar-engines.**
- **Tenant compute first:** interactive render runs on device; server CPU fallback **only** for explicit export/offline.
- **Automation steps:**
  - After creating/updating a muscle, run `python3 atoms-muscle/scripts/normalize_mcp.py`.
  - Before deploy/hand-off, run `python3 atoms-muscle/scripts/batch_prepare_deploy.py --clean-after`.
