from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode
from atoms_agents.runtime.frameworks.autogen import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: autogen.round_robin_groupchat
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("autogen.round_robin_groupchat", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "autogen.round_robin_groupchat" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "autogen.round_robin_groupchat", "error": str(e) }
