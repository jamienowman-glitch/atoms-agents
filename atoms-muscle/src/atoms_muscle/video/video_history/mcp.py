from mcp.server.fastmcp import FastMCP
from atoms_core.src.budget.snax_guard import require_snax, PaymentRequired
from .service import HistoryService

mcp = FastMCP("muscle-video-video_history")

service = HistoryService()

@mcp.tool()
@require_snax(tool_key="muscle-video-video_history")
def run_video_history(input_path: str, **kwargs) -> dict:
    """
    Executes HistoryService.
    """
    try:
        return service.run(input_path, **kwargs)
    except PaymentRequired as exc:
        return {"error": "payment_required", "detail": str(exc)}
    except Exception as exc:
        return {"error": str(exc), "error_type": type(exc).__name__}

if __name__ == "__main__":
    mcp.run()
