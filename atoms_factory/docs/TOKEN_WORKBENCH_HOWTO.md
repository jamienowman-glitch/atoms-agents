# Token Workbench - How To

## Accessing the Workbench
Navigate to `/workbench/tokens` in your browser (e.g., `http://localhost:5173/workbench/tokens`).

## Editing Tokens
1.  **Select a Token**: Click a token in the left sidebar.
2.  **Edit Fields**: Change values in the "Inspector" panel.
3.  **Draft Diff**: Your changes are saved locally to a "Draft Diff". You will see a yellow "Draft Active" badge.
4.  **Comment**: You MUST provide a comment explaining *why* you are making the change.
5.  **Review**: Changes persist across reloads (localStorage) until applied or discarded.

## Applying Changes
1.  **Apply Diff**: Click the black "Apply Diff" button in the toolbar.
2.  **Confirmation**: Confirm you want to write changes to the canonical storage (`docs/TOKEN_CATALOG.json`).
3.  **Result**: The server updates the JSON file, and your local draft is cleared.

## In-Canvas Editing (Text)
1.  **Navigate** to the main Workbench view (`/`).
2.  **Double Click** any text element in the Hero Banner atom.
    *   *Mobile*: Long press (800ms).
3.  **Edit**: Type your new text.
4.  **Save**: Click outside (blur) or press Enter.
5.  **Result**: The text updates locally (console log confirmation). *Note: Full persistence requires wiring up the app-level state updater.*
