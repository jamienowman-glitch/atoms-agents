from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.runtime.frameworks.langgraph import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: langgraph.sequential_chain
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("langgraph.sequential_chain", input_json, ctx)
    except SkipMode as e:
        return { "status": "SKIPPED", "reason": str(e), "mode_id": "langgraph.sequential_chain" }
    except Exception as e:
        return { "status": "FAIL", "mode_id": "langgraph.sequential_chain", "error": str(e) }
