from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Literal
from pydantic import BaseModel

from engines.common.identity import RequestContext
from engines.registry.service import get_component_registry_service, ComponentRegistryService
from engines.canvas_commands.store_service import CanvasCommandStoreService
from engines.canvas_commands.models import CommandEnvelope

logger = logging.getLogger(__name__)

class TokenCatalogItem(BaseModel):
    """Represents a merged token state for the UI."""
    token_key: str
    section: str = "general"
    token_type: str = "string"
    controller_kind: str = "text"
    controller_config: Dict[str, Any] = {}
    option_source: Optional[str] = None
    missing_siblings: Optional[List[str]] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    value: Any = None
    # For element scoping
    element_id: Optional[str] = None

class TokenCatalogService:
    def __init__(self, context: RequestContext) -> None:
        self.context = context
        self.registry = get_component_registry_service()
        self.cmd_store = CanvasCommandStoreService(context)

    async def get_token_catalog(self, canvas_id: str, element_id: Optional[str] = None) -> List[TokenCatalogItem]:
        # 1. Load Authoritative Definitions from Code Schema
        from engines.tokens.schema import TOKEN_DEFINITIONS
        
        # 2. Replay Canvas State
        commands = self.cmd_store.list_commands_since(canvas_id, 0)
        
        # Build state: element_id -> token_path -> value
        instance_values: Dict[str, Dict[str, Any]] = {}
        
        for cmd in commands:
            ctype = cmd.get("type")
            args = cmd.get("command_args", {})
            
            if ctype == "set_token":
                eid = args.get("element_id")
                path = args.get("token_path")
                val = args.get("value")
                if eid and path:
                    if eid not in instance_values:
                        instance_values[eid] = {}
                    instance_values[eid][path] = val
            elif ctype == "set_tokens":
                eid = args.get("element_id")
                updates = args.get("updates", [])
                if eid:
                    if eid not in instance_values:
                        instance_values[eid] = {}
                    for up in updates:
                        path = up.get("token_path")
                        val = up.get("value")
                        if path:
                            instance_values[eid][path] = val

        # 3. Build Catalog
        catalog: List[TokenCatalogItem] = []
        
        for defn in TOKEN_DEFINITIONS:
             # Basic mapping from Schema Def to UI Catalog Item
             # Wildcards need expansion (later), for now listing explicit ones
             if "*" in defn.path:
                 continue

             item = TokenCatalogItem(
                token_key=defn.path,
                section=defn.path.split('.')[0], # heuristic
                token_type=defn.type,
                controller_kind=defn.format if defn.format else ("select" if defn.enum else "text"),
                controller_config={"options": defn.enum} if defn.enum else {},
                value=None 
             )
             
             # Merge instance values
             # 1. Canvas Global Override
             if "canvas" in instance_values and item.token_key in instance_values["canvas"]:
                 item.value = instance_values["canvas"][item.token_key]
             
             # 2. Element Specific Override
             if element_id and element_id in instance_values and item.token_key in instance_values[element_id]:
                 item.value = instance_values[element_id][item.token_key]
                 item.element_id = element_id
            
             catalog.append(item)

        return catalog

def get_token_catalog_service(context: RequestContext) -> TokenCatalogService:
    return TokenCatalogService(context)
