from mcp.server.fastmcp import FastMCP
from atoms_core.src.billing.decorators import require_snax, PaymentRequired
import json
from .service import service
from .models import ExportJob

mcp = FastMCP("muscle-export-universal")

@mcp.tool()
@require_snax(tool_key="muscle-export-universal")
def run_export_job(job_json: str) -> dict:
    """
    Executes Export Service.
    Args:
        job_json: JSON string matching ExportJob schema
    """
    try:
        data = json.loads(job_json)
        job = ExportJob(**data)
        result = service.export(job)
        return result.dict()
    except PaymentRequired as exc:
        return {"error": "payment_required", "detail": str(exc)}
    except Exception as exc:
        return {"error": str(exc), "error_type": type(exc).__name__}

if __name__ == "__main__":
    mcp.run()
