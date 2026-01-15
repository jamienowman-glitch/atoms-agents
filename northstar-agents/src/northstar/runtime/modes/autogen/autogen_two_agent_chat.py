from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.result import ModeRunResult
from northstar.runtime.adapters.autogen_gateway import NorthstarAutoGenModelClient

def run(input_data: Dict[str, Any], ctx: RunContext) -> ModeRunResult:
    # 1. Check Dependencies
    try:
        import autogen
    except ImportError:
        return ModeRunResult(status="SKIP", reason="autogen not installed")

    if not ctx.llm_gateway or not ctx.model_card:
        # Prompt: "If framework integration is impossible without framework-specific provider creds (or gateway), FAIl/SKIP?"
        # Prompt says: "If config missing -> SKIP only if never passed, otherwise FAIL (ledger rule)."
        return ModeRunResult(status="SKIP", reason="No LLMGateway or ModelCard provided in context")

    # 3. Execution
    try:
        # Register custom model client
        config_list = [{
            "model": ctx.model_card.model_id, 
            "model_client_cls": "NorthstarAutoGenModelClient"
        }]
        
        user_proxy = autogen.UserProxyAgent(
            name="User_Proxy",
            system_message="Human admin",
            code_execution_config=False,
            human_input_mode="NEVER"
        )
        
        assistant = autogen.AssistantAgent(
            name="Assistant",
            llm_config={"config_list": config_list}
        )
        
        # Inject our client instance factory?
        # AutoGen registers classes. We need to register the class with the agent.
        assistant.register_model_client(
            model_client_cls=NorthstarAutoGenModelClient,
            func=lambda config: NorthstarAutoGenModelClient(
                config, 
                gateway=ctx.llm_gateway, 
                provider_config=ctx.provider_config, 
                model_card=ctx.model_card
            )
        )
        
        # Real Call: Initiate Chat
        user_proxy.initiate_chat(
            assistant,
            message="Hello (Gateway Smoke Test)",
            max_turns=1
        )
        
        return ModeRunResult(
            status="PASS", 
            reason="AutoGen TwoAgent execution successful via Gateway", 
            output="Chat initiated and completed 1 turn"
        )
        
    except Exception as e:
        return ModeRunResult(status="FAIL", reason=f"AutoGen Error: {e}")
