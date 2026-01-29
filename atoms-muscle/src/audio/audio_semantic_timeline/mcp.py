from mcp.server.fastmcp import FastMCP
from .service import AudioSemanticBackend
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_semantic_timeline")

# Initialize Service
service = AudioSemanticBackend()

@mcp.tool()
@require_snax()
def run_audio_semantic_timeline(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioSemanticBackend logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
