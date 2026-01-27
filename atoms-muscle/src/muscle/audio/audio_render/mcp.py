from mcp.server.fastmcp import FastMCP
from .service import AudioRenderService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_render")

# Initialize Service
service = AudioRenderService()

@mcp.tool()
def run_audio_render(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioRenderService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
