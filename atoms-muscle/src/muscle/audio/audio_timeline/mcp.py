from mcp.server.fastmcp import FastMCP
from .service import AudioTimelineService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_timeline")

# Initialize Service
service = AudioTimelineService()

@mcp.tool()
def run_audio_timeline(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioTimelineService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
