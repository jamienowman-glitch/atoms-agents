"""
MCP Wrapper for CAD Viewer.
"""
from typing import Optional

from mcp.server.fastmcp import FastMCP
from .service import get_cad_viewer_service

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_viewer")

@mcp.tool()
def build_gantt_view(
    project_id: str,
    cost_model_id: str,
    tenant_id: str = "default",
    env: str = "dev"
) -> dict:
    """
    Build Gantt view for a project.
    Note: Requires upstream Plan/Cost services (currently stubbed).
    """
    svc = get_cad_viewer_service()
    context = {"tenant_id": tenant_id, "env": env}

    try:
        view = svc.build_gantt_view(project_id, cost_model_id, context)
        return view.model_dump()
    except NotImplementedError:
        return {"error": "Upstream services unavailable in this environment."}
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def build_overlay_view(
    project_id: str,
    cost_model_id: str,
    tenant_id: str = "default",
    env: str = "dev"
) -> dict:
    """
    Build Overlay view for a project.
    Note: Requires upstream Cost services (currently stubbed).
    """
    svc = get_cad_viewer_service()
    context = {"tenant_id": tenant_id, "env": env}

    try:
        view = svc.build_overlay_view(project_id, cost_model_id, context)
        return view.model_dump()
    except NotImplementedError:
        return {"error": "Upstream services unavailable in this environment."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
