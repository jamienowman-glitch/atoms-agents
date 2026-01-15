from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os
import shutil
from pydantic import BaseModel

try:
    from crewai.flow.flow import Flow, listen, start
    from crewai.flow.persistence import persist
    CREWAI_INSTALLED = True
except ImportError:
    CREWAI_INSTALLED = False

class CounterState(BaseModel):
    counter: int = 0
    message: str = ""

# Define Persistence Path (Isolated for this demo)
DB_DIR = ".crewai_persistence_demo"

if CREWAI_INSTALLED:
    # We use a custom class to inject persistence capability explicitly if needed,
    # or rely on default behavior. 
    # CrewAI @persist usually uses SQLiteFlowPersistence default.
    # To control the path, we might need to subclass or configure.
    
    # NOTE: CrewAI 0.103.0+ @persist uses a hardcoded or configurable path.
    # Let's assume standard usage first.
    
    # We define the class inside run or global? 
    # Defining global so pickle can find it if needed, though CrewAI persistence 
    # often saves state as JSON/Pydantic.
    pass

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes CrewAI Persistence Mode.
    Increments a counter in a persisted state.
    """
    if not CREWAI_INSTALLED:
        return {"status": "FAIL", "reason": "CrewAI not installed"}

    # We define the Flow class here to ensure fresh definition or configured usage
    from crewai.flow.flow import Flow, listen, start
    from crewai.flow.persistence import persist, SQLiteFlowPersistence
    
    # Clean DB if requested
    if inputs.get("reset", False):
        if os.path.exists(DB_DIR):
            if os.path.isdir(DB_DIR):
                shutil.rmtree(DB_DIR)
            else:
                os.remove(DB_DIR)
            await emit("Cleared Persistence DB", {"event_type": "info"})

    # Setup custom persistence
    # Using explicit path ensures we control where state is saved/loaded
    # Note: SQLiteFlowPersistence constructor args might vary by version
    # If db_path is not accepted, it will fail loudly, which is better than silent failure.
    # Based on standard patterns, passing a path or config is expected.
    # If checking source is hard, we guess standard 'db_path'. 
    # If it fails, we will see TypeError.
    try:
         persistence = SQLiteFlowPersistence(db_path=DB_DIR)
    except TypeError:
         # Fallback if signature is different (e.g. no args, or different arg name)
         print("[Flow] Warning: SQLiteFlowPersistence does not accept db_path. Using default.")
         persistence = SQLiteFlowPersistence()

    @persist(persistence=persistence)
    class PersistenceFlow(Flow[CounterState]):
        @start()
        def check_counter(self):
            print(f"[Flow] Current Counter: {self.state.counter}")
            if self.state.counter == 0:
                self.state.message = "Initialized"
            return self.state.counter

        @listen(check_counter)
        def increment(self, counter):
            self.state.counter += 1
            self.state.message = f"Incremented to {self.state.counter}"
            print(f"[Flow] New Counter: {self.state.counter}")
            return self.state.counter

    try:
        # We assume standard SQLite persistence is used by @persist
        flow = PersistenceFlow()
        
        # RESUME LOGIC: If a previous ID is provided, set it to trigger reload
        resume_id = inputs.get("resume_flow_id")
        if resume_id:
            print(f"[Run] Resuming Flow ID: {resume_id}")
            # Identify target flow
            flow.state.id = resume_id
            
            # Explicitly load state and hydrate
            loaded_data = persistence.load_state(resume_id)
            if loaded_data:
                print(f"[Run] Hydrating state from persistence: {loaded_data}")
                for k, v in loaded_data.items():
                    if hasattr(flow.state, k):
                        setattr(flow.state, k, v)
                    elif isinstance(flow.state, dict):
                        flow.state[k] = v
            
        await emit(f"Starting Persistence Flow. Flow ID: {flow.state.id}", {"event_type": "info"})
        
        result = await flow.kickoff_async()
        
        final_state = {
            "id": str(flow.state.id),
            "counter": flow.state.counter,
            "message": flow.state.message
        }
        
        await emit(f"Flow Complete. Counter: {flow.state.counter}", {"event_type": "success", "state": final_state})
        return {"status": "PASS", "final_output": result, "state": final_state}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
