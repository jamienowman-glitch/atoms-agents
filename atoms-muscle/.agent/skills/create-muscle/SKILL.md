---
name: create-muscle
description: Teaches an Agent how to build, expose, and register a new GPU-accelerated Muscle tool in the Atoms-Muscle monolith.
metadata:
  short-description: Build a new Muscle (Video/Audio/3D Tool)
  version: 1.0.0
---

# 🏭 Muscle Factory: Build Protocol

Use this skill when the user asks to "Create a new muscle", "Build a video effect", or "Add a new capability" to `atoms-muscle`.

## 🧠 Context
You are a **Compute Engineer**. You build efficient, atomic Python tools that run as MCP services. You strictly follow the Factory Standard.

## 🧭 Architecture Law (Must Follow)
- **Service vs Library:** `atoms-muscle` is the runtime/service. Shared logic belongs in `atoms-core`.
- **Namespace Rule:** **Never** merge namespaces at runtime. Import explicitly from `atoms-core` (e.g., `from atoms_core.src.audio.models import ...`).
- **Rescue Protocol:** Port dependency logic from `northstar-engines` into `atoms-core` first. `atoms-muscle` must never import `northstar-engines`.

## 🎯 Production Compute Policy (Non‑Negotiable)
- **Tenant compute first.** Interactive paths must default to **client device CPU/GPU** (browser/mobile/desktop).
- **Server render only on explicit export/offline requests.**
- **No local fallbacks** in production paths (no placeholder URIs, no local disk outputs).

## 🛠️ The 5-Step Build Process

### 1. IMPLEMENTATION
Create the directory `atoms-muscle/src/{category}/{name}/`.
Create `service.py` with a clean Python class.
```python
# src/{category}/{name}/service.py
class {Name}:
    def run(self, input_path: str) -> str:
        # Implementation (FFmpeg, Torch, etc)
        pass
```
**Rule:** Import shared logic/models from `atoms-core` explicitly; do not duplicate them in atoms-muscle.

### 2. PACKAGING (The Recursive Skill)
Create `atoms-muscle/src/{category}/{name}/SKILL.md`.
This ensures the *result* of your work is also a Skill.
```markdown
---
name: muscle-{category}-{name}
description: [Short description]
metadata:
  mcp-endpoint: https://connect.atoms.fam/mcp/{name}
---
# Tool Name
## Capability
One sentence summary.
## When to use
Specific triggers (e.g., \"User uploads DXF\").
## Schema
JSON input/output definition.
## Cost
Base Snax price.
## Brain/Brawn
Explicitly state if the user must run a CLI command locally.
```

### 3. AUTOMATION (The Magic)
**STOP.** The Sentinel can generate starter files, but you must verify they are production‑ready.

The **Muscle Sentinel** is watching.
1.  Ensure the Sentinel is running: `python3 atoms-muscle/scripts/sentinel.py`
2.  Save your `service.py`.
3.  **Watch it happen**: The Sentinel will detect the file, generate `mcp.py` + `SKILL.md`, and register it in Supabase.
4.  **Verify**: The generated `mcp.py` is **not a stub** and includes `@require_snax` + clean JSON error handling.

### 4. VERIFICATION
1.  Check `atoms-muscle/src/{category}/{name}/` for the generated files.
2.  Check the Dashboard to see it live.

### 5. VERIFICATION
1.  Run the migration.
2.  Verify the new route exists in `atoms-muscle`.
3.  Confirm it appears in the Dashboard Registry.

## 🧪 Quality Control
*   [ ] Does `service.py` run without external side effects?
*   [ ] Is the `SKILL.md` present?
*   [ ] Is the Route public?
*   [ ] Is it in the Database?

**GO.**
