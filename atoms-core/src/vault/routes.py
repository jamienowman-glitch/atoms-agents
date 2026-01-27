from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from src.identity.auth import get_auth_context, AuthContext
from src.vault.service import VaultService

router = APIRouter(prefix="/vault", tags=["vault"])

class VaultResponse(BaseModel):
    key: str
    value: str

def get_service() -> VaultService:
    return VaultService()

@router.get("/{key_name}", response_model=VaultResponse)
def get_vault_secret(
    key_name: str,
    auth: AuthContext = Depends(get_auth_context),
    service: VaultService = Depends(get_service)
):
    """
    Retrieve a secret from the Vault.
    REQUIRES: 't_system' identity (Service Key).
    """
    try:
        secret_value = service.get_secret(key_name, auth)
        return VaultResponse(key=key_name, value=secret_value)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Vault Access Denied (System Only)")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Key not found")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid key format")
