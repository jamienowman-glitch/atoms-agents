# Haze FPV Canvas - Behaviour

This spec defines the interaction model for the FPV (First Person View) explorer.

## Camera Control (FPV)

The user "walks" on the terrain.

*   **Movement**:
    *   `W` / `ArrowUp`: Move forward (horizontal plane).
    *   `S` / `ArrowDown`: Move backward.
    *   `A` / `ArrowLeft`: Strafe left.
    *   `D` / `ArrowRight`: Strafe right.
    *   `Shift` (Hold): Run modifier (2x speed).
*   **Look**:
    *   **Mouse/Touch Drag**: Rotates the camera view (Pitch/Yaw).
    *   **Clamp**: Pitch is clamped to avoid neck-breaking angles (e.g., -85deg to +85deg).

## Terrain Mapping

*   **Elevation**: The `meta.height_score` of nodes drives the local terrain height. Higher score = Higher peak.
*   **Clustering**: Nodes with the same `cluster_id` attract the terrain to form continuous ridges or mountain ranges.
*   **Ground Clamping**: The camera `y` position is usually `terrainHeight(x, z) + playerHeight`.

## Token Definitions

These should be exposed in `exposed_tokens`.

*   `fpv_movement_speed_walk`: Base units per second.
*   `fpv_movement_speed_run`: Run multiplier or value.
*   `fpv_look_sensitivity`: Rotation speed factor.
*   `fpv_player_height`: Eye level above terrain ground.
