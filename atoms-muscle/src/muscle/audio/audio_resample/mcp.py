from mcp.server.fastmcp import FastMCP
from .service import AudioResampleService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_resample")

# Initialize Service
service = AudioResampleService()

@mcp.tool()
def run_audio_resample(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioResampleService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
