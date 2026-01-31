from __future__ import annotations

from typing import Optional

from src.identity.middleware import supabase


def normalize_surface_id(surface_id: Optional[str]) -> Optional[str]:
    if surface_id is None:
        return None
    if not supabase:
        return surface_id
    try:
        response = (
            supabase.table("surface_aliases")
            .select("canonical_id")
            .eq("alias_id", surface_id)
            .limit(1)
            .execute()
        )
        if response.data:
            return response.data[0].get("canonical_id") or surface_id
    except Exception:
        return surface_id
    return surface_id
