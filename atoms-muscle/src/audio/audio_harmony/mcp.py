from mcp.server.fastmcp import FastMCP
from .service import AudioHarmonyService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_harmony")

# Initialize Service
service = AudioHarmonyService()

@mcp.tool()
@require_snax()
def run_audio_harmony(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioHarmonyService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
