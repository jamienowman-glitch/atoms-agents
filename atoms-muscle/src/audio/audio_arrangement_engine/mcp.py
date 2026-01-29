from mcp.server.fastmcp import FastMCP
from .service import AudioArrangementEngineService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_arrangement_engine")

# Initialize Service
service = AudioArrangementEngineService()

@mcp.tool()
@require_snax()
def run_audio_arrangement_engine(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioArrangementEngineService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
