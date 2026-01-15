# Firearms vs Strategy Lock: Atomic Task List
**Date**: 2026-01-04

This task list defines the minimal steps to align the codebase with the `FIREARMS_STRATEGYLOCK_CLARIFICATION_2026-01-04.md`.

## /northstar-engines

### 1. Update Enforcement Error Codes
*   **Objective**: Align `GateChain` error responses with the new contract.
*   **Files**: `engines/nexus/hardening/gate_chain.py`
*   **Changes**:
    *   Firearms Block: Change `error` from `firearm_license_required` to `firearms.missing_grant`. Ensure `details` includes `required_license_types`.
    *   Strategy Lock Block: Change `error` from `strategy_lock_required` to `strategy_lock.required`.
*   **Acceptance Criteria**:
    *   Returns 403 `firearms.missing_grant` when grant is missing.
    *   Returns 403 `strategy_lock.required` when lock is missing.

### 2. Verify/Refactor Logic Separation
*   **Objective**: Ensure "Strategy Lock" logic in GateChain relies on *Config Resolution* (`resolve_strategy_lock`) rather than purely the Firearm Binding's `strategy_lock_required` flag (which should act as a default input to resolution, or a hard constraint?).
    *   *Clarification*: The prompt says "Default linkage is allowed only as a convenience... This is a default only, and must be overrideable".
    *   *Implication*: The current code `force_strategy_lock = firearms_decision.strategy_lock_required` treats it as a HARD requirement.
    *   *Correction*: We must pass this as a "Strong Default" to `resolve_strategy_lock`, but allow Config to say "No, actually, we trust this".
    *   *Actually*: Prompt says "Enterprise tenants can turn strategy lock off while keeping firearms enforced."
    *   *Action*: Modify `GateChain` to pass the binding's recommendation to `resolve_strategy_lock` as the "System/Base Requirement", which configuration can then override (if allowed). For now, implementation will just ensure `resolve_strategy_lock` is the final arbiter.
*   **Files**: `engines/nexus/hardening/gate_chain.py`, `engines/strategy_lock/resolution.py`.

### 3. Update Firearms Service to Return License Types
*   **Objective**: The error contract requires `details.required_license_types`.
*   **Files**: `engines/firearms/service.py`, `engines/firearms/models.py`.
*   **Changes**: Update `FirearmDecision` to include `required_license_types` (list of strings).

## /northstar-agents

### 4. Integrity Check (No Changes Expected)
*   **Objective**: Ensure we have NOT touched existing cards.
*   **Task**: Verify `src/northstar/registry` only contains NEW folders (`firearms`, `firearm_bindings`).
*   **Constraint**: DO NOT MODIFY existing agent/persona/tool definitions.

## /ui

### 5. Contract Stubs (No Changes Yet)
*   **Note**: UI implementation is deferred. No tasks here for this worker context.

## Verification

### 6. Alignment Tests
*   **File**: `engines/tests/test_firearms_alignment.py`
*   **Tests**:
    *   Test `firearms.missing_grant` error shape.
    *   Test `strategy_lock.required` error shape.
    *   Test that Strategy Lock can be disabled via config even if Firearm is attached (if we implement that override logic now).
