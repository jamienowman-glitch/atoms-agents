from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.runtime.frameworks.strands import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: strands.default
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("strands.default", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "strands.default" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "strands.default", "error": str(e) }
