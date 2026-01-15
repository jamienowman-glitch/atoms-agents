from typing import Dict, Any, Callable, Awaitable, TypedDict, Literal, List, Optional
from src.core.blackboard import Blackboard
import traceback
import uuid

# Global Fallback
GLOBAL_MEMORY_SAVER = None

class AgentState(TypedDict):
    status: str
    feedback: str

# --- HELPER: Define Graph Construction ---
def create_app(checkpointer=None, store=None):
    from langgraph.graph import StateGraph, END
    from langgraph.types import Command, interrupt
    from langchain_core.runnables import RunnableConfig

    # Remove store from arguments so it uses the 'store' from create_app scope
    def action_node(state: AgentState, config: RunnableConfig) -> Command[Literal["approve_path", "reject_path"]]:
        # Retrieve inputs from config
        if config is None: config = {}
        
        user_inputs = config.get("configurable", {}).get("user_inputs", {})
        user_id = user_inputs.get("user_id", "default_user")
        
        # 1. READ MEMORIES
        memories = []
        if store:
            namespace = (user_id, "memories")
            try:
                found = store.search(namespace)
                memories = [m.value.get("content") for m in found]
            except:
                memories = []
        
        memory_context = f"Known Memories: {memories}" if memories else "No memories found."
        
        question = user_inputs.get("approval_question", "Do you approve?")
        full_prompt = f"{question}\n[System Context: {memory_context}]"
        
        # INTERRUPT CALL
        user_decision = interrupt({
            "question": full_prompt,
            "context": state.get("status", "initial"),
            "memories": memories
        })
        
        # Logic based on RESUME value
        if isinstance(user_decision, dict):
             decision = user_decision.get("action", "").lower()
             new_memory = user_decision.get("save_memory")
        else:
             decision = str(user_decision).lower()
             new_memory = None

        # 2. WRITE MEMORY
        if store and new_memory:
             namespace = (user_id, "memories")
             mem_id = str(uuid.uuid4())
             store.put(namespace, mem_id, {"content": new_memory})
             
        if decision == "approve" or decision == "true":
            return Command(goto="approve_path")
        else:
            return Command(goto="reject_path")

    def approve_node(state: AgentState):
        return {"status": "approved", "feedback": "User authorized action."}

    def reject_node(state: AgentState):
        return {"status": "rejected", "feedback": "User denied action."}

    # Build Graph
    workflow = StateGraph(AgentState)
    workflow.add_node("decision_point", action_node)
    workflow.add_node("approve_path", approve_node)
    workflow.add_node("reject_path", reject_node)
    
    workflow.set_entry_point("decision_point")
    workflow.add_edge("approve_path", END)
    workflow.add_edge("reject_path", END)
    
    return workflow.compile(checkpointer=checkpointer, store=store)


async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]],
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Executes LangGraph Human Approval Mode (Interrupts & Durable Execution).
    """
    # 0. Load Dependencies Locally
    try:
        from langgraph.graph import StateGraph, END
        from langgraph.types import Command, interrupt
    except ImportError:
         return {"status": "FAIL", "reason": "LangGraph dependencies missing"}

    # 1. Setup Persistence via Shared Helper
    from runtime.langgraph.persistence import get_persistence, JsonFileStore
    
    checkpointer, conn = await get_persistence("northstar_state.db")
    if conn:
        await emit("Using AsyncSqliteSaver (Durable)", {"event_type": "debug"})
    else:
        await emit("Using Global MemorySaver (Non-Durable)", {"event_type": "warning"})

    # 1.5 Setup Store (JsonFileStore)
    # We use our custom one directly since we know it's available in this repo
    store = JsonFileStore("northstar_store.json")
    await emit("Using JsonFileStore (Shared Memory)", {"event_type": "debug"})

    if checkpointer is None:
         return {"status": "FAIL", "reason": "Persistence Init Failed"}

    # Setup Checkpointer
    if hasattr(checkpointer, "setup"):
        await checkpointer.setup()

    try:
        # Create App using Helper
        app = create_app(checkpointer, store)
        
        # 5. Handle State / Thread ID
        thread_id = inputs.get("thread_id")
        
        # IMPORTANT: Pass inputs via 'configurable' so action_node can access them
        config = {
            "configurable": {
                "thread_id": thread_id if thread_id else str(uuid.uuid4()),
                "user_inputs": inputs
            }
        }
        thread_id = config["configurable"]["thread_id"] # ensure captured

        if not inputs.get("thread_id"):
            # New Thread
            current_state = {"status": "pending", "feedback": ""}
            await emit(f"Starting new flow. Thread ID: {thread_id}", {"event_type": "info", "thread_id": thread_id})
            result = await app.ainvoke(current_state, config=config)
        else:
            # Resume
            action = inputs.get("resume_action", "reject")
            memory_to_save = inputs.get("save_memory")
            resume_payload = {"action": action, "save_memory": memory_to_save}
            
            await emit(f"Resuming Thread {thread_id} with payload: {resume_payload}", {"event_type": "info", "thread_id": thread_id})
            result = await app.ainvoke(Command(resume=resume_payload), config=config)

        # 6. Check Result (Async)
        snapshot = await app.aget_state(config)
        
        if snapshot.next:
            # We are paused (interrupted)
            tasks = snapshot.tasks
            interrupt_info = tasks[0].interrupts[0].value if (tasks and tasks[0].interrupts) else "Unknown Interrupt"
            msg = f"INTERRUPTED. Payload: {interrupt_info}\nTO RESUME: thread_id={thread_id}"
            await emit(msg, {"action_type": "write", "text": msg})
            if conn: await conn.close()
            return {"status": "INTERRUPTED", "thread_id": thread_id, "interrupt_payload": interrupt_info, "final_output": msg}
        else:
            final_out = result.get("feedback", "Completed")
            status = result.get("status", "done")
            await emit(f"Flow Finished: {status}", {"action_type": "write", "text": final_out})
            if conn: await conn.close()
            return {"status": "PASS", "final_output": final_out}

    except Exception as e:
        traceback.print_exc()
        await emit(f"Graph Error: {e}", {"event_type": "error"})
        if conn and hasattr(conn, "close"): 
            try: await conn.close()
            except: pass
        return {"status": "FAIL", "reason": str(e)}
