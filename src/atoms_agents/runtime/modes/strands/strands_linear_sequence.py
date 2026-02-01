from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode
from atoms_agents.runtime.frameworks.strands import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: strands.linear_sequence
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("strands.linear_sequence", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "strands.linear_sequence" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "strands.linear_sequence", "error": str(e) }
