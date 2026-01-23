# Plan 05: Registry Atomicity & UI Alignment

**Phase**: 4 - Registry Atomicity & UI Alignment
**Target**: `northstar-agents` (Registry)
**Status**: DRAFT

## 1. Executive Summary (The Gap)
The "Visual Grammar" (Magnifier Machine) requires a granular data structure that our current Registry does not support.
Currently, `ModelCard` relies on "lumpy" strings (e.g., `model_id: aws_bedrock_anthropic_claude_3_7_sonnet_20250219_v1_0`).
The UI needs to perform these splits:
- **Provider**: `aws_bedrock`
- **Family**: `anthropic.claude`
- **Version**: `3.7-sonnet`
- **Variant**: `20250219-v1:0`

We must refactor the Registry to support this "Atomic Schema" without breaking existing loaders.

## 2. Deep Recon Report

### 2.1 Model Atomicity
**Current State**:
- `model_id`: Monolithic string.
- `model_or_deployment_id`: Provider-specific string.
- **Missing**: Explicit `family`, `version`, `parameter_count`, `reasoning_effort`.

**Example Gap**:
`deepseek_r1.yaml` has `friendly_name: DeepSeek R1 (Reasoning)` but no structured field for `reasoning_effort` (Low/High/o1-level) that the UI slider requires.

### 2.2 Framework Atomicity
**Current State**:
- `ModeCard` defines a specific configuration (e.g., `crewai.crew_hierarchical`).
- **Missing**: A higher-level `FrameworkCard` that aggregates these modes. The UI needs to show "CrewAI" (Hexagon) -> "Select Mode" (Hierarchical/Sequential). Currently, we only have the leaf nodes (Modes).

### 2.3 Capability Atomicity
**Current State**:
- Capabilities are reasonably granular (`web_grounding`, `code_exec`), but lack a hierarchy (e.g., `vision` vs `vision.video_input`).

## 3. The New Atomic Schema

### 3.1 Refactored `ModelCard`
We will introduce a `ModelFamilyCard` and update `ModelCard`.

**`ModelFamilyCard` (New)**:
```yaml
card_type: model_family
family_id: anthropic.claude
name: Claude
provider_ids: [aws_bedrock, openrouter, gcp_vertex]
description: "High-intelligence reasoning models."
```

**`ModelCard` (Updated)**:
```yaml
card_type: model
model_id: aws_bedrock_anthropic_claude_3_7
family_id: anthropic.claude
provider_id: aws_bedrock
# Atomic Fields for UI Sliders
version: "3.7"
variant: "sonnet"
reasoning_effort: "high" # low | medium | high | o1
context_window: 200000
# Technical Binding
official_id: anthropic.claude-3-7-sonnet-20250219-v1:0
```

### 3.2 Refactored `FrameworkCard`
We need to group Modes under a Framework.

**`FrameworkCard` (New)**:
```yaml
card_type: framework
framework_id: crewai
name: CrewAI
description: "Orchestration for role-playing agents."
supported_modes:
  - crewai.sequential
  - crewai.hierarchical
  - crewai.flow_hybrid
```

## 4. Execution Plan (Draft)

### Phase 4.1: Schema Definition
1.  Update `northstar-agents/src/northstar/registry/schemas/models.py`: Add `ModelFamilyCard` and update `ModelCard`.
2.  Update `northstar-agents/src/northstar/registry/schemas/frameworks.py`: Add `FrameworkCard`.
3.  Update `loader.py` to ingest these new types.

### Phase 4.2: Data Migration
1.  **Create Families**: Write YAMLs for `gpt`, `claude`, `gemini`, `llama`, `deepseek`.
2.  **Refactor Models**: Rewrite existing `models/*.yaml` to use the new fields.
    - *Constraint*: Keep `model_id` as the primary key but ensure `official_id` is the deployment target.
3.  **Create Frameworks**: Write `crewai.yaml`, `autogen.yaml`, `langgraph.yaml`.

### Phase 4.3: UI Data Provider
1.  Update `RegistryService` (in Agents) to expose `list_families()` and `list_frameworks()`.
2.  Ensure `list_models(family_id=...)` returns the filtered list for the Right Magnifier.

## 5. Success Criteria
- [ ] Registry contains `card_type: model_family`.
- [ ] `ModelCard` has `reasoning_effort` field.
- [ ] Can query "All Claude Models on Bedrock".
- [ ] Can query "All Frameworks".
