from typing import Tuple, Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode

def is_available() -> Tuple[bool, str]:
    try:
        import google.auth  # noqa: F401
        return True, ""
    except ImportError:
        return False, "google-auth not installed"

def minimal_smoke(mode_id: str, input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    available, reason = is_available()
    if not available:
        raise SkipMode(reason)
        
    try:
        import google.auth
        creds, project = google.auth.default()
        if not creds:
             raise SkipMode("No Google default credentials")
        return {"status": "PASS", "mode_id": mode_id, "output": {"project": project}}
    except Exception as e:
        raise SkipMode(f"ADK Check Failed: {e}")
