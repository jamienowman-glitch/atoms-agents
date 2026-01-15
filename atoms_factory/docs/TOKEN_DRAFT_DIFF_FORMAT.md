# Token Draft Diff Format

The Draft Diff is a local-first change tracking object stored in `localStorage` under `atoms_factory:token_catalog_draft_diff:v1`.

## JSON Schema

```json
{
  "token_key_1": {
    "patch": {
      "notes": "Updated color info",
      "controller_kind": "color"
    },
    "comment": "Switching to color picker",
    "timestamp": 1715000000000
  }
}
```

## Behavior
- **Draft**: Updates are merged into this object locally.
- **Apply**: The `patch` object for each key is merged into the canonical `TokenCatalogItem`.
- **Discard**: The entire object is removed from storage.
- **Error**: If the server fails to save (`POST /api/tokens`), the draft is preserved locally so you can retry.

## Example Handoff Entry
To hand off a diff to another agent, export the JSON and attach it to a prompt.
