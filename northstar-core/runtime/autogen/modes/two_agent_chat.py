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

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]],
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Executes AutoGen Two Agent Chat.
    """
    try:
        # Resolve Gateway from Context (Preferred) or Fallback
        if context is None: context = {}
        gateway = context.get("model_gateway")
        
        # Blackboard is pure data, so we don't look there anymore.
        
        if not gateway:
             # Just for safety in tests that might not pass context yet
             pass 

        participants_config = flow_card.get("participants", [])

        # Load Agent
        agent_instances = {}
        target_agent = None
        
        for p_config in participants_config:
             pid = p_config["id"]
             path = p_config["agent_id"]
             if not os.path.isabs(path): path = os.path.abspath(path)
             
             with open(path, 'r') as f:
                 card = yaml.safe_load(f)
             
             model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
             
             # Agnostic Client Injection
             client = AgnosticModelClient(gateway=gateway, model_name=model_id)
             
             agent = AssistantAgent(
                 name=pid,
                 model_client=client,
                 system_message=card.get("persona", "You are a helpful assistant.")
             )
             agent_instances[pid] = agent
             target_agent = agent 

        if not target_agent:
            return {"status": "FAIL", "reason": "No agents defined in flow"}
            
        user_input = inputs.get("user_message", inputs.get("message", "Hello"))
        
        await emit(f"User asking: {user_input}", {"event_type": "info"})
        
        user_msg = TextMessage(content=user_input, source="user")
        
        response = await target_agent.on_messages(
            [user_msg], 
            cancellation_token=CancellationToken()
        )
        output_text = response.chat_message.content
        
        await emit(output_text, {"action_type": "write", "text": output_text, "agent_id": target_agent.name})
        
        return {
            "status": "PASS",
            "final_output": output_text
        }

    except Exception as e:
        traceback.print_exc()
        await emit(f"Error: {e}", {"event_type": "error"})
        return {"status": "FAIL", "reason": str(e)}
