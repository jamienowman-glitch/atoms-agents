# Haze / Vector Explorer Integration Note

**Component:** Haze FPV Landscape Viewer
**Context:** `aitoms_fam` Spec Library
**Status:** Initial Specs defined

## Overview
This viewer provides an FPV (First Person View) 3D exploration mode for vector landscapes. It treats the `height_score` of nodes as terrain elevation and allows the user to traverse the data landscape as if it were a physical terrain.

## Recommended Atoms

| Atom Name | Role |
| :--- | :--- |
| **`haze_fpv_canvas`** | The main 3D viewport. Renders the landscape, nodes, and fog. Handles the camera loop. |
| **`haze_fpv_hud`** | The Heads-Up Display. Provides the reticle and on-screen movement controls. |
| **`haze_node_info`** | The detail overlay. Appears when a node is focused/selected to show metadata. |

## Integration Contract

### Host App Responsibilities
1.  **Data Fetch**: Retrieve the Scene JSON from the backend.
2.  **Normalization**: Ensure the scene matches the `SceneData` interface (see `haze_fpv_canvas/data_schema/schema.md`).
3.  **State Management**:
    *   Track `activeNodeId`.
    *   Listen for `onNodeSelect` from the canvas.
    *   Pass `activeNodeId` back to the Canvas and Node Info atoms.

### Events Flow
*   User moves camera -> `haze_fpv_canvas` handles internally (emits throttling updates if needed).
*   User taps HUD Control -> `haze_fpv_hud` emits `move_*` events -> Host passes to Canvas OR Canvas listens directly (implementation detail for runtime). *Spec recommendation: Host bridges HUD events to Canvas refs.*
*   User looks at Node -> Canvas emits `onNodeFocus(id)` -> Host updates `activeNodeId` -> `haze_node_info` appears.

## Key Configuration
*   **Speed & Sensitivity**: Tunable via `exposed_tokens` in `haze_fpv_canvas`.
*   **Visuals**: Monochrome aesthetic is enforced via `colours` tokens.
