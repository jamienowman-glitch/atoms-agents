# Research Findings: Atom Prompting Specs

**Status**: Verified by Browser Research (Jan 2026)

## 1. Gemini 3 Flash / 2.0 Thinking
*   **Official ID**: `gemini-2.0-flash-thinking-exp` (or `gemini-3-flash` internal alias).
*   **Thinking Level**: Controlled via `generation_config`.
    *   Parameter: `thinking_level`
    *   Values: `MINIMAL`, `LOW`, `MEDIUM`, `HIGH`.
    *   **Prompt**: "Thinking Level: HIGH" ensures deep reasoning.
*   **Timestamps**:
    *   **Prompt**: "List salient events with `[MM:SS]` timestamps."
    *   **Enforcement**: Use `response_mime_type: "application/json"` with schema.

## 2. Molmo 2 (Spatial Grounding)
*   **Model**: `allenai/Molmo2-8B`.
*   **Prompt**: "Point to the [object] using `<point>` tags."
*   **Output Format**: `<point x="X_VAL" y="Y_VAL">Label</point>`.
*   **Coordinate System**: 0-1000 Normalized Grid. (0,0) Top-Left.

## 3. DeepSeek R1 (Reasoning Trace)
*   **API**: OpenAI-Compatible (`AsyncOpenAI`).
*   **Field**: `reasoning_content` in the delta/message object.
*   **Constraint**: Requires high `max_tokens` (8k+).
