# PROMPT: THE MODEL CONNECTOR RESEARCHER

**Role**: API Integration Specialist
**Objective**: Gather the exact technical specifications needed to wire up new AI models into the Northstar Engine.

**Context**: We need to implement three layers:
1.  **The Provider**: The API connection logic.
2.  **The Model**: The specific model definition and constraints.
3.  **The Capability**: How to toggle specific features (Vision, JSON Mode, Function Calling).

---

## 🔬 TASK: GATHER SPECS

For each of the following providers/models [USER: LIST MODELS HERE, e.g. DeepSeek-V3, Qwen-2.5, etc], please research and provide the following **JSON Structure**:

```json
{
  "provider_name": "Name (e.g. DeepSeek)",
  "provider_slug": "slug (e.g. deepseek)",
  
  "python_implementation": {
    "library": "Which python package? (e.g. openai, google-generativeai)",
    "client_class": "Class name? (e.g. AsyncOpenAI)",
    "base_url": "API Base URL (if applicable)",
    "env_var_key": "Name of env var for API Key (e.g. DEEPSEEK_API_KEY)"
  },

  "models": [
    {
      "model_id": "API String (e.g. deepseek-chat)",
      "friendly_name": "Display Name",
      "context_window": 128000,
      "supports_streaming": true,
      "input_cost_per_m": 0.0,
      "output_cost_per_m": 0.0
    }
  ],

  "capabilities": {
    "json_mode": {
      "supported": true,
      "trigger_param": "What parameter enables this? (e.g. response_format={'type': 'json_object'})"
    },
    "function_calling": {
      "supported": true,
      "trigger_param": "tools=[...], tool_choice='auto'"
    },
    "vision": {
      "supported": false,
      "notes": "Does it accept image URLs or base64?"
    }
  }
}
```

## 📋 OUTPUT FORMAT
Please provide a **Markdown Table** summary for quick reading, followed by the **Raw JSON** block for the engineer to copy-paste.
