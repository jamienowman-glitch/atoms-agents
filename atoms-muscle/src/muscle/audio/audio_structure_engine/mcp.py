from mcp.server.fastmcp import FastMCP
from .service import AudioStructureEngineService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_structure_engine")

# Initialize Service
service = AudioStructureEngineService()

@mcp.tool()
def run_audio_structure_engine(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioStructureEngineService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
