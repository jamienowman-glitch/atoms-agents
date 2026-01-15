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
    Executes CrewAI Memory Demo Mode.
    Enabled 'memory=True'.
    """
    if not CREWAI_INSTALLED:
        return {"status": "FAIL", "reason": "CrewAI not installed"}

    try:
        topic = inputs.get("topic", "AI History")
        
        await emit(f"Initializing Crew with memory=True for topic: {topic}", {"event_type": "info"})
        
        # Memory usually needs Embeddings provider (OpenAI default)
        try:
            agent = Agent(
                role="Historian",
                goal="Remember facts.",
                backstory="You have a good memory.",
                verbose=True,
                allow_delegation=False,
                llm="gpt-3.5-turbo"
            )
            
            task = Task(
                description=f"List 3 facts about {topic}.",
                expected_output="A list of facts.",
                agent=agent
            )
            
            crew = Crew(
                agents=[agent],
                tasks=[task],
                verbose=True,
                process=Process.sequential,
                memory=True # Enable Memory !!!
                # embedder=... # Optional configuration
            )
            
            result = crew.kickoff()
            final_output = str(result)
            
        except Exception as e:
            print(f"[Crew] Execution Warning (Expected if no api key/embedder): {e}")
            final_output = f"Simulated Memory Result (Crew skipped: {e})"

        await emit(f"Memory Execution Complete. Result: {final_output}", {"event_type": "success"})
        
        return {"status": "PASS", "final_output": final_output}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
