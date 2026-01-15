"""
AutoGen Runtime Adapter.
Thin wrapper for invoking AutoGen multi-agent conversations.
"""
from typing import Any, Dict, List, AsyncIterator
import asyncio
import traceback
import yaml
import os
import uuid
import time
from runtime.contract import RuntimeAdapter, StreamChunk
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from runtime.autogen.client_adapter import AgnosticModelClient

class AutoGenAdapter:
    """
    Adapter for AutoGen runtime.
    Used for complex multi-agent conversations and negotiation flows.
    """
    
    def invoke(
        self, 
        card_id: str, 
        input_data: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Invokes an AutoGen conversation defined by the flow card.
        """
        # Sync wrapper not really used by new runner, but kept for interface
        return asyncio.run(self._run_generic_flow_async(card_id, input_data, context))

    async def invoke_stream(
        self,
        card_id: str,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AsyncIterator[StreamChunk]:
        """
        Invokes an AutoGen conversation and streams steps.
        Stubs for contract compliance.
        """
        msg = "Starting AutoGen Flow...\n"
        yield StreamChunk(chunk_kind="event", text=msg, delta=msg, metadata={"status": "started"})
        
        # Real logic is via _run_generic_flow_async with callback
        # Implementation of full streaming here would duplicate logic.
        yield StreamChunk(chunk_kind="event", text="Use _run_generic_flow_async instead.", delta="", metadata={"status": "done"})

    def _run_generic_flow(self, flow_id: str, input_data: Dict[str, Any], context: Dict[str, Any]):
        try:
            return asyncio.run(self._run_generic_flow_async(flow_id, input_data, context))
        except Exception as e:
            traceback.print_exc()
            return {"status": "FAIL", "reason": str(e)}

    async def _run_generic_flow_async(self, flow_id, input_data, context, stream_callback=None):
        try:
            if "tenant_id" not in context:
                raise ValueError("Missing required context: tenant_id")

            flow_def = input_data.get("flow_def")
            steps_config = flow_def.get("steps", [])
            participants_config = flow_def.get("participants", [])
            
            # --- DYNAMIC OVERRIDE ---
            override_participants = input_data.get("_participants_override")
            if override_participants:
                participants_config = override_participants
            
            # --- Helper: Load Card ---
            def load_agent_card(path: str) -> Dict[str, Any]:
                 # Assuming REPO_ROOT is in sys.path or accessible? 
                 # We can't easily access REPO_ROOT here without importing config.
                 # We'll rely on relative path from cwd or absolute.
                 if not os.path.exists(path) and not os.path.isabs(path):
                     # Try finding it relative to cwd
                     path = os.path.abspath(path)
                 with open(path, 'r') as f:
                     return yaml.safe_load(f)


            # Retrieve Gateway from Context
            gateway = context.get("model_gateway")
            if not gateway:
                 # Check if blackboard has it (if passed in context)
                 bb = context.get("blackboard")
                 if bb:
                     gateway = getattr(bb, "model_gateway", None)
            
            if not gateway:
                 raise ValueError("ModelGateway not found in context. Cannot execute Agnostic AutoGen Flow.")

            # --- 2. Initialize Agents ---
            agent_instances = {}
            local_model_map = {} # Map agent_id -> model_id for logging

            for p_config in participants_config:
                pid = p_config["id"]
                path = p_config["agent_id"]
                
                try:
                    card = load_agent_card(path)
                except Exception as e:
                    # Fallback if path is relative
                    # Try prefixing with registry/ if missing or ..
                    return {"status": "FAIL", "reason": f"Failed to load agent {path}: {e}"}

                model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
                model_id = card.get("default_model_id", "mistral.ministral-3-8b-instruct")
                # Fix for AutoGen: Use Agnostic Client wrapper
                client = AgnosticModelClient(gateway=gateway, model_name=model_id)
                local_model_map[pid] = model_id
                
                # Persona
                persona = card.get("persona", "You are an AI assistant.")
                
                # Tools Injection
                agent_tools = []
                req_tools = card.get("tools", [])
                if "web_search" in req_tools:
                     try:
                         from src.capabilities.search import web_search
                         agent_tools.append(web_search)
                     except ImportError:
                         print("[WARNING] Could not load search tool dependencies.")

                agent = AssistantAgent(
                    name=pid,
                    model_client=client,
                    system_message=persona,
                    tools=agent_tools
                )
                agent_instances[pid] = agent

            # --- 3. Execute Steps (Manual Loop) ---
            current_history = [] 
            steps_log = []
            
            for i, step in enumerate(steps_config):
                pid = step.get("participant_id")
                agent = agent_instances.get(pid)
                if not agent:
                     continue
                
                template_id = step.get("template_id")
                
                # Reload card to get templates? or we could have cached it.
                # Re-loading is safer for now.
                path = next(p["agent_id"] for p in participants_config if p["id"] == pid)
                card = load_agent_card(path)
                
                templates = card.get("instruction_templates", {})
                raw_template = templates.get(template_id, f"Process step: {template_id}")
                
                # Format Template
                # Use all input_data as context for formatting
                fmt_args = {k: v for k, v in input_data.items() if isinstance(v, str)}
                
                # Check for missing keys in template
                # Simple check: if {key} is in template but not in fmt_args, it will remain as {key}
                # We can optionally log a warning or fill with placeholder.
                
                instruction = raw_template
                for k, v in fmt_args.items():
                    instruction = instruction.replace(f"{{{k}}}", v)
                    
                # Construct Prompt
                history_text = "\n".join([f"{m['source']}: {m['content']}" for m in current_history])
                full_prompt = f"HISTORY:\n{history_text}\n\nINSTRUCTION:\n{instruction}"
                
                # Run Agent
                user_msg = TextMessage(content=full_prompt, source="user")
                
                response = await agent.on_messages(
                    [user_msg], 
                    cancellation_token=CancellationToken()
                )
                
                output_text = response.chat_message.content
                
                # Update State
                current_history.append({"source": pid, "content": output_text})
                
                log_entry = {
                    "step_index": i + 1,
                    "agent_id": pid,
                    "action_type": "write",
                    "emitted_text": output_text,
                    "model_provider": local_model_map.get(pid, "unknown")
                }
                steps_log.append(log_entry)
                
                # Stream Callback
                if stream_callback:
                    evt = {
                        "agent_id": pid, 
                        "text": output_text, 
                        "action_type": "write",
                        "framework": "autogen",
                        "model": local_model_map.get(pid, "unknown")
                    }
                    if asyncio.iscoroutinefunction(stream_callback):
                        await stream_callback(evt)
                    else:
                        stream_callback(evt)
                        
            return {
                "status": "PASS",
                "final_output": steps_log[-1]["emitted_text"] if steps_log else "",
                "steps": steps_log
            }

        except Exception as e:
            traceback.print_exc()
            return {"status": "FAIL", "reason": str(e)}
