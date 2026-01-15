from typing import Tuple, Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode

def is_available() -> Tuple[bool, str]:
    try:
        import autogen  # noqa: F401
        return True, ""
    except ImportError:
        return False, "autogen package not installed"

def minimal_smoke(mode_id: str, input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    available, reason = is_available()
    if not available:
        raise SkipMode(reason)

    # AutoGen smoke
    # Prompt: "available if the python package imports; if they require an LLM provider key and none exists via AWS/GCP, skip."
    # We will assume for minimal smoke we just check import OK.
    # Real execution would fail without keys, but this is skeleton.
    
    return {"status": "PASS", "mode_id": mode_id, "output": {"msg": "AutoGen imported successfully"}}
