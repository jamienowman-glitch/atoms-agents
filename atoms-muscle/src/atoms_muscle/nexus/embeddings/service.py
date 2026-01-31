
"""Embedding Service (Heavy Muscle)."""
import os
import torch
from PIL import Image
try:
    import open_clip
except ImportError:
    open_clip = None 
from mistralai.client import MistralClient
import umap.umap_ as umap
from typing import List, Optional

# Configuring Mistral (Text)
MISTRAL_KEY_PATH = os.path.expanduser("~/northstar-keys/mistral-key.txt")
_MISTRAL_CLIENT = None

def _get_mistral():
    global _MISTRAL_CLIENT
    if not _MISTRAL_CLIENT:
        try:
            with open(MISTRAL_KEY_PATH) as f:
                key = f.read().strip()
            _MISTRAL_CLIENT = MistralClient(api_key=key)
        except Exception as e:
            print(f"Warning: Mistral Failed: {e}")
    return _MISTRAL_CLIENT

# Configuring OpenCLIP (Image - Local)
_CLIP_MODEL = None
_CLIP_PREPROCESS = None

def _get_clip():
    global _CLIP_MODEL, _CLIP_PREPROCESS
    if not _CLIP_MODEL and open_clip:
        # ViT-B-32 is a good balance of speed/quality. Running on CPU is fine for single images.
        _CLIP_MODEL, _, _CLIP_PREPROCESS = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
    return _CLIP_MODEL, _CLIP_PREPROCESS

class EmbeddingService:
    
    def embed_text(self, text: str) -> List[float]:
        """Get text embedding from Mistral (Free Credit)."""
        client = _get_mistral()
        if not client:
            return [0.0] * 1024 # Dummy fallback
            
        resp = client.embeddings(
            model="mistral-embed",
            input=[text],
        )
        return resp.data[0].embedding

    def embed_image(self, image_path: str) -> List[float]:
        """Get image embedding from OpenCLIP (Local CPU)."""
        model, preprocess = _get_clip()
        if not model:
            return [0.0] * 512
            
        image = preprocess(Image.open(image_path)).unsqueeze(0)
        with torch.no_grad():
            image_features = model.encode_image(image)
        
        image_features /= image_features.norm(dim=-1, keepdim=True)
        return image_features.cpu().numpy()[0].tolist()

    def generate_map_coords(self, vectors: List[List[float]]) -> List[List[float]]:
        """Project vectors to 3D using UMAP (Local)."""
        if len(vectors) < 5:
            # UMAP needs data
            return [[0.0, 0.0, 0.0] for _ in vectors]
            
        fit = umap.UMAP(n_components=3, random_state=42)
        u = fit.fit_transform(vectors)
        return u.tolist()
