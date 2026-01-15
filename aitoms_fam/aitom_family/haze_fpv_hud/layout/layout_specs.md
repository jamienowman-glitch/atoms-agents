# Haze FPV HUD - Layout

The HUD overlays the 3D canvas with minimal UI elements.

## Composition

1.  **Reticle**: Center of screen.
2.  **Control Pad**: Bottom-right corner.

## Layout Specs

### Reticle
*   **Position**: `absolute`, `top: 50%`, `left: 50%`.
*   **Transform**: `translate(-50%, -50%)`.
*   **Size**: `12px` x `12px` (approx).
*   **Style**: Simple crosshair or dot. White/Outline.

### Control Pad
*   **Position**: `absolute`, `bottom: 32px`, `right: 32px`.
*   **Dimension**: `120px` x `120px` container.
*   **Grid**: 3x2 or directional layout (Up, Down, Left, Right).
*   **Touch Friendly**: Min target size `44px`.

## Z-Index
*   `z-index: 10` (Above canvas, below info overlay).
