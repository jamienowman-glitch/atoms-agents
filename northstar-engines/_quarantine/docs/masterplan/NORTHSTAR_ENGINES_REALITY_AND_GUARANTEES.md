# Northstar Engines: Rigorous Deep Reckoning

**Status**: Verified & Detailed
**Date**: Jan 2026
**Scope**: `northstar-engines` (Full Audit)

---

## 1. Safety & Guarantees (The "Brakes")
**Source**: `engines/nexus/hardening/gate_chain.py`
The "Gate Chain" is the central enforcement loop. It checks the following **Strict Gates** (exact names):

1.  **Kill Switch (`kill_switch`)**: Global/Tenant panic button.
2.  **Firearms (`firearms`)**: Capability Licensing. Checks if the user/agent has the *license* to use a tool (e.g., `youtube.upload`).
3.  **Strategy Lock (`strategy_lock`)**: "Three Wise Men" Verification. Requires High-Level approval for dangerous actions.
4.  **Budget (`budget`)**:
    -   **Total Cost**: Checks against `BudgetPolicy.threshold`.
    -   **Tool Cap**: Checks `daily_cap` per tool.
5.  **KPI (`kpi`)**: Performance corridors. Enforces `floor` (min quality) and `ceiling` (max variance).
6.  **Temperature (`temperature`)**: System volatility check.
7.  **Rate Limit (`rate_limit`)**: Token bucket limiter (Memory or Firestore).

---

## 2. Connectors (The "Tendrils")
**Definition**: Adapter integrations for external services.
**Location**: `engines/connectors/`
**Count**: 35 Integrations

### A. Commerce & Retail
-   `shopify`: E-commerce platform (Products, Orders).
-   `faire`: Wholesale marketplace.
-   `fashiongo`: B2B fashion.
-   `joor`: Wholesale management.
-   `tundra`: Wholesale.
-   `aliexpress`, `dhgate`, `c1688`: Sourcing platforms.

### B. Social & Content
-   `instagram`: Social Media.
-   `tiktok`: Short videos.
-   `youtube`: Video platform (Uploads, Analytics).
-   `snapchat`: Social.
-   `pinterest`: Visual discovery.
-   `linkedin`: Professional network.
-   `twitter`: Social text.
-   `twitch`: Live streaming.

### C. Marketing & Ads
-   `google_ads`: Advertising.
-   `meta`: Facebook/Instagram Ads.
-   `klaviyo`: Email marketing.
-   `email_universal`: IMAP/SMTP generic.
-   `gmail`: Google Mail.

### D. Generic & Dev
-   `generic_remote`: HTTP/REST adapter.
-   `generic_stdio`: CLI adapter.
-   `local_dev`: Localhost testing.
-   `printful`, `prodigi`: Print-on-demand.

---

## 3. Feeds (The "Flow")
**Definition**: Continuous data intake pipelines.
**Status**: **Emerging / Incomplete**.
**Location**: `engines/feeds/` (Does not exist as top level), found in `engines/connectors/shopify/feed_router.py` and `engines/event_spine`.

-   **Registry**: `engines/registry/engine_registry.json` (exists), but `feed_registry.json` is **MISSING**.
-   **Router**: `engines/connectors/shopify/feed_router.py` suggests feeds are routed per-connector.
-   **Spine**: `engines/event_spine` handles the `CloudEvent` envelope.

---

## 4. Infrastructure & Routing (The "Pipes")
**Location**: `engines/routing/` & `engines/infrastructure/` (Virtual concept).

-   **Routing**:
    -   `manager.py`: Resolves `(tenant, env) -> backend`.
    -   `routes.py`: FastAPI route definitions.
-   **Memory**:
    -   `engines/memory/`: Vector & Episodic memory implementation.
    -   `engines/nexus/memory/`: Agent working memory.

---

## 5. Muscle (The "Power")
**Location**: `engines/` (Root Level)
**Categories**:
-   **Audio**: 29 engines (`audio_separation`, `audio_transcription`, etc.).
-   **Vision**: `scene_engine` (120+ engines for 3D/Layout), `video_*` (Editing, Rendering).
-   **Intelligence**: `nexus` (LLM, RAG, Chains).

---

## 6. Critical Gaps Identified
1.  **Missing Infrastructure Folder**: The user mentioned `engines/infrastructure`, but it does not exist on disk.
2.  **Missing Feed Registry**: Feeds are ad-hoc in `connectors/` rather than centrally registered.
3.  **Mocked Quotas**: `engines/nexus/hardening/quotas.py` is still a stub.
