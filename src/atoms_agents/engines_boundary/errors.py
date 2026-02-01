from typing import Any, Dict, Optional


class SafetyBlocked(Exception):
    def __init__(
        self,
        http_status: int,
        error: str,
        gate: Optional[str],
        action_name: Optional[str],
        details: Dict[str, Any],
    ) -> None:
        self.http_status = http_status
        self.error = error
        self.gate = gate
        self.action_name = action_name
        self.details = details
        super().__init__(error)

    def __repr__(self) -> str:  # pragma: no cover - cosmetic
        return (
            f"SafetyBlocked(status={self.http_status}, error={self.error!r}, "
            f"gate={self.gate!r}, action={self.action_name!r}, details={self.details!r})"
        )


def parse_safety_error(http_status: int, body: Dict[str, Any]) -> SafetyBlocked:
    error = ""
    gate: Optional[str] = None
    action_name: Optional[str] = None
    details: Dict[str, Any] = {}

    if isinstance(body, dict):
        if "error" in body:
            error_val = body.get("error")
            error = str(error_val) if error_val is not None else ""
            gate_val = body.get("gate")
            action_val = body.get("action") or body.get("action_name")
            gate = str(gate_val) if gate_val is not None else None
            action_name = str(action_val) if action_val is not None else None
            details = {
                k: v
                for k, v in body.items()
                if k not in {"error", "gate", "action", "action_name"}
            }
        elif "detail" in body:
            detail_val = body.get("detail")
            error = str(detail_val) if detail_val is not None else ""
            details = {"detail": detail_val}
    else:
        error = str(body)

    if not error:
        error = "safety_blocked"

    return SafetyBlocked(http_status, error, gate, action_name, details)
