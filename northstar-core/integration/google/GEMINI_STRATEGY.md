# Gemini Unified Capability Strategy (Late 2025)

## Core Concept
Instead of calling separate APIs for Video/Image/Audio, we swap the **Model ID** (Engine) while using the unified Vertex/GenAI SDK. Tools (Search/Maps/Code) are toggles on the request.

## Model ID Matrix (The "Nano Banana" Variants)

| Capability | Model ID | Role |
|---|---|---|
| **Text/Reasoning** | `gemini-3-pro-preview` | Default engine. |
| **High-End Image** | `gemini-3-pro-image-preview` | "Thinking" visual engine. |
| **High-End Video** | `veo-3.1-generate-001` | Motion engine. |
| **Native Audio** | `gemini-2.5-flash-native-audio` | Live steaming engine. |

## The "Smart Toggle" Logic

We implement a wrapper that determines the Model ID based on the requested capability.

```python
def generate_gemini_request(user_prompt, capabilities):
    # 1. Select the Base Model Engine
    model_id = "gemini-3-pro-preview" # Default
    
    if capabilities.get("video"):
        model_id = "veo-3.1-generate-001"
    elif capabilities.get("image"):
        model_id = "gemini-3-pro-image-preview"
    elif capabilities.get("audio_live"):
        model_id = "gemini-2.5-flash-native-audio"

    # 2. Add the "Flick-on" Tools
    tools = []
    if capabilities.get("web_search"):
        tools.append({"google_search": {}})
    if capabilities.get("maps"):
        tools.append({"google_maps": {}})
    if capabilities.get("code_sandbox"):
        tools.append({"code_execution": {}})

    # 3. Unified Call
    # client = ... (Vertex AI or GenAI SDK)
    return client.models.generate_content(
        model=model_id,
        contents=user_prompt,
        config={"tools": tools}
    )
```

## Agent Garden References
- **Podcast Agent**: `python/agents/podcast_transcript_agent` (in ADK Samples).
- **Marketing Agency**: `python/agents/marketing-agency` (in ADK Samples).
*Strategy: Port these logic flows into Northstar Cards rather than calling external endpoints.*
