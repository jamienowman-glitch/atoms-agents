---
name: atomic-model-providers
description: Add atomic model providers/models in atoms-agents with vault-loaded secrets, EventV2 logging, and per-model tests.
category: agents
version: 2026-02-03
---

# Atomic Model Provider Skill (atoms-agents)

This skill defines the **atomic, non-collapsing** workflow for adding model providers and models to `atoms-agents`.
It follows published agent skill conventions and keeps each model as an independent unit. See the references at the
bottom for the external skill-spec sources that informed this template.

## Non‑Negotiables (Atomic Rules)
- **One file per model. One class per file. Never collapse.**
- **Provider ≠ Model**. Providers supply transport/auth; models are atomic units.
- **Reasoning profiles are separate cards**. Do not embed reasoning level into provider/model code.
- **Capabilities live in model cards** (registry), not in provider code.
- **EventV2 logging is required** on every call (success + failure).
- **Vault-only secrets**. Never write `.env` or keys to disk. Read via vault‑mounted env at runtime.
- **No mocks or canned outputs** in providers or tests.
- **Absolute imports only** (`atoms_agents.*`).

## Directory Layout
```
atoms-agents/
  src/models/providers/<provider>/
    base.py
    <model_id>.py
  tests/providers/
    test_<model_id>.py
  src/models/providers/provider_registry.py
  src/models/providers/provider_registry_mw2.py
```

## Add a New Provider (Steps)
1. Create `src/models/providers/<provider>/base.py`.
2. Implement real SDK/HTTP calls.
3. Load API keys from environment (vault-mounted); do not hardcode.
4. Log every request via `atoms_agents.src.models.providers.common.log_inference_event`.
5. Provide capability‑specific methods: `generate()` for text, `transcribe()` for audio, `generate_image()` for images.
6. Add at least one model file (below).

## Add a New Model (Steps)
1. Create `src/models/providers/<provider>/<model>.py`.
2. Define one class with a single `MODEL_ID`.
3. Call the provider base to execute inference and logging.
4. Add a test in `tests/providers/test_<model>.py`:
   - Skip when required env keys are missing.
   - Use non‑deterministic prompts (live inference).
   - Assert non‑empty response.
5. Register the class in the correct registry (`provider_registry.py` or `provider_registry_mw2.py`).

## Missing Keys / Quota
- If a required key is missing, tests **must** skip.
- If a key exists but returns 401/429/403, **document it in AGENTS.md**, do not stub.
- Keep provider code intact; resolve key/quota separately.

## Free‑Model Fallback (OpenRouter)
- If credits are zero, prefer `:free` model IDs or `openrouter/free`.
- Use `/api/v1/models` to discover free models for the account.

## References (Skill Spec Sources)
- Agent Skills specification: https://agentskills.io/specification
- Agent Skills overview: https://agentskills.io/what-are-skills
