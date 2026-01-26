
"""Vision Muscle: OpenCLIP Encoder."""
import torch
import open_clip
from PIL import Image
from typing import List

class VisionEncoder:
    def __init__(self, model_name='ViT-B-32', pretrained='laion2b_s34b_b79k', device='cpu'):
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(model_name, pretrained=pretrained, device=device)
        self.device = device

    def encode_image(self, image_path: str) -> List[float]:
        """Encode image file to vector."""
        image = self.preprocess(Image.open(image_path)).unsqueeze(0).to(self.device)
        with torch.no_grad():
            features = self.model.encode_image(image)
        
        # Normalize
        features /= features.norm(dim=-1, keepdim=True)
        return features.cpu().numpy()[0].tolist()
