from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.exceptions import SkipMode
from atoms_agents.runtime.frameworks.crewai import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: crewai.crew_hierarchical
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("crewai.crew_hierarchical", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "crewai.crew_hierarchical" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "crewai.crew_hierarchical", "error": str(e) }
