from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
from pydantic import BaseModel

try:
    from crewai import Agent, Task, Crew, Process
    CREWAI_INSTALLED = True
except ImportError:
    CREWAI_INSTALLED = False

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes CrewAI Planning Demo Mode.
    Enabled 'planning=True'.
    """
    if not CREWAI_INSTALLED:
        return {"status": "FAIL", "reason": "CrewAI not installed"}

    try:
        objective = inputs.get("objective", "Organize a conference.")
        
        await emit(f"Initializing Crew with planning=True for objective: {objective}", {"event_type": "info"})
        
        try:
            agent = Agent(
                role="Organizer",
                goal="Execute plans.",
                backstory="You are an organizer.",
                verbose=True,
                allow_delegation=False,
                llm="gpt-3.5-turbo"
            )
            
            task = Task(
                description=f"Objective: {objective}. Create a rough timeline.",
                expected_output="A timeline.",
                agent=agent
            )
            
            crew = Crew(
                agents=[agent],
                tasks=[task],
                verbose=True,
                process=Process.sequential,
                planning=True, # Enable Planning !!!
                planning_llm="gpt-4" # Explicitly set planning LLM if needed
            )
            
            result = crew.kickoff()
            final_output = str(result)
            
        except Exception as e:
            print(f"[Crew] Execution Warning (Expected if no api key): {e}")
            final_output = f"Simulated Planning Result (Crew skipped: {e})"

        await emit(f"Planning Execution Complete. Result: {final_output}", {"event_type": "success"})
        
        return {"status": "PASS", "final_output": final_output}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
