"""
MCP Wrapper for BoQ Costing.
"""
import json
from mcp.server.fastmcp import FastMCP
from atoms_core.src.construction.models import BoQModel, Currency
from .service import get_costing_service

# Initialize FastMCP
mcp = FastMCP("muscle-construction-boq_costing")

@mcp.tool()
def run_boq_costing(
    boq_model_json: str,
    currency: str = "USD",
    markup_pct: float = 0.0,
    tax_pct: float = 0.0,
    catalog_version: str = "1.0.0"
) -> dict:
    """
    Generate Cost Estimate from BoQ Model (passed as JSON string).
    """
    try:
        # Parse BoQ
        boq = BoQModel.model_validate_json(boq_model_json)

        # Parse currency
        try:
            curr = Currency(currency)
        except ValueError:
            return {"error": f"Invalid currency: {currency}"}

        svc = get_costing_service()
        cost_model, response = svc.estimate_cost(
            boq_model=boq,
            currency=curr,
            markup_pct=markup_pct,
            tax_pct=tax_pct,
            catalog_version=catalog_version
        )

        # Stub artifact
        # artifact_id = svc.register_artifact(boq.id, cost_model)
        # response.cost_artifact_id = artifact_id

        return response.model_dump()

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
