from typing import List, Optional
from mcp.server.fastmcp import FastMCP
from atoms_core.src.budget.snax_guard import require_snax, PaymentRequired
from .service import SearchAssistantService

mcp = FastMCP("muscle-knowledge-search_assistant")

service = SearchAssistantService()

@mcp.tool()
@require_snax(tool_key="muscle-knowledge-search_assistant")
def run_search_assistant(
    query_text: str,
    tenant_id: str,
    domain: Optional[str] = None,
    domains: Optional[List[str]] = None,
    limit: int = 5,
    run_id: str = "unknown",
    project_id: str = "unknown",
    surface_id: Optional[str] = None,
    agent_id: Optional[str] = None,
    space_id: Optional[str] = None
) -> dict:
    """
    Executes SearchAssistantService.

    Args:
        query_text: The search query.
        tenant_id: The tenant ID.
        domain: Target domain for single search.
        domains: List of target domains for God Mode search.
        limit: Max results.
        run_id: Run ID for event context.
        project_id: Project ID for event context.
        surface_id: Surface ID for event context.
        agent_id: Agent ID for event context.
        space_id: Space ID for event context.
    """
    try:
        return service.run(
            input_path=query_text,
            tenant_id=tenant_id,
            domain=domain,
            domains=domains,
            limit=limit,
            run_id=run_id,
            project_id=project_id,
            surface_id=surface_id,
            agent_id=agent_id,
            space_id=space_id
        )
    except PaymentRequired as exc:
        return {"error": "payment_required", "detail": str(exc)}
    except Exception as exc:
        return {"error": str(exc), "error_type": type(exc).__name__}

if __name__ == "__main__":
    mcp.run()
