from typing import Tuple, Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode

def is_available() -> Tuple[bool, str]:
    return False, "official docs unknown in source-of-truth TSV"

def minimal_smoke(mode_id: str, input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    available, reason = is_available()
    if not available:
        raise SkipMode(reason)
    return {}
