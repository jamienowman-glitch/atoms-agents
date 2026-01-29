from mcp.server.fastmcp import FastMCP
from .service import AudioGrooveService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_groove")

# Initialize Service
service = AudioGrooveService()

@mcp.tool()
@require_snax()
def run_audio_groove(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioGrooveService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
