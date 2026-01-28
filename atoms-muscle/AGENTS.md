# 🏋️ THE MUSCLE FACTORY: Production Line Standard
> **Mission**: Build 100+ GPU-Accelerated Tools (Muscles) for Nexus and External Sale.

## 🛑 THE LAW
**All Muscles MUST obey the following mandates:**
1.  **Location**: All Muscles must live in `src/muscle/{category}/{name}`.
2.  **Components**: All Muscles must have `mcp.py`, `SKILL.md`, and `service.py`.
3.  **Automation**: Use `scripts/factory.py` and `scripts/sentinel.py` for all new work.
4.  **Tenant Compute First (Production)**: Default interactive paths to **client device CPU/GPU**. Server render is **only** for explicit export/offline requests. **No local fallbacks** in production.

## 🏗️ THE PRODUCTION LINE
Any Agent building a Muscle MUST follow this exact sequence:

### STEP 1: THE CORE LOGIC (Python)
Create the implementation in `src/muscle/{category}/{name}/service.py`.
*   **Style**: Pure Python. Class-based.
*   **Deps**: Import `ffmpeg`, `torch`, `numpy` etc. locally.

### STEP 2: THE MCP WRAPPER (mcp.py)
You MUST wrap the logic using FastMCP in `src/muscle/{category}/{name}/mcp.py`.
*   Use `scripts/factory.py` to auto-generate this if possible.
*   Ensure it imports `service.py`.

### STEP 3: THE SKILL PACKAGING (SKILL.md)
You MUST create a `SKILL.md` file in `src/muscle/{category}/{name}/SKILL.md`.
This allows Codex/Agents to "install" this muscle as a capability.

**Format**:
```markdown
---
name: muscle-{category}-{name}
description: [Short description]
metadata:
  type: mcp
  entrypoint: src/muscle/{category}/{name}/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
...
```

### STEP 4: THE REGISTRY
Run the sync script to register new muscles:
```bash
python3 scripts/sync_muscles.py
```

## 📋 STANDARD FOLDER STRUCTURE
```text
atoms-muscle/
├── src/
│   ├── muscle/
│   │   ├── video/
│   │   │   ├── render/             # <--- Subfolder per Muscle
│   │   │   │   ├── service.py      # Implementation
│   │   │   │   ├── mcp.py          # MCP Wrapper
│   │   │   │   └── SKILL.md        # Agent Definition
│   │   ├── audio/
│   │   ├── image/
│   │   ├── cad/
│   │   ├── text/
│   │   ├── media/
│   │   ├── timeline/
│   │   ├── construction/
│   │   └── main.py                 # The API Gateway (Legacy/Optional)
├── scripts/
│   ├── factory.py
│   ├── sentinel.py
│   └── sync_muscles.py
```

## 🔌 SUPABASE CONNECTION PROTOCOL

Before running `scripts/sync_muscles.py` or any Supabase registry update, complete the `supabase-connect` skill:
1. **Read the skill** at `atoms-muscle/.agent/skills/supabase-connect/SKILL.md`. It explains how to pull Vault secrets and how Supabase is wired through `atoms-core`.
2. **Reference the OS docs** in `atoms-core/AGENTS.md` and `atoms-core/docs/PRODUCTION_CHECKLIST.md` for Vault + Supabase guardrails.
3. **Load vault secrets** from `/Users/jaynowman/northstar-keys/` (`supabase-url.txt`, `supabase-service-key.txt`, etc.) via the Vault loader—never use `.env` or plain environment variables.
4. **Start the Sentinel**, let it generate `mcp.py`/`SKILL.md`, then run `python3 scripts/sync_muscles.py` against the Supabase URL/service key taught by the skill.
5. **Document results** (success/failure, connection errors, registry updates) so future agents can pick up where you left off.
