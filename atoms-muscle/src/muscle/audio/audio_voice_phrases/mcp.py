from mcp.server.fastmcp import FastMCP
from .service import StubVoicePhrasesBackend

# Initialize FastMCP
mcp = FastMCP("muscle-audio-audio_voice_phrases")

# Initialize Service
service = StubVoicePhrasesBackend()

@mcp.tool()
def run_audio_voice_phrases(input_path: str, **kwargs) -> dict:
    """
    Executes the StubVoicePhrasesBackend logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
