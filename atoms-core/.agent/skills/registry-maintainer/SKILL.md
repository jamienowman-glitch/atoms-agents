---
name: registry-maintainer
description: Auto-indexes the atoms ecosystem into Supabase. "The Spider".
---

# Registry Maintainer Skill (The Spider)

## Purpose
This skill ensures the Supabase `registry_components` table ("The Phonebook") is always 100% in sync with the file system. It eliminates manual registration.

## Capability: `run_spider`
**Trigger**: run when creating new files, moving files, or when the User asks to "refresh the phonebook".

### Instructions
1.  **Locate Script**: The spider lives at `atoms-core/tools/reindex_universe.py`.
2.  **Execute**:
    ```bash
    python3 atoms-core/tools/reindex_universe.py --all
    ```
3.  **Verify**: The script provides an output summary (e.g., "Indexed 150 new atoms, 2 moved, 0 deleted").

## The Logic (How it works)
The Spider recursively crawls all mapped `atoms-*` repositories.
*   **UI**: Checks `atoms-ui/canvases`, `atoms-ui/harnesses`.
*   **Core**: Checks `atoms-core/src/atoms_core`.
*   **Muscles**: Checks `atoms-muscle/src/atoms_muscle`.

It derives the **Alias** from the file path using the **Wildcard Map**.
*   `.../_atoms/Button.tsx` -> `@atoms/Button`
*   `.../atoms_muscle/video/renderer.py` -> `atoms_muscle.video.renderer`

## Usage Rules
*   **Always Run After Creation**: If you create a file, run the spider.
*   **Never Manual Insert**: Do not write SQL `INSERT` statements manually. The Spider is the single source of truth.
