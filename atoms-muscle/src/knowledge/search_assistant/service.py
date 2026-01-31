from typing import List, Optional, Any, Union
import uuid
from atoms_core.src.nexus.service import NexusService
from atoms_core.src.event_spine.service import EventService
from atoms_core.src.event_spine.repository import EventRepository
from atoms_core.src.event_spine.models import EventCreate

class SearchAssistantService:
    def __init__(self):
        self.event_repo = EventRepository()
        self.event_service = EventService(self.event_repo)

    def run(self, input_path: str, **kwargs) -> dict:
        """
        Unified entry point for search.

        Args:
            input_path (str): The query text.
            kwargs:
                tenant_id (str): Required.
                domain (str): Target domain for single search.
                domains (List[str] or str): Target domains for god mode search.
                limit (int): Max results (default 5).
                run_id (str): Run ID for event logging.
                project_id (str): Project ID for event logging.
                surface_id (str): Surface ID.
                agent_id (str): Agent ID.
                space_id (str): Space ID.
        """
        query_text = input_path
        tenant_id = kwargs.get("tenant_id")
        if not tenant_id:
            raise ValueError("tenant_id is required")

        domains = kwargs.get("domains")
        domain = kwargs.get("domain")

        limit = int(kwargs.get("limit", 5))

        # Metadata for Event
        run_id = kwargs.get("run_id", "unknown")
        project_id = kwargs.get("project_id", "unknown")
        surface_id = kwargs.get("surface_id")
        agent_id = kwargs.get("agent_id")
        space_id = kwargs.get("space_id")

        nexus = NexusService(tenant_id=tenant_id)

        # Embed query
        query_vector = nexus.embed.embed_text(query_text)

        results = []
        mode = "single"

        target_domains_list = []

        if domains:
             mode = "god"
             if isinstance(domains, str):
                 target_domains_list = [d.strip() for d in domains.split(",")]
             elif isinstance(domains, list):
                 target_domains_list = domains

             results = nexus.many_worlds_recall(target_domains_list, query_vector, limit=limit)
        elif domain:
             mode = "domain"
             target_domains_list = [domain]
             results = nexus.recall(domain, query_vector, limit=limit)
        else:
             raise ValueError("Either 'domain' or 'domains' must be provided.")

        # Emit Event
        event_id = str(uuid.uuid4())

        payload = {
            "query": query_text,
            "mode": mode,
            "hit_count": len(results),
            "top_score": results[0]['_distance'] if results else 0.0,
            "target_domain": domain,
            "target_domains": target_domains_list
        }

        event = EventCreate(
            id=event_id,
            tenant_id=tenant_id,
            mode="saas",
            project_id=project_id,
            run_id=run_id,
            surface_id=surface_id,
            space_id=space_id,
            agent_id=agent_id,
            event_type="nexus.search_hit",
            display_name="Nexus Search Hit",
            raw_name="nexus.search_hit",
            payload=payload
        )

        self.event_service.append_event(event)

        return {
            "query": query_text,
            "results": results,
            "count": len(results),
            "mode": mode
        }
