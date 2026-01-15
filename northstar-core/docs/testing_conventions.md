# Testing Conventions (Northstar Core)

## Registry Structure
- **Agents** (`registry/agents/`): Define Persona, Manifest, and **Prompt Templates**.
- **Flows** (`registry/flows/<runtime>/`): Define Orchestration Only. **NO PROMPTS**.

## Naming
- **Test Slug**: `youtube_multiframework_v1`
- **Run ID**: `run_<YYYYMMDD_HHMMSS>`
- **Artifacts**: `NN_<agent_role>__<description>.txt`

## Runtime Adapters
Adapters must be "Card Driven":
1. Read `flow.yaml` to get steps.
2. Read referenced `agent.yaml` to get templates.
3. Inject inputs into templates.
4. Execute.

## UI Runner
Use `scripts/server_test_runner.py` for visual verification.
- **FastAPI** based.
- Streaming logs via SSE.
- Artifacts saved to `registry/run_artifacts/...`.
