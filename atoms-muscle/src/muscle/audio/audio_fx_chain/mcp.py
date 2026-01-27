from mcp.server.fastmcp import FastMCP
from .service import AudioFxChainService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_fx_chain")

# Initialize Service
service = AudioFxChainService()

@mcp.tool()
def run_audio_fx_chain(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioFxChainService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
