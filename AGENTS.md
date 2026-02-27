# Atoms Agents AGENTS.md (Local Notes)
Last Updated: 2026-02-17

## Global Law Source (Mandatory)
1. Global constitutional law lives at `/Users/jaynowman/dev/AGENTS.md`.
2. Do not fork or redefine global law in this file.

## Repo Role
1. `atoms-agents` owns agent cards, runtime orchestration, and workbench APIs.
2. It consumes shared contracts from `atoms-core`.

## Read First
1. `/Users/jaynowman/dev/atoms-agents/.codex/skills/atomic-model-providers/SKILL.md`
2. `/Users/jaynowman/dev/docs/plans/2026-02-13_factory_stabilization_single_truth_ledger.md`
3. `/Users/jaynowman/dev/docs/plans/2026-02-15_phase_h2_memory_gateway_strict_contract_atomic_task_plan.md`
4. `/Users/jaynowman/dev/docs/plans/2026-02-15_phase_h3_blackboard_batch_endpoint_atomic_task_plan.md`

## Repo-Local Rules
1. Registry remains card-driven (`registry/cards/*`).
2. Keep strict context identity in runtime pathways (tenant/project/run).
3. Keep loop controller + HUMAN_GATE behavior deterministic.
4. Store adapter references only; tuning binaries belong outside this repo.

## Validation
1. `uv run pytest /Users/jaynowman/dev/atoms-agents/tests/test_loop_controller.py`
2. `uv run pytest /Users/jaynowman/dev/atoms-agents/tests/test_memory_gateway_strict.py`
