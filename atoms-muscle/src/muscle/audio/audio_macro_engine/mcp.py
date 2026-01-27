from mcp.server.fastmcp import FastMCP
from .service import AudioMacroEngineService

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_macro_engine")

# Initialize Service
service = AudioMacroEngineService()

@mcp.tool()
def run_audio_macro_engine(input_path: str, **kwargs) -> dict:
    """
    Executes the AudioMacroEngineService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
