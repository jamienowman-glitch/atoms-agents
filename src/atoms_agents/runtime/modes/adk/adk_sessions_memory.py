from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode
from atoms_agents.runtime.frameworks.adk import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: adk.sessions_memory
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("adk.sessions_memory", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "adk.sessions_memory" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "adk.sessions_memory", "error": str(e) }
