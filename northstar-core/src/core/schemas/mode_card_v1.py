from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional

class ModeCardV1(BaseModel):
    """
    Strict Schema for Mode Cards (V1).
    Ensures all registry modes conform to a predictable shape for the runtime.
    """
    framework: str = Field(..., description="The framework identifier (e.g., 'autogen', 'langgraph').")
    mode_id: str = Field(..., description="Unique identifier for the mode (e.g., 'LangGraph.Streaming').")
    invoke_entrypoint: str = Field(..., description="Python path to the run function (e.g., 'runtime.module:run').")
    supports_streaming: Literal["token", "event", "none"] = Field("none", description="Streaming capability.")
    required_params: List[str] = Field(default_factory=list, description="List of required input parameter names.")
    pinned_version_ref: str = Field(..., description="Path to PINNED_VERSION.md or 'UNKNOWN'.")
    notes: str = Field(..., description="Usage notes or 'UNKNOWN'.")

    # Optional fields (allowed but not enforced strictly by logic, just schema)
    description: Optional[str] = None
    parameters: Optional[dict] = None  # Legacy param definition, kept for reference

    @field_validator('invoke_entrypoint')
    def validate_entrypoint(cls, v):
        if ":" not in v and "." not in v:
            raise ValueError("Entrypoint must be in format 'module.path:function' or 'module.path.function'")
        return v
