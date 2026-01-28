from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode
from atoms_agents.runtime.frameworks.crewai import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: crewai.execution_async
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("crewai.execution_async", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "crewai.execution_async" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "crewai.execution_async", "error": str(e) }
