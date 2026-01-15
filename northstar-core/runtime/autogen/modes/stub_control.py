from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    await emit("Executing Control Stub...", {"event_type": "info", "framework": "autogen"})
    # INTENTIONAL FAILURE
    raise NotImplementedError("This is a control stub designed to fail.")
