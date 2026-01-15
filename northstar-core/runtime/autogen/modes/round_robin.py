from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import yaml
import os
import traceback
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from runtime.autogen.client_adapter import AgnosticModelClient
import uuid

# --- Bedrock Client Wrapper ---

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]],
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Executes AutoGen Round Robin GroupChat.
    """
    try:
        if context is None: context = {}
        gateway = context.get("model_gateway")
        
        if not gateway:
             pass # raise later if needed, or rely heavily on it being there

        steps_config = flow_card.get("steps", [])
        participants_config = flow_card.get("participants", [])
        
        # --- Helper: Load Card ---
        def load_agent_card(path: str) -> Dict[str, Any]:
             if not os.path.exists(path) and not os.path.isabs(path):
                 path = os.path.abspath(path)
             with open(path, 'r') as f:
                 return yaml.safe_load(f)

        # --- Initialize Agents ---
        agent_instances = {}
        local_model_map = {} 

        for p_config in participants_config:
            pid = p_config["id"]
            path = p_config["agent_id"]
            
            try:
                card = load_agent_card(path)
            except Exception as e:
                await emit(f"Failed to load agent {path}: {e}", {"event_type": "error"})
                return {"status": "FAIL"}

            model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
            client = AgnosticModelClient(gateway=gateway, model_name=model_id)
            local_model_map[pid] = model_id
            
            persona = card.get("persona", "You are an AI assistant.")
            
            agent = AssistantAgent(
                name=pid,
                model_client=client,
                system_message=persona
            )
            agent_instances[pid] = agent

        # --- Execute Steps (Manual Round Robin Loop) ---
        current_history = [] 
        steps_log = []
        
        for i, step in enumerate(steps_config):
            pid = step.get("participant_id")
            agent = agent_instances.get(pid)
            if not agent: continue
            
            template_id = step.get("template_id")
            
            # Re-load card for template (Optimization: cache this)
            path = next(p["agent_id"] for p in participants_config if p["id"] == pid)
            card = load_agent_card(path)
            
            templates = card.get("instruction_templates", {})
            raw_template = templates.get(template_id, f"Process step: {template_id}")
            
            # Format Template using Resolved Inputs
            fmt_args = {k: str(v) for k, v in inputs.items()}
            
            instruction = raw_template
            for k, v in fmt_args.items():
                instruction = instruction.replace(f"{{{k}}}", v)
                
            # Construct Prompt
            history_text = "\n".join([f"{m['source']}: {m['content']}" for m in current_history])
            full_prompt = f"HISTORY:\n{history_text}\n\nINSTRUCTION:\n{instruction}"
            
            await emit(f"Agent {pid} working...", {"step_id": f"autogen_{i}", "event_type": "info", "agent_id": pid})

            # Run Agent
            user_msg = TextMessage(content=full_prompt, source="user")
            
            response = await agent.on_messages(
                [user_msg], 
                cancellation_token=CancellationToken()
            )
            
            output_text = response.chat_message.content
            
            # Update State
            current_history.append({"source": pid, "content": output_text})
            
            # Emit Event
            await emit(output_text, {
                "agent_id": pid, 
                "action_type": "write", 
                "text": output_text,
                "framework": "autogen",
                "model": local_model_map.get(pid, "unknown")
            })
            
            steps_log.append({
                "agent_id": pid,
                "text": output_text
            })

        return {
            "status": "PASS",
            "final_output": steps_log[-1]["text"] if steps_log else "",
            "steps": steps_log
        }

    except Exception as e:
        traceback.print_exc()
        await emit(f"Error in AutoGen RoundRobin: {e}", {"event_type": "error"})
        return {"status": "FAIL", "reason": str(e)}
