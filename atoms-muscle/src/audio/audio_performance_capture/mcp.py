from mcp.server.fastmcp import FastMCP
from .service import AudioPerformanceCaptureService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_performance_capture")

# Initialize Service
service = AudioPerformanceCaptureService()

@mcp.tool()
@require_snax()
def run_audio_performance_capture(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioPerformanceCaptureService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
