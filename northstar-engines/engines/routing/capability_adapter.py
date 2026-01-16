from typing import Dict, Any, List

class CapabilityAdapter:
    """
    Standardizes tool calls so they work regardless of the underlying LLM provider.
    """
    
    @staticmethod
    def adapt_tool_definitions(tools: List[Dict[str, Any]], target_provider: str) -> Any:
        # Transform generic helper tool definitions into provider-specific schemas
        if target_provider == "bedrock":
            return [CapabilityAdapter._to_bedrock_tool(t) for t in tools]
        elif target_provider == "vertex":
            return [CapabilityAdapter._to_vertex_tool(t) for t in tools]
        elif target_provider == "openai" or target_provider == "groq":
             return [CapabilityAdapter._to_openai_tool(t) for t in tools]
        return tools

    @staticmethod
    def _to_bedrock_tool(tool: Dict[str, Any]) -> Dict[str, Any]:
        # Mock transformation to Bedrock format
        return {
            "toolSpec": {
                "name": tool["name"],
                "description": tool["description"],
                "inputSchema": {
                    "json": tool["parameters"]
                }
            }
        }

    @staticmethod
    def _to_vertex_tool(tool: Dict[str, Any]) -> Dict[str, Any]:
        # Mock transformation to Vertex format
        return {
            "name": tool["name"],
            "description": tool["description"],
            "parameters": tool["parameters"]
        }

    @staticmethod
    def _to_openai_tool(tool: Dict[str, Any]) -> Dict[str, Any]:
         # Standard OpenAI format often used as the 'common' format
        return {
            "type": "function",
            "function": {
                "name": tool["name"],
                "description": tool["description"],
                "parameters": tool["parameters"]
            }
        }
