from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from src.main import require_auth
from src.identity.models import RequestContext
from src.maybes.models import Note, NoteCreate, NoteUpdate
from src.maybes.service import MaybesService

router = APIRouter(prefix="/api/v1/maybes", tags=["maybes"])

def get_service(identity: RequestContext = Depends(require_auth)) -> MaybesService:
    return MaybesService(identity)

@router.get("/notes", response_model=List[Note])
def list_notes(service: MaybesService = Depends(get_service)):
    return service.list_notes()

@router.post("/notes", response_model=Note)
def create_note(note: NoteCreate, service: MaybesService = Depends(get_service)):
    return service.create_note(note)

@router.patch("/notes/{note_id}", response_model=Note)
def update_note(note_id: UUID, note: NoteUpdate, service: MaybesService = Depends(get_service)):
    updated = service.update_note(note_id, note)
    if not updated:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated

@router.delete("/notes/{note_id}")
def delete_note(note_id: UUID, service: MaybesService = Depends(get_service)):
    success = service.delete_note(note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"status": "archived"}

@router.post("/forward")
async def forward_note(note_id: UUID, target_surface: str, service: MaybesService = Depends(get_service)):
    try:
        await service.forward_to_harness(note_id, target_surface)
        return {"status": "forwarded"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
