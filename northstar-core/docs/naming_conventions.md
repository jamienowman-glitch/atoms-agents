# Naming Conventions (Northstar Core)

## Registry Structure
- **Agents** (`registry/agents/`): Define Persona, Manifest, and **Prompt Templates**.
- **Flows** (`registry/flows/<runtime>/`): Define Orchestration Only. **NO PROMPTS**.

## Testing & Artifacts
The `apps/test_harness_ui` generates runs with the following structure:

- **Test Slug**: `youtube_multiframework_v1`
- **Run ID**: `run_<YYYYMMDD_HHMMSS>`

### Artifact Naming
Artifacts are generated in `registry/run_artifacts/<slug>/<run_id>/`:

| Step | Filename Pattern | Description |
|---|---|---|
| Intern | `step_01__intern__youtube_ideas.txt` | Bulleted list of ideas |
| Spanish | `step_02__spanish__es_titles.txt` | Translated titles |
| | `step_03__spanish__co_titles.txt` | Colombian adaptations |
| | `step_04__spanish__post_spain.txt` | Community post (Spain) |
| | `step_05__spanish__poll_colombia.txt` | Community poll (Colombia) |
| Debate | `step_06__english__debate_transcript.txt` | Full chat transcript (Round 1-3) |
| | `step_07__english__winner.txt` | Final winner & justification |

## Runtime Adapters
Adapters must support:
1. **Card Injection**: Read `flow.yaml` -> `agent.yaml`.
2. **Instruction Templates**: Inject inputs into `instruction_templates`.
3. **Stream Callback**: Accept a `stream_callback(event)` to emit live logs to the UI.
