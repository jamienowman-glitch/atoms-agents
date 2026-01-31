from typing import Any, Dict, List
from .service import VaultWriterService

service = VaultWriterService()

def list_tools() -> List[Dict[str, Any]]:
    return [
        {
            "name": "write_secret",
            "description": "Securely writes a secret string to the local vault (disk). NEVER outputs the value.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "The secret name. Must be UPPERCASE_UNDERSCORE (e.g., PROVIDER_API_KEY)."
                    },
                    "value": {
                        "type": "string",
                        "description": "The secret value to store."
                    }
                },
                "required": ["key", "value"]
            }
        }
    ]

async def call_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    if name == "write_secret":
        try:
            result = await service.write_secret(
                key=arguments["key"],
                value=arguments["value"]
            )
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Status: {result}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error writing secret: {str(e)}"
                    }
                ],
                "isError": True
            }

    raise ValueError(f"Unknown tool: {name}")
