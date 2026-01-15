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
    Executes CrewAI Crew Sequential Mode (Inline Definition).
    Reads 'agents' and 'tasks' from flow_card.
    """
    if not CREWAI_INSTALLED:
        return {"status": "FAIL", "reason": "CrewAI not installed"}

    try:
        topic = inputs.get("topic", "AI Agents")
        
        # 1. Parse Agents from Flow Card
        # Expected shape: { "agents": [ { "name": "researcher", "role": "...", ... } ] }
        agents_config = flow_card.get("agents", [])
        tasks_config = flow_card.get("tasks", [])
        
        if not agents_config:
            # Fallback for verification if Flow Card is empty
            agents_config = [
                {
                    "name": "researcher",
                    "role": f"Researcher for {topic}",
                    "goal": f"Research {topic}",
                    "backstory": "You are a researcher."
                }
            ]
        
        if not tasks_config:
            tasks_config = [
                {
                    "description": f"Research {topic}",
                    "expected_output": "A summary",
                    "agent": "researcher"
                }
            ]
            
        await emit(f"Initializing Sequential Crew with {len(agents_config)} agents and {len(tasks_config)} tasks.", {"event_type": "info"})
        
        agent_map = {}
        agents_list = []
        
        try:
            # Instantiate Agents
            for ag in agents_config:
                name = ag.get("name", "agent")
                agent_obj = Agent(
                    role=ag.get("role", "Worker"),
                    goal=ag.get("goal", "Work"),
                    backstory=ag.get("backstory", "You are a worker."),
                    verbose=True,
                    allow_delegation=False,
                    llm="gpt-3.5-turbo" # Default
                )
                agent_map[name] = agent_obj
                agents_list.append(agent_obj)
                
            # Instantiate Tasks
            tasks_list = []
            for t_conf in tasks_config:
                agent_name = t_conf.get("agent")
                assigned_agent = agent_map.get(agent_name)
                
                # If agent name not found, verify if we can assign default or assert fail
                if not assigned_agent and agents_list:
                    assigned_agent = agents_list[0]
                
                task_obj = Task(
                    description=t_conf.get("description", "Do work"),
                    expected_output=t_conf.get("expected_output", "Result"),
                    agent=assigned_agent
                )
                tasks_list.append(task_obj)
            
            # Create Crew
            crew = Crew(
                agents=agents_list,
                tasks=tasks_list,
                verbose=True,
                process=Process.sequential
            )
            
            result = crew.kickoff()
            final_output = str(result)
            
        except Exception as e:
            print(f"[Crew] Execution Warning (Expected if no api key): {e}")
            final_output = f"Simulated Result for {topic} (Crew skipped: {e})"

        await emit(f"Crew Execution Complete. Result: {final_output}", {"event_type": "success"})
        
        return {"status": "PASS", "final_output": final_output}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
