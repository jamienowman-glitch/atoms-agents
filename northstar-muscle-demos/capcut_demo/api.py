
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import shutil
import os
import uuid
import json
from pathlib import Path

# Add the current directory to sys.path
import sys
sys.path.append(os.getcwd())

# Engines Imports
from engines.media_v2.service import MediaService, set_media_service
from engines.video_timeline.service import TimelineService, set_timeline_service
from engines.video_render.service import RenderService, set_render_service
from engines.video_timeline.models import (
    VideoProject, Sequence, Track, Clip
)
from engines.media_v2.models import MediaAsset
from engines.video_render.models import RenderRequest
from engines.video_render.ffmpeg_runner import run_ffmpeg

# Local Repo Imports
from capcut_demo.repositories import (
    JSONMediaRepository, JSONTimelineRepository, DemoMediaStorage
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="CapCut-lite Demo")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
DATA_DIR = Path("data")
ASSETS_DIR = DATA_DIR / "assets"
PROJECTS_DIR = DATA_DIR / "projects"
RENDERS_DIR = DATA_DIR / "renders"
MEDIA_DB = DATA_DIR / "media.json"

for d in [DATA_DIR, ASSETS_DIR, PROJECTS_DIR, RENDERS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Mount Static Files for Renders
app.mount("/renders", StaticFiles(directory=str(RENDERS_DIR)), name="renders")

# Initialize Services
media_repo = JSONMediaRepository(MEDIA_DB)
media_storage = DemoMediaStorage(ASSETS_DIR)
media_service = MediaService(repo=media_repo, storage=media_storage)
set_media_service(media_service)

timeline_repo = JSONTimelineRepository(PROJECTS_DIR)
timeline_service = TimelineService(repo=timeline_repo)
set_timeline_service(timeline_service)

# Render Service uses defaults (InMemoryJobRepo) which is fine.
# We might need to override if we want job persistence, but for "simple" synchronous, it's ok.
render_service = RenderService() # Will fallback to InMemory persistence for jobs 
set_render_service(render_service) 

# Constants
TENANT_ID = "demo-tenant"
ENV = "dev"
USER_ID = "demo-user"

# Models
class ClipRequest(BaseModel):
    asset_id: str
    start_ms: int
    end_ms: int
    track: str = "primary" # "primary" or "overlay"
    opacity: float = 1.0
    volume: float = 1.0 # 0.0 to 1.0
    speed: float = 1.0 # 0.1 to 5.0
    filters: List[Dict[str, Any]] = [] # e.g. [{"type": "color_grade", "params": {...}}]

class TransitionRequest(BaseModel):
    type: str = "crossfade" # crossfade, dip_to_black, etc.
    duration_ms: int = 500
    from_index: int # Index of clip in the clips list to transition FROM

class TimelineRequest(BaseModel):
    # Clips list now authoritative
    clips: List[ClipRequest] = []
    transitions: List[TransitionRequest] = []
    aspect_profile: str = "social_4_3_h264"
    # Legacy support (optional)
    asset_id: Optional[str] = None

# ... (RenderRequestModel) ...

# ... (health, upload_asset, list_assets) ...

@app.post("/timeline/simple")
async def create_timeline(request: TimelineRequest):
    # Create Project
    project = timeline_service.create_project(VideoProject(
        tenant_id=TENANT_ID,
        env=ENV,
        user_id=USER_ID,
        title=f"Demo Project {uuid.uuid4().hex[:8]}",
        render_profile=request.aspect_profile
    ))
    
    # Create Sequence
    seq = timeline_service.create_sequence(Sequence(
        tenant_id=TENANT_ID,
        env=ENV,
        project_id=project.id,
        name="Main Sequence"
    ))
    
    # Create Tracks
    track_primary = timeline_service.create_track(Track(
        tenant_id=TENANT_ID,
        env=ENV,
        sequence_id=seq.id,
        kind="video",
        video_role="main",
        order=0
    ))
    
    track_overlay = timeline_service.create_track(Track(
        tenant_id=TENANT_ID,
        env=ENV,
        sequence_id=seq.id,
        kind="video",
        video_role="overlay",
        order=1
    ))
    
    clips_to_add = request.clips
    # Legacy fallback
    if not clips_to_add and request.asset_id:
        asset = media_service.get_asset(request.asset_id)
        if asset:
             duration_ms = asset.duration_ms or 5000 
             clips_to_add.append(ClipRequest(
                 asset_id=request.asset_id,
                 start_ms=0,
                 end_ms=int(duration_ms),
                 track="primary"
             ))
    
    cursor_ms = 0.0
    created_clips = [] # List of clip IDs in order
    
    from engines.video_timeline.models import Filter, FilterStack, Transition
    
    for i, c_req in enumerate(clips_to_add):
        target_track = track_primary.id # Force single track for now if enabling transitions? 
        # API says clips can be "primary" or "overlay", but transitions typically between primary clips.
        # Let's honor request track but simplified transition logic assumes primary track.
        if c_req.track == "overlay":
             target_track = track_overlay.id

        import math
        vol_db = 0.0
        if c_req.volume <= 0.001:
            vol_db = -60.0
        else:
            vol_db = 20 * math.log10(c_req.volume)

        clip = timeline_service.create_clip(Clip(
            tenant_id=TENANT_ID,
            env=ENV,
            track_id=target_track,
            asset_id=c_req.asset_id,
            in_ms=float(c_req.start_ms),
            out_ms=float(c_req.end_ms),
            start_ms_on_timeline=cursor_ms,
            opacity=c_req.opacity,
            speed=c_req.speed,
            volume_db=vol_db
        ))
        
        # Filters
        if c_req.filters:
            f_list = []
            for f_data in c_req.filters:
                f_list.append(Filter(
                    type=f_data['type'],
                    params=f_data.get('params', {}),
                    enabled=True
                ))
            if f_list:
                timeline_service.create_filter_stack(FilterStack(
                    tenant_id=TENANT_ID,
                    env=ENV,
                    target_type="clip",
                    target_id=clip.id,
                    filters=f_list
                ))
        
        duration = (c_req.end_ms - c_req.start_ms) / c_req.speed
        if c_req.track == "primary":
            cursor_ms += duration
            
        created_clips.append(clip.id)

    # Calculate Transitions
    # Transitions logic: adjacent clips on same track. 
    # Current simplistic timeline: clips are just appended. 
    # Transition requires overlapping. 
    # engines.video_render handles "crossfade" by reading Transition objects.
    
    for t_req in request.transitions:
        idx = t_req.from_index
        if idx < 0 or idx >= len(created_clips) - 1:
            continue # Invalid index
        
        from_id = created_clips[idx]
        to_id = created_clips[idx+1]
        
        # Create Transition object
        timeline_service.create_transition(Transition(
            tenant_id=TENANT_ID,
            env=ENV,
            sequence_id=seq.id,
            type=t_req.type,
            duration_ms=float(t_req.duration_ms),
            from_clip_id=from_id,
            to_clip_id=to_id
        ))
        
    return {
        "project_id": project.id, 
        "timeline_summary": {
            "track_count": 2, 
            "clip_count": len(created_clips),
            "duration_ms": cursor_ms
        }
    }

@app.post("/render/simple")
async def render_timeline(request: RenderRequestModel):
    # Verify project exists
    project = timeline_service.get_project(request.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Create Render Request using internal model
    # Note: engines.video_render.models.RenderRequest name conflict with endpoint model
    from engines.video_render.models import RenderRequest as InternalRenderRequest
    
    output_filename = f"{request.project_id}_rendered.mp4"
    output_path = RENDERS_DIR / output_filename
    
    req = InternalRenderRequest(
        tenant_id=TENANT_ID,
        env=ENV,
        user_id=USER_ID,
        project_id=request.project_id,
        render_profile=request.profile,
        output_path=str(output_path.absolute()),
        storage_target="local"
    )
    
    try:
        # Build Plan
        # Access internal protected method? Or is there a public one?
        # RenderService doesn't have a public "render_now". It has "create_render_job".
        # But we want synchronous for this demo (or async but started immediately).
        # We can use _build_plan and run_ffmpeg directly which is what I saw in code usage patterns elsewhere.
        
        plan = render_service._build_plan(req)
        
        # Execute ffmpeg
        final_path = run_ffmpeg(plan, timeout=300, stage="render_demo")
        
        return {
            "render_id": uuid.uuid4().hex, # Dummy ID execution
            "output_path": f"data/renders/{output_filename}",
            "absolute_path": final_path
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Render failed: {str(e)}")
