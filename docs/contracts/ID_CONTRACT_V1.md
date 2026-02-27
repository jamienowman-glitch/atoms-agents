# ID Contract V1

## Purpose
Lock one canonical ID system for atomic cards so provider, model, capability, and agent composition do not drift.

## Scope
Applies to:
- `/Users/jaynowman/dev/atoms-agents/registry/cards/providers/*.yaml`
- `/Users/jaynowman/dev/atoms-agents/registry/cards/models/*.yaml`
- `/Users/jaynowman/dev/atoms-agents/registry/cards/capability_bindings/*.yaml`
- `/Users/jaynowman/dev/atoms-agents/registry/cards/agents/*.yaml`
- `/Users/jaynowman/dev/atoms-agents/registry/cards/frameworks/*.yaml`

## Canonical Rules
1. `provider_id` is the transport namespace.
- Format: `^[a-z][a-z0-9_]*$`
- Canonical examples: `google_ai_studio`, `google_adk`, `gcp_vertex`, `aws_bedrock`, `openrouter`, `groq`, `openai`, `azure_openai`.
- One provider card per `provider_id`.

2. `model_id` is provider-scoped and globally unique.
- Format: `<provider_id>__<model_slug>`
- Example: `gcp_vertex__gemini_2_5_pro`
- Rule: same model family in multiple providers gets multiple `model_id` values.
- Never reuse one `model_id` across providers.

3. `official_id` is provider-native and never normalized.
- Store exact API/deployment string used at runtime.
- Examples: `gemini-2.5-pro`, `us.amazon.nova-pro-v1:0`.
- `official_id` is not used as a registry join key.

4. Cross-provider equivalence is defined by model metadata, not ID reuse.
- Use `family_id` + `version` + `variant` to express "same logical model through different providers."
- Example:
  - `google_ai_studio__gemini_2_5_pro`
  - `gcp_vertex__gemini_2_5_pro`
  - both map to `family_id: google.gemini`, `version: 2.5`, `variant: pro`.

5. `capability_binding.model_or_deployment_id` must point to `model_id`.
- Do not put `official_id` in bindings.
- Join path is `binding.provider_id == model.provider_id` and `binding.model_or_deployment_id == model.model_id`.

6. `binding_id` is deterministic.
- Format: `<provider_id>__<model_slug>__<capability_slug>`
- Example: `gcp_vertex__gemini_2_5_pro__tool_use`.

7. Agent card composition stays atomic.
- `agent_id` references only card IDs (`manifest_ref`, `persona_ref`, `task_ref`, `model_ref`, `reasoning_ref`, `framework_ref`, `capability_refs`).
- No provider/model/capability payload blobs inside agent cards.

## Canonical Provider Namespace (V1)
- `aws_bedrock`
- `gcp_vertex`
- `google_ai_studio`
- `google_adk`
- `openai`
- `azure_openai`
- `anthropic`
- `openrouter`
- `groq`
- `mistral`
- `nvidia`
- `elevenlabs`
- `huggingface`
- `jules`
- `comet`
- `gencast`

## Required Normalization From Current Cards
- `bedrock` -> `aws_bedrock`
- `vertex` -> `gcp_vertex`
- `gemini` -> `google_ai_studio`
- `provider.jules` -> `jules`
- `jules` (bindings) -> `jules` (provider card must match)

## CSV Intake Rule
- CSV is staging input only.
- IDs are generated/normalized by the production line, then written to cards.
- Human labels from CSV (`agent_name`, `human_name`, `agent_tag`) are not identity keys.

## Production Line Hook
All new provider/model/capability onboarding must run through:
- `/Users/jaynowman/dev/atoms-agents/.codex/skills/atomic-model-providers/SKILL.md`

Required intake evidence per run:
- provider docs URL(s)
- model catalog URL(s)
- capability docs URL(s)
- generated card diff
- live non-mock smoke result

## Non-Negotiables
- No relative IDs.
- No alias IDs after cutover.
- No hardcoded provider/model capability logic inside agent cards.
- No mocks for provider certification paths.
