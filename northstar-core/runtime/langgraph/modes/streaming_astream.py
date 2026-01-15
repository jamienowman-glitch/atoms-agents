from typing import Dict, Any, Callable, Awaitable, TypedDict, Annotated
from src.core.blackboard import Blackboard
import traceback
import asyncio
import operator

try:
    from langgraph.graph import StateGraph, END
    LANGGRAPH_INSTALLED = True
except ImportError:
    LANGGRAPH_INSTALLED = False

class StreamingState(TypedDict):
    count: int
    target: int
    messages: Annotated[list[str], operator.add]

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes LangGraph Streaming Mode.
    Uses 'astream' to emit events as the graph progresses.
    """
    if not LANGGRAPH_INSTALLED:
         return {"status": "FAIL", "reason": "LangGraph not installed"}

    try:
        target = inputs.get("count_to", 3)
        await emit(f"Initializing LangGraph Streaming (Target: {target})", {"event_type": "info"})

        # 1. Define Nodes
        def counter_node(state: StreamingState):
            current = state["count"]
            new_count = current + 1
            msg = f"Counted {new_count}"
            return {"count": new_count, "messages": [msg]}

        # 2. Build Graph
        builder = StateGraph(StreamingState)
        builder.add_node("counter", counter_node)
        builder.set_entry_point("counter")

        def should_continue(state: StreamingState):
            if state["count"] < state["target"]:
                return "counter"
            return END

        builder.add_conditional_edges("counter", should_continue)

        graph = builder.compile()

        # 3. Stream Execution
        # We use astream to get updates.
        # Note: 'output' mode returns the State at each step.
        chunk_count = 0
        final_state = {}
        
        async for chunk in graph.astream({"count": 0, "target": target, "messages": []}, stream_mode="updates"):
            # Chunk is a dict of node_name -> state_update
            for node, update in chunk.items():
                if "messages" in update:
                    # Emit specific message event
                    latest_msg = update["messages"][-1]
                    await emit(f"Stream Update: {latest_msg}", {"event_type": "stream_chunk", "data": latest_msg})
                
                if "count" in update:
                    chunk_count = update["count"]
                    # Track final state loosely
                    final_state = update

        await emit(f"Streaming Complete. Final Count: {chunk_count}", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "final_count": chunk_count,
            "chunks_received": chunk_count # roughly
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
