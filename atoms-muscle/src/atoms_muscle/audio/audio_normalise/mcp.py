from mcp.server.fastmcp import FastMCP
from atoms_core.src.budget.snax_guard import require_snax, PaymentRequired
from .service import AudioNormaliseService

mcp = FastMCP("muscle-audio-audio_normalise")

service = AudioNormaliseService()

@mcp.tool()
@require_snax(tool_key="muscle-audio-audio_normalise")
def run_audio_normalise(input_path: str, **kwargs) -> dict:
    """
    Executes AudioNormaliseService.
    """
    try:
        return service.run(input_path, **kwargs)
    except PaymentRequired as exc:
        return {"error": "payment_required", "detail": str(exc)}
    except Exception as exc:
        return {"error": str(exc), "error_type": type(exc).__name__}

if __name__ == "__main__":
    mcp.run()
