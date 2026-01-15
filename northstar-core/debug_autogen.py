import asyncio
import uuid
import time
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.messages import TextMessage

from autogen_core.models import CreateResult, RequestUsage

# Minimal Mock for BedrockClient to test orchestration flow
class MockBedrockClient:
    def __init__(self):
        pass

    async def create(self, messages, **kwargs):
        print(f"DEBUG_CLIENT: Received {len(messages)} messages")
        # Return a valid result object expected by AutoGen
        usage = RequestUsage(prompt_tokens=10, completion_tokens=10)
        return CreateResult(content="This is a mock response from Bedrock.", usage=usage, finish_reason="stop", cached=False)

    async def create_stream(self, messages, **kwargs):
        yield "Stream"

    @property
    def model_info(self):
        return {
            "vision": False,
            "function_calling": False,
            "json_output": False,
            "family": "bedrock"
        }

async def main():
    try:
        client = MockBedrockClient()
        
        agent_a = AssistantAgent("agent_a", model_client=client, system_message="A")
        agent_b = AssistantAgent("agent_b", model_client=client, system_message="B")
        
        # RoundRobin for 2 turns
        team = RoundRobinGroupChat([agent_a, agent_b], max_turns=2)
        
        print("DEBUG: Starting run...")
        result = await team.run(task="Hello")
        
        print(f"DEBUG: Result Messages: {len(result.messages)}")
        for m in result.messages:
            print(f"DEBUG: {m.source}: {getattr(m, 'content', 'No Content')}")
            
    except Exception as e:
        print(f"DEBUG: Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
