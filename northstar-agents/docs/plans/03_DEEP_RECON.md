# 03_DEEP_RECON: The Northstar Audit

**Date**: 2026-01-10
**Architect**: Jules
**Status**: INVENTORY COMPLETE

## 1. Executive Summary

This audit catalogs the current assets in `northstar-agents` and `northstar-engines` to prepare for the "Northstar Lab" build and Token Accounting implementation.

**Key Findings:**
- **Token Accounting Gap**: Most Gateways (`AzureOpenAIGateway`, `BedrockGateway`, `VertexGateway`) do **NOT** currently return usage statistics (tokens). Only `OpenRouterGateway` appears to try.
- **Gemini 1.5 Legacy**: Multiple references to `gemini-1.5` exist in models, tests, and engine configs. These must be purged.
- **Commerce Layer**: `engines/budget/cogs.py` contains hardcoded prices for Gemini 1.5. This is insufficient for a multi-provider strategy.

## 2. Gateway Inventory (Token Usage Status)

| Gateway | File Path | Usage Status | Action Required |
| :--- | :--- | :--- | :--- |
| **OpenRouter** | `providers/openrouter.py` | ✅ Partial | Verify schema matches standard. |
| **Azure OpenAI** | `providers/azure_openai.py` | ❌ MISSING | Update `generate` to extract usage from response. |
| **Bedrock** | `providers/bedrock.py` | ❌ MISSING | Update `converse` call to extract `response['usage']`. |
| **Vertex** | `providers/vertex.py` | ❌ MISSING | Update `generate_content` to extract usage metadata. |
| **Gemini** | `providers/gemini.py` | ❌ MISSING | Update to extract usage. |
| **Groq** | `providers/groq.py` | ❓ Unknown | Audit and Fix. |

## 3. Gemini 1.5 Purge List

The following files contain references to `gemini-1.5` (Flash/Pro) and must be updated to Gemini 2.5 / 3.0 or generic pointers.

**Registry Cards:**
- `northstar-agents/src/northstar/registry/cards/models/vertex_default.yaml`
- `northstar-agents/src/northstar/registry/cards/models/new_models.yaml` (Multiple entries)
- `northstar-agents/src/northstar/registry/cards/capability_bindings/new_bindings.yaml`

**Code & Tests:**
- `northstar-agents/tests/manual/probe_harness.py`
- `northstar-engines/engines/three_wise/service.py`
- `northstar-engines/engines/chat/service/llm_client.py`

**Configs:**
- `northstar-engines/deploy/dev/engines-chat.yaml`
- `northstar-engines/engines/budget/cogs.py` (Price Table)

## 4. Asset Inventory

### Providers (Registry)
*Located in: `northstar-agents/src/northstar/registry/cards/providers/`*
- Azure OpenAI
- Bedrock
- Vertex
- (Others inferred from gateway files but need registry cards: OpenRouter, Groq, Mistral)

### Models (Registry)
*Located in: `northstar-agents/src/northstar/registry/cards/models/`*
- `vertex_default`
- `bedrock_default`
- `azure_default`
- Specific versions (e.g., `aws_bedrock_anthropic_claude_sonnet_4_5_20250929_v1_0`)

### Capabilities
*Located in: `northstar-agents/src/northstar/registry/cards/capabilities/`*
- `web_grounding`
- `code_exec`
- `computer_use`
- `image_gen`
- `video_gen`
- `tts`
- `long_context_cache`
- `tool_use`
- `vision`

### Agents (Personas)
*Located in: `northstar-agents/src/northstar/registry/cards/personas/`*
- `brand_writer_v1`
- `system_designer_v1`

## 5. Next Steps

1.  **Standardize Gateway Returns**: Modify `LLMGateway.generate` return signature to strictly include `usage: { input_tokens: int, output_tokens: int }`.
2.  **Implement Price Book**: Create `northstar-engines/data/price_book.json` to replace `cogs.py` hardcoding.
3.  **Build The Lab**: Proceed with `03_NORTHSTAR_LAB.md` execution.
