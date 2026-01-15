# ADK Runtime Adapter

This directory contains the runtime adapter for Google Cloud Vertex AI Agents (ADK).

## Configuration

The adapter is configured via environment variables:

- `GCP_PROJECT_ID`: (Required) The Google Cloud Project ID.
- `ADK_REGION`: (Optional) The region for Vertex AI endpoints. Defaults to `us-central1`.

Authentication is handled automatically via `GOOGLE_APPLICATION_CREDENTIALS` or standard gcloud auth.

## Usage (Internal)

This adapter is designed to be called by the Northstar Core shim, but can be invoked directly for testing.

```python
from runtime.adk.client import run_adk_agent
from runtime.adk.types import AdkAgentRequest

req = AdkAgentRequest(
    tenant_id="test-tenant",
    surface_id="squared",
    agent_id="gemini-1.5-flash-001", # invoking model for test
    session_id="session-123",
    user_message="Hello, ADK!"
)

resp = run_adk_agent(req)
print(resp.messages[0].content)
```

## Implementation Notes

- Currently supports a "model-as-agent" stub if `agent_id` does not look like a full resource path.
- Proper Agent Builder / Dialogflow CX integration paths are stubbed for future expansion.
