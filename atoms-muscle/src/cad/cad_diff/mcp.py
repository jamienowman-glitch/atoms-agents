"""
MCP Wrapper for CAD Diff.
"""
import json
from mcp.server.fastmcp import FastMCP
from .service import DiffService
from atoms_core.src.cad.models import SemanticModel
from atoms_core.src.construction.models import BoQModel, CostModel, PlanOfWork

# Initialize FastMCP
mcp = FastMCP("muscle-cad-cad_diff")

# Initialize Service
service = DiffService()

@mcp.tool()
def diff_semantics(old_semantics_json: str, new_semantics_json: str) -> dict:
    """
    Compute diff between two semantic models (passed as JSON strings).
    """
    try:
        old_obj = SemanticModel.model_validate_json(old_semantics_json)
        new_obj = SemanticModel.model_validate_json(new_semantics_json)

        diff = service.diff_semantics(old_obj, new_obj)
        return diff.model_dump()
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def diff_boq(old_boq_json: str, new_boq_json: str, old_cost_json: str = None, new_cost_json: str = None) -> dict:
    """
    Compute diff between two BoQ models (and optional Cost models).
    """
    try:
        old_b = BoQModel.model_validate_json(old_boq_json)
        new_b = BoQModel.model_validate_json(new_boq_json)

        old_c = CostModel.model_validate_json(old_cost_json) if old_cost_json else None
        new_c = CostModel.model_validate_json(new_cost_json) if new_cost_json else None

        diff = service.diff_boq(old_b, new_b, old_c, new_c)
        return diff.model_dump()
    except Exception as e:
        return {"error": str(e)}

@mcp.tool()
def diff_plan(old_plan_json: str, new_plan_json: str) -> dict:
    """
    Compute diff between two Plan models.
    """
    try:
        old_p = PlanOfWork.model_validate_json(old_plan_json)
        new_p = PlanOfWork.model_validate_json(new_plan_json)

        diff = service.diff_plan(old_p, new_p)
        return diff.model_dump()
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
