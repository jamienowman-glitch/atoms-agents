from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import yaml
import os
import traceback
import asyncio
from crewai import Agent, Task, Crew, Process
from runtime.crewai.agnostic_llm import AgnosticCrewAILLM

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]],
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Executes CrewAI Sequential Logic.
    """
    try:
        # Helper to load Agent Card
        def load_agent_card(path: str) -> Dict[str, Any]:
            if not os.path.isabs(path):
                 path = os.path.abspath(path)
            with open(path, 'r') as f:
                return yaml.safe_load(f)

        if context is None: context = {}
        gateway = context.get("model_gateway")
        if not gateway:
             # Depending on strictness, we might fallback or fail.
             # For now, allow fallback to trying to run without if CrewAI has env vars, 
             # BUT better to fail loud for Agnostic purity.
             # Let's assume gateway is mandatory for this mode now.
             pass 

        steps_config = flow_card.get("steps", [])
        
        # 1. Instantiate Agents
        unique_ids = set(s["agent_id"] for s in steps_config)
        crew_agents = {}
        
        steps_log = []
        
        # Defined here to capture scope
        def step_callback(step):
            content = str(step)
            if hasattr(step, 'result'): content = step.result
            elif hasattr(step, 'output'): content = step.output
            
            # Emit via main loop
            # Note: CrewAI runs in thread, so we need threadsafe emit logic if possible.
            # But here we are wrapping the sync call in to_thread, so we can't easily wait.
            # Best effort: we'll emit to a queue if we were fully async, 
            # for now we'll do the 'print' equivalent which is just appending to logs 
            # and rely on the lambda wrapper passed to `to_thread` in harness to handle bridging?
            # Actually, `emit` passed here IS async. We can't await it from sync callback.
            # We need a loop reference.
            try:
                loop = asyncio.get_running_loop() # Might fail in thread
                asyncio.run_coroutine_threadsafe(
                    emit(content, {"agent_id": "crew_agent", "action_type": "write", "text": content}),
                    loop
                )
            except RuntimeError:
                # No loop in this thread
                pass 

        for agent_path in unique_ids:
            if agent_path in crew_agents: continue
            
            try:
                card = load_agent_card(agent_path)
            except Exception as e:
                await emit(f"Failed to load agent {agent_path}: {e}", {"event_type": "error"})
                return {"status": "FAIL"}
            
            aid = card.get("id")
            model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
            
            if gateway:
                 llm = AgnosticCrewAILLM(gateway=gateway, model_id=model_id)
            else:
                 # Fallback (Legacy)
                 llm = f"bedrock/{model_id}"
            
            crew_agents[agent_path] = Agent(
                role=card.get("display_name", aid),
                goal=card.get("manifest", "Perform task"),
                backstory=card.get("persona", ""),
                backstory=card.get("persona", ""),
                llm=llm,
                verbose=False,
                allow_delegation=False,
                step_callback=step_callback
            )

        # 2. Instantiate Tasks
        crew_tasks = []
        for i, step in enumerate(steps_config):
            agent_path = step["agent_id"]
            template_id = step.get("template_id")
            
            card = load_agent_card(agent_path)
            templates = card.get("instruction_templates", {})
            raw_template = templates.get(template_id, f"Execute {template_id}")
            
            # Format inputs using Resolved Inputs
            # Inputs are already resolved by Harness into `inputs` dict
            desc = raw_template
            for k, v in inputs.items():
                desc = desc.replace(f"{{{k}}}", str(v))
            
            t = Task(
                description=desc,
                expected_output=step.get("expected_output", "Output as requested."),
                agent=crew_agents[agent_path],
                context=crew_tasks[:i] if i > 0 else None 
            )
            crew_tasks.append(t)

        # 3. Blocking Run in Thread
        crew = Crew(
            agents=list(crew_agents.values()),
            tasks=crew_tasks,
            process=Process.sequential,
            verbose=False,
            memory=False
        )
        
        await emit("Kickoff CrewAI Sequential...", {"event_type": "info", "framework": "crewai"})
        
        # We must run this in a thread to not block the event loop
        result = await asyncio.to_thread(crew.kickoff)
        
        return {
            "status": "PASS",
            "final_output": str(result)
        }

    except Exception as e:
        traceback.print_exc()
        await emit(f"Error in CrewAI Sequential: {e}", {"event_type": "error"})
        return {"status": "FAIL", "reason": str(e)}
