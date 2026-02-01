The Full Recon Inventory (No Collapsing)
• **AWS**: `boto3` client used heavily. Services: `Secrets Manager` (Vault backup), `Bedrock Runtime` (Model Inference), `STS` (Auth), `S3` (Media Storage).
• **NEXUS**: Uses `LanceDB` (Development) and AWS S3 for storage. Embeddings generated via `Mistral` (Text) and `OpenCLIP` (Image).
• **NEXUS Ingest**: `media_v2` Service (in `atoms-core` & `atoms-muscle`). It uploads to S3 and registers assets in Postgres.
• **Open Source**: `atoms-core` (Pydantic), `atoms-ui` (React/Tailwind), `atoms-muscle` (FastAPI/MCP), `LanceDB`.
• **RAG search as a service**: `search_assistant` muscle (`atoms-muscle/knowledge/search_assistant`). Performs semantic search on Nexus memory.
• **Logging/eval/debugging (EVENT_2)**: `EventSpineService`. A singleton routing backbone found in `atoms-core`. Connects to Redis (planned) or usually in-memory/Postgres for now.
• **Logging usage**: Consumers use `EventSpineService.emit_event()`. Used by `atoms-connectors` (YouTube) and `atoms-agents` (Run tracking).
• **MEDIA_V2**: The "Thin MCP Wrapper" over S3 + Postgres. Located in `atoms-muscle/src/media/media_v2`. Handles upload & registration.
• **Tenant Security**: `Supabase Auth` (GoTrue). Used extensively in `atoms-app` (`supabase.auth.getUser()`).
• **Tenant Security Location**: `atoms-app/src/app` (Middleware & Client Side checks).
• **Email Verification**: Supabase Auth (built-in flow).
• **Heavy Media Files**: **AWS S3**. Path structure: `tenants/{tenant_id}/{env}/media_v2/{asset_id}/`.
• **t_system / God Mode**: Log in via Supabase Auth. Access `/_flat_config/god_...` pages. Protected by `is_super_admin` checks.
• **SNAX**: Logged in `public.snax_ledger` (Postgres table).
• **SNAX Ledger**: A Postgres Table (`public.snax_ledger`) with RLS. Tracks Wallet ID, Tenant ID, Delta, Reason.
• **Domain Names**: No automated registrar found in code. Likely **Manual** (via Vercel/Cloudflare dashboard) or passed through Config.
• **Hosting**: `atoms-app` (Vercel), `atoms-muscle` (Oracle/Fly/Docker), `atoms-site-templates` (Cloudflare Pages).
• **Real-time SSE + WS**: `EventSpine` acts as the logical layer. Physical transport is likely Supabase Realtime (Postgres Changes) or a custom FastAPI WebSocket in `atoms-muscle` for high-freq data.
• **Real-time Transport**: `atoms-core` emits events -> `EventSpine` -> UI listens via `useTransport` hook (SSE for truth, WS for ephemeral gestures).
• **Agent State Awareness**: via **Blackboard** (Edge-Scoped context) and **Whiteboard** (Global Flow context).
• **Media Consumption**: Agents receive `media_v2` URIs (s3 references). They don't download bytes; they pass URIs to Muscles.
• **Media Transmission**: TTS/STT muscles (e.g., `audio_capture_normalize`) upload to `media_v2` and return a URI to the Agent.
• **FEEDS (Broadcast)**: Yes, `atoms-connectors` has a `YouTube` feed engine.
• **FEEDS (Content)**: YouTube Videos, Products (Shopify - inferred), System Events.
• **FEEDS (Population)**: System-level "Feed Engines" generate items. `EventSpine` distributes them.
• **FEEDS (Creation)**: Tenants configure Connectors (e.g. YouTube Channel ID) which spin up Feed Engines.
• **HAZE**: **Planetary Explorer Canvas** (`atoms-ui/canvases/haze`). First-person 3D navigation. Backend: `video_planet_*` muscles.
• **MAYBES**: **Note-Taking City Canvas** (`atoms-ui/canvases/maybes`). Text/Voice/Camera nodes. Backend: `maybes` service (Supabase + S3).
• **WHITEBOARD**: **Global Context**. Shared across the entire Agent Run. Persists for the lifecycle of the flow.
• **BLACKBOARD**: **Local Context**. Scoped to the **Edge** (Connection between two nodes). Handover memory.
• **WHITEBOARD/BLACKBOARD Infra**: `atoms-agents` Memory Gateway. Backed by `Redis` (Hot) or `Postgres` (Cold).
• **Model Providers**: **AWS Bedrock** (Anthropic), **OpenAI** (via LiteLLM/Proxy), **Mistral** (Embeddings).
• **Models per Provider**: Bedrock: Claude 3 Sonnet/Opus. OpenAI: GPT-4o.
• **Model Capabilities**: Defined in `atoms-agents/registry/cards/models`. Capabilities: `chat`, `vision`, `tool_use`.
• **Harnesses**: **Mother** (Root), **Flow** (Agent Builder), **Wysiwyg-Builder** (UI Builder). React wrappers that provide Context/Tools to Canvases.
• **Canvases**: `Haze` (3D), `Maybes` (Notes), `Multi21` (Chat), `Spatial` (2D Infinite), `Taskforce` (Kanban), `Viddy` (Video), `Words` (Doc), `Contract Builder`.
• **UI Atoms**: ~30-50 components in `ui-atoms` (Buttons, Sliders, Toggles, etc.).
• **Agent Loading**: Loaded from `atoms-agents/registry` (YAML/JSON Manifests) into `supa_agents` table.
• **Agent Elements**: Persona, Task, Model, Capabilities, Tools, Guidance (Blackboard).
• **Graph**: Built in `God Mode` or `Flow Canvas`. Nodes connected by Edges. Stored in `atoms-agents` graph definition.
• **Model Loading (Internal)**: `ModelCard` defines provider/model. `ModelGateway` loads the specific client (Boto3/OpenAI) at runtime.
• **Frameworks**: Loaded via `FrameworkCard`. Example: `langchain`, `crewai`, `smolagents`.
• **Framework/Mode Separation**: Framework = The Library (e.g. LangChain). Mode = The Pattern (e.g. ReAct, Chain-of-Thought).
• **Services Identification**: `atoms-muscle` (Compute), `atoms-app` (UI/Orchestration), `atoms-core` (Logic/DB), `EventSpine` (Bus), `JuniorAgentSecurity` (Auth/Audit).
• **Services Status**: Core/App/Muscle are **Active/Production**. Tuning is **Offline/Batch**. Security is **Local/Beta**.
• **Monetization**: **Snax Token**. Pricing Configs in `atoms-app/_flat_config/god_config_pricing`. Usage metered via `gate_chain`.