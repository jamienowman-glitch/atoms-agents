from typing import Optional, List
from pydantic import BaseModel

class AuthContext(BaseModel):
    user_id: str = "u_muscle_default"
    tenant_ids: List[str] = ["t_muscle_default"]

def get_auth_context():
    return AuthContext()

def require_tenant_membership(*args, **kwargs):
    pass
