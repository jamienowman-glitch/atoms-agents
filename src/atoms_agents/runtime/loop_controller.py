from enum import Enum
from typing import Optional, Dict, Any, List
from dataclasses import dataclass, field
import datetime

class LoopState(str, Enum):
    EXPLORE = "explore"
    STRATEGY_LOCK_PENDING = "strategy_lock_pending"
    STRATEGY_LOCKED = "strategy_locked"
    EXECUTE = "execute"
    QA_REVIEW = "qa_review"
    HUMAN_GATE = "human_gate"
    REFINE = "refine"
    RECAP = "recap"
    COMPLETE = "complete"
    FAILED = "failed"

@dataclass
class LoopContext:
    run_id: str
    tenant_id: str
    max_attempts: int = 3
    current_attempt: int = 1
    state_history: List[Dict[str, Any]] = field(default_factory=list)
    qa_passed: bool = False
    human_approved: bool = False
    artifacts: Dict[str, Any] = field(default_factory=dict)

class LoopController:
    """
    Manages the state transitions for the Factory Loop V1.
    Enforces guards like max_attempts, qa_pass, and human_approval.
    """
    # Canonical state transitions for V1
    ALLOWED_TRANSITIONS = {
        LoopState.EXPLORE: [LoopState.STRATEGY_LOCK_PENDING, LoopState.EXECUTE, LoopState.FAILED],
        LoopState.STRATEGY_LOCK_PENDING: [LoopState.STRATEGY_LOCKED, LoopState.FAILED],
        LoopState.STRATEGY_LOCKED: [LoopState.EXECUTE, LoopState.FAILED],
        LoopState.EXECUTE: [LoopState.QA_REVIEW, LoopState.FAILED],
        LoopState.QA_REVIEW: [LoopState.COMPLETE, LoopState.REFINE, LoopState.HUMAN_GATE, LoopState.RECAP, LoopState.FAILED],
        LoopState.HUMAN_GATE: [LoopState.EXECUTE, LoopState.REFINE, LoopState.COMPLETE, LoopState.FAILED],
        LoopState.REFINE: [LoopState.EXECUTE, LoopState.FAILED],
        LoopState.RECAP: [LoopState.COMPLETE, LoopState.FAILED],
        LoopState.COMPLETE: [],
        LoopState.FAILED: []
    }

    def __init__(self, context: LoopContext):
        self.context = context
        self._current_state = LoopState.EXPLORE
        # If history exists, sync current state with last entry
        if self.context.state_history:
            self._current_state = LoopState(self.context.state_history[-1]["to_state"])

    @property
    def current_state(self) -> LoopState:
        return self._current_state

    def transition(self, target_state: LoopState, reason: str = "") -> bool:
        """
        Attempts to transition to the target state.
        Returns True if successful, raises ValueError if transition is invalid.
        """
        # 1. Basic FSM Guard
        allowed = self.ALLOWED_TRANSITIONS.get(self._current_state, [])
        if target_state not in allowed and target_state != self._current_state:
            raise ValueError(f"Invalid transition from {self._current_state} to {target_state}")

        # 2. Logic Guards
        if target_state == LoopState.COMPLETE:
            if not self.context.qa_passed and not self.context.human_approved:
                 raise ValueError("Cannot transition to COMPLETE without qa_passed=True or human_approved=True")

        if target_state == LoopState.REFINE:
             if self.context.current_attempt >= self.context.max_attempts:
                 self._set_state(LoopState.FAILED, f"Max attempts {self.context.max_attempts} reached.")
                 return False
             self.context.current_attempt += 1

        # 3. Record transition
        self._set_state(target_state, reason)
        return True

    def _set_state(self, state: LoopState, reason: str):
        from_state = self._current_state
        self._current_state = state
        transition_entry = {
            "from_state": from_state.value if isinstance(from_state, LoopState) else from_state,
            "to_state": state.value if isinstance(state, LoopState) else state,
            "ts": datetime.datetime.now().isoformat(),
            "reason": reason,
            "attempt": self.context.current_attempt,
            "qa_passed": self.context.qa_passed,
            "human_approved": self.context.human_approved
        }
        self.context.state_history.append(transition_entry)
        print(f"[LoopController] {from_state} -> {state} (Attempt {self.context.current_attempt}). Reason: {reason}")

    def evaluate_qa(self, success: bool, feedback: str = "") -> LoopState:
        """
        Evaluates QA result and determines next state.
        """
        print(f"[LoopController] Evaluating QA Result: Success={success}, Feedback={feedback}")
        if success:
            self.context.qa_passed = True
            return LoopState.COMPLETE
        else:
            self.context.qa_passed = False
            return LoopState.REFINE

    def evaluate_human_gate(self, approved: bool, feedback: str = "") -> LoopState:
        """
        Evaluates Human Gate result and determines next state.
        """
        print(f"[LoopController] Evaluating Human Gate: Approved={approved}, Feedback={feedback}")
        if approved:
            self.context.human_approved = True
            return LoopState.COMPLETE # In V1, human approval often skips further loops
        else:
            self.context.human_approved = False
            return LoopState.REFINE
