from typing import Dict, Any, Callable, Awaitable, TypedDict, List
from src.core.blackboard import Blackboard
import traceback
import uuid
import datetime
from runtime.langgraph.persistence import get_persistence, JsonFileStore

# State Definition
class MemoryState(TypedDict):
    messages: List[Dict[str, str]]
    status: str

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes LangGraph Memory Mode.
    A simple chat loop that saves/retrieves user facts.
    """
    try:
        from langgraph.graph import StateGraph, END
        from langgraph.types import Command
        from langchain_core.runnables import RunnableConfig
    except ImportError:
         return {"status": "FAIL", "reason": "LangGraph dependencies missing"}

    # 1. Setup Persistence
    checkpointer, conn = await get_persistence("northstar_state.db")
    if conn: await emit("Using AsyncSqliteSaver (Durable)", {"event_type": "debug"})
    
    # Setup Store
    store = JsonFileStore("northstar_store.json")
    await emit("Using Shared Memory Store", {"event_type": "debug"})

    if hasattr(checkpointer, "setup"): await checkpointer.setup()

    # 2. Define Nodes
    # Using closure to capture 'store' instance reliably
    def memory_agent(state: MemoryState, config: RunnableConfig) -> Dict[str, Any]:
        user_inputs = config.get("configurable", {}).get("user_inputs", {})
        user_id = user_inputs.get("user_id", "default_user")
        input_text = user_inputs.get("input_text", "")
        
        # 1. Recall
        memories = []
        if store:
            namespace = (user_id, "memories")
            # Simple search all
            try:
                found = store.search(namespace)
                memories = [m.value.get("content") for m in found]
            except: pass
        
        memory_context = "\n".join([f"- {m}" for m in memories])
        system_prompt = f"You are a helpful assistant with long-term memory.\n\nKNOWN FACTS ABOUT USER:\n{memory_context}"
        
        # 2. Process Input (Mock Logic)
        response_text = f"I processed: '{input_text}'."
        
        # Check if user wants to remember something
        # Simple keyword detection for demo
        if "remember that" in input_text.lower():
            fact = input_text.split("that", 1)[1].strip()
            if store:
                 mem_id = str(uuid.uuid4())
                 store.put((user_id, "memories"), mem_id, {"content": fact, "timestamp": str(datetime.datetime.now())})
                 response_text += f"\n(I have saved this to memory: '{fact}')"
        
        # Check if user asks for recall
        if "what do you know" in input_text.lower() or "what did i tell you" in input_text.lower():
             if memories:
                 response_text = f"Here is what I remember about you:\n{memory_context}"
             else:
                 response_text = "I don't remember anything about you yet."

        # Return update
        new_messages = state.get("messages", []) + [
            {"role": "user", "content": input_text},
            {"role": "assistant", "content": response_text}
        ]
        return {"messages": new_messages, "status": "responded"}

    # 3. Build Graph
    workflow = StateGraph(MemoryState)
    workflow.add_node("agent", memory_agent)
    workflow.set_entry_point("agent")
    workflow.add_edge("agent", END)
    
    # Compile
    app = workflow.compile(checkpointer=checkpointer, store=store)
    
    # 4. Execute
    thread_id = inputs.get("thread_id", str(uuid.uuid4()))
    config = {
        "configurable": {
            "thread_id": thread_id,
            "user_inputs": inputs
        }
    }
    
    current_state = {"messages": [], "status": "start"}
    await emit(f"Running Memory Agent [Thread: {thread_id}]", {"event_type": "info"})
    
    result = await app.ainvoke(current_state, config=config)
    
    # Extract final response
    messages = result.get("messages", [])
    last_response = messages[-1]["content"] if messages else "No response"
    
    await emit(f"Agent Logic Complete.", {"action_type": "write", "text": last_response})
    
    if conn: await conn.close()
    return {"status": "PASS", "final_output": last_response, "thread_id": thread_id}
