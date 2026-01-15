from typing import Dict, Any, Callable, Awaitable, TypedDict, Literal
from src.core.blackboard import Blackboard
import traceback
import asyncio

try:
    from langgraph.graph import StateGraph, END
    LANGGRAPH_INSTALLED = True
except ImportError:
    LANGGRAPH_INSTALLED = False

class RouterState(TypedDict):
    decision: str
    path_taken: str
    final_output: str

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes LangGraph Conditional Router Mode.
    Graph: Start -> Router (Logic) -> Node A or Node B -> End.
    """
    if not LANGGRAPH_INSTALLED:
         return {"status": "FAIL", "reason": "LangGraph not installed"}

    try:
        decision_input = inputs.get("decision", "A")
        
        await emit(f"Initializing LangGraph Router with decision: {decision_input}", {"event_type": "info"})

        # 1. Define Nodes
        def start_node(state: RouterState):
            return {"decision": decision_input} # Pass through

        def node_a(state: RouterState):
            return {"path_taken": "A", "final_output": "Executed Path A"}

        def node_b(state: RouterState):
            return {"path_taken": "B", "final_output": "Executed Path B"}

        # 2. Define Router Logic
        def route_decision(state: RouterState) -> Literal["node_a", "node_b"]:
            if state["decision"] == "A":
                return "node_a"
            return "node_b"

        # 3. Build Graph
        builder = StateGraph(RouterState)
        builder.add_node("start", start_node)
        builder.add_node("node_a", node_a)
        builder.add_node("node_b", node_b)

        builder.set_entry_point("start")
        
        # Conditional Edge
        builder.add_conditional_edges(
            "start",
            route_decision,
            {
                "node_a": "node_a",
                "node_b": "node_b"
            }
        )

        builder.add_edge("node_a", END)
        builder.add_edge("node_b", END)

        graph = builder.compile()

        # 4. Execute
        final_state = await graph.ainvoke({"decision": decision_input, "path_taken": "none", "final_output": ""})
        
        output_msg = final_state["final_output"]
        await emit(f"Graph Execution Complete. Output: {output_msg}", {"event_type": "success"})
        
        return {
            "status": "PASS", 
            "path_taken": final_state["path_taken"],
            "final_output": output_msg
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
