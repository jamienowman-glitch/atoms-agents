from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode
from atoms_agents.runtime.frameworks.autogen import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: autogen.code_execution
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("autogen.code_execution", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "autogen.code_execution" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "autogen.code_execution", "error": str(e) }
