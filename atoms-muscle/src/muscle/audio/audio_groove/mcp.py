from mcp.server.fastmcp import FastMCP
from .service import AudioGrooveService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_groove")

# Initialize Service
service = AudioGrooveService()

@mcp.tool()
def run_audio_groove(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioGrooveService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
