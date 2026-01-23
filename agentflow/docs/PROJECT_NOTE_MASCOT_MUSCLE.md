# 📂 PROJECT NOTE: The Mascot Muscle (Founder-in-the-Browser)
> **Status**: Concept / Implementation Ready
> **Goal**: Replace standard "Help Tooltips" with transparent video overlays of the founder (You).
> **Philosophy**: "Scaleable Intimacy"—a personal, living deck where you guide the user through the app, explain features, or pitch investors directly on the glass.

## The Concept
Instead of sending a boring pitch deck, investors use the actual tool (`agentflow`), while a video of the founder (with background removed) walks them through it on-screen.

## Tech Stack
*   **Input**: Raw phone video (MP4/MOV).
*   **Processing**: Python + `rembg` (AI background removal) + `ffmpeg`.
*   **Output**: WebM (Chrome/Edge) and HEVC/MOV (Safari) with Alpha Channel.
*   **Frontend**: React video element with `pointer-events: none` to allow click-through.

---

## 1. Backend: The Processor (`atoms_mascot.py`)
Takes raw video, strips background, outputs transparent web-ready files.

```python
import os
import cv2
import subprocess
from rembg import new_session, remove
from tqdm import tqdm

# --- CONFIG ---
INPUT_DIR = "./data/mascot_raw"
OUTPUT_DIR = "./public/assets/mascot"
MODEL_NAME = "u2net_human_seg" # Optimized for people

def process_video(input_path):
    filename = os.path.basename(input_path)
    name_no_ext = os.path.splitext(filename)[0]
    print(f"🎬 Processing: {filename}")

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    session = new_session(MODEL_NAME)

    # Output: WebM (VP9 + Alpha) for Chrome/Edge
    output_path = os.path.join(OUTPUT_DIR, f"{name_no_ext}.webm")
    
    # FFmpeg Pipe: Takes raw RGBA frames -> Encodes to WebM
    cmd = [
        'ffmpeg', '-y', '-f', 'rawvideo', '-vcodec', 'rawvideo',
        '-s', f'{width}x{height}', '-pix_fmt', 'rgba', '-r', str(fps),
        '-i', '-', '-c:v', 'libvpx-vp9', '-b:v', '2M', '-auto-alt-ref', '0',
        '-pix_fmt', 'yuva420p', output_path
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    pbar = tqdm(total=total_frames, unit="frame")
    
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        # CV2 (BGR) -> RGB -> RemBG (RGBA)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        output_rgba = remove(frame_rgb, session=session)
        
        # Write to FFmpeg
        pipe.stdin.write(output_rgba.tobytes())
        pbar.update(1)

    pipe.stdin.close()
    pipe.wait()
    pbar.close()
    cap.release()

if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR): os.makedirs(OUTPUT_DIR)
    for f in os.listdir(INPUT_DIR):
        if f.endswith(('.mp4', '.mov')): process_video(os.path.join(INPUT_DIR, f))
```

---

## 2. Frontend: The Overlay Component (React)
Plays the video in the corner but lets users click "through" you to use the app.

```typescript
import React, { useState } from 'react';

export const MascotOverlay = ({ src, onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-4 z-50 flex flex-col items-end pointer-events-none">
      {/* pointer-events-none: Allows clicks to pass through the container 
         so you don't block the UI behind you.
      */}
      
      {/* The Video: Founder-on-Glass */}
      <video
        src={src} // e.g., "/assets/mascot/pricing_explainer.webm"
        autoPlay
        muted // Browser policy often requires mute for autoplay
        playsInline
        onEnded={() => {
           // Auto-hide when done, or keep looping if it's a "vibes" loop
           // setIsVisible(false); 
           if (onFinish) onFinish();
        }}
        className="w-[300px] h-auto object-cover drop-shadow-2xl"
        style={{ 
            // Optional: slight filter to blend better
            filter: 'contrast(1.1) saturate(1.1)' 
        }}
      />

      {/* Controls: Re-enable pointer events just for the buttons */}
      <div className="pointer-events-auto mt-2 flex gap-2">
        <button 
            onClick={() => setIsVisible(false)} 
            className="bg-black/80 text-white text-xs px-3 py-1 rounded-full hover:bg-black"
        >
          Dismiss
        </button>
        <button 
            onClick={() => {
                const v = document.querySelector('video');
                if(v) v.muted = !v.muted;
            }} 
            className="bg-white/90 text-black text-xs px-3 py-1 rounded-full shadow-sm hover:bg-white"
        >
          Unmute
        </button>
      </div>
    </div>
  );
};
```
