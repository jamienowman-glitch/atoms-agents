from mcp.server.fastmcp import FastMCP
from .service import AudioService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_service")

# Initialize Service
service = AudioService()

@mcp.tool()
@require_snax()
def run_audio_service(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
