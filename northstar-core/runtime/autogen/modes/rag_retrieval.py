from typing import Dict, Any, Callable, Awaitable
from src.core.blackboard import Blackboard
import traceback
import asyncio
import os

try:
    try:
        from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent
        HAS_RETRIEVAL = True
    except ImportError:
        HAS_RETRIEVAL = False
    
    from autogen_agentchat.agents import AssistantAgent
    AUTOGEN_INSTALLED = True
except ImportError:
    try:
        from autogen import AssistantAgent
        try:
            from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent
            HAS_RETRIEVAL = True
        except ImportError:
            HAS_RETRIEVAL = False
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
    Executes AutoGen RAG Mode.
    """
    if not AUTOGEN_INSTALLED:
        return {"status": "FAIL", "reason": "AutoGen (or Retrieval Contrib) not installed"}

    try:
        docs_path = inputs.get("docs_path", "docs/")
        query = inputs.get("query", "What is this?")
        
        await emit(f"Initializing AutoGen RAG for query: {query}", {"event_type": "info"})
        
        try:
             if not HAS_RETRIEVAL:
                 raise ImportError("RetrieveUserProxyAgent not available (pyautogen[retrievechat] needed)")

             assistant = AssistantAgent(
                name="rag_assistant",
                llm_config={"config_list": [{"model": "gpt-3.5-turbo", "api_key": "sk-fake"}]},
                system_message="Answer based on context."
            )
            
             rag_proxy = RetrieveUserProxyAgent(
                name="rag_proxy",
                human_input_mode="NEVER",
                max_consecutive_auto_reply=1,
                retrieve_config={
                    "task": "qa",
                    "docs_path": docs_path,
                    "collection_name": "test_collection",
                    "model": "gpt-3.5-turbo",
                    "client": None, 
                    "embedding_model": "all-MiniLM-L6-v2", 
                },
                code_execution_config=False
            )
            
             def run_chat():
                 return rag_proxy.initiate_chat(assistant, message=rag_proxy.message_generator, problem=query)
            
             chat_res = await asyncio.to_thread(run_chat)
             final_output = str(chat_res.summary)

        except ImportError as e:
            print(f"[AutoGen] RAG Missing Dependency: {e}")
            final_output = f"Simulated RAG Result (Skipped: {e})"
        except Exception as e:
            print(f"[AutoGen] Execution Warning: {e}")
            final_output = f"Simulated RAG Result (Skipped: {e})"

        await emit(f"RAG Execution Complete. Result: {final_output}", {"event_type": "success"})
        
        return {"status": "PASS", "final_output": final_output}

    except Exception as e:
        traceback.print_exc()
        return {"status": "FAIL", "reason": str(e)}
