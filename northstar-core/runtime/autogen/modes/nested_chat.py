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
    Executes AutoGen Nested Chat.
    Simulates: Main Agent -> decides to call Nested Agent -> returns summary.
    """
    try:
        if context is None: context = {}
        gateway = context.get("model_gateway")

        participants_config = flow_card.get("participants", [])
        
        # Load Agents
        def create_agent(pid, path):
             if not os.path.exists(path) and not os.path.isabs(path): path = os.path.abspath(path)
             with open(path, 'r') as f: card = yaml.safe_load(f)
             model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
             
             # Use Agnostic Client
             client = AgnosticModelClient(gateway=gateway, model_name=model_id)
             
             return AssistantAgent(
                 name=pid,
                 model_client=client,
                 system_message=card.get("persona", "You are a helpful assistant.")
             )

        main_agent = None
        nested_agent = None
        
        if participants_config:
             main_agent = create_agent(participants_config[0]["id"], participants_config[0]["agent_id"])
             if len(participants_config) > 1:
                  nested_agent = create_agent(participants_config[1]["id"], participants_config[1]["agent_id"])
             else:
                  nested_agent = create_agent("nested_agent", participants_config[0]["agent_id"])
        
        if not main_agent:
             return {"status": "FAIL", "reason": "No agents defined"}

        user_input = inputs.get("user_message", inputs.get("message", "Hello"))
        await emit(f"User: {user_input}", {"event_type": "info"})
        
        await emit("Entering Nested Chat...", {"event_type": "info"})
        
        nested_msg = TextMessage(content=f"Context: The user asked '{user_input}'. Please analyze.", source="system")
        nested_resp = await nested_agent.on_messages([nested_msg], cancellation_token=CancellationToken())
        nested_out = nested_resp.chat_message.content
        
        await emit(f"Nested Response: {nested_out}", {"agent_id": nested_agent.name})
        
        main_msg = TextMessage(content=f"The inner circle analysis says: '{nested_out}'. Please summarize for user.", source="system")
        main_resp = await main_agent.on_messages([main_msg], cancellation_token=CancellationToken())
        final_out = main_resp.chat_message.content
        
        await emit(final_out, {"action_type": "write", "text": final_out, "agent_id": main_agent.name})
        
        return {
            "status": "PASS",
            "final_output": final_out
        }

    except Exception as e:
        traceback.print_exc()
        await emit(f"Error: {e}", {"event_type": "error"})
        return {"status": "FAIL", "reason": str(e)}
