from mcp.server.fastmcp import FastMCP
from .service import AudioSeparationService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_separation")

# Initialize Service
service = AudioSeparationService()

@mcp.tool()
def run_audio_separation(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioSeparationService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
