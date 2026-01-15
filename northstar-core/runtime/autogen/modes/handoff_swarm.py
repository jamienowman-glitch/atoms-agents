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

# --- Bedrock Client Wrapper (Shared) ---

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]],
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Executes AutoGen Handoff Swarm.
    Detects "HANDOFF TO <ID>" in content to switch speaker.
    """
    try:
        if context is None: context = {}
        gateway = context.get("model_gateway")
             
        participants_config = flow_card.get("participants", [])
        if not participants_config:
             return {"status": "FAIL", "reason": "No participants defined"}

        # Load Agents
        agent_instances = {}
        agents_list = []
        local_model_map = {}
        
        def load_agent_card(path: str):
             if not os.path.exists(path) and not os.path.isabs(path): path = os.path.abspath(path)
             with open(path, 'r') as f: return yaml.safe_load(f)

        for p_config in participants_config:
            pid = p_config["id"]
            path = p_config["agent_id"]
            card = load_agent_card(path)
            model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
            
            client = AgnosticModelClient(gateway=gateway, model_name=model_id)
            local_model_map[pid] = model_id
            agents_list.append(pid)
            
            sys_msg = card.get("persona", "You are an agent.")
            sys_msg += "\nIf you want to transfer to another agent, say 'HANDOFF TO <agent_id>'."
            
            agent_instances[pid] = AssistantAgent(name=pid, model_client=client, system_message=sys_msg)

        # Execution Loop
        history = []
        max_turns = inputs.get("max_turns", 5)
        current_speaker = agents_list[0]
        
        await emit(f"Starting Handoff Swarm. Start: {current_speaker}", {"event_type": "info", "framework": "autogen"})
        
        for turn in range(max_turns):
            agent = agent_instances[current_speaker]
            
            history_text = "\n".join([f"{m['source']}: {m['content']}" for m in history])
            input_msg = inputs.get("input_text", "Start swarm.")
            user_msg = TextMessage(content=f"TASK: {input_msg}\n\nHISTORY:\n{history_text}", source="user")
            
            await emit(f"Turn {turn+1}: {current_speaker} ...", {"event_type": "info", "agent_id": current_speaker})
            
            resp = await agent.on_messages([user_msg], cancellation_token=CancellationToken())
            content = resp.chat_message.content
            
            history.append({"source": current_speaker, "content": content})
            
            await emit(content, {
                "agent_id": current_speaker, 
                "action_type": "write", 
                "text": content,
                "framework": "autogen",
                "model": local_model_map.get(current_speaker)
            })
            
            # Handoff Logic
            next_speaker = None
            if "HANDOFF TO" in content:
                for a in agents_list:
                    if f"HANDOFF TO {a}" in content or f"HANDOFF TO {a.upper()}" in content:
                        next_speaker = a
                        await emit(f"Handoff detected -> {next_speaker}", {"event_type": "info", "badge": "HANDOFF"})
                        break
            
            if next_speaker:
                current_speaker = next_speaker
            else:
                # Default: Stay on same speaker or rotate? Swarm usually stays until handoff or finish.
                # Let's rotate if no handoff, to prevent getting stuck if LLM fails to handoff.
                idx = agents_list.index(current_speaker)
                current_speaker = agents_list[(idx + 1) % len(agents_list)]

        return {"status": "PASS", "final_output": history[-1]["content"], "steps": history}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
