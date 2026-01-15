from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.runtime.frameworks.autogen import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: autogen.human_input
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("autogen.human_input", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "autogen.human_input" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "autogen.human_input", "error": str(e) }
