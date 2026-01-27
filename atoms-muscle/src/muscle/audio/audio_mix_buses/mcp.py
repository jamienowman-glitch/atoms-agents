from mcp.server.fastmcp import FastMCP
from .service import AudioMixBusesService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_mix_buses")

# Initialize Service
service = AudioMixBusesService()

@mcp.tool()
def run_audio_mix_buses(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioMixBusesService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
