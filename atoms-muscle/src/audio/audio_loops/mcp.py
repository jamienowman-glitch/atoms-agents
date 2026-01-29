from mcp.server.fastmcp import FastMCP
from .service import AudioLoopsService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_loops")

# Initialize Service
service = AudioLoopsService()

@mcp.tool()
@require_snax()
def run_audio_loops(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioLoopsService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
