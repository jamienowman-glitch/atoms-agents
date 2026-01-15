from typing import Any
import sys

def list_tenants(ctx: Any) -> None:
    """List all available tenants."""
    if not hasattr(ctx, "tenants") or not ctx.tenants:
        print("No tenants found.")
        return

    print(f"Found {len(ctx.tenants)} tenants:")
    for tid, card in ctx.tenants.items():
        print(f"  - {tid}: {card.name}")

def show_tenant(ctx: Any, tenant_id: str) -> None:
    """Show details for a specific tenant."""
    if not hasattr(ctx, "tenants") or tenant_id not in ctx.tenants:
        print(f"Tenant '{tenant_id}' not found.")
        sys.exit(1)

    card = ctx.tenants[tenant_id]
    print(f"Tenant: {card.name} ({card.tenant_id})")
    
    if card.policy_pack_refs:
        print("  Policies:")
        for pid in card.policy_pack_refs:
            print(f"    - {pid}")
            
    if card.budget_ref:
        print(f"  Budget: {card.budget_ref}")
        
    if card.nexus_profile_ref:
        print(f"  Nexus Profile: {card.nexus_profile_ref}")

    if card.secrets_profile_ref:
        print(f"  Secrets Profile: {card.secrets_profile_ref}")

    if card.default_overlays:
        print("  Default Overlays:")
        for overlay in card.default_overlays:
            print(f"    - {overlay}")
