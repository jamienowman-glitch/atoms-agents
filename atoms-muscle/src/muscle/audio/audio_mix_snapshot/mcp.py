from mcp.server.fastmcp import FastMCP
from .service import AudioMixSnapshotService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_mix_snapshot")

# Initialize Service
service = AudioMixSnapshotService()

@mcp.tool()
def run_audio_mix_snapshot(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioMixSnapshotService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
