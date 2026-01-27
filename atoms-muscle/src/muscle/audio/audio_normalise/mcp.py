from mcp.server.fastmcp import FastMCP
from .service import AudioNormaliseService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_normalise")

# Initialize Service
service = AudioNormaliseService()

@mcp.tool()
def run_audio_normalise(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioNormaliseService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
