from __future__ import annotations
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class OutputParams(BaseModel):
    width: Optional[int] = Field(None, description="Width in pixels")
    height: Optional[int] = Field(None, description="Height in pixels")
    quality: Optional[str] = Field("high", description="Quality setting: low, medium, high")
    include_background: bool = Field(True, description="Whether to include the canvas background")

class AuthContext(BaseModel):
    tenant_id: str = Field(..., description="Tenant ID context")
    env: str = Field("prod", description="Environment: prod, dev, staging")

class ExportJob(BaseModel):
    job_id: str = Field(..., description="Unique Job ID (UUID v4)")
    canvas_state: Dict[str, Any] = Field(..., description="The RAW JSON of the Canvas (Atoms, Props)")
    target_format: str = Field(..., description="Target format extension (e.g. pdf, png)")
    output_params: OutputParams = Field(default_factory=OutputParams, description="Optional tuning parameters")
    auth_context: AuthContext = Field(..., description="Tenant and Environment context")

class ExportArtifact(BaseModel):
    uri: str = Field(..., description="S3 URI of the exported file")
    mime_type: str = Field(..., description="MIME type of the exported file")
    size_bytes: int = Field(..., description="Size of the file in bytes")
    filename: str = Field(..., description="Filename of the exported file")

class NexusMetadata(BaseModel):
    type: str = Field("document", description="Type of artifact")
    generated_by: str = Field("muscle_export_universal", description="The service that generated this artifact")
    page_count: Optional[int] = Field(None, description="Number of pages if applicable")

class ExportResult(BaseModel):
    job_id: str = Field(..., description="Job ID")
    status: str = Field("success", description="Status of the job")
    artifact: ExportArtifact = Field(..., description="Details of the generated artifact")
    nexus_metadata: NexusMetadata = Field(..., description="Auto-indexing metadata")
