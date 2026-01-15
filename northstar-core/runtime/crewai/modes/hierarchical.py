from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import yaml
import os
import traceback
import asyncio
from runtime.contract import StreamChunk
from runtime.crewai.agnostic_llm import AgnosticCrewAILLM

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]],
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Executes CrewAI Hierarchical Process.
    """
    try:
        from crewai import Agent, Task, Crew, Process
        import threading
    except ImportError:
         return {"status": "SKIP", "reason": "CrewAI not installed"}

    if context is None: context = {}
    gateway = context.get("model_gateway")
    
    # context = {"tenant_id": "test_tenant", "blackboard": blackboard} # Don't overwrite if passed!
    if not context.get("tenant_id"): context["tenant_id"] = "test_tenant"
    steps_config = flow_card.get("steps", [])
    
    # 1. Helper: Load Agent Card
    def load_agent_card(path: str) -> Dict[str, Any]:
        if not os.path.exists(path) and not os.path.isabs(path):
             path = os.path.abspath(path)
        with open(path, 'r') as f:
            return yaml.safe_load(f)

    # 2. Instantiate Agents
    unique_ids = set(s.get("agent_id") for s in steps_config if s.get("agent_id"))
    crew_agents = {}
    steps_log = []
    
    # Generic Callback
    def step_callback(step):
        content = str(step)
        if hasattr(step, 'result'): content = step.result
        elif hasattr(step, 'output'): content = step.output
        
        steps_log.append({
            "step_index": len(steps_log) + 1,
            "action_type": "write",
            "emitted_text": content
        })
        
        # We can't await emit here easily as it's running in sync thread usually
        # But we could run_coroutine_threadsafe if we had a loop ref.
        # For now, just log.

    for agent_path in unique_ids:
        try:
            card = load_agent_card(agent_path)
        except Exception as e:
            await emit(f"Failed to load agent {agent_path}: {e}", {"event_type": "error"})
            return {"status": "FAIL"}
        
        aid = card.get("id")
        # Use simple model for agents
        model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
        
        if gateway:
             llm = AgnosticCrewAILLM(gateway=gateway, model_id=model_id)
        else:
             llm = f"bedrock/{model_id}"
        
        crew_agents[agent_path] = Agent(
            role=card.get("display_name") or card.get("name") or aid or "Agent",
            goal=card.get("manifest", "Perform task"),
            backstory=card.get("persona", ""),
            llm=llm,
            verbose=False,
            allow_delegation=False, # In hierarchical, manager delegates. Agents usually don't?
            step_callback=step_callback
        )

    # 3. Instantiate Tasks
    crew_tasks = []
    for i, step in enumerate(steps_config):
        agent_path = step["agent_id"]
        template_id = step.get("template_id")
        card = load_agent_card(agent_path)
        
        templates = card.get("instruction_templates", {})
        raw_template = templates.get(template_id, f"Execute step {step['id']}")
        
        # Format Inputs
        fmt_args = {k: str(v) for k, v in inputs.items()}
        # Alias first value
        if fmt_args and "user_message" not in fmt_args:
             fmt_args["user_message"] = list(fmt_args.values())[0] if fmt_args else ""
             
        desc = raw_template
        for k, v in fmt_args.items():
            desc = desc.replace(f"{{{k}}}", v)
            
        crew_tasks.append(Task(
            description=desc,
            expected_output=step.get("expected_output", "Output"),
            agent=crew_agents[agent_path]
        ))

    # 4. Manager LLM
    # Use resolved model or fallback
    # The runner might not pass resolved model ID explicitly in `inputs`?
    # Actually runner passes generic inputs. 
    # Logic in generic smoke flow: likely doesn't specify manager_llm.
    # We default to a strong model for manager.
    manager_model_id = "amazon.nova-pro-v1:0" 
    
    if gateway:
         manager_llm = AgnosticCrewAILLM(gateway=gateway, model_id=manager_model_id)
    else:
         manager_llm = f"bedrock/{manager_model_id}"

    await emit(f"Starting Hierarchical Crew with Manager {manager_model}...", {"event_type": "info"})
    
    # 5. Run
    # Run in thread/executor because it's sync
    loop = asyncio.get_running_loop()
    
    def run_sync():
        crew = Crew(
            agents=list(crew_agents.values()),
            tasks=crew_tasks,
            process=Process.hierarchical,
            manager_llm=manager_model,
            verbose=False
        )
        return crew.kickoff()

    try:
        result = await loop.run_in_executor(None, run_sync)
        final_out = str(result)
        
        await emit(final_out, {"action_type": "write", "text": final_out, "agent_id": "manager"})
        
        return {
            "status": "PASS",
            "final_output": final_out,
            "steps": steps_log
        }
    except Exception as e:
        traceback.print_exc()
        await emit(f"CrewAI Error: {e}", {"event_type": "error"})
        return {"status": "FAIL", "reason": str(e)}
