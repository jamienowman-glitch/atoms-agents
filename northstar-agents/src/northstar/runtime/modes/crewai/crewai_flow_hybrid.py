from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.runtime.frameworks.crewai import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: crewai.flow_hybrid
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("crewai.flow_hybrid", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "crewai.flow_hybrid" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "crewai.flow_hybrid", "error": str(e) }
