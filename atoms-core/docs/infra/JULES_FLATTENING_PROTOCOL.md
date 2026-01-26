# 🚜 JULES: THE FLATTENING PROTOCOL
> **Mission**: Unify `legacy/muscle` into the main `src/muscle` directory.
> **Mandate**: "Nesting is punishable by death."

## 1. The Migration
Once you have wrapped the legacy muscles (Previous Task), you must **MOVE** them.

*   **Source**: `atoms-muscle/src/muscle/legacy/muscle/{name}`
*   **Destination**: `atoms-muscle/src/muscle/{category}/{name}`

### Rules of Movement
1.  **Identify Category**:
    *   If name starts with `video_` -> move to `src/muscle/video/`.
    *   If name starts with `audio_` -> move to `src/muscle/audio/`.
    *   If name starts with `image_` -> move to `src/muscle/image/`.
    *   If unsure -> move to `src/muscle/legacy_flattened/`.
2.  **Move Folder**: `mv src/muscle/legacy/muscle/video_render src/muscle/video/video_render`
3.  **Delete Legacy**: Once empty, delete `src/muscle/legacy`.

## 2. The Code Updates
Moving/Renaming breaks imports. You must fix them.
*   **Check**: `service.py`, `mcp.py`, `main.py`.
*   **Fix**: Relative imports (`from ..common import X`) might break. Change to absolute `from muscle.common import X` if needed.

## 3. The Documentation Update
You must rewrite `atoms-muscle/AGENTS.md` and `SKILL.md` to rigidly enforce the new structure.

### Update `AGENTS.md`
```markdown
# 🛑 THE LAW OF MUSCLE STORAGE
1.  **Flat Hierarchy**: `src/muscle/{category}/{name}`.
2.  **No Nesting**: `src/muscle/legacy/muscle/foo` is FORBIDDEN.
3.  **One Level**: Category -> Muscle. That's it.
```

### Update `SKILL.md` (Template)
Add a warning block:
```markdown
> [!IMPORTANT]
> **FOLDER STRUCTURE**: You must create this muscle in `src/muscle/{category}/{name}`.
> Do NOT create sub-sub-folders.
```

## 4. Final Sync
Run `python3 atoms-core/scripts/sync_muscles.py`.
*   It should scan the NEW locations.
*   It should register them all in Supabase.
*   The `legacy` entries in DB might need a cleanup (manual SQL `DELETE FROM muscles WHERE key LIKE 'muscle_legacy_%'`).
