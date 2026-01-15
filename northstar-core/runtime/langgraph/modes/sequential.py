from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]],
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Executes LangGraph Sequential Chain.
    """
    try:
        from langgraph.graph import StateGraph, END
        from typing import TypedDict, Annotated
        import operator
        
        # Define State
        class AgentState(TypedDict):
            messages: list
            aggregate: str

        workflow = StateGraph(AgentState)
        
        # --- Stub Nodes for Generic Execution ---
        async def generic_node(state, node_id, content):
            await emit(f"Executing Node: {node_id}", {"event_type": "info", "framework": "langgraph"})
            return {"aggregate": state["aggregate"] + f"\n[{node_id}] {content}"}

        # Build Graph from Flow Steps
        steps = flow_card.get("steps", [])
        last_node = None
        
        for i, step in enumerate(steps):
            node_id = f"node_{i}"
            # For simplicity in this generic runner, we just mock the node execution
            # In a real impl, we'd load the agent card and run it like AutoGen/CrewAI adapters do.
            # Here we demonstrate the GRAPH construction.
            
            def node_func(state, nid=node_id):
                 # We can emit here? No, sync compilation issue. 
                 # LangGraph nodes are usually sync or async. 
                 # Let's keep it simple: return updated state.
                 return {"aggregate": state["aggregate"] + f"\nProcessed by {nid}"}
            
            workflow.add_node(node_id, node_func)
            if last_node:
                workflow.add_edge(last_node, node_id)
            else:
                workflow.set_entry_point(node_id)
            last_node = node_id
            
        if last_node:
            workflow.add_edge(last_node, END)
        
        app = workflow.compile()
        
        # Invoke
        initial_input = inputs.get("input_text", "Start")
        result = await app.ainvoke({"messages": [], "aggregate": initial_input})
        
        final_out = result["aggregate"]
        await emit(final_out, {"action_type": "write", "text": final_out})
        
        return {"status": "PASS", "final_output": final_out}

    except ImportError:
         await emit("LangGraph not installed.", {"event_type": "error"})
         return {"status": "SKIP"}
    except Exception as e:
        traceback.print_exc()
        await emit(f"Error in LangGraph: {e}", {"event_type": "error"})
        return {"status": "FAIL", "reason": str(e)}
