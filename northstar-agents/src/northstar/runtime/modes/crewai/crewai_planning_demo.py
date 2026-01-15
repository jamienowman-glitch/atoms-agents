from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.runtime.frameworks.crewai import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: crewai.planning_demo
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("crewai.planning_demo", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "crewai.planning_demo" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "crewai.planning_demo", "error": str(e) }
