from __future__ import annotations

from typing import List

from engines.common.identity import RequestContext
from engines.registry.schemas.atelier import SurfaceDefinition, ToolSurface
from engines.registry.service import get_component_registry_service


def seed_standard_surfaces() -> None:
    """
    Pre-register core surfaces so they always exist.
    """
    surfaces: List[SurfaceDefinition] = [
        # Desktop
        SurfaceDefinition(
            id=ToolSurface.DESKTOP_RAIL,
            label="Chat Rail",
            description="Global chat assistant rail on desktop."
        ),
        SurfaceDefinition(
            id=ToolSurface.DESKTOP_PANEL,
            label="Right Panel",
            description="Contextual inspector and tool panel on desktop."
        ),
        SurfaceDefinition(
            id=ToolSurface.CANVAS_OVERLAY,
            label="Canvas Overlay",
            description="Overlay elements on the infinite canvas."
        ),
        
        # Mobile
        SurfaceDefinition(
            id=ToolSurface.MOBILE_DOCK,
            label="Floating Dock",
            description="Primary mobile navigation pill."
        ),
        SurfaceDefinition(
            id=ToolSurface.MOBILE_DRAWER,
            label="Bottom Drawer",
            description="Slide-up sheet for detailed tool views on mobile."
        ),

        # Lenses
        SurfaceDefinition(
            id=ToolSurface.CONTEXT_LENS,
            label="Context Lens",
            description="Read-only lens for understanding current context."
        ),
        SurfaceDefinition(
            id=ToolSurface.DELIVERY_LENS,
            label="Delivery Lens",
            description="Write-action lens for delivering content/updates."
        ),
    ]

    service = get_component_registry_service()
    
    # We use a system context for bootstrapping
    # Assuming t_system is the tenant for global defs
    ctx = RequestContext(
        tenant_id="t_system",
        user_id="system_bootstrap",
        env="dev", # Default to dev, could be dynamic
        request_id="bootstrap_001"
    )

    print(f"Seeding {len(surfaces)} standard surfaces...")
    service.register_surfaces(ctx, surfaces)
    print("Done.")

if __name__ == "__main__":
    seed_standard_surfaces()
