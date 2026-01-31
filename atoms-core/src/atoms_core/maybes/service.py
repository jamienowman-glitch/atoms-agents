from typing import List, Optional
from uuid import UUID
from src.identity.middleware import supabase
from src.maybes.models import Note, NoteCreate, NoteUpdate
from src.realtime.timeline import get_timeline_service
from src.realtime.contracts import StreamEvent, RoutingKeys, ActorType
from src.identity.models import RequestContext

class MaybesService:
    def __init__(self, context: RequestContext):
        self.context = context
        self.supabase = supabase

    def _get_table(self):
        if not self.supabase:
            raise RuntimeError("Supabase client not initialized")
        return self.supabase.table("maybes_notes")

    def list_notes(self) -> List[Note]:
        # Filter by tenant. RLS should handle it, but we add explicit filter for safety.
        response = self._get_table().select("*").eq("tenant_id", self.context.tenant_id).order("updated_at", desc=True).execute()
        return [Note(**item) for item in response.data]

    def create_note(self, note: NoteCreate) -> Note:
        data = note.dict()
        data["tenant_id"] = self.context.tenant_id
        data["user_id"] = self.context.user_id or "unknown"
        data["space_id"] = "default" # TODO: Get from context if available
        data["surface_id"] = getattr(self.context, "surface_id", "default")

        response = self._get_table().insert(data).execute()
        if not response.data:
            raise RuntimeError("Failed to create note")
        return Note(**response.data[0])

    def update_note(self, note_id: UUID, update: NoteUpdate) -> Optional[Note]:
        data = update.dict(exclude_unset=True)
        data["updated_at"] = "now()"

        response = self._get_table().update(data).eq("id", str(note_id)).eq("tenant_id", self.context.tenant_id).execute()
        if not response.data:
            return None
        return Note(**response.data[0])

    def delete_note(self, note_id: UUID) -> bool:
        # Soft delete
        response = self._get_table().update({"is_archived": True}).eq("id", str(note_id)).eq("tenant_id", self.context.tenant_id).execute()
        return len(response.data) > 0

    async def forward_to_harness(self, note_id: UUID, target_surface: str):
        # 1. Fetch note to verify access
        response = self._get_table().select("*").eq("id", str(note_id)).eq("tenant_id", self.context.tenant_id).execute()
        if not response.data:
            raise ValueError("Note not found")
        note = Note(**response.data[0])

        # 2. Construct Event
        routing = RoutingKeys(
            tenant_id=self.context.tenant_id,
            project_id=getattr(self.context, "project_id", "p_default"),
            actor_id=self.context.user_id or "system",
            actor_type=ActorType.HUMAN,
            surface_id=target_surface
        )

        event = StreamEvent(
            type="maybes.forward",
            routing=routing,
            data={
                "note_id": str(note.id),
                "type": note.type,
                "content": note.content_text,
                "uri": note.content_uri
            }
        )

        # 3. Emit to Timeline
        timeline = get_timeline_service()
        await timeline.append_event(event, self.context)
