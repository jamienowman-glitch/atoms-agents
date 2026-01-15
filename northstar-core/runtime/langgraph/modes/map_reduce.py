from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import operator
from typing import Annotated, List, TypedDict

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes LangGraph MapReduce.
    """
    try:
        from langgraph.graph import StateGraph, END
        
        # 1. Define State
        class State(TypedDict):
            inputs: List[str]
            outputs: Annotated[List[str], operator.add]
            
        # 2. Define Nodes
        async def map_step(state):
            # This is not a true fan-out using Send API in this simple implementation,
            # but rather a simulated map node that processes the list.
            # To do true parallel map in LangGraph requires 'Send' text.
            # For "Operational" status in a single python file without complex generic setup:
            # We will process each item in the input list.
            
            results = []
            for item in state["inputs"]:
                # Simulate processing
                res = f"Processed({item})"
                # await emit(f"Mapped: {item}", {"event_type": "info"}) 
                results.append(res)
            return {"outputs": results}

        async def reduce_step(state):
            summary = "\n".join(state["outputs"])
            await emit(f"Reducing {len(state['outputs'])} items...", {"event_type": "info", "framework": "langgraph"})
            return {"outputs": [f"Summary:\n{summary}"]}

        # 3. Build Graph
        workflow = StateGraph(State)
        workflow.add_node("map", map_step)
        workflow.add_node("reduce", reduce_step)
        
        workflow.set_entry_point("map")
        workflow.add_edge("map", "reduce")
        workflow.add_edge("reduce", END)
        
        app = workflow.compile()
        
        # 4. Invoke
        raw_input = inputs.get("input_text", "Item1, Item2, Item3")
        input_list = [x.strip() for x in raw_input.split(",")]
        
        await emit(f"Starting MapReduce on {len(input_list)} items", {"event_type": "info"})
        
        result = await app.ainvoke({"inputs": input_list, "outputs": []})
        
        final_out = result["outputs"][0]
        await emit(final_out, {"action_type": "write", "text": final_out})
        
        return {"status": "PASS", "final_output": final_out}

    except ImportError:
         return {"status": "SKIP", "reason": "LangGraph not installed"}
    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
