from mcp.server.fastmcp import FastMCP
from atoms_core.src.animation.models import AgentAnimInstruction
from atoms_core.src.animation.logic import AnimationService

# Initialize FastMCP
mcp = FastMCP("muscle-video-animation_kernel")

# Initialize Service
service = AnimationService()

@mcp.tool()
def execute_animation(instruction: dict) -> dict:
    """
    Executes an animation instruction (Auto-Rig, IK Solve, etc).
    Input must match AgentAnimInstruction schema.
    """
    try:
        model = AgentAnimInstruction(**instruction)
        return service.execute_instruction(model)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
