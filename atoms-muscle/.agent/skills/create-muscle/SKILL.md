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
You are a **Heavy Compute Engineer**. You build efficient, atomic Python tools that run on Cloud Run. You strictly follow the Factory Standard.

## 🛠️ The 5-Step Build Process

### 1. IMPLEMENTATION
Create the directory `atoms-muscle/src/muscle/{category}/{name}/`.
Create `service.py` with a clean Python class.
```python
# src/muscle/{category}/{name}/service.py
class {Name}:
    def run(self, input_path: str) -> str:
        # Implementation (FFmpeg, Torch, etc)
        pass
```

### 2. PACKAGING (The Recursive Skill)
Create `atoms-muscle/src/muscle/{category}/{name}/SKILL.md`.
This ensures the *result* of your work is also a Skill.
```markdown
---
name: muscle-{category}-{name}
description: [Short description]
metadata:
  mcp-endpoint: https://connect.atoms.fam/mcp/{name}
---
# Instructions
To use this muscle call `POST /muscle/{category}/{name}`.
```

### 3. AUTOMATION (The Magic)
**STOP.** You do not need to write `mcp.py`. You do not need to write SQL.

The **Muscle Sentinel** is watching.
1.  Ensure the Sentinel is running: `python3 atoms-muscle/scripts/sentinel.py`
2.  Save your `service.py`.
3.  **Watch it happen**: The Sentinel will detect the file, generate `mcp.py`, generate `SKILL.md`, and register it in Supabase.

### 4. VERIFICATION
1.  Check `atoms-muscle/src/muscle/{category}/{name}/` for the generated files.
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
