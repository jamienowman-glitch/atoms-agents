from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode
from atoms_agents.runtime.frameworks.langgraph import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: langgraph.human_approval
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("langgraph.human_approval", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "langgraph.human_approval" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "langgraph.human_approval", "error": str(e) }
