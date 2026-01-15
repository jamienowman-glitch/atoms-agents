# Discovered Provider Surfaces

## Supported Providers (Code Exists)

### AWS Bedrock
- **Source**: `runtime/bedrock/`
- **Client**: `boto3.client("bedrock-runtime")`
- **Auth**: Uses standard `boto3` credential chain (Environment, Profile, IAM Role).
- **Capabilities**: Text, Vision (Converse API), Streaming.

### Google ADK (GenAI SDK)
- **Source**: `runtime/adk/`
- **Client**: `google.genai.Client` (Wrapper around Vertex/Gemini).
- **Auth**: `vertexai.init()` or standard Google ADC.
- **Capabilities**: Text, Tools, Multimodal.

## Unsupported Providers (No Code Found)

### Azure
- **Status**: UNSUPPORTED
- **Reason**: No `azure-ai-*` or `azure-identity` imports found in `runtime/` or `src/`.
- **Action**: Mark all Azure capabilities as UNSUPPORTED/SKIP in matrix.

### OpenAI (Direct)
- **Status**: UNSUPPORTED (Direct)
- **Reason**: No direct `openai` client usage found in "blessed" runtimes (except potentially via `langgraph` or `autogen` adapters if configured, but user requested *provider-backed* capabilities).
- **Note**: If `autogen` or `langgraph` use `openai` via their internal config, that is a *framework* detail, not a *provider* surface we control directly for atomic capabilities. User specified "No new vendors... unless reachable through existing first-class providers".

### Anthropic (Direct)
- **Status**: UNSUPPORTED (Direct)
- **Reason**: Accessed via AWS Bedrock (Supported) or Vertex (if configured). Direct `anthropic` client not found in `runtime/`.

## Conclusion
We will implement Atomic Capabilities for:
1. **AWS Bedrock** (`src/capabilities/bedrock/`)
2. **Google ADK/Vertex** (`src/capabilities/adk/` or `src/capabilities/gcp/`)

All others will be marked UNSUPPORTED in the live matrix.
