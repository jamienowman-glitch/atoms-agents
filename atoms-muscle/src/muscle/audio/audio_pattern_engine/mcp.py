from mcp.server.fastmcp import FastMCP
from .service import AudioPatternEngineService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_pattern_engine")

# Initialize Service
service = AudioPatternEngineService()

@mcp.tool()
def run_audio_pattern_engine(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioPatternEngineService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
