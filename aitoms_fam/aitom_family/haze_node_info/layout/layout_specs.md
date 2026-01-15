# Haze Node Info - Layout

A floating or fixed overlay that displays details for the currently focused/selected node.

## Positioning

*   **Mode A (Floating)**: Anchored 2D screen coordinates projected from the 3D node position.
*   **Mode B (Fixed)**: Bottom-left or Top-right corner fixed panel.
*   **Default**: Fixed Bottom-Left for FPV stability.

## Composition

1.  **Title**: Heading (H3/H4).
2.  **Tags**: Row of small pills/badges.
3.  **Metrics**: Mini stats grid (2x2) or list.
4.  **Action Hint**: "Press [Space] to expand" (future proofing).

## Visual Tokens
*   `overlay_bg`: Semi-transparent black (`rgba(0,0,0,0.8)`).
*   `overlay_border`: Thin white border `1px solid rgba(255,255,255,0.3)`.
*   `overlay_padding`: `16px`.
