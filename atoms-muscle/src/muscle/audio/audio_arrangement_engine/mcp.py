from mcp.server.fastmcp import FastMCP
from .service import AudioArrangementEngineService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_arrangement_engine")

# Initialize Service
service = AudioArrangementEngineService()

@mcp.tool()
def run_audio_arrangement_engine(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioArrangementEngineService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
