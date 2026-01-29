from mcp.server.fastmcp import FastMCP
from .service import AudioMixSnapshotService
from atoms_muscle.src.common.billing import require_snax

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_mix_snapshot")

# Initialize Service
service = AudioMixSnapshotService()

@mcp.tool()
@require_snax()
def run_audio_mix_snapshot(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioMixSnapshotService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
