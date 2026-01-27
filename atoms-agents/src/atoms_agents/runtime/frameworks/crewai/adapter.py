from typing import Tuple, Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode

def is_available() -> Tuple[bool, str]:
    try:
        import crewai  # noqa: F401
        return True, ""
    except ImportError:
        return False, "crewai package not installed"

def minimal_smoke(mode_id: str, input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    available, reason = is_available()
    if not available:
        raise SkipMode(reason)

    return {"status": "PASS", "mode_id": mode_id, "output": {"msg": "CrewAI imported successfully"}}
