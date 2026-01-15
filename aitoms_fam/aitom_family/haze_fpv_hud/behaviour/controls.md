# Haze FPV HUD - Behaviour

Handles user input translation to FPV movement events.

## Interactions

### Control Pad (Touch/Pointer)
*   **Tap/Hold "Forward"**: Emits continuous `move_forward` event.
*   **Tap/Hold "Back"**: Emits continuous `move_backward` event.
*   **Tap/Hold "Left/Right"**: Emits `strafe_left` / `strafe_right`.

### Keyboard Mapping (Visualized only)
The HUD does not capture keyboard events (that's the interaction layer's job), but it should visually react (button press state) when corresponding keys (WASD) are pressed, if the host app pipes that state in.

## Props/Events
*   `onInteractionStart(action: ActionType)`
*   `onInteractionEnd(action: ActionType)`
*   `activeAction`: (Optional) Highlight state for external triggers (e.g. keyboard).
