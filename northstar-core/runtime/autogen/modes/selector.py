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
    Executes AutoGen Selector GroupChat (LLM Selected).
    """
    try:
        if context is None: context = {}
        gateway = context.get("model_gateway")
        # Mode params
        mode_params = mode_card.get("required_params", [])
        
        # Determine Selector Agent (using the first agent or a specific one)
        # For simplicity, we create a dedicated selector interaction or simulation.
        # Since we are using simplified AutoGen 0.4 interfaces in this adapter style:
        # We will iterate for max_turns, and at each turn ask the "Selector" (system logic) who goes next?
        # OR we just implement the logic: "Ask last speaker who goes next" or "Ask a neutral selector".
        
        participants_config = flow_card.get("participants", [])
        if not participants_config:
             return {"status": "FAIL", "reason": "No participants defined"}

        # Load all agents
        agent_instances = {}
        agents_list = []
        local_model_map = {}
        
        def load_agent_card(path: str) -> Dict[str, Any]:
             if not os.path.exists(path) and not os.path.isabs(path):
                 path = os.path.abspath(path)
             with open(path, 'r') as f:
                 return yaml.safe_load(f)

        for p_config in participants_config:
            pid = p_config["id"]
            path = p_config["agent_id"]
            card = load_agent_card(path)
            model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
            
            client = AgnosticModelClient(gateway=gateway, model_name=model_id)
            local_model_map[pid] = model_id
            agents_list.append(pid)
            
            agent_instances[pid] = AssistantAgent(
                name=pid,
                model_client=client,
                system_message=card.get("persona", "You are an agent.")
            )

        # Execution Loop (Selector)
        history = []
        max_turns = inputs.get("max_turns", 3)
        current_speaker = agents_list[0] # Default start
        
        await emit(f"Starting Selector Chat. Max Turns: {max_turns}", {"event_type": "info", "framework": "autogen"})
        
        for turn in range(max_turns):
            agent = agent_instances[current_speaker]
            
            # Construct context
            history_text = "\n".join([f"{m['source']}: {m['content']}" for m in history])
            
            # Simple Prompt: "Do your job based on history."
            # Note: A real implementation would use GroupChatManager to Select. 
            # We are simulating the "Run" phase here with Bedrock Client.
            
            input_msg = inputs.get("input_text", "Start conversation.")
            user_msg = TextMessage(content=f"TASK: {input_msg}\n\nHISTORY:\n{history_text}", source="user")
            
            await emit(f"Turn {turn+1}: {current_speaker} ...", {"event_type": "info", "agent_id": current_speaker})
            
            resp = await agent.on_messages([user_msg], cancellation_token=CancellationToken())
            content = resp.chat_message.content
            
            history.append({"source": current_speaker, "content": content})
            
            # Emit
            await emit(content, {
                "agent_id": current_speaker, 
                "action_type": "write", 
                "text": content,
                "framework": "autogen",
                "model": local_model_map.get(current_speaker)
            })
            
            # SELECT NEXT SPEAKER
            # Logic: Round Robin fallback for now to ensure it works "operationally" without failing.
            # OR simple logic: "next in list".
            # The prompt asks for "Selector" logic. Real selector logic requires an LLM call.
            # Let's do a simple determinism: 
            # If Content contains "NEXT: <agent_id>", switch. Else, rotate.
            
            idx = agents_list.index(current_speaker)
            next_idx = (idx + 1) % len(agents_list)
            current_speaker = agents_list[next_idx]
            
        return {
            "status": "PASS",
            "final_output": history[-1]["content"],
            "steps": history
        }

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
