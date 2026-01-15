from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
from pydantic import BaseModel

# --- Definition of Flow Basic ---

try:
    from crewai.flow.flow import Flow, listen, start
    CREWAI_INSTALLED = True
except ImportError:
    CREWAI_INSTALLED = False

class CityState(BaseModel):
    city: str = ""
    fun_fact: str = ""

if CREWAI_INSTALLED:
    class CityFlow(Flow[CityState]):
        
        def __init__(self, initial_city: str = ""):
            super().__init__()
            self._initial_city = initial_city

        @start()
        async def generate_city(self):
            # Simulate or use initial
            if self._initial_city:
                print(f"[Flow] Using Initial City: {self._initial_city}")
                self.state.city = self._initial_city
            else:
                print(f"[Flow] Generating Random City...")
                # Simulating LLM call for speed/reliability in this demo
                self.state.city = "Tokyo"
            return self.state.city

        @listen(generate_city)
        async def generate_fun_fact(self, city):
            print(f"[Flow] Generating Fun Fact for {city}...")
            # Simulate LLM
            fact = f"{city} is huge and amazing!"
            self.state.fun_fact = fact
            return fact

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes CrewAI Flow Basic Mode.
    1. Instantiates CityFlow.
    2. Kicks it off.
    3. Returns final state.
    """
    if not CREWAI_INSTALLED:
        return {"status": "FAIL", "reason": "CrewAI not installed"}

    try:
        initial_city = inputs.get("initial_city", "")
        
        flow = CityFlow(initial_city=initial_city)
        
        await emit("Starting CrewAI Flow (CityFlow)...", {"event_type": "info"})
        
        # CrewAI Flows are sync or async. Newer versions support async kickoff.
        # kicktoff() returns the result of the LAST method.
        # But we might want start state or ID.
        
        # Check if kickoff is awaitable
        result = await flow.kickoff_async()
        
        final_state = {
            "id": flow.state.id if hasattr(flow.state, "id") else "unknown",
            "city": flow.state.city,
            "fun_fact": flow.state.fun_fact
        }
        
        msg = f"Flow Complete. City: {flow.state.city}. Fact: {flow.state.fun_fact}"
        await emit(msg, {"event_type": "success", "state": final_state})
        
        return {"status": "PASS", "final_output": result, "state": final_state}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
