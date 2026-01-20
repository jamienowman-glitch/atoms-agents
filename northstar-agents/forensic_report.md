# Agent Repo Forensic Report

## 🔨 TASK 1: THE TRANSPORT CHECK

*   **Transport Status**: **PARTIAL**
    *   **Files Found**:
        *   `src/northstar/runtime/canvas_mirror.py`: Contains `CanvasMirror` class which subscribes to SSE.
        *   `src/northstar/runtime/node_executor.py`: References `canvas_mirror` and ingests tools.
    *   **Event Handling**:
        *   `CANVAS_READY`: **FOUND**. Handled in `CanvasMirror.get_tools()` (lines 56-69).
        *   `SPATIAL_UPDATE`: **NOT FOUND**. `grep` returned 0 results. The agent implementation for handling spatial updates is currently missing.
    *   **Conclusion**: The "Mirror" exists and can see tools, but it is blind to spatial updates.

## 🔨 TASK 2: MODEL PROVIDER INVENTORY

*   **Location**: `src/northstar/runtime/providers/`
*   **Current Providers**:
    *   `AzureOpenAI` (`azure_openai.py`)
    *   `Bedrock` (`bedrock.py`)
    *   `Comet` (`comet.py`)
    *   `Gemini` (`gemini.py`)
    *   `Groq` (`groq.py`)
    *   `Jules` (`jules.py`)
    *   `Nvidia` (`nvidia.py`)
    *   `OpenRouter` (`openrouter.py`)
    *   `Vertex` (`vertex.py`)
    *   *Note: No `LocalAI` file found.*
*   **Action**: Ask me to add new providers to this directory.

## 🔨 TASK 3: REGISTRY AWARENESS

*   **Local Registry**: **YES**
    *   **Files**:
        *   `src/northstar/registry/loader.py`: The logic to load tools/capabilities.
        *   `src/northstar/registry/cards/`: The directory containing YAML definitions (where specific **Model** cards like `gpt-4o.yaml` live).
    *   **Mechanism**: The `RegistryLoader` reads YAML cards into `RegistryContext`. It is NOT hardcoded; it is file-based.
    *   **Tool Lookup**: Via `RegistryContext.capabilities` or `RegistryContext.bindings`.

---

## 🔍 SUMMARY for Central Registry Update

*   **Transport Status**: `src/northstar/runtime/canvas_mirror.py` (Handling `CANVAS_READY`, missing `SPATIAL_UPDATE`)
*   **Current Providers**: `azure_openai`, `bedrock`, `comet`, `gemini`, `groq`, `jules`, `nvidia`, `openrouter`, `vertex` -> `src/northstar/runtime/providers/`
*   **Local Registry**: `src/northstar/registry/` (File-based YAML loader)
