from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.runtime.frameworks.autogen import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: autogen.selector_groupchat
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("autogen.selector_groupchat", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "autogen.selector_groupchat" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "autogen.selector_groupchat", "error": str(e) }
