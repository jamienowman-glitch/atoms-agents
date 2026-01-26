# 🤖 JULES: FRESH START PROTOCOL
> **Mission**: Wrap 61 "Legacy" Muscles into MCP Servers.
> **Repo**: `atoms-muscle`

## 📂 The Critical Paths (Verify These First)
Jules, before you start, verify you see these files. If you do not, **pull the repo** (The human may have just pushed them).

1.  ** The Factory Script**:
    *   Path: `atoms-muscle/scripts/factory.py`
    *   *If missing*: The repo is out of sync.

2.  **The Targets (Legacy Muscles)**:
    *   Path: `atoms-muscle/src/muscle/legacy/muscle/`
    *   *Context*: This folder contains **61 folders** (e.g., `video_render`, `audio_separation`).
    *   *Note*: Ignore the nesting. It is technical debt. WRAP THEM WHERE THEY ARE.

3.  **Dependency**:
    *   Check `atoms-muscle/pyproject.toml` for `"mcp"`.
    *   *Action*: If missing, add it.

---

## 🏭 THE TASKS

### 1. Run The Factory
We have automated the boilerplate.
```bash
# Go to the script folder
cd atoms-muscle/scripts

# Run the factory on the LEGACY folder
python3 factory.py ../src/muscle/legacy/muscle
```

**Expected Output**:
*   It should scan all 61 folders.
*   It should generate `mcp.py` and `SKILL.md` in each one.
*   *If it says "Path not found"*, you are likely at the wrong relative path. Double check `pwd`.

### 2. Verify Key Muscles (Manual check)
The factory is dumb. You are smart. Check these critical muscles:
*   `src/muscle/legacy/muscle/video_render/mcp.py`
*   `src/muscle/legacy/muscle/audio_separation/mcp.py`

**Check**:
*   Does the import work? (`from .service import Service` vs `from .service import VideoRenderService`).
*   Fix any import errors manually.

### 3. Sync to Registry (The "Boom")
Once verified, run the registry sync to tell the database about them.
```bash
cd ../../atoms-core/scripts
python3 sync_muscles.py
```
*   This will populate the `/god/config/muscles` UI.

---

## ❓ Troubleshooting
*   **"I can't find `legacy/muscle`"**: You are likely on an old commit. Ask for a PUSH.
*   **"Import Error in mcp.py"**: The `service.py` might have a weird class name. Open the file and fix the class name in `mcp.py`.
