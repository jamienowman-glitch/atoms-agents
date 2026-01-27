from mcp.server.fastmcp import FastMCP
from .service import AudioToVideoOriginService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_to_video_origin")

# Initialize Service
service = AudioToVideoOriginService()

@mcp.tool()
def run_audio_to_video_origin(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioToVideoOriginService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
