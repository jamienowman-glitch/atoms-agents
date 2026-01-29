from mcp.server.fastmcp import FastMCP
from .service import TemplateService

# Initialize FastMCP
mcp = FastMCP("muscle-video-video_edit_templates")

# Initialize Service
service = TemplateService()

@mcp.tool()
def run_video_edit_templates(input_path: str, **kwargs) -> dict:
    """
    Executes the TemplateService logic.
    """
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
