from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Optional, TypeVar

from supabase import create_client, Client

T = TypeVar("T")

VAULT_DIR = Path("/Users/jaynowman/northstar-keys")


class PaymentRequired(Exception):
    """Raised when a tenant does not have sufficient Snax."""


@dataclass
class SnaxChargeResult:
    new_balance: int


def _read_vault_text(filename: str) -> str:
    path = VAULT_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Missing vault secret: {path}")
    value = path.read_text().strip()
    if not value:
        raise ValueError(f"Vault secret empty: {path}")
    return value


def _get_service_supabase() -> Client:
    url = _read_vault_text("supabase-url.txt")
    service_key = _read_vault_text("supabase-service-key.txt")
    return create_client(url, service_key)


def _resolve_tenant_id(kwargs: dict[str, Any]) -> Optional[str]:
    if "tenant_id" in kwargs and kwargs["tenant_id"]:
        return str(kwargs["tenant_id"])
    context = kwargs.get("context") or kwargs.get("request_context") or {}
    if isinstance(context, dict) and context.get("tenant_id"):
        return str(context["tenant_id"])
    return None


def _get_price_snax(client: Client, tool_key: str) -> int:
    response = client.table("pricing").select("base_price_snax").eq("tool_key", tool_key).limit(1).execute()
    if not response.data:
        raise ValueError(f"pricing_missing:{tool_key}")
    return int(response.data[0].get("base_price_snax") or 0)


def _charge_snax(client: Client, tenant_id: str, tool_key: str, cost_snax: int, request_id: str | None) -> SnaxChargeResult:
    payload = {
        "p_tenant_id": tenant_id,
        "p_tool_key": tool_key,
        "p_cost_snax": cost_snax,
        "p_request_id": request_id,
        "p_reason": "usage",
    }
    response = client.rpc("snax_charge", payload).execute()
    if response.data is None:
        raise PaymentRequired("insufficient_snax")
    if isinstance(response.data, list) and response.data:
        return SnaxChargeResult(new_balance=int(response.data[0].get("new_balance") or 0))
    return SnaxChargeResult(new_balance=int(response.data.get("new_balance") or 0))


def require_snax(tool_key: str, cost_snax: Optional[int] = None) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """
    Decorator that charges Snax before executing the wrapped function.

    Expects tenant_id in kwargs or in context/request_context dict.
    """
    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        def wrapper(*args: Any, **kwargs: Any) -> T:
            tenant_id = _resolve_tenant_id(kwargs)
            if not tenant_id:
                raise PaymentRequired("tenant_missing")
            client = _get_service_supabase()
            price = cost_snax if cost_snax is not None else _get_price_snax(client, tool_key)
            _charge_snax(client, tenant_id, tool_key, int(price), kwargs.get("request_id"))
            return fn(*args, **kwargs)
        return wrapper
    return decorator
