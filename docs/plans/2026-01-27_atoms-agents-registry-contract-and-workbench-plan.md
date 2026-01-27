# 2026-01-27 — `atoms-agents` Registry Contract + Workbench Plan (Atomic)

## Canonical Paths (use these exact paths; do not “nest” new repos)
- Repo root (your “/dev”): `/Users/jaynowman/dev`
- This plan (read first): `/Users/jaynowman/dev/docs/plans/2026-01-27_atoms-agents-registry-contract-and-workbench-plan.md`
- Legacy source (read-only; copy from here): `/Users/jaynowman/dev/northstar-agents`
- New repo destination (create here): `/Users/jaynowman/dev/atoms-agents`
- Workbench UI repo: `/Users/jaynowman/dev/atoms-app`

## Intent
Create a **new** repo `atoms-agents/` as the production-bound home for:
- The **agent registry** (Atomic Cards).
- The **agent runtime** later (graph execution, lens application, mirror subscriber) — **not required for Day-0**.

Do **not** delete or mutate `northstar-agents/` while this is built. We copy forward and keep legacy intact.

## Non‑Negotiables
- **NO `.env` files** anywhere. Secrets come from `VaultLoader` reading absolute paths under `/Users/jaynowman/northstar-keys/`.
- **Atomic Intelligence Law**: never hardcode an agent definition into Python/TS. Agents are assembled from cards.
- **Model selection must be decomposable**: you can switch `model_id` without changing `persona`, switch `reasoning` without changing `model_id`, and swap `provider` without rewriting code.
- **Firearms license** is the *only* permission primitive you want to talk about. We model it as a card and apply it via a lens/policy, not ad-hoc conditionals.

## Naming & Boundaries (Canonical)
- `atoms-agents` owns:
  - Registry schemas + loader + validators.
  - Registry cards (YAML).
  - Provider adapters + framework adapters (implementation) that **consume** cards.
- `atoms-core` owns:
  - Identity/tenancy enforcement, realtime gateway, event sink, Nexus, storage presign.
- `atoms-ui` owns:
  - Harness + canvases + tool surfaces, and the one shared transport client.
- `atoms-app` owns:
  - Product surfaces + **Workbench UI** (your “model connectivity + chat” tester).
  - No direct secrets; calls an API service for actual model calls.

---

# Contract: Atomic Registry (v0)

## 1) Canonical Card Types (must exist)
These are separate files. A node/agent is **composition**, never a monolith.

### A. Identity cards
- **ManifestCard**: “speciality/role” system prompt payload (deep guidance).
- **PersonaCard**: voice/style tags + principle rules.
- **TaskCard**: goal + constraints + acceptance criteria.

### B. Model stack cards (split)
- **ProviderCard**: provider identity + required fields + discovery hints.
- **ModelFamilyCard**: family groupings (optional).
- **ModelCard (Base)**: `model_id` + `official_id` + technical constants (context window, streaming, etc.).
- **ReasoningProfileCard**: the reasoning configuration **separate** from model.
  - Must be swappable while holding `model_id` constant.
- **CapabilityCard**: capability names (“vision”, “tool_use”, “tts”…).
- **CapabilityBindingCard**: provider/model → capability toggle instructions (or adapter mapping).

### C. Framework cards (split)
- **FrameworkCard**: framework identity (LangGraph, CrewAI, AutoGen…).
- **FrameworkAdapterCard**: import path for adapter implementation (how to connect).
- **ModeCard**: framework mode (how the framework is configured/invoked).

### D. Safety / permission cards (your vocabulary)
- **FirearmsLicenseCard**: the capability/tool envelope an agent/node is permitted to use.
  - This is the “license”, not an “allowlist” product concept.

### E. Lens cards (already exist conceptually; keep them)
- **TokenMapCard**: token read/write mappings (read-only first is fine).
- **ContextLayerCard**: manifests + data sources projected onto nodes.
- **SafetyProfileCard**: coarse tiering (if you still want it).
- (Optional later) **PolicyPackCard**: rule packs for enterprise compliance; not needed for your day-0.

## 2) Composition: What defines “an Agent”
An “agent” must be a **card that references other cards**, never inline blobs.

### AgentCard (new in atoms-agents)
Minimum required refs:
- `manifest_ref`
- `persona_ref`
- `task_ref`
- `model_ref` (base model)
- `reasoning_ref` (separate)
- `firearms_license_ref`
- `capability_refs` (optional; if capabilities are strictly derived from license, keep empty)
- `framework_ref` + `framework_mode_ref` (optional for day-0 workbench; required for runtime later)

This lets you atomically swap **one** ref without editing the others.

## 3) Reasoning split: how it works (no monolithic Python)
Reasoning becomes a separate card, and adapters merge it into the request.

**Rule**: adapters do not contain per-model “special” Python files. They implement:
- `build_request(model: ModelCard, reasoning: ReasoningProfileCard, persona: PersonaCard, manifest: ManifestCard, tools: …)`
- merge strategy: `request = base_request(model) + reasoning_overrides(reasoning) + persona/manifest prompt layers + tool toggles`

### ReasoningProfileCard contract (minimum)
- `reasoning_id` (stable id)
- `name`
- `notes`
- `request_overrides` (provider-agnostic-ish dict; adapters interpret)
- optional `provider_id` (if a profile is provider-specific)

**Backward compatibility**: if a legacy `ModelCard` still has `reasoning_effort`, that becomes the default reasoning profile when `reasoning_ref` is absent.

## 4) Firearms license contract (what it gates)
Firearms license should gate:
- tool use (and which tool families)
- code exec
- web grounding
- vision/video/audio inputs
- write access to canvases/tokens (if you want strict write gating)

**Important**: this is a *card + lens application*, not a runtime ad-hoc switch.

## 5) Where cards live in the repo
In `atoms-agents/registry/cards/`:
- `manifests/`
- `personas/`
- `tasks/`
- `providers/`
- `model_families/`
- `models/` (base)
- `reasoning_profiles/`
- `capabilities/`
- `capability_bindings/`
- `frameworks/`
- `framework_adapters/`
- `framework_modes/`
- `firearms_licenses/`
- `agents/` (AgentCard)

**Migration note:** to reduce thrash, it’s fine to keep the existing `northstar-agents` directory shapes during Phase 2 (e.g. `framework_modes/<framework>/...`) and only normalize later once everything loads end-to-end.

---

# Contract: Workbench (atoms-app) + Workbench API (atoms-agents)

## Goal
Before any graph runtime work: a single place to **prove connectivity** per model/provider and rapidly switch atomic selections.

## Workbench UI (atoms-app)
One page, minimal scope:
- Dropdowns: `provider`, `model`, `reasoning_profile`, `persona`, `manifest`, `firearms_license`
- A chat panel:
  - user message input
  - streaming assistant response (token streaming if available)
  - shows selected card IDs used for the call
- A diagnostics panel:
  - resolved “effective config” (redacted; no secrets)
  - adapter name + request shape summary
  - last error with remediation hint (e.g. “missing Vault secret file: …”)

## Workbench API (atoms-agents)
Keep secrets out of Next.js. Deploy this API to Cloud Run alongside atoms-app.

Endpoints (v0):
- `GET /registry/index` → lists available cards (ids + names)
- `POST /workbench/chat` → `{ provider_id, model_id, reasoning_id, persona_id, manifest_id, firearms_license_id, messages[] }`
  - returns streamed tokens if the provider supports it (SSE is fine)

Cards are loaded from the repo (filesystem in container image) via `RegistryLoader`.

---

# Atomic Task Plan (handoff to a cloud coding agent)

## Phase 0 — Safety & invariants
**ATOMS-AG-00**
- Confirm `.env` guard is active and CI/scripts fail on `.env*`.
- Confirm `VaultLoader` exists and is the only secret pathway (no “dotenv” dependency).
- Confirm `northstar-agents/` is read-only for this effort (copy only).

## Phase 1 — Create `atoms-agents/` repo skeleton
**ATOMS-AG-01**
- Create `atoms-agents/` at repo root (sibling to `atoms-core`, `atoms-ui`, `atoms-app`).
- Add `atoms-agents/AGENTS.md` (must include: no `.env`, Vault law, “cards only”, repo boundaries).
- Add minimal `README.md` describing purpose + how to run workbench API locally.
- Add Python packaging (`pyproject.toml`) consistent with `atoms-core` style (uv/ruff/pytest if that’s the norm here).

## Phase 2 — Copy forward the registry loader (do not “improve” yet)
**ATOMS-AG-02**
- Copy (exact paths):
  - From: `/Users/jaynowman/dev/northstar-agents/src/northstar/registry/`
  - To: `/Users/jaynowman/dev/atoms-agents/src/atoms_agents/registry/`
- Preserve parser behavior initially; only change import paths.
- Add a small “registry self-check” CLI: load cards, print counts per card type, exit 0/1.

**ATOMS-AG-02B (Adapters + runtime code must come over too)**
Cards do nothing without the Python adapters that execute them. Copy (exact paths, copy-forward only):
- Provider adapters:
  - From: `/Users/jaynowman/dev/northstar-agents/src/northstar/runtime/providers/`
  - To: `/Users/jaynowman/dev/atoms-agents/src/atoms_agents/runtime/providers/`
- Framework implementations:
  - From: `/Users/jaynowman/dev/northstar-agents/src/northstar/runtime/frameworks/`
  - To: `/Users/jaynowman/dev/atoms-agents/src/atoms_agents/runtime/frameworks/`
- Framework modes:
  - From: `/Users/jaynowman/dev/northstar-agents/src/northstar/runtime/modes/`
  - To: `/Users/jaynowman/dev/atoms-agents/src/atoms_agents/runtime/modes/`
- Shared client wrappers / SDK glue:
  - From: `/Users/jaynowman/dev/northstar-agents/src/northstar/clients/`
  - To: `/Users/jaynowman/dev/atoms-agents/src/atoms_agents/clients/`

**Guardrail:** do not “refactor” during copy. Make it import-clean first, then iterate.

## Phase 3 — Formalize missing cards (manifest + firearms + reasoning)
**ATOMS-AG-03 (ManifestCard)**
- If manifest YAML exists but schema/parser is missing, add:
  - `schemas/manifests.py` with `ManifestCard`
  - `parsers.parse_manifest`
  - loader wiring so `card_type: manifest` works.

**ATOMS-AG-04 (FirearmsLicenseCard)**
- Add `schemas/firearms.py` with `FirearmsLicenseCard` (and any small sub-structures).
- Add YAML cards under `registry/cards/firearms_licenses/`.
- Add loader + parser wiring.
- Define a deterministic merge rule: license → permitted capabilities/tools.

**ATOMS-AG-05 (ReasoningProfileCard)**
- Add `schemas/reasoning.py` with `ReasoningProfileCard`.
- Add parser + loader wiring.
- Add initial cards (e.g. `reasoning.low`, `reasoning.medium`, `reasoning.high`, plus provider-specific overrides if needed).
- Backward compat: if a model still has `reasoning_effort`, map it to one of these defaults.

## Phase 4 — Make “agent = composition” real
**ATOMS-AG-06 (AgentCard)**
- Add `schemas/agents.py` with `AgentCard` referencing:
  - `manifest_ref`, `persona_ref`, `task_ref`, `model_ref`, `reasoning_ref`, `firearms_license_ref`,
  - optional `framework_ref`, `framework_mode_ref`, `capability_refs`.
- Add parser + loader wiring.
- Create 1–2 example agents using existing persona/manifest/model cards.

## Phase 5 — Ensure frameworks are split (no monoatomic “framework blob”)
**ATOMS-AG-07**
- Ensure these stay separate and are used as separate refs:
  - `FrameworkCard`
  - `FrameworkAdapterCard`
  - `ModeCard`
- Add registry examples that prove switching mode without changing framework id.

## Phase 6 — Workbench API (atoms-agents service)
**ATOMS-AG-08**
- Create a minimal FastAPI (or existing preferred framework) app:
  - loads registry at startup
  - `GET /registry/index`
  - `POST /workbench/chat` streaming response
- Implement “effective config” resolution:
  - resolve AgentCard OR resolve raw selection IDs from UI
  - apply firearms license gating before invoking adapter
- Implement provider credential discovery via VaultLoader + cloud SDK default creds where appropriate.
  - No secrets in logs; only report missing secret file paths.

## Phase 7 — Workbench UI in `atoms-app`
**ATOMS-APP-WB-01**
- Add a `/workbench` route/page in `atoms-app`:
  - fetches `/registry/index`
  - dropdown selection state
  - chat UI with streaming
  - diagnostics panel

**ATOMS-APP-WB-02**
- Add a single `atoms-app` server config entry for the Workbench API base URL (Cloud Run service URL).
  - This is not a `.env` file; it’s a deploy-time environment variable or config file consistent with your vault law.

## Phase 8 — Cloud Run deployment readiness
**ATOMS-DEPLOY-01**
- Define two Cloud Run services:
  - `atoms-app` (Next.js)
  - `atoms-agents-api` (workbench API)
- Ensure both mount/see Vault secret files (or can use cloud SDK default credentials where permitted).
- Add a smoke script:
  - `GET /registry/index` returns non-empty
  - one chat call per provider/model succeeds or yields a clear missing-credential error

## Phase 9 — Documentation and agent-proofing
**ATOMS-AG-DOC-01**
- Document “How to add a new model” as **cards only** (provider/model/reasoning/capability bindings).
- Document “How to add a new agent” as **AgentCard composition**.
- Add “Common failure modes”:
  - missing Vault key file
  - wrong provider project/region discovery
  - model not available in region

---

# Acceptance Criteria (Day‑0)
- `atoms-agents` exists with a working registry loader and the new card types:
  - manifest, reasoning_profile, firearms_license, agent
- Workbench UI can:
  - list cards
  - run a chat call against at least one provider/model
  - swap `reasoning_profile` without changing `model_id`
  - swap `persona` without changing `model_id`
- No `.env` usage, no deletion of `northstar-agents`.

---

# Handoff Checklist (what to give the cloud agent)
- Start from this plan: `docs/plans/2026-01-27_atoms-agents-registry-contract-and-workbench-plan.md`
- First runnable milestone: **ATOMS-AG-02** (registry loader copied + self-check CLI).
- Second runnable milestone: **ATOMS-AG-08** (Workbench API responding to `/registry/index`).
- Only after API works: **ATOMS-APP-WB-01** (Workbench UI in `atoms-app`).
