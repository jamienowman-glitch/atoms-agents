"""
MCP Wrapper for BoQ Quantities.
"""
import json
from mcp.server.fastmcp import FastMCP
from atoms_core.src.cad.models import SemanticModel
from .service import get_boq_service

# Initialize FastMCP
mcp = FastMCP("muscle-construction-boq_quantities")

@mcp.tool()
def run_boq_quantities(
    semantic_model_json: str,
    calc_version: str = "1.0.0",
    wall_height_mm: float = 2700.0,
    wall_thickness_mm: float = 200.0
) -> dict:
    """
    Generate Bill of Quantities from a Semantic Model (passed as JSON string).

    Args:
        semantic_model_json: JSON string of SemanticModel
        calc_version: Version of BoQ rules
        wall_height_mm: Default wall height
        wall_thickness_mm: Default wall thickness
    """
    try:
        # Parse input model
        semantic_model = SemanticModel.model_validate_json(semantic_model_json)

        # Prepare params
        params = {
            "wall_height_mm": wall_height_mm,
            "wall_thickness_mm": wall_thickness_mm
        }

        svc = get_boq_service()
        boq_model, response = svc.quantify(semantic_model, calc_version, params)

        # Stub artifact
        # artifact_id = svc.register_artifact(semantic_model.id, boq_model)
        # response.boq_artifact_id = artifact_id

        return response.model_dump()

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
