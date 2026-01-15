# Token Diff Handoff

Draft Diffs can be used to hand off design intent to coding agents.

## Workflow
1.  **Designer** uses Token Workbench to define tokens, specs, and animations.
2.  **Designer** clicks "Export JSON" (or copies the Draft Diff from storage).
3.  **Handoff**: Paste the JSON or Markdown summary into the agent prompt.

## Example Handoff Markdown

**Subject**: Update Hero Banner Tokens

**Diff Summary**:
- `hero.heading.color`: Changed controller to `color`.
- `hero.animation`: Added hover animation spec.

**Action Required**:
Please implement the animation logic in the renderer based on the new `animation_spec` in the token catalog.
