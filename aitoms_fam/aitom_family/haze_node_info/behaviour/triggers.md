# Haze Node Info - Behaviour

## Triggers

*   **Appear**: When `onNodeFocus` or `onNodeSelect` is triggered by the Canvas.
*   **Disappear**: When focus is lost (reticle hits void) or selection is cleared.

## Transitions

*   **Entrance**: Fade in + Slide Up (Small distance, 10px).
*   **Exit**: Fade out.
*   **Duration**: Fast (`200ms`).

## Interaction
*   **Read-only**: This atom is strictly informational in V1. No clickable elements inside (pass-through events).
