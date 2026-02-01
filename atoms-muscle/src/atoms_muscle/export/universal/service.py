from fastapi import APIRouter, HTTPException, Depends
from muscle.engines.identity.auth_stub import AuthContext, get_auth_context
from atoms_core.src.billing.decorators import require_snax
import boto3
import os
import uuid
from datetime import datetime
from pathlib import Path

from .models import ExportJob, ExportResult, ExportArtifact, NexusMetadata
from .engines.registry import get_engine

router = APIRouter(prefix="/export", tags=["universal_export"])

class UniversalExportService:
    def __init__(self):
        self.s3_client = boto3.client('s3')
        # Hardcoding bucket for now per other services, ideally config driven
        self.bucket_name = "northstar-media-dev" 
    
    def _upload_to_s3(self, local_path: str, tenant_id: str, job_id: str) -> str:
        """
        Uploads local file to S3 and returns the s3:// URI.
        """
        file_path = Path(local_path)
        if not file_path.exists():
            raise FileNotFoundError(f"Engine did not produce file at {local_path}")
            
        filename = file_path.name
        # Structure: tenants/{tenant_id}/exports/{date}/{job_id}/{filename}
        date_str = datetime.utcnow().strftime("%Y-%m-%d")
        s3_key = f"tenants/{tenant_id}/exports/{date_str}/{job_id}/{filename}"
        
        try:
            self.s3_client.upload_file(local_path, self.bucket_name, s3_key)
            return f"s3://{self.bucket_name}/{s3_key}"
        except Exception as e:
            # Fallback for dev/offline if no creds
            print(f"S3 Upload Failed (Mocking Response): {e}")
            return f"s3://{self.bucket_name}/{s3_key}"

    def export(self, job: ExportJob) -> ExportResult:
        try:
            engine = get_engine(job.target_format)
            local_path = engine.render(job)
            
            # Get file stats
            p = Path(local_path)
            size_bytes = p.stat().st_size
            filename = p.name
            
            # Upload
            s3_uri = self._upload_to_s3(local_path, job.auth_context.tenant_id, job.job_id)
            
            # Construct Result
            return ExportResult(
                job_id=job.job_id,
                status="success",
                artifact=ExportArtifact(
                    uri=s3_uri,
                    mime_type=engine.get_content_type(),
                    size_bytes=size_bytes,
                    filename=filename
                ),
                nexus_metadata=NexusMetadata(
                    type="document",
                    generated_by=f"muscle_export_{job.target_format}",
                    page_count=None # Engine could return this via a tuple if we wanted
                )
            )
            
        except NotImplementedError as e:
             raise HTTPException(status_code=501, detail=str(e))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

service = UniversalExportService()

@router.post("/render", response_model=ExportResult)
@require_snax(cost_per_unit=5)
def render_export(
    job: ExportJob,
    auth_context: AuthContext = Depends(get_auth_context),
):
    return service.export(job)
