# Haze FPV Canvas - Colours

The landscape is strictly monochrome (Black & White) with light accents for data.

## Palette

| Token ID | Reference | Description |
| :--- | :--- | :--- |
| `landscape_bg` | `base.black` | The void/sky and ground base. |
| `landscape_contour` | `base.white` | The wireframe or contour lines defining the terrain. |
| `node_point_light` | `base.white` | The emissive color of a node point. |
| `node_point_selected` | `base.white` (High Intensity) | Brighter glow for selected nodes. |
| `fog_color` | `base.black` | Depth cueing fades to black. |

## Visual Style

*   **Wireframe/Contour**: The terrain is not a solid mesh but a series of isolines or a grid.
*   **Glow**: Post-processing bloom may be applied to nodes and high-intensity contours.
