
"""Video Extractor Muscle: FFmpeg wrapper."""
import ffmpeg
import tempfile
import boto3
import os
from typing import List, Tuple

class VideoExtractor:
    def process_video(self, video_path: str) -> Tuple[List[str], str]:
        """
        Extracts 3 Keyframes and Audio from Video.
        Supports local paths or S3 Keys (if configured).
        """
        # TODO: Handle S3 Download if path is s3://
        
        probe = ffmpeg.probe(video_path)
        duration = float(probe['format']['duration'])
        
        times = [0.1, duration / 2, duration - 1.0]
        frame_paths = []
        
        for i, t in enumerate(times):
            out_path = tempfile.mktemp(suffix=f"_frame_{i}.jpg")
            (
                ffmpeg
                .input(video_path, ss=t)
                .filter('scale', 512, -1)
                .output(out_path, vframes=1)
                .overwrite_output()
                .run(quiet=True)
            )
            frame_paths.append(out_path)

        audio_path = tempfile.mktemp(suffix="_audio.mp3")
        try:
            (
                ffmpeg
                .input(video_path)
                .output(audio_path, acodec='mp3', ab='128k')
                .overwrite_output()
                .run(quiet=True)
            )
        except ffmpeg.Error:
            audio_path = None
            
        return frame_paths, audio_path
