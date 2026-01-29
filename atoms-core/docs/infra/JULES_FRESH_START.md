# 🤖 JULES: THE MUSCLE REFINE PROTOCOL
> **Mission**: Wrap, Flatten, and Register the Legacy Muscle Fleet.
> **Context**: We have a "Legacy" folder (`atoms-muscle/src/legacy/muscle`) with 61 raw Python tools. We need to modernize them into standard, flat, MCP-compliant Muscles.

## 🟢 PHASE 1: THE FACTORY (Wrap)
We have built an automation script to do the heavy lifting.

1.  **Locate the Target**:
    *   Verify you see `atoms-muscle/src/legacy/muscle/`.
    *   It contains ~61 folders (`video_render`, `audio_separation`, etc.).

2.  **Run the Automation**:
    ```bash
    cd atoms-muscle/scripts
    # This script recursively scans the folder and generates 'mcp.py' and 'SKILL.md'
    python3 factory.py ../src/legacy/muscle
    ```

3.  **Verify**:
    *   Check `src/legacy/muscle/video_render/`.
    *   Does it have `mcp.py`? Does it have `SKILL.md`?

---

## 🟡 PHASE 2: THE FLATTENING (Move)
Nesting is forbidden. We must move them to the top level.

1.  **The Rules**:
    *   `src/legacy/muscle/video_render` -> `src/video/video_render`
    *   `src/legacy/muscle/audio_separation` -> `src/audio/audio_separation`
    *   (Use your best judgment for other categories: `image`, `cad`, `text`).

2.  **Action**:
    *   Move the folders.
    *   **Delete** the empty `legacy` folder when done.

3.  **Fix Imports**:
    *   Opening `mcp.py` in the new location might break imports like `from .service`.
    *   Ensure the code still runs.

---

## 🔴 PHASE 3: THE LAW (Docs)
Update `atoms-muscle/AGENTS.md` to establish the new order.
*   **Mandate**: "All Muscles must live in `src/{category}/{name}`."
*   **Mandate**: "All Muscles must have `mcp.py` and `SKILL.md`."
*   **Mandate**: "Use `scripts/factory.py` and `scripts/sentinel.py` for all new work."

---

## 🔵 PHASE 4: THE SYNC (Registry)
Tell the Database about the new world.
```bash
cd ../../atoms-core/scripts
python3 sync_muscles.py
```
*   This will scan the NEW locations and register them in Supabase.
*   Check `/god/config/muscles` to confirm they are online.

**Go.**
