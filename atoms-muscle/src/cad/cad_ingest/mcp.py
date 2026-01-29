"""
MCP Wrapper for CAD Ingest.
"""
import os
from typing import Optional

from mcp.server.fastmcp import FastMCP
from atoms_core.src.cad.models import CadIngestRequest, UnitKind
from .service import get_cad_ingest_service

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_ingest")

@mcp.tool()
def run_cad_ingest(
    input_path: str,
    tolerance: float = 0.001,
    unit_hint: Optional[str] = None,
    snap_to_grid: bool = False,
    grid_size: float = 0.001,
    tenant_id: str = "default",
    env: str = "dev"
) -> dict:
    """
    Ingest a CAD file (DXF or IFC-lite) and return normalized model metadata.

    Args:
        input_path: Path to local CAD file
        tolerance: Healing tolerance
        unit_hint: Optional unit override (mm, cm, m, ft, in)
        snap_to_grid: Enable grid snapping
        grid_size: Grid size if snapping enabled
        tenant_id: Tenant ID for context
        env: Environment (dev, prod)
    """
    # Verify file exists
    if not os.path.exists(input_path):
        return {"error": f"File not found: {input_path}"}

    # Read content
    try:
        with open(input_path, "rb") as f:
            content = f.read()
    except Exception as e:
        return {"error": f"Failed to read file: {str(e)}"}

    # Parse unit hint
    uk = None
    if unit_hint:
        try:
            uk = UnitKind(unit_hint)
        except ValueError:
            return {"error": f"Invalid unit_hint: {unit_hint}"}

    # Create request
    # TODO: @require_snax decorator should inject context/validation
    req = CadIngestRequest(
        file_uri=input_path,
        tolerance=tolerance,
        unit_hint=uk,
        snap_to_grid=snap_to_grid,
        grid_size=grid_size,
        tenant_id=tenant_id,
        env=env
    )

    # Execute service
    try:
        svc = get_cad_ingest_service()
        model, response = svc.ingest(content, req)

        # Stub artifact registration since media service is unavailable
        # artifact_id = svc.register_artifact(model, req)
        # response.cad_model_artifact_id = artifact_id

        return response.model_dump()
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
