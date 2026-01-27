from mcp.server.fastmcp import FastMCP
from .service import AudioHitsService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_hits")

# Initialize Service
service = AudioHitsService()

@mcp.tool()
def run_audio_hits(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioHitsService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
