from typing import Any, Dict, List
from pydantic import BaseModel, Field, ConfigDict

class BlackboardState(BaseModel):
    version: int
    raw_data: Dict[str, Any]       # The heavy JSON dumps
    distilled_context: str         # The "Story so far" (Markdown)
    takeaways: List[str]           # Key decisions made (Bullet points)
    active_agents: List[str]       # Who is currently writing

    model_config = ConfigDict(extra="ignore")
