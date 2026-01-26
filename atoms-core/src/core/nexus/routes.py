
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from src.core.nexus.service import NexusService
from src.core.main import require_auth

router = APIRouter(prefix="/api/v1/nexus", tags=["nexus"])

class IngestRequest(BaseModel):
    domain: str
    surface: str
    text: Optional[str] = None
    file_path: Optional[str] = None # Local or S3 path
    modality: str = "text" # text, video, audio

from src.core.storage.service import StorageService

class UploadRequest(BaseModel):
    filename: str
    content_type: str

@router.post("/upload-url")
async def get_upload_url(req: UploadRequest, identity = Depends(require_auth)):
    """Get a Presigned S3 URL for direct usage."""
    storage = StorageService()
    # Path: tenant_id/raw/{filename}
    key = f"{identity.tenant_id or 't_demo'}/raw/{req.filename}"
    
    data = storage.get_presigned_url(key, req.content_type)
    if not data:
        raise HTTPException(500, "Failed to generate presigned URL")
        
    return {
        "url": data['url'],
        "fields": data['fields'],
        "key": key
    }

@router.post("/ingest")
async def ingest(req: IngestRequest, identity = Depends(require_auth)):
    """Ingest content into Nexus."""
    service = NexusService(tenant_id=identity.tenant_id or "t_demo")
    
    try:
        if req.modality == "text":
            if not req.text:
                raise HTTPException(400, "Text required for text modality")
            mem_id = service.ingest(req.domain, req.surface, req.text)
            return {"status": "success", "id": mem_id, "type": "text"}
            
        elif req.modality == "video":
            if not req.file_path:
                raise HTTPException(400, "File path required for video modality")
                
            # If path starts with s3://, we might need to handle it.
            # But specific to our setup, if it's in our bucket, the VideoMuscle 
            # might need to download it using the same boto3 creds.
            
            # For now, we pass the key.
            mem_id = service.ingest_video(req.domain, req.surface, req.file_path)
            return {"status": "success", "id": mem_id, "type": "video"}

        else:
            raise HTTPException(400, f"Unsupported modality: {req.modality}")
            
    except Exception as e:
        print(f"Ingest Error: {e}")
        raise HTTPException(500, str(e))
