from typing import Any, Dict, List
from .service import SiteSpawnerService

# Initialize service
service = SiteSpawnerService()

def list_tools() -> List[Dict[str, Any]]:
    return [
        {
            "name": "create_site",
            "description": "Spawns a new website from scratch in <30 seconds. Buys domain, creates repo, pushes template, and deploys.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The internal project name (e.g., 'summer-campaign'). Used for repo name."
                    },
                    "domain_strategy": {
                        "type": "string",
                        "enum": ["subdomain", "purchase"],
                        "description": "Whether to use a subdomain or buy a new domain."
                    },
                    "domain_name": {
                        "type": "string",
                        "description": "The full domain name (e.g., 'mysite.com'). Required if strategy is 'purchase'."
                    },
                    "template_id": {
                        "type": "string",
                        "description": "The template to use (e.g., 'ecom/brutalist')."
                    }
                },
                "required": ["name", "domain_strategy", "template_id"]
            }
        }
    ]

async def call_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    if name == "create_site":
        try:
            result = await service.spawn_site(
                name=arguments["name"],
                domain_strategy=arguments["domain_strategy"],
                domain_name=arguments.get("domain_name", ""),
                template_id=arguments["template_id"]
            )
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Successfully spawned site! Repo: {result['repo_url']}, Live: {result['live_url']}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error spawning site: {str(e)}"
                    }
                ],
                "isError": True
            }

    raise ValueError(f"Unknown tool: {name}")
