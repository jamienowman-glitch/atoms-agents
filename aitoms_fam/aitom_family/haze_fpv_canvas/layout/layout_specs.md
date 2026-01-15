# Haze FPV Canvas - Layout

The canvas is a fullscreen or container-filling 3D viewport.

## Layout Tokens

| Token | Value | Description |
| :--- | :--- | :--- |
| `canvas_z_index` | `0` | Base layer, behind all HUD elements. |
| `canvas_aspect_ratio` | `fill` | Always fills the parent container. |
| `canvas_safe_area` | `0px` | No intrinsic padding; content is 3D. |

## Composition

The canvas renders the WebGL/Three.js context. It does not contain DOM elements natively, but acts as the backdrop for:

*   `haze_fpv_hud` (Layered on top, z-index 10)
*   `haze_node_info` (Layered on top, z-index 20)

## Responsive Behaviour

*   **Resize**: On window resize, the internal 3D camera aspect ratio must update to match the container.
*   **Resolution**: Supports dynamic pixel ratio (dpr) scaling for performance vs quality (default to 1.0 or window.devicePixelRatio capped at 2).
