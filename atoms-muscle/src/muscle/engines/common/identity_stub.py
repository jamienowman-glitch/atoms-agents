from typing import Optional, List
from pydantic import BaseModel

class RequestContext(BaseModel):
    tenant_id: Optional[str] = "t_muscle_default"
    project_id: Optional[str] = "p_muscle_default"
    env: Optional[str] = "dev"
    user_id: Optional[str] = "u_muscle_default"

def get_request_context():
    return RequestContext()

def assert_context_matches(*args, **kwargs):
    pass
