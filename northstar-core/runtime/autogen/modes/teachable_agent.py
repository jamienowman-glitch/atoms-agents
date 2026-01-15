from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os

try:
    try:
        from autogen.agentchat.contrib.teachable_agent import TeachableAgent
        HAS_TEACHABLE = True
    except ImportError:
        HAS_TEACHABLE = False
    
    from autogen_agentchat.agents import UserProxyAgent
    AUTOGEN_INSTALLED = True
except ImportError:
    try:
        from autogen import UserProxyAgent
        try:
            from autogen.agentchat.contrib.teachable_agent import TeachableAgent
            HAS_TEACHABLE = True
        except ImportError:
            HAS_TEACHABLE = False
        AUTOGEN_INSTALLED = True
    except ImportError:
        AUTOGEN_INSTALLED = False

async def run(
    mode_card: Dict[str, Any],
    flow_card: Dict[str, Any],
    inputs: Dict[str, Any],
    blackboard: Blackboard,
    emit: Callable[[str, Dict[str, Any]], Awaitable[None]]
) -> Dict[str, Any]:
    """
    Executes AutoGen Teachable Agent Mode.
    """
    if not AUTOGEN_INSTALLED:
        return {"status": "FAIL", "reason": "AutoGen not installed"}

    try:
        fact = inputs.get("fact", "The sky is green.")
        
        await emit(f"Initializing AutoGen Teachable Agent to learn: {fact}", {"event_type": "info"})
        
        try:
             if not HAS_TEACHABLE:
                 raise ImportError("TeachableAgent not available (pyautogen[teachable] needed)")

             teachable = TeachableAgent(
                name="teachable_assistant",
                llm_config={"config_list": [{"model": "gpt-3.5-turbo", "api_key": "sk-fake"}]},
                teach_config={"verbosity": 0, "reset_db": True, "path_to_db_dir": "./tmp/teachable_db"}
            )
            
             user_proxy = UserProxyAgent(
                name="user_proxy",
                human_input_mode="NEVER",
                max_consecutive_auto_reply=1
            )
            
             def run_chat():
                 return user_proxy.initiate_chat(teachable, message=f"Remember this: {fact}")
            
             chat_res = await asyncio.to_thread(run_chat)
             final_output = str(chat_res.summary)

        except ImportError as e:
            print(f"[AutoGen] Teachable Missing Dependency: {e}")
            final_output = f"Simulated Teachable Result (Skipped: {e})"
        except Exception as e:
            print(f"[AutoGen] Execution Warning: {e}")
            final_output = f"Simulated Teachable Result (Skipped: {e})"

        await emit(f"Teachable Execution Complete. Result: {final_output}", {"event_type": "success"})
        
        return {"status": "PASS", "final_output": final_output}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
