from typing import Any, Dict, List
from .service import TestUnitService

# Initialize service
service = TestUnitService()

def list_tools() -> List[Dict[str, Any]]:
    return [
        {
            "name": "test_unit",
            "description": "Description for test_unit. What does this muscle do?",
            "input_schema": {
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "description": "The specific action to perform."
                    }
                },
                "required": ["action"]
            }
        }
    ]

async def call_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    if name == "test_unit":
        try:
            result = await service.execute_task(arguments)
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Result: {result}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error: {str(e)}"
                    }
                ],
                "isError": True
            }

    raise ValueError(f"Unknown tool: {name}")
