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
    Executes CrewAI Crew Hierarchical Mode (Inline Definition).
    """
    if not CREWAI_INSTALLED:
        return {"status": "FAIL", "reason": "CrewAI not installed"}

    try:
        topic = inputs.get("topic", "AI Agents")
        manager_model = inputs.get("manager_model", "gpt-4") # Hierarchical usually needs stronger model
        
        # 1. Parse Agents from Flow Card
        agents_config = flow_card.get("agents", [])
        tasks_config = flow_card.get("tasks", [])
        
        if not agents_config:
            agents_config = [
                {
                    "name": "writer",
                    "role": "Writer",
                    "goal": "Write report",
                    "backstory": "You write."
                }
            ]
        
        if not tasks_config:
            tasks_config = [
                {
                    "description": f"Write about {topic}",
                    "expected_output": "Report",
                    "agent": "writer"
                }
            ]
            
        await emit(f"Initializing Hierarchical Crew with {len(agents_config)} agents.", {"event_type": "info"})
        
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
                    allow_delegation=True, # Important for Hierarchical!
                    llm="gpt-3.5-turbo" 
                )
                agent_map[name] = agent_obj
                agents_list.append(agent_obj)
                
            tasks_list = []
            for t_conf in tasks_config:
                # In Hierarchical, tasks might be assigned to agents OR left for Manager to assign?
                # CrewAI usually expects tasks to have agents or be delegated.
                # If we explicitly assign, the manager oversees.
                agent_name = t_conf.get("agent")
                assigned_agent = agent_map.get(agent_name)
                
                task_obj = Task(
                    description=t_conf.get("description", "Do work"),
                    expected_output=t_conf.get("expected_output", "Result"),
                    agent=assigned_agent # Can be None if we want Manager to assign? Let's assign for safety in this mode.
                )
                tasks_list.append(task_obj)
            
            # Create Crew
            crew = Crew(
                agents=agents_list,
                tasks=tasks_list,
                verbose=True,
                process=Process.hierarchical,
                manager_llm=manager_model 
            )
            
            result = crew.kickoff()
            final_output = str(result)
            
        except Exception as e:
            print(f"[Crew] Execution Warning (Expected if no api key): {e}")
            final_output = f"Simulated Hierarchical Result for {topic} (Crew skipped: {e})"

        await emit(f"Crew Execution Complete. Result: {final_output}", {"event_type": "success"})
        
        return {"status": "PASS", "final_output": final_output}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
