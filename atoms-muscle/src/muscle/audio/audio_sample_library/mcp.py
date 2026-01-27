from mcp.server.fastmcp import FastMCP
from .service import AudioSampleLibraryService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_sample_library")

# Initialize Service
service = AudioSampleLibraryService()

@mcp.tool()
def run_audio_sample_library(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioSampleLibraryService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
