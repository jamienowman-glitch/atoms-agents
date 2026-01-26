
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.muscle.audio.transcriber import AudioTranscriber
from src.muscle.video.extractor import VideoExtractor
from src.muscle.vision.encoder import VisionEncoder
import os
import boto3
from typing import List

app = FastAPI(title="atoms-muscle", version="0.1.0")

# Lazy Loaders
_audio = None
_video = None
_vision = None

def get_audio():
    global _audio
    if not _audio: _audio = AudioTranscriber()
    return _audio

def get_video():
    global _video
    if not _video: _video = VideoExtractor()
    return _video

def get_vision():
    global _vision
    if not _vision: _vision = VisionEncoder() # OpenCLIP
    return _vision

class S3Request(BaseModel):
    bucket: str
    key: str

@app.get("/health")
async def health_check():
    return {"status": "ok", "role": "The Heavy Lifter"}

@app.post("/muscle/ingest/video")
async def ingest_video_workflow(req: S3Request):
    """
    Full Heavy Lift:
    1. Download Video
    2. Extract Frames & Audio
    3. Transcribe Audio
    4. Embed Frames (Visual Vector)
    5. Return { text, visual_vector }
    """
    s3 = boto3.client('s3')
    local_path = f"/tmp/{os.path.basename(req.key)}"
    
    try:
        s3.download_file(req.bucket, req.key, local_path)
        
        # 1. Extract
        frame_paths, audio_path = get_video().process_video(local_path)
        
        # 2. Transcribe
        transcript = ""
        if audio_path:
            transcript = get_audio().transcribe(audio_path)
            os.remove(audio_path)
            
        # 3. Vision Embed (Average of Frames)
        vectors = []
        for fp in frame_paths:
            vec = get_vision().encode_image(fp)
            vectors.append(vec)
            os.remove(fp)
        
        # Simple average
        import numpy as np
        avg_visual = np.mean(vectors, axis=0).tolist() if vectors else []

        os.remove(local_path)
        
        return {
            "transcript": transcript,
            "visual_vector": avg_visual,
            # Note: Semantic Vector (Text) is usually fast/API based, 
            # so Core can do it via Mistral API, or Muscle can do it.
            # We'll let Core do Mistral since it holds the keys/logic for text.
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, str(e))
