# Runtime Compatibility Contract

## Overview
`northstar-core` serves as a thin orchestration layer that can host multiple runtimes (e.g., LangGraph, ADK). To maintain this flexibility and avoid "thick" logic in the core, all runtimes must adhere to the `RuntimeAdapter` interface.

## Interface
All adapters must implement the `invoke` method:

```python
def invoke(self, card_id: str, input_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    ...
```

### Inputs
1.  **card_id**: A string reference to a Card. The Card contains *data* (YAML/JSON) that defines the behavior (system instructions, tool definitions, steps). The code must NOT infer behavior.
2.  **input_data**: A dictionary of inputs for the execution.
3.  **context**: A dictionary containing request-scoped context.
    *   `tenant_id` (Required)
    *   `env` (Required: e.g., 'dev', 'prod')
    *   `user_id` (Optional)

### Outputs
*   **Result**: A dictionary containing the execution output.

## Forbidden Patterns (Strict)
1.  **No Business Logic**: Adapters must not contain `if card_id == 'foo': do_special_thing()`.
2.  **No Prompts in Code**: All prompt text must live in the Card data, never in Python strings.
3.  **No Governance**: Policy checks (Strategy Lock, permissions) belong in the governance hooks or the runtime execution path, not hardcoded in the adapter.

## Supported Runtimes

| Runtime | Framework | Auth Chain | Notes |
| :--- | :--- | :--- | :--- |
| `runtime/adk` | Google Cloud Vertex AI Agents (ADK) | `GOOGLE_APPLICATION_CREDENTIALS` | Uses standard GCP auth chain. |
| `runtime/langgraph` | LangChain / LangGraph | Environment Variables | API keys must be in env (e.g. `OPENAI_API_KEY`). |
| `runtime/strands` | AWS Strands | `AWS_PROFILE` / default chain | Uses standard boto3 auth chain. |
| `runtime/bedrock_agents` | AWS Bedrock Agents | `AWS_PROFILE` / default chain | Uses standard boto3 auth chain. |
| `runtime/autogen` | Microsoft AutoGen | Environment Variables | API keys must be in env. |
| `runtime/crewai` | CrewAI | Environment Variables | API keys must be in env. |
